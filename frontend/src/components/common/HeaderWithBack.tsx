import { ArrowLeft, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderWithBackProps {
  title?: string;
  timeLeft?: string;
  showTime?: boolean;
}

export const HeaderWithBack = ({ title, timeLeft = "03:42:15 남음", showTime = true }: HeaderWithBackProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-5 py-5 md:px-20 md:py-5 flex justify-between items-center">
      {/* Header Left */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">돌아가기</span>
        </button>

        {/* Logo Group or Title */}
        {title ? (
          <h1 className="text-white font-semibold text-base">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-2">
            <h1 className="text-white font-bold text-base md:text-xl tracking-[4px]">
              MIDNIGHT
            </h1>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Header Right */}
      {showTime && (
        <div className="flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-midnight-text-muted" />
          <span className="text-midnight-text-muted font-mono text-[13px] font-medium">
            {timeLeft}
          </span>
        </div>
      )}
    </header>
  );
};
