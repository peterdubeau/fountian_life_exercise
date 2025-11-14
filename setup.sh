#!/bin/bash

# Setup script for NotebookLM POC

echo "Setting up NotebookLM POC..."

# Backend setup
echo ""
echo "=== Setting up Backend ==="
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please add your OpenAI API key to backend/.env"
fi

cd ..

# Frontend setup
echo ""
echo "=== Setting up Frontend ==="
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""
echo "To start the frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Don't forget to add your OpenAI API key to backend/.env!"

