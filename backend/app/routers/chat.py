from fastapi import APIRouter
from app.models.schemas import ChatMessage, ChatResponse
from app.services.rag_service import query_vector_store

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Handle chat messages and return AI responses based on uploaded documents."""
    if not message.message or not message.message.strip():
        return ChatResponse(response="Please provide a question.")

    try:
        response = await query_vector_store(message.message)
        return ChatResponse(response=response)
    except Exception as e:
        return ChatResponse(response=f"Error processing your question: {str(e)}")

