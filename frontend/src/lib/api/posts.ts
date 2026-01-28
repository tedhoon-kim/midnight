import { supabase } from '../supabase';
import type { TagType, SortType, PostWithDetails, PostWithCountsRow } from '../database.types';

export interface CreatePostData {
  content: string;
  tag: TagType;
  image_url?: string;
  is_permanent?: boolean;
}

export interface GetPostsOptions {
  tag?: TagType;
  sortBy?: SortType;
  limit?: number;
  offset?: number;
}

// 글 목록 조회
export async function getPosts(options: GetPostsOptions = {}): Promise<PostWithDetails[]> {
  const { tag, sortBy = 'latest', limit = 20, offset = 0 } = options;

  console.log('getPosts called with:', { tag, sortBy, limit, offset });

  let query = supabase
    .from('posts_with_counts')
    .select('*');

  // 정렬 적용
  switch (sortBy) {
    case 'reactions':
      query = query.order('reactions_count', { ascending: false });
      break;
    case 'views':
      query = query.order('view_count', { ascending: false });
      break;
    case 'latest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }
  
  // 2차 정렬: 항상 최신순
  if (sortBy !== 'latest') {
    query = query.order('created_at', { ascending: false });
  }

  // 페이지네이션
  query = query.range(offset, offset + limit - 1);

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
export async function getHotPosts(limit = 3, tag?: TagType): Promise<PostWithDetails[]> {
  console.log('getHotPosts called with:', { limit, tag });

  let query = supabase
    .from('posts_with_counts')
    .select('*');

  if (tag) {
    query = query.eq('tag', tag);
  }

  const { data, error } = await query
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
      is_permanent: postData.is_permanent ?? false,
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

// 조회수 증가 (중복 방지)
export async function incrementViewCount(postId: string, userId?: string): Promise<boolean> {
  // IP 해시 대신 간단한 세션 기반 처리 (클라이언트에서 IP 접근 불가)
  // 로그인 사용자는 user_id로, 비로그인은 localStorage 키로 중복 방지
  
  const viewKey = `post_view_${postId}`;
  
  // 비로그인 사용자: localStorage로 중복 체크
  if (!userId) {
    const viewed = localStorage.getItem(viewKey);
    if (viewed) {
      return false; // 이미 조회함
    }
    localStorage.setItem(viewKey, 'true');
  }

  // RPC 함수 호출 (DB에서 중복 체크)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('increment_view_count', {
    p_post_id: postId,
    p_user_id: userId || null,
    p_ip_hash: userId ? null : `local_${Date.now()}`, // 비로그인은 임시 해시
  });

  if (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }

  return data as boolean;
}
