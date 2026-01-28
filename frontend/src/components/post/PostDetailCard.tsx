import { useState, useRef, useEffect } from 'react';
import { Ellipsis, Trash2 } from 'lucide-react';
import { ImageModal } from '../ui/ImageModal';
import { Avatar } from '../ui/Avatar';
import { TAG_CONFIG } from '../../lib/constants';
import type { TagType } from '../../lib/database.types';

interface PostDetailCardProps {
  author: string;
  authorProfileImage?: string | null;
  time: string;
  tag: TagType;
  content: string;
  imageUrl?: string;
  isMyPost?: boolean;
  onDelete?: () => void;
}

export const PostDetailCard = ({
  author,
  authorProfileImage,
  time,
  tag,
  content,
  imageUrl,
  isMyPost = false,
  onDelete,
}: PostDetailCardProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = TAG_CONFIG[tag];
  const TagIcon = config.icon;

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <article className="w-full bg-midnight-card border border-midnight-border p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar src={authorProfileImage} alt={author} size="md" />
          
          {/* Author Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-midnight-text-secondary text-[15px] font-semibold">{author}</span>
              {/* Tag */}
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                style={{ backgroundColor: config.bg }}
              >
                <TagIcon className="w-3 h-3" style={{ color: config.color }} />
                <span className="text-[11px] font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
            </div>
            <span className="text-midnight-text-subtle font-mono text-xs">{time}</span>
          </div>
        </div>

        {/* More Button - 내 글일 때만 표시 */}
        {isMyPost && (
          <div className="relative" ref={menuRef}>
            <button 
              className="p-2 hover:bg-midnight-border rounded transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Ellipsis className="w-5 h-5 text-midnight-text-subtle" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#1E1E24] border border-[#333] rounded-lg shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete?.();
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-status-error hover:bg-[#2A2A30] transition-colors w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">삭제</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-midnight-text-secondary text-base leading-[1.8] whitespace-pre-wrap">
        {content}
      </p>

      {/* Image */}
      {imageUrl && (
        <div 
          className="w-full rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <img 
            src={imageUrl} 
            alt="Post image" 
            className="w-full h-auto max-h-[400px] object-cover hover:opacity-90 transition-opacity"
          />
        </div>
      )}

      {/* Image Modal */}
      {imageUrl && (
        <ImageModal 
          imageUrl={imageUrl}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </article>
  );
};
