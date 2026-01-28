import { supabase } from '../supabase';
import type { CommentWithDetails, CommentWithCountsRow } from '../database.types';

// 댓글 목록 조회
export async function getComments(postId: string): Promise<CommentWithDetails[]> {
  const { data, error } = await supabase
    .from('comments_with_counts')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return ((data || []) as CommentWithCountsRow[]).map(comment => ({
    ...comment,
    user: { id: comment.user_id, nickname: comment.author_nickname, profile_image_url: comment.author_profile_image_url },
  }));
}

// 댓글 작성
export async function createComment(userId: string, postId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      post_id: postId,
      content,
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  return data;
}

// 댓글 삭제
export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// 댓글 좋아요 추가
export async function addCommentLike(userId: string, commentId: string) {
  const { data, error } = await supabase
    .from('comment_likes')
    .insert({
      user_id: userId,
      comment_id: commentId,
    } as any)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return null; // 이미 좋아요함
    }
    console.error('Error adding comment like:', error);
    throw error;
  }

  return data;
}

// 댓글 좋아요 취소
export async function removeCommentLike(userId: string, commentId: string) {
  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId);

  if (error) {
    console.error('Error removing comment like:', error);
    throw error;
  }
}

// 댓글 좋아요 토글
export async function toggleCommentLike(userId: string, commentId: string, isLiked: boolean) {
  if (isLiked) {
    await removeCommentLike(userId, commentId);
    return false;
  } else {
    await addCommentLike(userId, commentId);
    return true;
  }
}

// 여러 댓글에 대한 좋아요 여부 확인
export async function checkCommentLikes(userId: string, commentIds: string[]): Promise<Record<string, boolean>> {
  if (commentIds.length === 0) return {};

  const { data, error } = await supabase
    .from('comment_likes')
    .select('comment_id')
    .eq('user_id', userId)
    .in('comment_id', commentIds);

  if (error) {
    console.error('Error checking comment likes:', error);
    return {};
  }

  return ((data || []) as Array<{ comment_id: string }>).reduce((acc, { comment_id }) => {
    acc[comment_id] = true;
    return acc;
  }, {} as Record<string, boolean>);
}

// 내가 댓글 단 글 조회
export async function getCommentedPostIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('post_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching commented posts:', error);
    throw error;
  }

  // 중복 제거
  return [...new Set(((data || []) as Array<{ post_id: string }>).map(c => c.post_id))];
}
