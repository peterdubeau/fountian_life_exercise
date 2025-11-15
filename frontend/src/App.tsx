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
      
      <div className="container mx-auto px-4 py-6 max-w-[95%] relative z-10 h-[calc(100vh-3rem)] flex flex-col">
        <header className="mb-6 text-left flex-shrink-0">
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-fountain-accent mb-2">
              Fountain Life
            </h1>
          </div>
          <p className="text-lg text-white/90 mt-2 font-light max-w-3xl">
            AI-Powered Document Intelligence
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <div className="flex flex-col min-h-0 lg:w-80 flex-shrink-0">
            <div className="bg-fountain-secondary/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className="w-1 h-6 bg-fountain-accent rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">
                  Documents
                </h2>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
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
          </div>

          <div className="flex flex-col min-h-0 flex-1">
            <div className="bg-fountain-secondary/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className="w-1 h-6 bg-fountain-accent rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
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

