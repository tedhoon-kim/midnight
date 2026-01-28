import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, deleteComment, toggleCommentLike, checkCommentLikes } from '../lib/api/comments';
import { useAuth } from '../contexts/AuthContext';
import type { CommentWithDetails } from '../lib/database.types';

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getComments(postId);

      // 사용자가 로그인한 경우 좋아요 여부 확인
      let commentsWithLikes = data;
      if (user && data.length > 0) {
        const commentIds = data.map(c => c.id);
        const likesMap = await checkCommentLikes(user.id, commentIds);
        commentsWithLikes = data.map(comment => ({
          ...comment,
          is_liked: likesMap[comment.id] || false,
        }));
      }

      setComments(commentsWithLikes);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성
  const addComment = useCallback(async (content: string) => {
    if (!user) throw new Error('로그인이 필요합니다');

    const newComment = await createComment(user.id, postId, content) as any;
    
    // 목록에 추가
    const commentToAdd: CommentWithDetails = {
      id: newComment.id,
      user_id: user.id,
      post_id: postId,
      content: content,
      created_at: newComment.created_at || new Date().toISOString(),
      author_nickname: user.nickname,
      author_profile_image_url: user.profile_image_url || null,
      likes_count: 0,
      user: { id: user.id, nickname: user.nickname, profile_image_url: user.profile_image_url || null },
      is_liked: false,
    };
    setComments(prev => [...prev, commentToAdd]);

    return newComment;
  }, [user, postId]);

  // 댓글 삭제
  const removeComment = useCallback(async (commentId: string) => {
    await deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  // 댓글 좋아요 토글
  const handleLike = useCallback(async (commentId: string) => {
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const wasLiked = comment.is_liked || false;

    // 낙관적 업데이트
    setComments(prev => prev.map(c => 
      c.id === commentId ? {
        ...c,
        is_liked: !wasLiked,
        likes_count: c.likes_count + (wasLiked ? -1 : 1),
      } : c
    ));

    try {
      await toggleCommentLike(user.id, commentId, wasLiked);
    } catch (err) {
      // 실패 시 롤백
      setComments(prev => prev.map(c => 
        c.id === commentId ? {
          ...c,
          is_liked: wasLiked,
          likes_count: c.likes_count + (wasLiked ? 1 : -1),
        } : c
      ));
      console.error('Error toggling comment like:', err);
    }
  }, [user, comments]);

  return {
    comments,
    isLoading,
    error,
    refresh: fetchComments,
    addComment,
    removeComment,
    handleLike,
    count: comments.length,
  };
}
