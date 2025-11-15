import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client';
import SourceReferences from './SourceReferences';
import type { ChatMessage } from '../types';

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { response, sources } = await sendChatMessage(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources: sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to get response',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-fountain-primary/40 rounded-xl border border-white/10 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 mt-12">
            <div className="inline-block p-4 bg-fountain-accent/10 rounded-full mb-4 border border-fountain-accent/20">
              <svg className="w-8 h-8 text-fountain-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white/80">Start a conversation</p>
            <p className="text-xs text-white/50 mt-1">Ask a question about your documents</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-fountain-accent/20 border border-fountain-accent/30 text-white'
                      : 'bg-fountain-primary/60 backdrop-blur-sm text-white border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <SourceReferences sources={message.sources} />
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-fountain-primary/60 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-fountain-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-fountain-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-fountain-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-white/10 bg-fountain-primary/60 backdrop-blur-sm p-4">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            className="flex-1 px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-fountain-accent focus:border-fountain-accent/50 resize-none bg-fountain-primary/40 text-white placeholder-white/40 text-sm"
            rows={2}
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-fountain-primary border border-white/20 text-white rounded-xl hover:bg-fountain-secondary hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm"
            aria-label="Send message"
            tabIndex={0}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

