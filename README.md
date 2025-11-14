# NotebookLM POC

A simple proof-of-concept implementation of a NotebookLM-like application that allows users to upload documents and ask questions about them using RAG (Retrieval-Augmented Generation).

## Features

- Upload documents (PDF, CSV, XLS, XLSX, DOCX)
- Delete documents
- Chat interface that answers questions based on uploaded document content
- RAG implementation using Langchain, FAISS, and OpenAI

## Tech Stack

### Backend
- FastAPI
- SQLite (via SQLAlchemy)
- Langchain
- FAISS (vector store)
- OpenAI API

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

6. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

7. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Start both the backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Upload documents using the upload interface
4. Once documents are uploaded, ask questions in the chat interface
5. The AI will answer based on the content of your uploaded documents

## Project Structure

```
fountain_life_exercise/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── db.py                # Database setup
│   │   ├── routers/
│   │   │   ├── documents.py     # Document upload/delete routes
│   │   │   └── chat.py          # Chat routes
│   │   ├── services/
│   │   │   ├── document_processor.py  # Document text extraction
│   │   │   └── rag_service.py         # RAG implementation
│   │   └── models/
│   │       └── schemas.py       # Pydantic models
│   ├── uploads/                 # Uploaded documents storage
│   ├── vector_store/            # FAISS vector store
│   ├── requirements.txt
│   └── .env                     # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── api/
│   │   │   └── client.ts        # API client functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## Notes

- Documents are stored in the `backend/uploads/` directory
- The vector store is persisted in `backend/vector_store/`
- The SQLite database is created automatically as `notebooklm.db` in the backend directory
- FAISS doesn't support direct document deletion, so the vector store is rebuilt when documents are added (for a production system, consider using a vector database that supports deletion)

