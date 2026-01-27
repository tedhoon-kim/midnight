import { Clock3, User } from 'lucide-react';

interface HeaderOpenProps {
  timeLeft?: string;
  nickname?: string;
}

export const HeaderOpen = ({ timeLeft = "03:47:22 남음", nickname = "익명의 올빼미" }: HeaderOpenProps) => {
  return (
    <header className="w-full px-5 py-5 md:px-20 md:py-5 flex justify-between items-center">
      {/* Logo Group */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <h1 className="text-white font-bold text-base md:text-xl tracking-[4px]">
          MIDNIGHT
        </h1>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>

      {/* Header Right */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Time Left */}
        <div className="hidden md:flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-midnight-text-muted" />
          <span className="text-midnight-text-muted font-mono text-[13px] font-medium">
            {timeLeft}
          </span>
        </div>

        {/* Profile Button */}
        <button className="bg-midnight-card px-3 py-2.5 md:px-4 md:py-2.5 rounded flex items-center gap-2 hover:bg-midnight-border transition-colors">
          <User className="w-4 h-4 text-[#888888]" />
          <span className="hidden md:inline text-[#888888] font-mono text-[13px] font-medium">
            {nickname}
          </span>
        </button>
      </div>
    </header>
  );
};
