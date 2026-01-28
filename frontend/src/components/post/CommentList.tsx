import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { EmptyState } from '../ui/EmptyState';
import { DeleteModal } from '../modals/DeleteModal';
import { ReportModal } from '../modals/ReportModal';
import type { CommentWithDetails, CommentSortType, ReportReasonType } from '../../lib/database.types';

interface CommentListProps {
  comments: CommentWithDetails[];
  currentUserId?: string;
  postAuthorId?: string;
  sortBy: CommentSortType;
  onSortChange: (sort: CommentSortType) => void;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string, reason: ReportReasonType, detail?: string) => void;
  onReply?: (parentId: string) => void;
  onToggleReplies?: (commentId: string) => void;
  expandedReplies?: Set<string>;
}

const sortOptions: { value: CommentSortType; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

export const CommentList = ({ 
  comments, 
  currentUserId,
  postAuthorId,
  sortBy,
  onSortChange,
  onLike,
  onDelete,
  onReport,
  onReply,
  onToggleReplies,
  expandedReplies = new Set(),
}: CommentListProps) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 부모 댓글만 필터링 (parent_id가 null인 것)
  const parentComments = comments.filter(c => !c.parent_id);
  
  // 대댓글 맵 생성
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parent_id) {
      if (!acc[comment.parent_id]) {
        acc[comment.parent_id] = [];
      }
      acc[comment.parent_id].push(comment);
    }
    return acc;
  }, {} as Record<string, CommentWithDetails[]>);

  const handleDeleteClick = (commentId: string) => {
    setDeleteTargetId(commentId);
  };

  const handleReportClick = (commentId: string) => {
    setReportTargetId(commentId);
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

  const handleReportSubmit = async (reason: string, detail?: string) => {
    if (!reportTargetId) return;
    
    setIsReporting(true);
    try {
      await onReport?.(reportTargetId, reason as ReportReasonType, detail);
      setReportTargetId(null);
    } finally {
      setIsReporting(false);
    }
  };

  const handleReportCancel = () => {
    setReportTargetId(null);
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

  const totalCount = comments.length;

  if (totalCount === 0) {
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

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || '최신순';

  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-5">
      {/* Header with sort dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-[15px] font-semibold">
          댓글 {totalCount}
        </h3>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1 text-midnight-text-muted text-sm hover:text-midnight-text-secondary transition-colors"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-[#1E1E24] border border-[#333] rounded-lg shadow-lg overflow-hidden z-20 min-w-[100px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? 'text-indigo-400 bg-indigo-400/10'
                        : 'text-midnight-text-secondary hover:bg-[#2A2A30]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Comments */}
      <div className="flex flex-col">
        {parentComments.map((comment) => {
          const replies = repliesMap[comment.id] || [];
          const isExpanded = expandedReplies.has(comment.id);

          return (
            <div key={comment.id}>
              <CommentItem
                id={comment.id}
                author={comment.user?.nickname || '익명'}
                authorProfileImage={comment.user?.profile_image_url}
                time={formatRelativeTime(comment.created_at)}
                content={comment.content}
                likes={comment.likes_count}
                isLiked={comment.is_liked || false}
                isPostAuthor={comment.user_id === postAuthorId}
                isMyComment={comment.user_id === currentUserId}
                repliesCount={comment.replies_count || replies.length}
                onLike={() => onLike?.(comment.id)}
                onDelete={() => handleDeleteClick(comment.id)}
                onReport={() => handleReportClick(comment.id)}
                onReply={() => onReply?.(comment.id)}
                onToggleReplies={() => onToggleReplies?.(comment.id)}
                showReplies={isExpanded}
              />

              {/* 대댓글 렌더링 */}
              {isExpanded && replies.length > 0 && (
                <div className="ml-0">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      id={reply.id}
                      author={reply.user?.nickname || '익명'}
                      authorProfileImage={reply.user?.profile_image_url}
                      time={formatRelativeTime(reply.created_at)}
                      content={reply.content}
                      likes={reply.likes_count}
                      isLiked={reply.is_liked || false}
                      isPostAuthor={reply.user_id === postAuthorId}
                      isMyComment={reply.user_id === currentUserId}
                      isReply={true}
                      onLike={() => onLike?.(reply.id)}
                      onDelete={() => handleDeleteClick(reply.id)}
                      onReport={() => handleReportClick(reply.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
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

      {/* Report Modal */}
      <ReportModal
        isOpen={reportTargetId !== null}
        onClose={handleReportCancel}
        onSubmit={handleReportSubmit}
        isLoading={isReporting}
      />
    </div>
  );
};
