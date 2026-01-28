import { useState, useEffect, useCallback, useRef } from 'react';
import { getPost, incrementViewCount } from '../lib/api/posts';
import { getMyReactions, toggleReaction } from '../lib/api/reactions';
import { useAuth } from '../contexts/AuthContext';
import type { PostWithDetails, ReactionType, ReactionsByType } from '../lib/database.types';

export function usePost(postId: string) {
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef(false);
  const viewCountedRef = useRef(false);

  const fetchPost = useCallback(async () => {
    if (!postId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getPost(postId);
      
      if (data && user) {
        // 내가 누른 리액션 타입들 조회
        const myReactions = await getMyReactions(user.id, postId);
        setPost({ 
          ...data, 
          is_reacted: myReactions.length > 0,
          my_reactions: myReactions,
        });
      } else {
        setPost(data);
      }

      // 조회수 증가 (한 번만)
      if (data && !viewCountedRef.current) {
        viewCountedRef.current = true;
        const viewIncreased = await incrementViewCount(postId, user?.id);
        if (viewIncreased) {
          // 조회수가 증가했으면 로컬 상태도 업데이트
          setPost(prev => prev ? { ...prev, view_count: prev.view_count + 1 } : null);
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [postId, user?.id]);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // 리액션 토글 (특정 타입)
  const handleReaction = useCallback(async (reactionType: ReactionType) => {
    if (!user || !post) return;

    const myReactions = post.my_reactions || [];
    const hasReacted = myReactions.includes(reactionType);
    
    // 낙관적 업데이트
    const newMyReactions = hasReacted
      ? myReactions.filter(t => t !== reactionType)
      : [...myReactions, reactionType];
    
    const newReactionsByType: ReactionsByType = { ...(post.reactions_by_type || {}) };
    const currentCount = newReactionsByType[reactionType] || 0;
    newReactionsByType[reactionType] = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;
    
    // 카운트가 0이면 삭제
    if (newReactionsByType[reactionType] === 0) {
      delete newReactionsByType[reactionType];
    }

    const newTotalCount = Object.values(newReactionsByType).reduce((sum, count) => sum + (count || 0), 0);

    setPost(prev => prev ? {
      ...prev,
      my_reactions: newMyReactions,
      is_reacted: newMyReactions.length > 0,
      reactions_by_type: newReactionsByType,
      reactions_count: newTotalCount,
    } : null);

    try {
      await toggleReaction(user.id, post.id, reactionType, hasReacted);
    } catch (err) {
      // 실패 시 롤백
      setPost(prev => prev ? {
        ...prev,
        my_reactions: myReactions,
        is_reacted: myReactions.length > 0,
        reactions_by_type: post.reactions_by_type,
        reactions_count: post.reactions_count,
      } : null);
      console.error('Error toggling reaction:', err);
    }
  }, [user, post]);

  return {
    post,
    isLoading,
    error,
    refresh: fetchPost,
    handleReaction,
  };
}
