import { Heart, Ellipsis } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface CommentItemProps {
  id: string;
  author: string;
  authorProfileImage?: string | null;
  time: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  isAuthor?: boolean;
  onLike?: () => void;
  onDelete?: () => void;
}

export const CommentItem = ({
  author,
  authorProfileImage,
  time,
  content,
  likes,
  isLiked = false,
  isAuthor = false,
  onLike,
  onDelete,
}: CommentItemProps) => {
  return (
    <div className="flex gap-3 py-4 border-b border-midnight-border last:border-b-0">
      {/* Avatar */}
      <Avatar src={authorProfileImage} alt={author} size="sm" />

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

          {isAuthor && (
            <button 
              onClick={onDelete}
              className="p-1 hover:bg-midnight-border rounded transition-colors text-midnight-text-subtle hover:text-status-error"
            >
              <Ellipsis className="w-4 h-4" />
            </button>
          )}
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
