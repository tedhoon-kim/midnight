import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onSubmit?: (content: string) => void;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit?.(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-4 flex items-end gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="따뜻한 댓글을 남겨주세요..."
        className="flex-1 bg-midnight-bg border border-midnight-border rounded-lg p-3 text-white text-sm resize-none min-h-[44px] max-h-[120px] placeholder:text-midnight-text-subtle focus:outline-none focus:border-midnight-text-muted"
        rows={1}
      />
      <button 
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="p-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
