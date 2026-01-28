import { PostCard } from './PostCard';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../contexts/AuthContext';
import { toggleReaction } from '../../lib/api/reactions';
import type { TagType, SortType } from '../../lib/database.types';

interface PostListProps {
  tag?: TagType;
  sortBy?: SortType;
  onPostClick?: (id: string) => void;
}

export const PostList = ({ tag, sortBy, onPostClick }: PostListProps) => {
  const { user } = useAuth();
  const { posts, isLoading, error, updatePost, loadMore, hasMore } = usePosts({ tag, sortBy });

  const handleReaction = async (postId: string, isReacted: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    // 낙관적 업데이트
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    updatePost(postId, {
      is_reacted: !isReacted,
      reactions_count: post.reactions_count + (isReacted ? -1 : 1),
    });

    try {
      // 목록에서는 기본 'heart' 리액션 사용
      await toggleReaction(user.id, postId, 'heart', isReacted);
    } catch (err) {
      // 롤백
      updatePost(postId, {
        is_reacted: isReacted,
        reactions_count: post.reactions_count,
      });
    }
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        title="글을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요"
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        type="no-posts"
        title="아직 글이 없어요"
        description="첫 번째 이야기를 남겨보세요"
      />
    );
  }

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

  return (
    <div className="w-full flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          author={post.user?.nickname || '익명'}
          authorProfileImage={post.user?.profile_image_url}
          time={formatRelativeTime(post.created_at)}
          tag={post.tag}
          content={post.content}
          imageUrl={post.image_url || undefined}
          reactions={post.reactions_count}
          comments={post.comments_count}
          views={post.view_count}
          isReacted={post.is_reacted}
          onClick={() => onPostClick?.(post.id)}
          onReaction={(e) => handleReaction(post.id, post.is_reacted || false, e)}
        />
      ))}
      
      {/* Load More */}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="w-full py-4 text-midnight-text-muted hover:text-midnight-text-secondary transition-colors disabled:opacity-50"
        >
          {isLoading ? <Spinner size="sm" /> : '더 보기'}
        </button>
      )}
    </div>
  );
};
