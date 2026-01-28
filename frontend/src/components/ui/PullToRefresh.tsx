import { useState, useRef, useCallback, type ReactNode } from 'react';
import { Spinner } from './Spinner';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
}

export const PullToRefresh = ({
  onRefresh,
  children,
  threshold = 80,
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 스크롤이 맨 위일 때만 pull-to-refresh 활성화
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isRefreshing || startYRef.current === 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // 아래로 당길 때만 (양수)
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      // 저항감 적용 (당길수록 느려짐)
      const resistance = 0.4;
      setPullDistance(Math.min(diff * resistance, threshold * 1.5));
    }
  }, [isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    startYRef.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center transition-opacity duration-200 z-10"
        style={{
          top: 0,
          height: pullDistance,
          opacity: showIndicator ? 1 : 0,
        }}
      >
        {isRefreshing ? (
          <Spinner size="md" />
        ) : (
          <div
            className="text-midnight-text-muted transition-transform duration-150"
            style={{
              transform: `rotate(${progress * 180}deg)`,
              opacity: progress,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-150"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transitionDuration: pullDistance === 0 && !isRefreshing ? '200ms' : '0ms',
        }}
      >
        {children}
      </div>
    </div>
  );
};
