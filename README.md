<div align="center">
  <img src="./assets/flux.gif" alt="Flux Demo" width="80%"/>
  
  # Flux: AI-Powered Adaptive Content Discovery
  
  <p align="center">
    <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="scikit-learn"/>
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Hume_AI-FF6B6B?style=for-the-badge&logo=ai&logoColor=white" alt="Hume AI"/>
  </p>
  
  <p align="center">
    <b>The world's most human-centric content recommendation system</b><br>
    <i>Content that adapts to who you are, not just what you watch.</i>
  </p>
</div>

---

## 🌟 Overview

**Flux** is a revolutionary content discovery platform that combines psychological character archetype analysis with adaptive recommendations. Unlike traditional recommendation engines that rely on generic demographic clustering, Flux leverages deep psychological insights to understand your content preferences on a fundamental level, then adapts to match your emotional states and preferences throughout the day.

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

The Character Archetype Engine is the psychological core of Flux, discovering and naming character archetypes across different media using a hybrid of machine learning for clustering and large language models for creative naming.

### System Overview: How It Works

This system discovers and names **character archetypes** across different media using a hybrid of **machine learning for clustering** and the **DeepSeek V3 0324 large language model (LLM)** for creative naming.

#### 1. **Data Ingestion & Filtering**
* Loads character metadata from `character_codex.json`
* Filters the dataset to include only relevant media types: **Anime, Movies, Manga, Television Shows**

#### 2. **Description Cleaning**
* Cleans `description` fields by:
  * Lowercasing all text
  * Removing special characters
  * Removing short tokens and English stopwords using `sklearn`'s built-in list
* This results in a `cleaned_description` column ready for vectorization

#### 3. **TF-IDF Vectorization**
* Transforms the cleaned text into numerical vectors using `TfidfVectorizer` with a vocabulary of top 100 terms
* These vectors represent how important each word is in the context of all descriptions

#### 4. **KMeans Clustering**
* Clusters the characters into **5 archetype clusters** using `KMeans`
* Each character is assigned a cluster ID (`archetype_cluster`), forming groups of semantically similar descriptions

#### 5. **Cluster Keyword & Character Extraction**
* For each cluster:
  * **Top 10 keywords** are extracted from the cluster's centroid vector
  * **3 sample characters** are pulled from the cluster to give narrative context

#### 6. **Archetype Naming using DeepSeek V3**
* Prompts are crafted with the cluster's keywords and sample characters
* A call is made to **OpenRouter's DeepSeek V3 0324 model** using the `openai` API client:
  * The prompt asks for an **archetype name (1–3 words)** and a **one-line description**
  * The response is expected in **strict JSON** format
* The raw JSON string is cleaned and parsed for downstream use

#### 7. **Saving Results**
* Two output files are generated:
  * `clustered_characters.json`: each character with their assigned cluster
  * `cluster_archetypes.json`: metadata for each cluster including keywords, sample characters, generated archetype name, and description

### Technical Implementation

```
├── scikit-learn: Machine learning for clustering and TF-IDF vectorization
├── DeepSeek V3 0324 via OpenRouter: LLM for creative archetype naming and descriptions
├── Pandas: Data preprocessing and feature engineering
├── NumPy: Numerical computing for model operations
└── MongoDB + JSON: Processed archetype metadata and character traits storage
```

### Key Features

- **Archetype Classification**: Identifies content based on proprietary archetypes:
  - **Rebel Heartthrob**: Charismatic high school protagonists who defy expectations, balancing love life and personal struggles
  - **The Hidden Prodigies**: Young individuals with extraordinary skills navigating love and life while balancing personal and team dynamics
  - **Dark Mentor**: Complex characters who guide protagonists through twisted life lessons, blurring the line between villain and teacher
  - **Star Presenter**: Charismatic hosts known for dynamic personalities and engaging audiences
  - **Firebrand Strategist**: Daring protagonists whose fiery spirit and tactical brilliance set them apart in a world of chaos
- **Narrative Analysis**: Processes content for moral complexity, empathy levels, and character arcs
- **Psychological Matching**: Delivers precise recommendations like "Morally complex protagonists in tough moral dilemmas" instead of generic genres

### LLM Integration

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
    
    response = openai_client.chat.completions.create(
        model="deepseek/deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.7
    )
    
    return json.loads(response.choices[0].message.content)
```

---

## ⏱️ Adaptive Daylist Technology

The Adaptive Daylist system utilizes Mistral LLM to select relevant daylist based on mood + archetype + time of day, creating personalized content recommendations that adapt to users' emotional states and temporal preferences.

### Technical Implementation

```
├── FastAPI: High-performance API framework for recommendation endpoints
├── OpenRouter (Mistral-7B): LLM inference for intelligent content analysis
├── Hume AI: Empathic Voice Interface API for mood detection and tone analysis
├── Custom Functions: Simple recommendation logic for time-based filtering
├── MongoDB + JSON: User preferences and engagement data storage
└── Uvicorn: ASGI server for FastAPI deployment
```

### Key Features

- **Time-Sensitive Recommendations**: Adjusts content suggestions based on time of day
- **Voice-Based Mood Detection**: Processes verbal requests through Hume AI's Empathic Voice Interface to infer emotional states
- **Multi-Modal Fusion**: Combines archetypes, temporal, and emotional data for holistic recommendations

---

## 🎥 Native Watch Party

**Native Watch Party** is a standalone feature that enables users to watch content together in real-time, synchronized across devices, with integrated chat capabilities.

### Technical Implementation

```
├── WebRTC: Real-time video synchronization and low-latency streaming
├── Socket.io: Instant messaging and event broadcasting
├── Express.js: Backend signaling and room management
├── MongoDB: Session and user data storage
└── JSON: Local state management for playback control
```

### Key Features

- **Synchronized Playback**: All participants experience the same content at the same time, with host controls for play, pause, and seek
- **Integrated Chat**: Real-time text chat and emoji reactions for social interaction
- **Scalable Rooms**: Supports multiple concurrent watch parties with up to 100 participants per session
- **Device Compatibility**: Works across web browsers and can be extended to mobile and TV platforms
- **State Management**: Playback state (play, pause, seek) is broadcast and synchronized via real-time messaging

---

## 🛠️ Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://cdn.simpleicons.org/scikitlearn" width="60px"/><br/>scikit-learn</td>
      <td align="center"><img src="https://cdn.simpleicons.org/fastapi" width="60px"/><br/>FastAPI</td>
      <td align="center"><img src="https://cdn.simpleicons.org/nodedotjs" width="60px"/><br/>Node.js</td>
      <td align="center"><img src="https://cdn.simpleicons.org/mongodb" width="60px"/><br/>MongoDB</td>
      <td align="center"><img src="https://cdn.simpleicons.org/python" width="60px"/><br/>Python</td>
      <td align="center"><img src="https://cdn.simpleicons.org/javascript" width="60px"/><br/>JSON</td>
    </tr>
  </table>
</div>

### AI/ML Infrastructure
```
├── scikit-learn: Clustering and TF-IDF for archetype discovery
├── DeepSeek V3 0324: Creative archetype naming via OpenRouter
├── Mistral-7B: Content analysis and daylist generation
├── Hume AI: Empathic voice analysis for mood detection
├── FastAPI: High-performance ML inference endpoints
└── Custom Functions: Simple recommendation algorithms
```

### Data & Storage Layer
```
├── MongoDB: Document storage for user data and metadata
├── JSON Files: Local data storage for development and configuration
├── GridFS: Media file storage within MongoDB
└── Local File System: Character datasets and processed results
```

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │          Frontend Interface             │
                    │                                         │
    ┌───────────────┤  Next.js + Tailwind CSS + React        │
    │               │  SSR/SSG + Mobile-First Design         │
    │               └─────────────┬───────────────────────────┘
    │                             │ HTTP/WebSocket
    │               ┌─────────────▼───────────────────────────┐
    │               │        API Gateway & Security           │
    │               │                                         │
    │               │  Express.js + JWT Auth + OAuth2         │
    │               │  Rate Limiting + Input Validation       │
    │               └─────────────┬───────────────────────────┘
    │                             │ REST APIs
    │               ┌─────────────▼───────────────────────────┐
    │               │          Core Services                  │
    ├───────────────┤                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │ Character   │  │   Adaptive      │   │
    │               │  │ Archetype   │  │   Daylist       │   │
    │               │  │ Engine      │  │   Engine        │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               └─────────────┬───────────────────────────┘
    │                             │
    │               ┌─────────────▼───────────────────────────┐
    │               │           AI/ML Engine                  │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │ OpenRouter  │  │   FastAPI       │   │
    │               │  │ DeepSeek V3 │  │  ML Inference   │   │
    │               │  │ LLM Service │  │   <100ms        │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │   Hume AI   │  │   Mistral-7B    │   │
    │               │  │ Voice API   │  │ Content Analysis│   │
    │               │  │ Integration │  │   via OpenRouter│   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               └─────────────┬───────────────────────────┘
    │                             │
    │               ┌─────────────▼───────────────────────────┐
    │               │        Data & Storage Layer             │
    │               │                                         │
    │               │  ┌─────────────┐  ┌─────────────────┐   │
    │               │  │  MongoDB    │  │  JSON Files     │   │
    │               │  │ Document    │  │  Local Data     │   │
    │               │  │ Storage     │  │  Storage        │   │
    │               │  └─────────────┘  └─────────────────┘   │
    │               └─────────────────────────────────────────┘
    │
    └── Hume AI Empathic Voice Integration
```

---

## 🧪 Final Tech Stack

| Layer                    | Tool / Library                          | Purpose                                       |
| ------------------------ | --------------------------------------- | --------------------------------------------- |
| **Language**             | Python                                  | General scripting and orchestration           |
| **Data Handling**        | `pandas`                                | Load, filter, and manage data                 |
| **Text Preprocessing**   | `re`, `sklearn.feature_extraction.text` | Regex cleaning, TF-IDF vectorization          |
| **Clustering**           | `sklearn.cluster.KMeans`                | Unsupervised learning for grouping characters |
| **LLM (Remote)**         | **DeepSeek V3 0324 via OpenRouter API** | Generates archetype names & descriptions      |
| **API Client**           | `openai` Python SDK                     | Used to call OpenRouter LLM endpoint          |
| **Environment Handling** | `python-dotenv`                         | Load `OPENROUTER_API_KEY` securely            |
| **Storage Format**       | JSON + MongoDB                          | Input/output persistence                      |

---

## 🚀 Setup & Installation

### Prerequisites
```bash
# System Requirements
Node.js 18+
Python 3.9+
Docker & Docker Compose
MongoDB 6.0+
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/team-espanys/flux.git
cd flux

# Install dependencies
npm install
cd ml-pipeline && pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Configure your environment variables including OPENROUTER_API_KEY and HUME_API_KEY

# Start development environment
docker-compose up -d
npm run dev

# Start FastAPI ML service
cd ml-pipeline
uvicorn main:app --reload --port 8000

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

### Adaptive Daylist
```http
GET /api/v1/daylist/{user_id}/current
POST /api/v1/daylist/mood-update
GET /api/v1/daylist/recommendations/time-based
PUT /api/v1/daylist/preferences/mood
GET /api/v1/daylist/openrouter/analyze
POST /api/v1/daylist/voice/analyze
```

### Watch Party
```http
POST /api/v1/watchparty/create
GET /api/v1/watchparty/join/{room_id}
POST /api/v1/watchparty/control/{room_id}
GET /api/v1/watchparty/status/{room_id}
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
    <img src="https://img.shields.io/badge/Powered_by-AI/ML-00D4AA?style=for-the-badge" alt="Powered by AI/ML"/>
  </p>
</div>
