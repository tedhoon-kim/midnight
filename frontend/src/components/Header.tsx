import { LogIn } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full px-5 py-6 md:px-20 md:py-6 flex justify-between items-center">
      {/* Logo Group */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <h1 className="text-white font-bold text-base md:text-xl tracking-wider-xl">
          MIDNIGHT
        </h1>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>

      {/* Login Button */}
      <button className="bg-midnight-card px-3.5 py-2 md:px-5 md:py-2.5 rounded flex items-center gap-2 hover:bg-midnight-border transition-colors">
        <LogIn className="w-4 h-4 text-midnight-text-muted" />
        <span className="text-midnight-text-muted font-mono text-xs md:text-sm font-medium">
          로그인
        </span>
      </button>
    </header>
  );
};
