import os
from pathlib import Path
import pandas as pd
from pypdf import PdfReader
from docx import Document as DocxDocument
import openpyxl


async def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file."""
    reader = PdfReader(file_path)
    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text())
    return "\n".join(text_parts)


async def extract_text_from_csv(file_path: str) -> str:
    """Extract text from CSV file."""
    df = pd.read_csv(file_path)
    return df.to_string(index=False)


async def extract_text_from_xls(file_path: str) -> str:
    """Extract text from Excel (.xls or .xlsx) file."""
    if file_path.endswith('.xls'):
        df = pd.read_excel(file_path, engine='xlrd')
    else:
        df = pd.read_excel(file_path, engine='openpyxl')
    return df.to_string(index=False)


async def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file."""
    doc = DocxDocument(file_path)
    text_parts = []
    for paragraph in doc.paragraphs:
        text_parts.append(paragraph.text)
    return "\n".join(text_parts)


async def process_document(file_path: str, file_type: str) -> str:
    """Process document based on file type and extract text."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    file_type_lower = file_type.lower()

    if file_type_lower == "application/pdf" or file_path.endswith(".pdf"):
        return await extract_text_from_pdf(file_path)
    elif file_type_lower == "text/csv" or file_path.endswith(".csv"):
        return await extract_text_from_csv(file_path)
    elif file_type_lower in [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ] or file_path.endswith((".xls", ".xlsx")):
        return await extract_text_from_xls(file_path)
    elif file_type_lower == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or file_path.endswith(".docx"):
        return await extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

