import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderWithBack } from '../components/common/HeaderWithBack';
import { PostDetailCard } from '../components/post/PostDetailCard';
import { ReactionBar } from '../components/post/ReactionBar';
import { CommentInput } from '../components/post/CommentInput';
import { CommentList } from '../components/post/CommentList';
import { DeleteModal } from '../components/modals/DeleteModal';
import { ReportModal } from '../components/modals/ReportModal';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { usePost } from '../hooks/usePost';
import { useComments } from '../hooks/useComments';
import { useMidnightAccess } from '../hooks/useMidnightAccess';
import { useAuth } from '../contexts/AuthContext';
import { deletePost } from '../lib/api/posts';
import { createReport } from '../lib/api/reports';
import type { ReportReasonType } from '../lib/database.types';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { timeLeft } = useMidnightAccess();
  const { showToast } = useToast();
  const { post, isLoading, error, handleReaction } = usePost(id || '');
  const {
    comments,
    addComment,
    addReply,
    removeComment,
    handleLike,
    reportComment,
    sortBy,
    handleSortChange,
    expandedReplies,
    toggleReplies,
    replyingTo,
    startReply,
    cancelReply,
    count: commentsCount
  } = useComments(id || '');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReportPostModalOpen, setIsReportPostModalOpen] = useState(false);
  const [isReportingPost, setIsReportingPost] = useState(false);

  // 내 글인지 확인
  const isMyPost = user && post && post.user_id === user.id;

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

  const handleCommentSubmit = async (content: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addComment(content);
  };

  // 글 삭제 핸들러
  const handleDeletePost = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deletePost(id);
      showToast('글이 삭제되었습니다', 'info');
      navigate('/community');
    } catch (err) {
      console.error('Error deleting post:', err);
      showToast('글 삭제에 실패했습니다', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 글 신고 핸들러
  const handleReportPost = async (reason: string, detail?: string) => {
    if (!id || !user) return;

    setIsReportingPost(true);
    try {
      await createReport({
        reporterId: user.id,
        targetType: 'post',
        targetId: id,
        reason: reason as ReportReasonType,
        detail,
      });
      showToast('신고가 접수되었습니다', 'info');
      setIsReportPostModalOpen(false);
    } catch (err: any) {
      console.error('Error reporting post:', err);
      if (err.message?.includes('이미 신고')) {
        showToast('이미 신고한 게시물입니다', 'error');
      } else {
        showToast('신고에 실패했습니다', 'error');
      }
    } finally {
      setIsReportingPost(false);
    }
  };

  // 댓글 신고 핸들러
  const handleReportComment = async (commentId: string, reason: ReportReasonType, detail?: string) => {
    try {
      await reportComment(commentId, reason, detail);
      showToast('신고가 접수되었습니다', 'info');
    } catch (err: any) {
      console.error('Error reporting comment:', err);
      if (err.message?.includes('이미 신고')) {
        showToast('이미 신고한 댓글입니다', 'error');
      } else {
        showToast('신고에 실패했습니다', 'error');
      }
    }
  };

  // 답글 제출 핸들러
  const handleReplySubmit = async (content: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!replyingTo) return;
    await addReply(replyingTo, content);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
        <HeaderWithBack timeLeft={`${timeLeft} 남음`} />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            type="error"
            title="글을 찾을 수 없어요"
            description="삭제되었거나 존재하지 않는 글이에요"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <HeaderWithBack timeLeft={`${timeLeft} 남음`} />
      
      {/* Main Content */}
      <main className="w-full max-w-[640px] px-5 md:px-0 py-8 md:py-12 flex flex-col gap-4">
        {/* Post Card */}
        <PostDetailCard
          author={post.user?.nickname || '익명'}
          authorProfileImage={post.user?.profile_image_url}
          time={formatRelativeTime(post.created_at)}
          tag={post.tag}
          content={post.content}
          imageUrl={post.image_url || undefined}
          isMyPost={isMyPost ?? false}
          onDelete={() => setIsDeleteModalOpen(true)}
          onReport={() => setIsReportPostModalOpen(true)}
        />

        {/* Reaction Bar */}
        <ReactionBar
          reactionsByType={post.reactions_by_type}
          comments={commentsCount}
          myReactions={post.my_reactions}
          onReact={handleReaction}
        />

        {/* Comments */}
        <CommentList
          comments={comments}
          currentUserId={user?.id}
          postAuthorId={post.user_id}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onLike={handleLike}
          onDelete={removeComment}
          onReport={handleReportComment}
          onReply={startReply}
          onToggleReplies={toggleReplies}
          expandedReplies={expandedReplies}
        />

        {/* Comment Input */}
        <CommentInput
          onSubmit={replyingTo ? handleReplySubmit : handleCommentSubmit}
          replyingTo={replyingTo}
          onCancelReply={cancelReply}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        title="글을 삭제할까요?"
        description="삭제된 글은 복구할 수 없어요."
        isLoading={isDeleting}
      />

      {/* Report Post Modal */}
      <ReportModal
        isOpen={isReportPostModalOpen}
        onClose={() => setIsReportPostModalOpen(false)}
        onSubmit={handleReportPost}
        isLoading={isReportingPost}
      />
    </div>
  );
};
