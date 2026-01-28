import { supabase } from '../supabase';
import type { User } from '../database.types';

export interface UpdateProfileData {
  nickname?: string;
  profile_image_url?: string | null;
}

// 프로필 업데이트
export async function updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: user, error } = await (supabase
    .from('users') as any)
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return user as User;
}

// 사용자 정보 조회
export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching user:', error);
    throw error;
  }

  return data as User;
}

// 닉네임 유효성 검사 (2~12자, 한글/영문/숫자/공백)
export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  const trimmed = nickname.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, error: '닉네임은 2자 이상이어야 해요' };
  }
  
  if (trimmed.length > 12) {
    return { isValid: false, error: '닉네임은 12자 이하여야 해요' };
  }
  
  // 한글, 영문, 숫자, 공백만 허용
  const validPattern = /^[가-힣a-zA-Z0-9\s]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: '한글, 영문, 숫자만 사용 가능해요' };
  }

  return { isValid: true };
}

// 랜덤 닉네임 생성
export function generateRandomNickname(): string {
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
