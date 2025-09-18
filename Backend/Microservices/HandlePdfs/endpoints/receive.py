import os
import re
import tempfile
import unicodedata
import requests
import pdfplumber
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

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


# --- Text cleaning ---
def clean_text(text: str) -> str:
    # Normalize text (keeps accents, non-Latin scripts intact)
    text = unicodedata.normalize("NFC", text)

    # Collapse multiple spaces/newlines into one space
    text = re.sub(r"\s+", " ", text)

    # Remove "Page X" markers (case-insensitive)
    text = re.sub(r"Page \d+", "", text, flags=re.IGNORECASE)

    # Remove space before punctuation, but don’t drop non-English chars
    text = re.sub(r"\s([?.!,;:])", r"\1", text)

    return text.strip()


# --- PDF download + extract ---
def extract_text_from_pdf(file_url: str) -> str:
    response = requests.get(file_url, stream=True)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to download file from Supabase")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(response.content)
        tmp_path = tmp_file.name

    text = ""
    with pdfplumber.open(tmp_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"

    os.remove(tmp_path)
    return clean_text(text)


# --- Endpoint ---
@app.post("/generate-flashcards")
def generate_flashcards_endpoint(req: FlashcardRequest):
    text = extract_text_from_pdf(req.fileDownloadUrl)
    return {"text": text}
