import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderWithBack } from '../components/common/HeaderWithBack';
import { PostDetailCard } from '../components/post/PostDetailCard';
import { ReactionBar } from '../components/post/ReactionBar';
import { CommentInput } from '../components/post/CommentInput';
import { CommentList } from '../components/post/CommentList';
import { DeleteModal } from '../components/modals/DeleteModal';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { usePost } from '../hooks/usePost';
import { useComments } from '../hooks/useComments';
import { useMidnightAccess } from '../hooks/useMidnightAccess';
import { useAuth } from '../contexts/AuthContext';
import { deletePost } from '../lib/api/posts';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { timeLeft } = useMidnightAccess();
  const { showToast } = useToast();
  const { post, isLoading, error, handleReaction } = usePost(id || '');
  const { comments, addComment, removeComment, handleLike, count: commentsCount } = useComments(id || '');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          onLike={handleLike}
          onDelete={removeComment}
        />

        {/* Comment Input */}
        <CommentInput onSubmit={handleCommentSubmit} />
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
    </div>
  );
};
