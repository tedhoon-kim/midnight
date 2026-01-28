import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, createReply, deleteComment, toggleCommentLike, checkCommentLikes } from '../lib/api/comments';
import { createReport } from '../lib/api/reports';
import { useAuth } from '../contexts/AuthContext';
import type { CommentWithDetails, CommentSortType, ReportReasonType } from '../lib/database.types';

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortBy, setSortBy] = useState<CommentSortType>('latest');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getComments(postId, sortBy);

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
  }, [postId, user, sortBy]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 정렬 변경
  const handleSortChange = useCallback((newSort: CommentSortType) => {
    setSortBy(newSort);
  }, []);

  // 댓글 작성
  const addComment = useCallback(async (content: string) => {
    if (!user) throw new Error('로그인이 필요합니다');

    const newComment = await createComment(user.id, postId, content) as any;
    
    // 목록에 추가
    const commentToAdd: CommentWithDetails = {
      id: newComment.id,
      user_id: user.id,
      post_id: postId,
      parent_id: null,
      content: content,
      created_at: newComment.created_at || new Date().toISOString(),
      author_nickname: user.nickname,
      author_profile_image_url: user.profile_image_url || null,
      likes_count: 0,
      replies_count: 0,
      user: { id: user.id, nickname: user.nickname, profile_image_url: user.profile_image_url || null },
      is_liked: false,
    };
    setComments(prev => [...prev, commentToAdd]);

    return newComment;
  }, [user, postId]);

  // 대댓글(답글) 작성
  const addReply = useCallback(async (parentId: string, content: string) => {
    if (!user) throw new Error('로그인이 필요합니다');

    const newReply = await createReply(user.id, postId, parentId, content) as any;
    
    // 목록에 추가
    const replyToAdd: CommentWithDetails = {
      id: newReply.id,
      user_id: user.id,
      post_id: postId,
      parent_id: parentId,
      content: content,
      created_at: newReply.created_at || new Date().toISOString(),
      author_nickname: user.nickname,
      author_profile_image_url: user.profile_image_url || null,
      likes_count: 0,
      replies_count: 0,
      user: { id: user.id, nickname: user.nickname, profile_image_url: user.profile_image_url || null },
      is_liked: false,
    };
    setComments(prev => [...prev, replyToAdd]);

    // 부모 댓글의 replies_count 증가
    setComments(prev => prev.map(c => 
      c.id === parentId 
        ? { ...c, replies_count: (c.replies_count || 0) + 1 }
        : c
    ));

    // 답글 입력 상태 초기화
    setReplyingTo(null);

    // 답글 영역 자동 펼치기
    setExpandedReplies(prev => new Set([...prev, parentId]));

    return newReply;
  }, [user, postId]);

  // 댓글 삭제
  const removeComment = useCallback(async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    await deleteComment(commentId);
    
    // 삭제된 댓글이 대댓글이면 부모 댓글의 replies_count 감소
    if (comment?.parent_id) {
      setComments(prev => prev.map(c => 
        c.id === comment.parent_id
          ? { ...c, replies_count: Math.max(0, (c.replies_count || 0) - 1) }
          : c
      ));
    }
    
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, [comments]);

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

  // 댓글 신고
  const reportComment = useCallback(async (commentId: string, reason: ReportReasonType, detail?: string) => {
    if (!user) throw new Error('로그인이 필요합니다');

    await createReport({
      reporterId: user.id,
      targetType: 'comment',
      targetId: commentId,
      reason,
      detail,
    });
  }, [user]);

  // 답글 토글
  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  // 답글 작성 모드 설정
  const startReply = useCallback((parentId: string) => {
    setReplyingTo(parentId);
    // 답글 영역 자동 펼치기
    setExpandedReplies(prev => new Set([...prev, parentId]));
  }, []);

  // 답글 작성 취소
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  return {
    comments,
    isLoading,
    error,
    sortBy,
    expandedReplies,
    replyingTo,
    refresh: fetchComments,
    addComment,
    addReply,
    removeComment,
    handleLike,
    reportComment,
    handleSortChange,
    toggleReplies,
    startReply,
    cancelReply,
    count: comments.length,
  };
}
