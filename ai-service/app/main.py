from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.ai_engine import AIEngine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Enterprise Portal AI Service", version="1.0.0")

# Enable CORS for frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = AIEngine()
from app.vector_store import SimpleVectorStore
vector_store = SimpleVectorStore()

class ChatRequest(BaseModel):
    prompt: str
    history: Optional[list] = None
    system_instruction: Optional[str] = "You are the Smart Enterprise Portal AI Copilot. Assist employees with their questions."
    ollama_model: Optional[str] = "qwen2.5"

class ERPAnalysisRequest(BaseModel):
    inventory_count: int
    low_stock_count: int
    po_count: int
    so_count: int

@app.get("/")
@app.get("/api")
@app.get("/api/")
def read_root():
    return {
        "status": "online",
        "description": "Smart Enterprise AI Service API",
        "ollama_running": ai_engine.check_ollama()
    }

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    try:
        response_text = ai_engine.chat(
            prompt=request.prompt,
            history=request.history,
            system_instruction=request.system_instruction,
            ollama_model=request.ollama_model
        )
        return {"response": response_text}
    except Exception as e:
        logger.error(f"Chat endpoint failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/document-ai")
async def document_ai_endpoint(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        content = ""
        if file:
            # Simple text extraction for demonstration, or mock PDF/Docx content parsing
            file_bytes = await file.read()
            content = file_bytes.decode("utf-8", errors="ignore")
            logger.info(f"Received file: {file.filename}, length: {len(content)}")
        elif text:
            content = text
        else:
            raise HTTPException(status_code=400, detail="Either 'text' or 'file' must be provided.")

        if not content.strip():
            return {
                "summary": "Empty document provided",
                "key_entities": [],
                "action_items": ["Review document content"]
            }

        # Index document content into RAG vector store
        doc_name = file.filename if file else "Manual_Document_Upload"
        try:
            vector_store.add_document(content, doc_name)
            logger.info(f"Indexed document '{doc_name}' into RAG vector store.")
        except Exception as e:
            logger.error(f"Failed to index document '{doc_name}' into vector store: {e}")

        response_json_str = ai_engine.summarize_document(content)
        # Attempt to parse as JSON, otherwise return structured default
        try:
            # Clean up potential markdown formatting around JSON blocks
            cleaned_json = response_json_str.strip()
            if cleaned_json.startswith("```json"):
                cleaned_json = cleaned_json[7:]
            if cleaned_json.endswith("```"):
                cleaned_json = cleaned_json[:-3]
            cleaned_json = cleaned_json.strip()
            
            result = json.loads(cleaned_json)
            return result
        except Exception:
            # Fallback if AI output is not strict JSON
            return {
                "summary": response_json_str,
                "key_entities": ["Manual Review Required"],
                "action_items": ["Verify extracted text manually"]
            }
    except Exception as e:
        logger.error(f"Document AI endpoint failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-erp")
def analyze_erp_endpoint(request: ERPAnalysisRequest):
    try:
        report = ai_engine.analyze_erp_metrics(
            inventory_count=request.inventory_count,
            low_stock_count=request.low_stock_count,
            po_count=request.po_count,
            so_count=request.so_count
        )
        return {"report": report}
    except Exception as e:
        logger.error(f"ERP Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

import json


# Include QR API
from app.qr_api.routes import qr_router
app.include_router(qr_router)


# Include Meeting AI
from app.meeting_ai.api.fastapi import meeting_router
app.include_router(meeting_router)
