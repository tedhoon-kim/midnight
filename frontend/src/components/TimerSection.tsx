import { useMidnightAccess, useCountdown } from '../hooks/useMidnightAccess';

export const TimerSection = () => {
  const { nextOpenAt } = useMidnightAccess();
  const timeLeft = useCountdown(nextOpenAt);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="w-[80px] h-[88px] md:w-[100px] md:h-[108px] bg-midnight-card border-2 border-midnight-border rounded-lg flex flex-col items-center justify-center gap-2 md:gap-2.5 shadow-lg">
      <span className="text-white font-mono text-[36px] md:text-[48px] font-semibold leading-none">
        {formatTime(value)}
      </span>
      <span className="text-midnight-text-subtle font-mono text-[11px] md:text-[12px] font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <section className="w-full px-6 py-10 md:px-20 md:py-14 flex flex-col items-center gap-6 md:gap-8 bg-midnight-card/30">
      <span className="text-midnight-text-secondary font-mono text-[13px] md:text-[15px] font-medium">
        다음 오픈까지
      </span>

      <div className="flex items-center gap-4 md:gap-5">
        <TimeBox value={timeLeft.hours} label="시간" />
        <span className="text-midnight-text-muted font-mono text-2xl md:text-[36px] font-semibold">
          :
        </span>
        <TimeBox value={timeLeft.minutes} label="분" />
        <span className="text-midnight-text-muted font-mono text-2xl md:text-[36px] font-semibold">
          :
        </span>
        <TimeBox value={timeLeft.seconds} label="초" />
      </div>
    </section>
  );
};
