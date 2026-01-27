import { useEffect, useState } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimerSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const currentHour = now.getHours();

      // Midnight opens at 00:00 (midnight) and closes at 04:00 (4 AM)
      let targetTime: Date;

      if (currentHour >= 4) {
        // If it's after 4 AM, next opening is at midnight tonight
        targetTime = new Date(now);
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(0, 0, 0, 0);
      } else {
        // If it's before 4 AM, we're currently open (but this is closed landing)
        // Still show time until next midnight
        targetTime = new Date(now);
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(0, 0, 0, 0);
      }

      const difference = targetTime.getTime() - now.getTime();

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

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
