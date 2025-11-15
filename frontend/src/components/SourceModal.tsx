import { useState, useEffect } from 'react';
import type { SourceReference } from '../types';

interface SourceModalProps {
  source: SourceReference | null;
  isOpen: boolean;
  onClose: () => void;
  question?: string;
}

const SourceModal = ({ source, isOpen, onClose, question }: SourceModalProps) => {
  const [relevantText, setRelevantText] = useState<string>('');
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (!source || !question) {
      setRelevantText(source?.text || '');
      return;
    }

    // Extract keywords from question (remove common words)
    const questionLower = question.toLowerCase();
    const stopWords = ['what', 'did', 'he', 'she', 'they', 'do', 'at', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'where', 'when', 'why', 'how', 'who'];
    const keywords = questionLower
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));

    // Split source text into sentences
    const sentences = source.text.split(/([.!?]\s+)/);
    const relevantSentences: string[] = [];
    const allText: string[] = [];

    // Reconstruct sentences properly
    for (let i = 0; i < sentences.length; i += 2) {
      if (i + 1 < sentences.length) {
        allText.push(sentences[i] + sentences[i + 1]);
      } else {
        allText.push(sentences[i]);
      }
    }

    // Score each sentence based on keyword matches
    const scoredSentences = allText.map(sentence => {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;
      keywords.forEach(keyword => {
        if (sentenceLower.includes(keyword)) {
          score += 1;
        }
      });
      return { sentence, score };
    });

    // Get sentences with matches, sorted by score
    const matchedSentences = scoredSentences
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.sentence);

    // If we found relevant sentences, use them; otherwise use first few sentences
    if (matchedSentences.length > 0) {
      // Include context: the matched sentence plus surrounding sentences
      const result: string[] = [];
      allText.forEach((sentence, idx) => {
        if (matchedSentences.includes(sentence)) {
          // Add the matched sentence
          result.push(sentence);
          // Optionally add next sentence for context
          if (idx + 1 < allText.length && !matchedSentences.includes(allText[idx + 1])) {
            result.push(allText[idx + 1]);
          }
        }
      });
      setRelevantText(result.join(' ').trim() || source.text);
    } else {
      // Fallback: use first few sentences
      setRelevantText(allText.slice(0, 3).join(' ').trim() || source.text);
    }
  }, [source, question]);

  if (!isOpen || !source) return null;

  const displayText = showFull ? source.text : relevantText;
  const hasMoreContent = source.text.length > relevantText.length && relevantText.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-label="Close modal"
    >
      <div
        className="bg-fountain-secondary/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-fountain-accent rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Source Reference</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close modal"
            tabIndex={0}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4">
            <p className="text-sm font-semibold text-fountain-accent mb-1">Document</p>
            <p className="text-white/90">{source.filename}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-fountain-accent mb-2">
              {showFull ? 'Full Excerpt' : 'Relevant Excerpt'}
            </p>
            <div className="bg-fountain-primary/40 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{displayText}</p>
            </div>
            {hasMoreContent && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="mt-3 text-xs text-fountain-accent hover:text-fountain-accent/80 underline transition-colors"
                tabIndex={0}
              >
                {showFull ? 'Show only relevant' : 'Show full excerpt'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceModal;

