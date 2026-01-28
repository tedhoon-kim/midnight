import { useState, useEffect, useCallback } from 'react';
import { supabasePublic } from '../lib/supabase';

interface MidnightAccessState {
  isOpen: boolean;
  timeLeft: string;
  nextOpenAt: Date;
  nextCloseAt: Date;
}

// 한국 시간 기준 00:00 ~ 04:00
const OPEN_HOUR = 0;
const CLOSE_HOUR = 4;

// 개발 모드 키
const LOCAL_DEV_MODE_KEY = 'midnight_dev_mode_local';

// 로컬 개발 모드 (내 세션만)
function getLocalDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LOCAL_DEV_MODE_KEY) === 'true';
}

export function setLocalDevMode(enabled: boolean): void {
  localStorage.setItem(LOCAL_DEV_MODE_KEY, String(enabled));
  window.dispatchEvent(new Event('devModeChange'));
}

// 전역 개발 모드 캐시 (Supabase에서 가져온 값)
let globalDevModeCache = false;

function getGlobalDevModeCache(): boolean {
  return globalDevModeCache;
}

export function setGlobalDevModeCache(enabled: boolean): void {
  globalDevModeCache = enabled;
  window.dispatchEvent(new Event('devModeChange'));
}

// 전역 개발 모드 Supabase에서 조회
export async function fetchGlobalDevMode(): Promise<boolean> {
  try {
    const { data, error } = await (supabasePublic as any)
      .from('global_settings')
      .select('value')
      .eq('key', 'dev_mode')
      .single();

    if (error || !data) return false;
    const enabled = (data.value as { enabled?: boolean })?.enabled ?? false;
    globalDevModeCache = enabled;
    return enabled;
  } catch {
    return false;
  }
}

// 전역 개발 모드 Supabase에 저장
export async function setGlobalDevMode(enabled: boolean): Promise<boolean> {
  try {
    const { error } = await (supabasePublic as any)
      .from('global_settings')
      .update({ value: { enabled }, updated_at: new Date().toISOString() })
      .eq('key', 'dev_mode');

    if (error) {
      console.error('Error updating global dev mode:', error);
      return false;
    }
    globalDevModeCache = enabled;
    window.dispatchEvent(new Event('devModeChange'));
    return true;
  } catch {
    return false;
  }
}

// 레거시 호환
export function setDevMode(enabled: boolean): void {
  setLocalDevMode(enabled);
}

function getKoreanTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

function calculateMidnightState(): MidnightAccessState {
  const now = getKoreanTime();
  const currentHour = now.getHours();

  // 로컬 또는 전역 개발 모드면 항상 열림
  const isDevMode = getLocalDevMode() || getGlobalDevModeCache();
  const isOpen = isDevMode || (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR);

  // 다음 오픈/클로즈 시간 계산
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let nextOpenAt: Date;
  let nextCloseAt: Date;

  if (isOpen) {
    nextCloseAt = new Date(today);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);

    nextOpenAt = new Date(today);
    nextOpenAt.setDate(nextOpenAt.getDate() + 1);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);
  } else if (currentHour >= CLOSE_HOUR) {
    nextOpenAt = new Date(today);
    nextOpenAt.setDate(nextOpenAt.getDate() + 1);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);

    nextCloseAt = new Date(nextOpenAt);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);
  } else {
    nextOpenAt = new Date(today);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);

    nextCloseAt = new Date(today);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);
  }

  const targetTime = isOpen ? nextCloseAt : nextOpenAt;
  const diff = targetTime.getTime() - now.getTime();
  const timeLeft = formatTimeLeft(diff);

  return {
    isOpen,
    timeLeft,
    nextOpenAt,
    nextCloseAt,
  };
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '00:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(n => n.toString().padStart(2, '0'))
    .join(':');
}

export function useMidnightAccess() {
  const [state, setState] = useState<MidnightAccessState>(calculateMidnightState);

  const refresh = useCallback(() => {
    setState(calculateMidnightState());
  }, []);

  useEffect(() => {
    // 초기 로드 시 전역 개발 모드 조회
    fetchGlobalDevMode().then(() => refresh());

    // 매초 업데이트
    const interval = setInterval(refresh, 1000);

    // 개발 모드 변경 감지
    const handleDevModeChange = () => refresh();
    window.addEventListener('devModeChange', handleDevModeChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('devModeChange', handleDevModeChange);
    };
  }, [refresh]);

  return {
    ...state,
    refresh,
    timeLeftFormatted: state.isOpen
      ? `${state.timeLeft} 남음`
      : `다음 오픈까지 ${state.timeLeft}`,
  };
}

// 시간 분리 (타이머 표시용)
export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = getKoreanTime();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const totalSeconds = Math.floor(diff / 1000);
      return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
