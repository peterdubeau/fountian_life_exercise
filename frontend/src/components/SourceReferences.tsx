import type { SourceReference } from '../types';

interface SourceReferencesProps {
  sources: SourceReference[];
}

const SourceReferences = ({ sources }: SourceReferencesProps) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">
        Sources ({sources.length})
      </div>
      {sources.map((source, index) => (
        <div
          key={index}
          className="bg-fountain-primary/40 border border-white/10 rounded-lg p-3 hover:bg-fountain-primary/60 transition-colors"
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="w-1 h-4 bg-fountain-accent rounded-full mt-1"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-fountain-accent truncate">
                {source.filename}
              </p>
            </div>
          </div>
          <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
            {source.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SourceReferences;

