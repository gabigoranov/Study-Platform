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
@app.post("/mindmaps/generate")
def generate_mindmap_endpoint(req: MindmapRequest):
    text = extract_text_from_pdf(req.fileDownloadUrl)

    prompt = f"""
    You are a mindmap generator for a study tool.

    Analyze the text below and output a single **valid JSON object** that defines a conceptual mindmap.
    The mindmap must include a "nodes" array and an "edges" array, formatted for use with ReactFlow.

    Each node represents a distinct concept or idea.
    Each edge represents a logical relationship or connection between two nodes.

    Follow this structure exactly:

    {{
      "nodes": [
        {{
          "id": "1",
          "data": {{ "label": "Main Topic" }},
          "position": {{ "x": 0, "y": 0 }}
        }},
        {{
          "id": "2",
          "data": {{ "label": "Subtopic" }},
          "position": {{ "x": 200, "y": 100 }}
        }}
      ],
      "edges": [
        {{ "id": "e1-2", "source": "1", "target": "2", "label": "related" }}
      ],
      "difficulty": 0,
      "description": "A concise summary of the overall mindmap.",
      "title": "A short title for the topic"
    }}

    ### Requirements:
    - Output **valid JSON only** (no markdown, no comments, no text outside the JSON).
    - The first node must represent the **main idea**.
    - Use concise node labels (2–5 words max).
    - Use concise edge labels (1–3 words max, like “leads to”, “causes”, “includes”, etc.).
    - Avoid having any node with more than **3 direct children** — prefer deeper branching instead.
    - Place nodes in a logical, spaced layout (tree or radial structure).
    - Use unique node and edge IDs.
    - Include a reasonable estimate of positions for clarity.
    - “difficulty” must be an integer: 0 = Easy, 1 = Medium, 2 = Hard.
    - Do **not** output difficulty as text (“Easy”, “Hard”, etc.).
    - “description” should briefly explain the mindmap (max 2 sentences).
    - “title” should summarize the main topic in a few words.

    Text:
    {text}
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
