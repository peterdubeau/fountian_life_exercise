import type { Document, ChatMessage, SourceReference } from '../types';

const API_BASE_URL = '/api';

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}/documents/`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
};

export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload document');
  }

  return response.json();
};

export const deleteDocument = async (documentId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
};

export const clearAllDocuments = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/documents/clear-all`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to clear all documents');
  }
};

export const sendChatMessage = async (message: string): Promise<{ response: string; sources: SourceReference[] }> => {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return { response: data.response, sources: data.sources || [] };
};

