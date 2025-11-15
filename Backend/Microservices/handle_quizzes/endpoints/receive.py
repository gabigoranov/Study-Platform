import json
import os
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

from utils.text_util import extract_text_from_pdf
from openai import OpenAI

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
client = OpenAI()

# --- Supabase client ---
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# --- FastAPI app ---
app = FastAPI()

# --- Request schema ---
class MindmapRequest(BaseModel):
    fileDownloadUrl: str  # Supabase file URL

# --- Endpoint ---
@app.post("/quizzes/generate")
def generate_mindmap_endpoint(req: MindmapRequest):
    text = extract_text_from_pdf(req.fileDownloadUrl)

    prompt = f"""
    You are a quiz generator for a study platform.

    Analyze the text below and output a single valid JSON object that defines a Quiz, structured for use with the backend models below.

    The JSON must follow this exact schema:

    {{
      "title": "Short quiz title",
      "description": "A concise summary of the quiz topic.",
      "difficulty": 0,
      "questions": [
        {{
          "description": "Question text here?",
          "answers": [
            {{"description": "Answer option 1", "isCorrect": false }},
            {{"description": "Answer option 2", "isCorrect": true }},
            {{"description": "Answer option 3", "isCorrect": false }}
          ]
        }}
      ]
    }}

    Requirements:

    - Output valid JSON only — no markdown, no comments, no text outside JSON.

    - "title" → short, 2–6 words summarizing the quiz topic.

    - "description" → up to 400 characters, summarizing what the quiz covers.
 
    - "difficulty" → integer only: 0 = Easy ; 1 = Medium ; 2 = Hard
 
    - Each quiz must include 3–10 questions.
 
    - Each question must have 3–5 answers.
 
    - Exactly one answer per question must have "isCorrect": true.F
 
    - "description" fields must stay within the 400-character limit (to comply with model attributes).
 
    - Avoid filler or duplicate answers.
 
    - Keep all text clear, factual, and relevant to the analyzed content.
 
    - The quiz should test conceptual understanding of the text, not trivia or grammar.

    Data: {text}
    """

    response = client.responses.create(
        model="gpt-5-nano-2025-08-07",
        input=prompt,
    )

    output_text = response.output_text

    try:
        mindmap = json.loads(output_text)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse mindmap JSON from model output.")

    return mindmap
