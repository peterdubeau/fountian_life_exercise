from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import os
import shutil
from pathlib import Path
from datetime import datetime

from app.db import get_db, Document
from app.models.schemas import DocumentResponse
from app.services.document_processor import process_document
from app.services.rag_service import add_documents_to_vector_store, remove_document_from_vector_store, clear_vector_store

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload a document and process it."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Validate file type
    allowed_types = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    allowed_extensions = [".pdf", ".csv", ".xls", ".xlsx", ".docx"]

    file_extension = Path(file.filename).suffix.lower()
    if file.content_type not in allowed_types and file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed types: PDF, CSV, XLS, XLSX, DOCX"
        )

    # Save file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process document and extract text
    try:
        text_content = await process_document(str(file_path), file.content_type or file_extension)
    except Exception as e:
        # Clean up file if processing fails
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

    # Save to database
    db_document = Document(
        filename=file.filename,
        file_path=str(file_path),
        file_type=file.content_type or file_extension,
        uploaded_at=datetime.utcnow()
    )
    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)

    # Add to vector store
    try:
        await add_documents_to_vector_store(text_content, db_document.id, db_document.filename)
    except Exception as e:
        # Log error but don't fail the upload
        print(f"Error adding to vector store: {str(e)}")

    return DocumentResponse(
        id=db_document.id,
        filename=db_document.filename,
        file_type=db_document.file_type,
        uploaded_at=db_document.uploaded_at
    )


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db)):
    """List all uploaded documents."""
    result = await db.execute(select(Document))
    documents = result.scalars().all()
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            file_type=doc.file_type,
            uploaded_at=doc.uploaded_at
        )
        for doc in documents
    ]


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a document."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete file
    file_path = Path(document.file_path)
    if file_path.exists():
        file_path.unlink()

    # Store document_id before deletion
    doc_id = document.id

    # Delete from database
    await db.delete(document)
    await db.commit()

    # Remove from vector store
    try:
        await remove_document_from_vector_store(doc_id)
    except Exception as e:
        # Log error but don't fail the deletion
        print(f"Error removing from vector store: {str(e)}")

    return {"message": "Document deleted successfully"}


@router.delete("/clear-all")
async def clear_all_documents(db: AsyncSession = Depends(get_db)):
    """Clear all documents, files, and vector store."""
    # Delete all files
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.is_file():
            file_path.unlink()
    
    # Delete all database records
    result = await db.execute(select(Document))
    documents = result.scalars().all()
    for doc in documents:
        await db.delete(doc)
    await db.commit()
    
    # Clear vector store
    try:
        await clear_vector_store()
    except Exception as e:
        print(f"Error clearing vector store: {str(e)}")
    
    return {"message": "All documents, files, and vector store cleared successfully"}

