import { supabase, supabasePublic } from '../supabase';
import type { ReactionType } from '../database.types';

// 리액션 추가
export async function addReaction(userId: string, postId: string, reactionType: ReactionType = 'heart') {
  const { data, error } = await supabase
    .from('reactions')
    .insert({
      user_id: userId,
      post_id: postId,
      reaction_type: reactionType,
    } as any)
    .select()
    .single();

  if (error) {
    // 이미 같은 타입 리액션을 한 경우 무시
    if (error.code === '23505') {
      return null;
    }
    console.error('Error adding reaction:', error);
    throw error;
  }

  return data;
}

// 리액션 삭제 (특정 타입)
export async function removeReaction(userId: string, postId: string, reactionType: ReactionType) {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId)
    .eq('reaction_type', reactionType);

  if (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
}

// 리액션 토글 (특정 타입)
export async function toggleReaction(
  userId: string, 
  postId: string, 
  reactionType: ReactionType,
  hasReacted: boolean
): Promise<boolean> {
  if (hasReacted) {
    await removeReaction(userId, postId, reactionType);
    return false;
  } else {
    await addReaction(userId, postId, reactionType);
    return true;
  }
}

// 내가 특정 글에 누른 리액션 타입들 조회
export async function getMyReactions(userId: string, postId: string): Promise<ReactionType[]> {
  const { data, error } = await supabasePublic
    .from('reactions')
    .select('reaction_type')
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    console.error('Error getting my reactions:', error);
    return [];
  }

  return ((data || []) as Array<{ reaction_type: ReactionType }>).map(r => r.reaction_type);
}

// 여러 글에 대한 내 리액션 조회
export async function getMyReactionsForPosts(
  userId: string,
  postIds: string[]
): Promise<Record<string, ReactionType[]>> {
  if (postIds.length === 0) return {};

  const { data, error } = await supabasePublic
    .from('reactions')
    .select('post_id, reaction_type')
    .eq('user_id', userId)
    .in('post_id', postIds);

  if (error) {
    console.error('Error getting my reactions for posts:', error);
    return {};
  }

  const result: Record<string, ReactionType[]> = {};
  
  ((data || []) as Array<{ post_id: string; reaction_type: ReactionType }>).forEach(({ post_id, reaction_type }) => {
    if (!result[post_id]) {
      result[post_id] = [];
    }
    result[post_id].push(reaction_type);
  });

  return result;
}

// 레거시 호환 - 공감 여부 확인 (아무 리액션이나 있는지)
export async function checkReaction(userId: string, postId: string): Promise<boolean> {
  const reactions = await getMyReactions(userId, postId);
  return reactions.length > 0;
}

// 레거시 호환 - 여러 글에 대한 공감 여부
export async function checkReactions(userId: string, postIds: string[]): Promise<Record<string, boolean>> {
  const reactionsMap = await getMyReactionsForPosts(userId, postIds);
  
  return Object.keys(reactionsMap).reduce((acc, postId) => {
    acc[postId] = reactionsMap[postId].length > 0;
    return acc;
  }, {} as Record<string, boolean>);
}
