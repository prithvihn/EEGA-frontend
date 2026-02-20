from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Allow your Next.js frontend (localhost:3000) to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://models.inference.ai.azure.com"  # GitHub marketplace endpoint
)

class EmergencyRequest(BaseModel):
    message: str
    emergency_type: str = ""

SYSTEM_PROMPT = """You are EEGA (Extreme Emergency Guidance Assistant), an AI first-aid and emergency response assistant.
When someone describes an emergency:
1. Immediately give step-by-step first aid instructions (numbered, clear, simple)
2. Mention when to call emergency services (100=Police, 101=Fire, 108=Ambulance in India)
3. Keep instructions concise and actionable — people are panicking
4. Always end with the relevant emergency number to call
Be calm, direct, and life-saving focused."""

@app.post("/analyze")
async def analyze_emergency(request: EmergencyRequest):
    user_message = request.message
    if request.emergency_type:
        user_message = f"Emergency type: {request.emergency_type}. Details: {request.message}"

    response = client.chat.completions.create(
        model="gpt-4o",  # or "gpt-4o-mini" for faster/cheaper
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        max_tokens=600,
        temperature=0.3,
    )

    return {
        "guidance": response.choices[0].message.content,
        "emergency_type": request.emergency_type or "General Emergency"
    }

@app.get("/health")
async def health():
    return {"status": "EEGA backend running"}