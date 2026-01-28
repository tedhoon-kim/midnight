import { supabase } from '../supabase';
import type { TagType, PostWithDetails, PostWithCountsRow } from '../database.types';

export interface CreatePostData {
  content: string;
  tag: TagType;
  image_url?: string;
}

export interface GetPostsOptions {
  tag?: TagType;
  limit?: number;
  offset?: number;
}

// 글 목록 조회
export async function getPosts(options: GetPostsOptions = {}): Promise<PostWithDetails[]> {
  const { tag, limit = 20, offset = 0 } = options;

  console.log('getPosts called with:', { tag, limit, offset });

  let query = supabase
    .from('posts_with_counts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (tag) {
    query = query.eq('tag', tag);
  }

  const { data, error } = await query;

  console.log('getPosts result:', { data, error });

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  return ((data || []) as PostWithCountsRow[]).map(post => ({
    ...post,
    user: { id: post.user_id, nickname: post.author_nickname, profile_image_url: post.author_profile_image_url },
  }));
}

// 핫 포스트 조회 (반응 많은 순)
export async function getHotPosts(limit = 3): Promise<PostWithDetails[]> {
  console.log('getHotPosts called with limit:', limit);

  const { data, error } = await supabase
    .from('posts_with_counts')
    .select('*')
    .order('reactions_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  console.log('getHotPosts result:', { data, error });

  if (error) {
    console.error('Error fetching hot posts:', error);
    throw error;
  }

  return ((data || []) as PostWithCountsRow[]).map(post => ({
    ...post,
    user: { id: post.user_id, nickname: post.author_nickname, profile_image_url: post.author_profile_image_url },
  }));
}

// 글 상세 조회
export async function getPost(id: string): Promise<PostWithDetails | null> {
  const { data, error } = await supabase
    .from('posts_with_counts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching post:', error);
    throw error;
  }

  const post = data as PostWithCountsRow;
  return {
    ...post,
    user: { id: post.user_id, nickname: post.author_nickname, profile_image_url: post.author_profile_image_url },
  };
}

// 글 작성
export async function createPost(userId: string, postData: CreatePostData) {
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      content: postData.content,
      tag: postData.tag,
      image_url: postData.image_url,
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return post;
}

// 글 삭제
export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// 내 글 조회
export async function getMyPosts(userId: string): Promise<PostWithDetails[]> {
  const { data, error } = await supabase
    .from('posts_with_counts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my posts:', error);
    throw error;
  }

  return ((data || []) as PostWithCountsRow[]).map(post => ({
    ...post,
    user: { id: post.user_id, nickname: post.author_nickname, profile_image_url: post.author_profile_image_url },
  }));
}

// 공감한 글 조회
export async function getReactedPosts(userId: string): Promise<PostWithDetails[]> {
  // reactions 테이블에서 해당 사용자의 공감 목록을 가져옴
  const { data: reactions, error: reactionsError } = await supabase
    .from('reactions')
    .select('post_id')
    .eq('user_id', userId);

  if (reactionsError) {
    console.error('Error fetching reactions:', reactionsError);
    throw reactionsError;
  }

  if (!reactions || reactions.length === 0) {
    return [];
  }

  const postIds = (reactions as Array<{ post_id: string }>).map(r => r.post_id);

  const { data, error } = await supabase
    .from('posts_with_counts')
    .select('*')
    .in('id', postIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reacted posts:', error);
    throw error;
  }

  return ((data || []) as PostWithCountsRow[]).map(post => ({
    ...post,
    user: { id: post.user_id, nickname: post.author_nickname, profile_image_url: post.author_profile_image_url },
  }));
}
