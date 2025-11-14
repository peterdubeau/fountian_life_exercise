export interface Document {
  id: number;
  filename: string;
  file_type: string;
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

