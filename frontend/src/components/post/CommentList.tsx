import { useState } from 'react';
import { CommentItem } from './CommentItem';
import { EmptyState } from '../ui/EmptyState';
import { DeleteModal } from '../modals/DeleteModal';
import type { CommentWithDetails } from '../../lib/database.types';

interface CommentListProps {
  comments: CommentWithDetails[];
  currentUserId?: string;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentList = ({ 
  comments, 
  currentUserId,
  onLike,
  onDelete 
}: CommentListProps) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (commentId: string) => {
    setDeleteTargetId(commentId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    
    setIsDeleting(true);
    try {
      await onDelete?.(deleteTargetId);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };
  // 상대 시간 포맷
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (comments.length === 0) {
    return (
      <div className="w-full bg-midnight-card border border-midnight-border p-5">
        <h3 className="text-white text-[15px] font-semibold mb-4">
          댓글 0
        </h3>
        <EmptyState
          type="no-comments"
          title="아직 댓글이 없어요"
          description="첫 번째 댓글을 남겨주세요"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-5">
      <h3 className="text-white text-[15px] font-semibold mb-4">
        댓글 {comments.length}
      </h3>
      
      <div className="flex flex-col">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            author={comment.user?.nickname || '익명'}
            authorProfileImage={comment.user?.profile_image_url}
            time={formatRelativeTime(comment.created_at)}
            content={comment.content}
            likes={comment.likes_count}
            isLiked={comment.is_liked || false}
            isAuthor={comment.user_id === currentUserId}
            onLike={() => onLike?.(comment.id)}
            onDelete={() => handleDeleteClick(comment.id)}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteTargetId !== null}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="댓글을 삭제할까요?"
        description="삭제된 댓글은 복구할 수 없어요."
        isLoading={isDeleting}
      />
    </div>
  );
};
