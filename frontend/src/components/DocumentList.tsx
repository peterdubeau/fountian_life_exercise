import { deleteDocument } from '../api/client';
import type { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  onDeleteSuccess: () => void;
}

const DocumentList = ({ documents, onDeleteSuccess }: DocumentListProps) => {
  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(documentId);
      onDeleteSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    documentId: number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDelete(documentId);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="mb-6 p-6 bg-fountain-primary/50 rounded-xl border border-white/10">
        <p className="text-sm text-white/50 text-center">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between p-4 bg-fountain-primary/60 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-fountain-primary/80 hover:border-white/20 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{doc.filename}</p>
              <p className="text-xs text-white/50 mt-1">
                {doc.file_type} • {new Date(doc.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc.id)}
              onKeyDown={(e) => handleKeyDown(e, doc.id)}
              className="ml-4 px-4 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-red-500/50 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              aria-label={`Delete ${doc.filename}`}
              tabIndex={0}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;

