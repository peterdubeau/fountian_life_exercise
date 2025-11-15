export interface Document {
  id: number;
  filename: string;
  file_type: string;
  uploaded_at: string;
}

export interface SourceReference {
  document_id?: number;
  filename: string;
  text: string;
  chunk_index?: number;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: SourceReference[];
}

