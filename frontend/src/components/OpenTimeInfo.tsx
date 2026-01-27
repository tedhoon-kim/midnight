import { Clock3 } from 'lucide-react';

export const OpenTimeInfo = () => {
  return (
    <div className="w-full px-6 py-4 md:px-20 md:py-6 flex items-center justify-center bg-midnight-card/20">
      <div className="flex items-center gap-2.5 md:gap-3 bg-midnight-card border border-midnight-border rounded-lg px-5 py-3 md:px-6 md:py-3.5">
        <Clock3 className="w-4 h-4 md:w-[18px] md:h-[18px] text-midnight-text-muted" />
        <span className="text-midnight-text-secondary font-mono text-[13px] md:text-[14px]">
          매일 자정 <span className="text-white font-semibold">00:00</span> ~ 새벽 <span className="text-white font-semibold">04:00</span>
        </span>
      </div>
    </div>
  );
};
