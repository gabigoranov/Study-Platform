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
class FlashcardRequest(BaseModel):
    fileDownloadUrl: str  # Supabase file URL

# --- Endpoint ---
@app.post("/flashcards/generate")
def generate_flashcards_endpoint(req: FlashcardRequest):
    text = extract_text_from_pdf(req.fileDownloadUrl)

    prompt = f"""
    Generate concise Q&A flashcards from the text below. Each flashcard must be in the following JSON format:

    {{
    "title": "...",
    "front": "...",
    "back": "..."
    }}

    Requirements:
    - Keep language simple and consistent with the source.
    - Do not include foreign words, obscure terminology, or source-specific names.
    - Do not include examples, exercises, or data-specific scenarios.
    - Ignore headings, footers, links, and unrelated info.
    - Verify key terms and constants; do not hallucinate.
    - Cover all key topics.
    - Output must be valid JSON.

    Data: {text}
    """

    response = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    output_text = response.output_text

    try:
        flashcards = json.loads(output_text)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse flashcards JSON from model output.")

    return flashcards
