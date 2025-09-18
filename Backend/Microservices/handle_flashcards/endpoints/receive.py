import os
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

from utils.text_util import extract_text_from_pdf

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

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
    return {"text": text}
