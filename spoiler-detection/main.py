import google.generativeai as genai # type: ignore
from dotenv import load_dotenv # type: ignore
load_dotenv()
import os

from pydantic import BaseModel # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore
from sklearn.metrics.pairwise import cosine_similarity # type: ignore
import uvicorn # type: ignore


from fastapi import FastAPI,Query # type: ignore
app = FastAPI()

genai.configure(api_key = os.getenv("GEMINI_API_KEY"))

summary_cache = {}

class MessageInput(BaseModel):
    movie_name: str
    message: str

def summarize_movie(title):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Give me a short but detailed summary of the story of movie: {title} . Focus only on the storyline, not the cast or ratings and make it detailed."
    response = model.generate_content(prompt)
    return response.text.strip()


@app.get("/summary")
def get_movie_summary(movie_name: str):
    if movie_name in summary_cache:
        return {"summary": summary_cache[movie_name]}

    summary = summarize_movie(movie_name)
    summary_cache[movie_name] = summary
    return {"summary": summary}

@app.post("/spoiler-detection")
def detect_spoiler(input:MessageInput):
    print("Received input:", input)
    movie_name = input.movie_name
    message = input.message
    if movie_name not in summary_cache:
        summary = summarize_movie(movie_name)
        summary_cache[movie_name] = summary
    else:
        summary = summary_cache[movie_name]
    model = SentenceTransformer('all-MiniLM-L6-v2')
    summary_embedding = model.encode(summary, convert_to_tensor=True)
    message_embedding = model.encode(message, convert_to_tensor=True)
    similarity = cosine_similarity([summary_embedding], [message_embedding])[0][0]
    print(f"Similarity between summary and message: {similarity}")
    result = {
    "spoiler": round(float(similarity), 3),
    }
    return result

@app.get("/")
def root():
    return {"message": "Welcome to the Movie Spoiler Detection API. Use /summary to get movie summaries and /spoiler-detection to check for spoilers."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port = 8800)



