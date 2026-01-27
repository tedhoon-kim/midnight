import { Moon, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center justify-center px-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-midnight-card border border-midnight-border flex items-center justify-center mb-8">
        <Moon className="w-10 h-10 text-midnight-text-subtle" />
      </div>

      {/* Error Code */}
      <h1 className="text-6xl font-bold text-midnight-text-primary mb-2 font-mono">
        404
      </h1>

      {/* Message */}
      <h2 className="text-xl font-semibold text-midnight-text-secondary mb-2">
        페이지를 찾을 수 없어요
      </h2>
      <p className="text-midnight-text-muted text-center max-w-sm mb-8">
        요청하신 페이지가 존재하지 않거나, 새벽이 지나 사라졌을 수도 있어요.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-11 bg-midnight-card border border-midnight-border rounded-xl flex items-center justify-center gap-2 text-midnight-text-secondary hover:bg-midnight-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">뒤로 가기</span>
        </button>
        <Link
          to="/"
          className="flex-1 h-11 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">홈으로</span>
        </Link>
      </div>
    </div>
  );
};
