interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div
      className={`animate-spin rounded-full border-midnight-text-subtle border-t-indigo-400 ${sizeClasses[size]} ${className}`}
    />
  );
};

// Full page loading spinner
export const PageSpinner = () => {
  return (
    <div className="min-h-screen bg-midnight-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-midnight-text-muted text-sm">로딩 중...</p>
      </div>
    </div>
  );
};
