import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/database.types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithKakao: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        handleUserProfile(session);
      } else {
        setIsLoading(false);
      }
    });

    // Auth 상태 변화 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        setSession(session);
        
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
          await handleUserProfile(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 사용자 프로필 처리 (조회 또는 생성)
  async function handleUserProfile(session: Session) {
    const authUser = session.user;
    const authUserId = authUser.id;
    const provider = (authUser.app_metadata.provider || 'google') as 'kakao' | 'google';
    const providerId = authUser.user_metadata.sub || authUser.id;

    console.log('Handling user profile:', { authUserId, provider, providerId });

    try {
      // 먼저 auth.uid()와 동일한 id로 사용자 조회
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user by id:', fetchError);
      }

      // id로 못 찾으면 provider + provider_id로 찾기
      if (!existingUser) {
        const { data: userByProvider } = await supabase
          .from('users')
          .select('*')
          .eq('provider', provider)
          .eq('provider_id', providerId)
          .maybeSingle();
        
        existingUser = userByProvider;
      }

      if (existingUser) {
        console.log('Found existing user:', existingUser);
        setUser(existingUser as User);
      } else {
        // 새 사용자 생성 (id를 auth.uid()와 동일하게 설정)
        console.log('Creating new user with id:', authUserId);
        const nickname = generateRandomNickname();
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUserId,  // auth.uid()와 동일하게!
            nickname,
            provider,
            provider_id: providerId,
          } as any)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          // 이미 존재하는 경우 다시 조회
          if (insertError.code === '23505') {
            const { data: retryUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', authUserId)
              .single();
            if (retryUser) {
              setUser(retryUser as User);
            }
          }
        } else {
          console.log('Created new user:', newUser);
          setUser(newUser as User);
        }
      }
    } catch (error) {
      console.error('Error handling user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // 카카오 로그인
  async function signInWithKakao() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  // 구글 로그인
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  // 로그아웃
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }

  // 사용자 정보 업데이트 (프로필 수정 후 호출)
  function updateUser(updatedUser: User) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signInWithKakao,
        signInWithGoogle,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 랜덤 닉네임 생성
function generateRandomNickname(): string {
  const adjectives = [
    '잠 못 드는', '새벽의', '밤을 걷는', '별을 보는', '달빛 아래',
    '고요한', '외로운', '따뜻한', '조용한', '꿈꾸는',
    '밤하늘의', '은은한', '차분한', '몽환적인', '깊은 밤의'
  ];
  const nouns = [
    '올빼미', '고양이', '여우', '토끼', '곰',
    '별', '달', '바람', '구름', '밤하늘',
    '산책러', '몽상가', '시인', '나그네', '여행자'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj} ${noun}`;
}
