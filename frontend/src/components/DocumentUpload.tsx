import { useState } from 'react';
import { uploadDocument } from '../api/client';

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

const DocumentUpload = ({ onUploadSuccess }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await uploadDocument(file);
      onUploadSuccess();
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.currentTarget.click();
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload"
        className="block mb-3 text-sm font-medium text-white/80"
      >
        Upload Document
      </label>
      <div className="flex items-center gap-4">
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.csv,.xls,.xlsx,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border file:border-white/20 file:text-sm file:font-semibold file:bg-fountain-primary file:text-white hover:file:bg-fountain-secondary hover:file:border-white/40 file:transition-all file:shadow-md file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Upload document"
        />
        {isUploading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-fountain-accent border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-white/60 font-medium">Uploading...</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/30" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;

