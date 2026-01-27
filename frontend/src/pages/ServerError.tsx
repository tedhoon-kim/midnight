import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center justify-center px-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-status-error/10 border border-status-error/20 flex items-center justify-center mb-8">
        <AlertTriangle className="w-10 h-10 text-status-error" />
      </div>

      {/* Error Code */}
      <h1 className="text-6xl font-bold text-midnight-text-primary mb-2 font-mono">
        500
      </h1>

      {/* Message */}
      <h2 className="text-xl font-semibold text-midnight-text-secondary mb-2">
        서버에 문제가 생겼어요
      </h2>
      <p className="text-midnight-text-muted text-center max-w-sm mb-8">
        일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleRefresh}
          className="flex-1 h-11 bg-midnight-card border border-midnight-border rounded-xl flex items-center justify-center gap-2 text-midnight-text-secondary hover:bg-midnight-border transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">새로고침</span>
        </button>
        <Link
          to="/"
          className="flex-1 h-11 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">홈으로</span>
        </Link>
      </div>

      {/* Support link */}
      <p className="mt-8 text-midnight-text-subtle text-sm">
        문제가 계속되면{' '}
        <a href="mailto:support@midnight.app" className="text-indigo-400 hover:underline">
          고객센터
        </a>
        로 문의해 주세요.
      </p>
    </div>
  );
};
