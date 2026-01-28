import { supabase } from '../supabase';
import type { User } from '../database.types';

// 랜덤 닉네임 생성 (클라이언트 사이드)
function generateRandomNickname(): string {
  const adjectives = [
    '잠 못 드는', '새벽의', '밤을 걷는', '별을 보는', '달빛 아래',
    '고요한', '외로운', '따뜻한', '조용한', '꿈꾸는',
    '밤하늘의', '은은한', '차분한', '몽환적인', '깊은 밤의'
  ];
  const nouns = [
    '올빼미', '고양이', '여우', '토끼', '곰',
    '별', '달', '바람', '구름', '밤하늘',
    '산책러', '몽상가', '시인', '나그네', '여행자',
    '음악가', '화가', '독서가', '철학자', '방랑자'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj} ${noun}`;
}

// 소셜 로그인 (카카오)
export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: '',  // 개인정보 수집 안함
    },
  });

  if (error) {
    console.error('Error signing in with Kakao:', error);
    throw error;
  }

  return data;
}

// 소셜 로그인 (구글)
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }

  return data;
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// 현재 세션 가져오기
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    throw error;
  }

  return session;
}

// 현재 사용자 정보 가져오기 (users 테이블에서)
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Error getting current user:', error);
    throw error;
  }

  return data as User | null;
}

// 사용자 프로필 생성 또는 업데이트
export async function upsertUserProfile(
  authUserId: string, 
  provider: 'kakao' | 'google',
  providerId: string
): Promise<User> {
  // 먼저 기존 사용자 확인
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('provider', provider)
    .eq('provider_id', providerId)
    .maybeSingle();

  if (existingUser) {
    return existingUser as User;
  }

  // 새 사용자 생성
  const nickname = generateRandomNickname();
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: authUserId,
      nickname,
      provider,
      provider_id: providerId,
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data as User;
}

// Auth 상태 변화 리스너
export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

// 사용자 통계 조회
export async function getUserStats(userId: string) {
  const [postsResult, commentsResult] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  // 받은 공감 수는 posts_with_counts에서 합산
  const { data: posts } = await supabase
    .from('posts_with_counts')
    .select('reactions_count')
    .eq('user_id', userId);
  
  const reactionsCount = (posts || []).reduce((acc: number, p: any) => acc + (p.reactions_count || 0), 0);

  return {
    posts: postsResult.count || 0,
    reactions: reactionsCount,
    comments: commentsResult.count || 0,
  };
}
