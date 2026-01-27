import { User, Heart, Ellipsis } from 'lucide-react';

interface CommentItemProps {
  author: string;
  time: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  isAuthor?: boolean;
  onLike?: () => void;
  onMore?: () => void;
}

export const CommentItem = ({
  author,
  time,
  content,
  likes,
  isLiked = false,
  isAuthor = false,
  onLike,
  onMore,
}: CommentItemProps) => {
  return (
    <div className="flex gap-3 py-4 border-b border-midnight-border last:border-b-0">
      {/* Avatar */}
      <div className="w-8 h-8 bg-midnight-border rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-midnight-text-subtle" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-midnight-text-secondary text-[13px] font-semibold">{author}</span>
            {isAuthor && (
              <span className="text-[10px] font-medium text-midnight-text-muted bg-midnight-border px-2 py-0.5 rounded">
                작성자
              </span>
            )}
            <span className="text-midnight-text-subtle font-mono text-[11px]">{time}</span>
          </div>

          <button 
            onClick={onMore}
            className="p-1 hover:bg-midnight-border rounded transition-colors"
          >
            <Ellipsis className="w-4 h-4 text-midnight-text-subtle" />
          </button>
        </div>

        <p className="text-midnight-text-secondary text-[14px] leading-[1.6]">{content}</p>

        <button 
          onClick={onLike}
          className={`flex items-center gap-1 w-fit text-[12px] ${
            isLiked ? 'text-status-error' : 'text-midnight-text-subtle hover:text-midnight-text-muted'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};
