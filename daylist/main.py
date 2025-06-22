import os
import json
import requests
import datetime
import asyncio
import logging
import random
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from voice_mood_recognition.emotion import MoodDetector

# --- CONFIGURATION ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# --- API SETUP ---
API_BASE_URL = "https://character-iwaf.onrender.com"
LOCAL_SHOW_CATALOG = []

if not OPENROUTER_API_KEY:
    logger.error("FATAL: OPENROUTER_API_KEY not found in .env file.")

app = FastAPI(title="Smart Daylist API with OpenRouter")

# --- STARTUP EVENT ---
@app.on_event("startup")
async def startup_event():
    global LOCAL_SHOW_CATALOG
    try:
        with open("archetype/clustered_characters.json") as f:
            LOCAL_SHOW_CATALOG = json.load(f)
        logger.info(f"Successfully loaded {len(LOCAL_SHOW_CATALOG)} shows into local catalog.")
    except Exception as e:
        logger.error(f"FATAL: Could not load local show catalog. Error: {e}")

# --- HELPER FUNCTIONS ---
# (All helper functions are correct and remain unchanged)
def get_time_of_day():
    h = datetime.datetime.now().hour
    if 5 <= h < 12: return "morning"
    if 12 <= h < 17: return "afternoon"
    if 17 <= h < 21: return "evening"
    return "night"

def get_user_profile_from_api(user_id: str) -> dict | None:
    try:
        user_info_url = f"{API_BASE_URL}/user/{user_id}"
        logger.info(f"Fetching user profile from {user_info_url}")
        response = requests.get(user_info_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Could not fetch profile for user '{user_id}': {e}")
        return None

def get_candidate_shows(user_profile: dict, full_catalog: list, max_candidates: int = 50) -> list:
    liked_genres = user_profile.get("genres")
    if not liked_genres:
        return random.sample(full_catalog, min(len(full_catalog), max_candidates))
    liked_genres_set = {genre.lower() for genre in liked_genres}
    candidates = [s for s in full_catalog if s.get("genre") and any(lg in s["genre"].lower() for lg in liked_genres_set)]
    logger.info(f"Pre-filtered catalog from {len(full_catalog)} down to {len(candidates)} candidates based on genre.")
    if len(candidates) > max_candidates:
        return random.sample(candidates, max_candidates)
    if not candidates:
        return random.sample(full_catalog, min(len(full_catalog), max_candidates))
    return candidates

def create_openai_compatible_messages(user_profile: dict, mood: str, time_of_day: str, candidate_shows: list) -> list:
    system_prompt = """
You are a highly perceptive and creative "Daylist" curator for an Amazon Prime-style service. Your goal is to create a small, perfect, and compelling playlist for a user based on their unique taste and current mood.

Your Tasks:
1. Create a Catchy Title: Generate a unique, fun, and creative title for this personalized playlist.
2. Curate a List: From the provided "Candidate Show Catalog", select 5 to 7 shows that are the absolute best fit.
3. Write Compelling Scenarios: For each show you select, write a short, one-line scenario that explains *why* it's the perfect choice for them right now.
4. Respond ONLY with a single, valid JSON object. Do not add any text before or after the JSON. The required format is:
{"title": "...", "shows": [{"character_name": "...", "media_source": "...", "genre": "...", "scenario": "..."}, ...]}
"""
    liked_genres = ", ".join(user_profile.get("genres", ["not specified"]))
    liked_shows = ", ".join(user_profile.get("media_sources", ["not specified"]))
    catalog_text = "\n".join(
        f"- {s.get('character_name', 'N/A')} from '{s.get('media_source', 'N/A')}' (Genre: {s.get('genre', 'N/A')})"
        for s in candidate_shows
    )
    user_prompt = f"""
Here is the user and catalog information. Please generate the curated daylist now.

**User's Profile:**
- **Vibe/Genres:** {liked_genres}
- **Liked Shows:** {liked_shows}
- **Current Mood:** {mood}
- **Time of Day:** {time_of_day}

**Candidate Show Catalog (Only pick from this list):**
{catalog_text}
"""
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

# --- FASTAPI ENDPOINT ---
@app.post("/daylist", response_class=JSONResponse)
async def daylist(user_id: str = Form(...)):
    if not OPENROUTER_API_KEY: raise HTTPException(status_code=503, detail="The AI routing service is not configured.")
    if not LOCAL_SHOW_CATALOG: raise HTTPException(status_code=503, detail="The show catalog is not available.")

    user_profile = get_user_profile_from_api(user_id) or {"genres": ["General"], "media_sources": ["Popular shows"]}
    candidate_shows = get_candidate_shows(user_profile, LOCAL_SHOW_CATALOG)
    time_of_day = get_time_of_day()
    
    mood = "neutral"
    try:
        mood = await MoodDetector().get_mood_from_voice()
        logger.info(f"Detected voice mood: {mood}")
    except Exception as e:
        logger.warning(f"Could not detect mood from voice: {e}. Defaulting to '{mood}'.")

    messages = create_openai_compatible_messages(user_profile, mood, time_of_day, candidate_shows)
    
    logger.info(f"Calling OpenRouter API with a smart prompt containing {len(candidate_shows)} candidate shows.")
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://daylist.yourapp.com", 
                "X-Title": "Daylist Curation App", 
            },
            json={
                # --- THIS IS THE DIAGNOSTIC MODEL NAME ---
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": messages,
                "response_format": {"type": "json_object"}
            }
        )
        response.raise_for_status()
        
        ai_response_json = response.json()
        raw_response_text = ai_response_json['choices'][0]['message']['content']
        
        logger.info(f"Raw OpenRouter response received:\n{raw_response_text}")

        result = json.loads(raw_response_text)
        return JSONResponse(content=result)

    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling OpenRouter API: {e}")
        if e.response is not None:
             logger.error(f"Response Body: {e.response.text}")
        raise HTTPException(status_code=500, detail="Failed to get a response from the AI routing service.")