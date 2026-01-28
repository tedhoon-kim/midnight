import { useState, useRef, useEffect } from 'react';
import { Heart, Ellipsis, MessageCircle, ChevronDown, ChevronUp, Trash2, Flag } from 'lucide-react';
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
  isPostAuthor?: boolean;
  isMyComment?: boolean;
  repliesCount?: number;
  isReply?: boolean;
  onLike?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onReply?: () => void;
  onToggleReplies?: () => void;
  showReplies?: boolean;
}

export const CommentItem = ({
  author,
  authorProfileImage,
  time,
  content,
  likes,
  isLiked = false,
  isAuthor: _isAuthor = false,
  isPostAuthor = false,
  isMyComment = false,
  repliesCount = 0,
  isReply = false,
  onLike,
  onDelete,
  onReport,
  onReply,
  onToggleReplies,
  showReplies = false,
}: CommentItemProps) => {
  void _isAuthor; // Reserved for future use
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={`flex gap-3 py-4 border-b border-midnight-border last:border-b-0 ${isReply ? 'pl-10 relative' : ''}`}>
      {/* 대댓글 세로선 */}
      {isReply && (
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-midnight-border" />
      )}

      {/* Avatar */}
      <Avatar src={authorProfileImage} alt={author} size="sm" />

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-midnight-text-secondary text-[13px] font-semibold">{author}</span>
            {/* 글 작성자 배지 */}
            {isPostAuthor && (
              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-0.5 rounded">
                작성자
              </span>
            )}
            <span className="text-midnight-text-subtle font-mono text-[11px]">{time}</span>
          </div>

          {/* 더보기 버튼 */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-midnight-border rounded transition-colors text-midnight-text-subtle hover:text-midnight-text-muted"
            >
              <Ellipsis className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#1E1E24] border border-[#333] rounded-lg shadow-lg overflow-hidden z-10 min-w-[100px]">
                {isMyComment ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete?.();
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-status-error hover:bg-[#2A2A30] transition-colors w-full"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">삭제</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onReport?.();
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-status-warning hover:bg-[#2A2A30] transition-colors w-full"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="text-sm">신고</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-midnight-text-secondary text-[14px] leading-[1.6]">{content}</p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* 좋아요 */}
          <button 
            onClick={onLike}
            className={`flex items-center gap-1 text-[12px] ${
              isLiked ? 'text-status-error' : 'text-midnight-text-subtle hover:text-midnight-text-muted'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* 답글 버튼 - 대댓글이 아닐 때만 표시 */}
          {!isReply && onReply && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-[12px] text-midnight-text-subtle hover:text-midnight-text-muted"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>답글</span>
            </button>
          )}

          {/* 답글 토글 버튼 */}
          {!isReply && repliesCount > 0 && (
            <button
              onClick={onToggleReplies}
              className="flex items-center gap-1 text-[12px] text-indigo-400 hover:text-indigo-300"
            >
              {showReplies ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span>답글 {repliesCount}개</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
