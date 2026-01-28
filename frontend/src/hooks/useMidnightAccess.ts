import { useState, useEffect, useCallback } from 'react';

interface MidnightAccessState {
  isOpen: boolean;
  timeLeft: string;
  nextOpenAt: Date;
  nextCloseAt: Date;
}

// 한국 시간 기준 00:00 ~ 04:00
const OPEN_HOUR = 0;
const CLOSE_HOUR = 4;

// 개발 모드에서는 항상 열림
const DEV_MODE = true;

function getKoreanTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

function calculateMidnightState(): MidnightAccessState {
  const now = getKoreanTime();
  const currentHour = now.getHours();
  
  // 개발 모드면 항상 열림, 아니면 시간 체크
  const isOpen = DEV_MODE || (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR);

  // 다음 오픈/클로즈 시간 계산
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let nextOpenAt: Date;
  let nextCloseAt: Date;

  if (isOpen) {
    // 현재 오픈 상태: 오늘 4시에 닫힘
    nextCloseAt = new Date(today);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);
    
    // 다음 오픈은 내일 0시
    nextOpenAt = new Date(today);
    nextOpenAt.setDate(nextOpenAt.getDate() + 1);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);
  } else if (currentHour >= CLOSE_HOUR) {
    // 4시 이후: 다음 오픈은 내일 0시
    nextOpenAt = new Date(today);
    nextOpenAt.setDate(nextOpenAt.getDate() + 1);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);
    
    nextCloseAt = new Date(nextOpenAt);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);
  } else {
    // 0시 이전 (이론상 불가능하지만 안전을 위해)
    nextOpenAt = new Date(today);
    nextOpenAt.setHours(OPEN_HOUR, 0, 0, 0);
    
    nextCloseAt = new Date(today);
    nextCloseAt.setHours(CLOSE_HOUR, 0, 0, 0);
  }

  // 남은 시간 계산
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
    // 매초 업데이트
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...state,
    refresh,
    // 편의 메서드
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
