import { useState, useEffect, useCallback, useRef } from 'react';
import { getPosts, getHotPosts } from '../lib/api/posts';
import type { GetPostsOptions } from '../lib/api/posts';
import { checkReactions } from '../lib/api/reactions';
import { useAuth } from '../contexts/AuthContext';
import type { PostWithDetails, TagType, SortType } from '../lib/database.types';

interface UsePostsOptions {
  tag?: TagType;
  sortBy?: SortType;
  limit?: number;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // 무한 루프 방지를 위한 refs
  const isFetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const currentTagRef = useRef(options.tag);
  const currentSortRef = useRef(options.sortBy);

  const fetchPosts = useCallback(async (reset = false) => {
    // 이미 fetching 중이면 무시
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      const offset = reset ? 0 : posts.length;
      const fetchOptions: GetPostsOptions = {
        tag: options.tag,
        sortBy: options.sortBy,
        limit: options.limit || 20,
        offset,
      };

      const data = await getPosts(fetchOptions);

      // 사용자가 로그인한 경우 공감 여부 확인
      let postsWithReactions = data;
      if (user && data.length > 0) {
        const postIds = data.map(p => p.id);
        const reactionsMap = await checkReactions(user.id, postIds);
        postsWithReactions = data.map(post => ({
          ...post,
          is_reacted: reactionsMap[post.id] || false,
        }));
      }

      if (reset) {
        setPosts(postsWithReactions);
      } else {
        setPosts(prev => [...prev, ...postsWithReactions]);
      }

      setHasMore(data.length === (options.limit || 20));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [options.tag, options.sortBy, options.limit, user?.id, posts.length]);

  // 초기 로드 - 한 번만 실행
  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchPosts(true);
    }
  }, []);

  // 태그 또는 정렬 변경 시 다시 로드
  useEffect(() => {
    if (currentTagRef.current !== options.tag || currentSortRef.current !== options.sortBy) {
      currentTagRef.current = options.tag;
      currentSortRef.current = options.sortBy;
      fetchPosts(true);
    }
  }, [options.tag, options.sortBy]);

  const refresh = useCallback(() => {
    isFetchingRef.current = false; // 강제 리셋
    fetchPosts(true);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isFetchingRef.current) {
      fetchPosts(false);
    }
  }, [fetchPosts, isLoading, hasMore]);

  // 로컬 상태 업데이트 (낙관적 업데이트용)
  const updatePost = useCallback((postId: string, updates: Partial<PostWithDetails>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

  const removePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
    updatePost,
    removePost,
  };
}

export function useHotPosts(limit = 3) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 무한 루프 방지
  const isFetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  const fetchHotPosts = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getHotPosts(limit);

      // 사용자가 로그인한 경우 공감 여부 확인
      let postsWithReactions = data;
      if (user && data.length > 0) {
        const postIds = data.map(p => p.id);
        const reactionsMap = await checkReactions(user.id, postIds);
        postsWithReactions = data.map(post => ({
          ...post,
          is_reacted: reactionsMap[post.id] || false,
        }));
      }

      setPosts(postsWithReactions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit, user?.id]);

  // 초기 로드 - 한 번만 실행
  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchHotPosts();
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    refresh: fetchHotPosts,
  };
}
