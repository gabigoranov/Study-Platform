import os
import re
import tempfile
import requests
import pdfplumber
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

# --- Supabase client ---
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# --- FastAPI app ---
app = FastAPI()


# --- Request schema ---
class FlashcardRequest(BaseModel):
    file_url: str  # Supabase file URL
    num_flashcards: int = 20  # optional limit
    style: str = "concise"    # e.g., concise, detailed, exam


# --- Text cleaning ---
def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"Page \d+", "", text, flags=re.IGNORECASE)
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
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


# --- Dummy flashcard generator (replace with your LLM call) ---
def generate_flashcards(text: str, num: int, style: str):
    # 🔥 Replace this with your LLM integration
    return [
        {"Q": f"Sample Question {i+1}", "A": f"Sample Answer {i+1}"}
        for i in range(num)
    ]


# --- Endpoint ---
@app.post("/generate-flashcards")
def generate_flashcards_endpoint(req: FlashcardRequest):
    text = extract_text_from_pdf(req.file_url)
    flashcards = generate_flashcards(text, req.num_flashcards, req.style)
    return {"flashcards": flashcards}
