import { useState, useEffect } from 'react';
import { fetchDocuments } from './api/client';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';
import type { Document } from './types';

const App = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-fountain-primary relative overflow-hidden">
      {/* Subtle glowing accent line */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 bg-fountain-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 left-20 w-64 h-64 bg-fountain-accent/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <header className="mb-12 text-left">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-fountain-accent mb-4">
              Fountain Life
            </h1>
          </div>
          <p className="text-xl text-white/90 mt-3 font-light max-w-3xl">
            AI-Powered Document Intelligence
          </p>
          <p className="text-sm text-white/60 mt-3 max-w-2xl">
            Upload your documents and ask questions powered by advanced AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-fountain-secondary/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-fountain-accent rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white">
                  Documents
                </h2>
              </div>
              <DocumentUpload onUploadSuccess={loadDocuments} />
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-pulse text-white/50 text-sm">Loading documents...</div>
                </div>
              ) : (
                <DocumentList
                  documents={documents}
                  onDeleteSuccess={loadDocuments}
                />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-fountain-secondary/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl h-[600px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-fountain-accent rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white">AI Assistant</h2>
              </div>
              <div className="flex-1 min-h-0">
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

