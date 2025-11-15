from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentCreate(BaseModel):
    filename: str
    file_path: str
    file_type: str


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class ChatMessage(BaseModel):
    message: str


class SourceReference(BaseModel):
    document_id: Optional[int] = None
    filename: str
    text: str
    chunk_index: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    sources: list[SourceReference] = []

