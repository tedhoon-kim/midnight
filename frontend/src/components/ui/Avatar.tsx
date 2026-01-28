import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
  xl: 'w-8 h-8',
};

export const Avatar = ({ 
  src, 
  alt = '프로필', 
  size = 'md',
  className = '' 
}: AvatarProps) => {
  return (
    <div 
      className={`${sizeClasses[size]} bg-[#1E1E24] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 아이콘 표시
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <User className={`${iconSizeClasses[size]} text-[#666666]`} />
      )}
    </div>
  );
};
