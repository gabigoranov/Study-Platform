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

    Analyze the text below and produce a JSON object containing a "nodes" array and an "edges" array,
    formatted for use with ReactFlow. Each node represents a concept or topic; edges represent relationships
    or connections between them.

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
        {{ "id": "e1-2", "source": "1", "target": "2", "label": "related to" }}
      ]
    }}

    Requirements:
    - Use concise labels (3–6 words max).
    - The first node must represent the **main idea** of the text.
    - Subtopics and related ideas should be connected logically to their parent concepts.
    - Use unique node IDs and edge IDs.
    - Space node positions logically (you may estimate positions in a tree or radial layout).
    - Output must be **valid JSON** only (no markdown, no explanations).
    - Do not include headings, examples, or unrelated metadata.

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
