<div align="center">
  <img src="./assets/flux.gif" alt="Flux Demo" width="80%"/>
  
  # Flux: AI-Powered Adaptive Content Discovery
  
  <p align="center">
    <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="scikit-learn"/>
    <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/Hume_AI-00D4AA?style=for-the-badge&logo=ai&logoColor=white" alt="Hume AI"/>
  </p>
  
  <p align="center">
    <b>The world's most human-centric content recommendation system</b><br>
    <i>Content that adapts to who you are, not just what you watch.</i>
  </p>
</div>

---

## 🌟 Overview

**Flux** is a revolutionary content discovery platform that combines psychological character archetype analysis with time-aware adaptive recommendations. Unlike traditional recommendation engines that rely on generic demographic clustering, Flux leverages deep psychological insights to understand your content preferences on a fundamental level, then adapts throughout the day to match your emotional states and personal preferences.

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <h3 align="center">🧠 Character Psychology</h3>
        <ul>
          <li>AI-powered archetype analysis</li>
          <li>Personality-driven content matching</li>
          <li>Deep narrative understanding</li>
        </ul>
      </td>
      <td width="50%">
        <h3 align="center">⏱️ Adaptive Daylist</h3>
        <ul>
          <li>Utilizing Mistral LLM to select relevant daylist based on mood + archetype + time of day</li>
          <li>Voice-activated mood detection</li>
          <li>Multi-modal emotional analysis</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## 🧠 Character Archetype Engine

The Character Archetype Engine is the psychological core of Flux, analyzing content and user preferences through the lens of character archetypes and narrative structures.

### Technical Implementation

```
├── scikit-learn: Machine learning for clustering and TF-IDF vectorization
├── DeepSeek V3 0324 via OpenRouter: LLM for creative archetype naming and descriptions
├── Pandas: Data preprocessing and feature engineering
├── NumPy: Numerical computing for model operations
└── Local JSON: Character archetype metadata and traits storage
```

### System Overview: How It Works

1. **Data Ingestion & Filtering**: Loads and filters character metadata for relevant media types
2. **Text Preprocessing**: Cleans descriptions by lowercasing, removing special characters and stopwords
3. **TF-IDF Vectorization**: Transforms text into numerical vectors using top vocabulary terms
4. **KMeans Clustering**: Groups characters into 5 archetype clusters based on semantic similarity
5. **Keyword & Sample Extraction**: Extracts top keywords and representative characters per cluster
6. **Archetype Naming with DeepSeek V3**: Prompts the DeepSeek V3 0324 LLM via OpenRouter to generate creative archetype names and descriptions
7. **Results Storage**: Saves cluster metadata with generated archetypes for recommendation use

### Key Features

- **Archetype Classification**: Identifies content based on proprietary archetypes:
  - **Rebel Heartthrob**: Charismatic high school protagonists who defy expectations, balancing love life and personal struggles.
  - **The Hidden Prodigies**: Young individuals with extraordinary skills navigating love and life while balancing personal and team dynamics.
  - **Dark Mentor**: Complex characters who guide protagonists through twisted life lessons, blurring the line between villain and teacher.
  - **Star Presenter**: Charismatic hosts known for dynamic personalities and engaging audiences.
  - **Firebrand Strategist**: Daring protagonists whose fiery spirit and tactical brilliance set them apart in a world of chaos.
- **Narrative Analysis**: Processes content for moral complexity, empathy levels, and character arcs.
- **Psychological Matching**: Delivers precise recommendations like "Morally complex protagonists in tough moral dilemmas" instead of generic genres.

---

## ⏱️ Adaptive Daylist Technology

The Adaptive Daylist system is Flux's time-aware recommendation engine that adapts to users' viewing patterns and emotional states throughout the day.

### Technical Implementation

```
├── FastAPI: High-performance API framework for recommendation endpoints
├── OpenRouter (Mistral-7B): LLM inference for intelligent content analysis
├── Hume AI: Empathic Voice Interface API for mood detection and tone analysis
├── Local JSON: User preferences and daylist data storage
└── Simple Functions: Custom logic for time-based recommendation filtering
```

### Key Features

- **Time-Sensitive Recommendations**: Adjusts content suggestions based on time of day.
- **Voice-Based Mood Detection**: Processes verbal requests through Hume AI's Empathic Voice Interface to infer emotional states.
- **Multi-Modal Fusion**: Combines archetypes, temporal, and emotional data for holistic recommendations.
- **Mistral LLM Integration**: Utilizes Mistral-7B to intelligently select relevant daylist content based on mood, archetype, and time of day.

---

## 🎥 Native Watch Party

**Native Watch Party** is a standalone feature that enables users to watch content together in real-time, synchronized across devices, with integrated chat capabilities.

### Technical Implementation

```
├── WebRTC: Real-time video synchronization and low-latency streaming
├── Socket.io: Instant messaging and event broadcasting
├── Next.js: Backend signaling and room management
└── Local JSON: Session and user data storage
```

### Key Features

- **Synchronized Playback**: All participants experience the same content at the same time, with host controls for play, pause, and seek.
- **Integrated Chat**: Real-time text chat and emoji reactions for social interaction.
- **Scalable Rooms**: Supports multiple concurrent watch parties with up to 100 participants per session.
- **Device Compatibility**: Works across web browsers and can be extended to mobile and TV platforms.
- **State Management**: Playback state (play, pause, seek) is broadcast and synchronized via real-time messaging.

---

## 🛠️ Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://cdn.simpleicons.org/scikitlearn" width="60px"/><br/>scikit-learn</td>
      <td align="center"><img src="https://cdn.simpleicons.org/fastapi" width="60px"/><br/>FastAPI</td>
      <td align="center"><img src="https://cdn.simpleicons.org/nodedotjs" width="60px"/><br/>Node.js</td>
      <td align="center"><img src="https://cdn.simpleicons.org/openai" width="60px"/><br/>OpenRouter</td>
      <td align="center"><img src="https://cdn.simpleicons.org/python" width="60px"/><br/>Python</td>
    </tr>
  </table>
</div>

### AI/ML Infrastructure
```
├── scikit-learn: Core machine learning algorithms and model training
├── OpenRouter: API access to DeepSeek V3 0324 and Mistral-7B models
├── FastAPI: High-performance API serving for ML inference
├── Pandas + NumPy: Data processing and numerical computation
├── NLTK/spaCy: Natural language processing pipeline
└── Uvicorn: ASGI server for production deployment
```

### Data & Storage Layer
```
├── Local JSON: Character archetype metadata and user preferences
├── GridFS: Binary file storage for media files and thumbnails
└── AES-256 Encryption: Data protection at rest and in transit
```

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │          Frontend Interface             │
                    │                                         │
    ┌───────────────┤  Next.js + Tailwind CSS + React         │
    │               │  SSR/SSG + Mobile-First Design          │
    │               └─────────────┬───────────────────────────┘
    │                             │ HTTP/WebSocket
    │               ┌─────────────▼───────────────────────────┐
    │               │        API Gateway & Security           │
    │               │                                         │
    │               │  Next.js + JWT Auth + OAuth2            │
    │               │  Rate Limiting + Input Validation       │
    │               └─────────────┬───────────────────────────┘
    │                             │ REST APIs
    │               ┌─────────────▼───────────────────────────┐
    │               │          Core Services                  │
    ├───────────────┤                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │ Character   │  │   Adaptive      │   │
    │               │  │ Archetype   │  │   Daylist       │   │
    │               │  │ Engine      │  │ FastAPI Service │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               │                                         │
    │               │  ┌─────────────────────────────────────┐│
    │               │  │      Native Watch Party             ││
    │               │  │    WebRTC + Socket.io Engine        ││
    │               │  └─────────────────────────────────────┘│
    │               └─────────────┬───────────────────────────┘
    │                             │
    │               ┌─────────────▼───────────────────────────┐
    │               │           AI/ML Engine                  │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │ OpenRouter  │  │   scikit-learn  │   │
    │               │  │ DeepSeek V3 │  │    ML Models    │   │
    │               │  │ LLM Service │  │                 │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │   Hume AI   │  │   FastAPI       │   │
    │               │  │ Voice API   │  │  ML Inference   │   │
    │               │  │ Integration │  │   <100ms        │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               └─────────────┬───────────────────────────┘
    │                             │
    │               ┌─────────────▼───────────────────────────┐
    │               │        Data & Storage Layer             │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │ Local JSON  │  │   GridFS        │   │
    │               │  │ File System │  │  File Storage   │   │
    │               │  │  Storage    │  │    System       │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               └─────────────────────────────────────────┘
    │
    └── Hume AI Empathic Voice Integration
```

---

## 🔧 LLM Integration

### DeepSeek V3 0324 Integration
```python
# OpenRouter DeepSeek V3 integration for archetype naming
def generate_archetype_name(keywords, sample_characters):
    prompt = f"""
    You are naming character archetypes based on analysis of similar characters.
    
    KEYWORDS: {', '.join(keywords)}
    SAMPLE CHARACTERS: {', '.join(sample_characters)}
    
    Based on these keywords and sample characters, generate:
    1. A concise, evocative archetype name (1-3 words)
    2. A single-sentence description of this archetype
    
    Format your response as strict JSON:
    {{
      "archetype_name": "Name Here",
      "description": "Description here."
    }}
    """
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-ai/deepseek-v3-0324",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload
    )
    
    result = response.json()
    generated_text = result["choices"][0]["message"]["content"]
    
    # Parse JSON from the response
    archetype_data = json.loads(generated_text)
    return archetype_data
```

### Mistral-7B Daylist Integration
```python
# FastAPI endpoint for Mistral-7B daylist recommendations
@app.post("/api/v1/daylist/mistral/recommendations")
async def mistral_daylist_recommendations(request: DaylistRequest):
    prompt = f"""
    Generate content recommendations based on:
    - User Archetype: {request.archetype}
    - Current Mood: {request.mood}
    - Time of Day: {request.time_of_day}
    
    Select 3-5 pieces of content that match these criteria.
    """
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    response = await openrouter_client.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload
    )
    
    return response.json()
```

### Key Features
- **Model**: DeepSeek V3 0324 for character archetype naming
- **Model**: Mistral-7B for intelligent daylist content selection
- **API**: OpenRouter for scalable LLM inference
- **Integration**: FastAPI endpoints for real-time processing
- **Voice**: Hume AI for empathic voice mood detection

---

## 🧪 Key Technical Components

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>🧠</h3>
        <b>Character Analysis</b><br>
        <small>scikit-learn + DeepSeek V3</small>
      </td>
      <td align="center">
        <h3>📊</h3>
        <b>Content Analysis</b><br>
        <small>Mistral-7B + Simple Functions</small>
      </td>
      <td align="center">
        <h3>🗣️</h3>
        <b>Voice Analysis</b><br>
        <small>Hume AI Empathic Voice</small>
      </td>
      <td align="center">
        <h3>🔄</h3>
        <b>Multi-Modal Fusion</b><br>
        <small>FastAPI + LLM pipelines</small>
      </td>
    </tr>
  </table>
</div>

---

## 🚀 Setup & Installation

### Prerequisites
```bash
# System Requirements
Node.js 18+
Python 3.9+
FastAPI 0.100+
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/Harsh-1-0/Amazon-hack
cd Amazon-hack

# Install dependencies for frontend
cd firetvfrontend
npm i 

# Environment setup
cp .env
# Configure your environment variables including NEXT_PUBLIC_CHAT_SERVER, NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, NEXT_PUBLIC_HUME_API_KEY

# NEXT_PUBLIC_ARCHTYPE_API="https://character-iwaf.onrender.com"
npm run dev

# Start Backednd on node express
In AMAZON-HACK directory 
cd node_backend

#install dependencies
npm i

# Environment setup
cp .env

# Configure your environment variables including PORT, DATABASE_URL (mongoDB atlas cluster key) FIREBASE_SERVICE_ACCOUNT (firebase admin json), JWT_SECRET

#SPOILER_API_URL="http://localhost:8800"

npm run dev

In AMAZON-HACK directory 
cd spoiler-detection

#create venv and activate 

pip install -r requirements.txt

# Environment setup
# Configure your environment variables including GEMINI_API_KEY
Python main.py

# Access application
open http://localhost:3000
```

---

## 📚 API Documentation

### Character Archetype Engine
```http
GET /api/v1/archetypes/analyze
POST /api/v1/archetypes/feedback
GET /api/v1/archetypes/recommendations/{user_id}
PUT /api/v1/archetypes/preferences/{user_id}
```

### Adaptive Daylist (FastAPI)
```http
GET /api/v1/daylist/{user_id}/current
POST /api/v1/daylist/mood-update
GET /api/v1/daylist/recommendations/time-based
POST /api/v1/daylist/mistral/recommendations
GET /api/v1/daylist/openrouter/analyze
POST /api/v1/daylist/voice/analyze
```

### Native Watch Party
```http
POST /api/v1/watchparty/create
GET /api/v1/watchparty/join/{room_id}
POST /api/v1/watchparty/control/{room_id}
GET /api/v1/watchparty/status/{room_id}
DELETE /api/v1/watchparty/leave/{room_id}
```

### ML Model Endpoints
```http
POST /api/v1/ml/inference/archetype
POST /api/v1/ml/inference/recommendation
GET /api/v1/ml/models/status
PUT /api/v1/ml/models/update
```

---

## 👥 Meet Team Espanys

<div align="center">
  <img src="./assets/team.png" alt="Team Espanys" width="80%"/>
</div>

---

<div align="center">
  <h2><b>Flux</b></h2>
  <h3><i>Content that adapts to who you are, not just what you watch</i> | Built by <a href="#" target="_blank">Team Espanys</a></h3>
  
  <p>
    <img src="https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge" alt="Made with Love"/>
  </p>
</div>
