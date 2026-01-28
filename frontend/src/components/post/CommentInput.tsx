import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';

interface CommentInputProps {
  onSubmit?: (content: string) => void;
  replyingTo?: string | null;
  onCancelReply?: () => void;
}

export const CommentInput = ({ onSubmit, replyingTo, onCancelReply }: CommentInputProps) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 답글 모드가 활성화되면 입력창에 포커스
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

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
    // ESC로 답글 취소
    if (e.key === 'Escape' && replyingTo) {
      onCancelReply?.();
    }
  };

  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-4 flex flex-col gap-2">
      {/* 답글 표시 */}
      {replyingTo && (
        <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
          <span className="text-indigo-400 text-sm">답글 작성 중...</span>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-indigo-500/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={replyingTo ? "답글을 입력하세요..." : "따뜻한 댓글을 남겨주세요..."}
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
    </div>
  );
};
