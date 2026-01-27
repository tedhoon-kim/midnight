import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface ReactionBarProps {
  reactions: number;
  comments: number;
  isReacted?: boolean;
  onReact?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const ReactionBar = ({
  reactions,
  comments,
  isReacted = false,
  onReact,
  onComment,
  onShare,
}: ReactionBarProps) => {
  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Reaction Button */}
        <button 
          onClick={onReact}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
            isReacted 
              ? 'bg-status-error/20 text-status-error' 
              : 'bg-midnight-border text-midnight-text-muted hover:bg-midnight-text-subtle'
          }`}
        >
          <Heart className={`w-5 h-5 ${isReacted ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">공명 {reactions}</span>
        </button>

        {/* Comment Button */}
        <button 
          onClick={onComment}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-midnight-border text-midnight-text-muted hover:bg-midnight-text-subtle transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">댓글 {comments}</span>
        </button>
      </div>

      {/* Share Button */}
      <button 
        onClick={onShare}
        className="p-2.5 rounded-lg bg-midnight-border text-midnight-text-muted hover:bg-midnight-text-subtle transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};
