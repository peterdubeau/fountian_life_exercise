from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.schemas import ChatMessage, ChatResponse
from app.services.rag_service import query_vector_store
from app.db import get_db

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage, db: AsyncSession = Depends(get_db)):
    """Handle chat messages and return AI responses based on uploaded documents."""
    if not message.message or not message.message.strip():
        return ChatResponse(response="Please provide a question.", sources=[])

    try:
        response, sources = await query_vector_store(message.message, db=db)
        return ChatResponse(response=response, sources=sources)
    except Exception as e:
        return ChatResponse(response=f"Error processing your question: {str(e)}", sources=[])

