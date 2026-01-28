import { useState } from 'react';
import { Heart, MessageCircle, Eye, Ellipsis } from 'lucide-react';
import { ImageModal } from '../ui/ImageModal';
import { Avatar } from '../ui/Avatar';
import { TAG_CONFIG } from '../../lib/constants';
import type { TagType } from '../../lib/database.types';

interface PostCardProps {
  id: string;
  author: string;
  authorProfileImage?: string | null;
  time: string;
  tag: TagType;
  content: string;
  imageUrl?: string;
  reactions: number;
  comments: number;
  views: number;
  isReacted?: boolean;
  onClick?: () => void;
  onReaction?: (e: React.MouseEvent) => void;
}

export const PostCard = ({
  author,
  authorProfileImage,
  time,
  tag,
  content,
  imageUrl,
  reactions,
  comments,
  views,
  isReacted = false,
  onClick,
  onReaction,
}: PostCardProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const config = TAG_CONFIG[tag];
  const TagIcon = config.icon;

  return (
    <article 
      className="w-full bg-midnight-card border border-midnight-border p-5 md:p-6 flex flex-col gap-4 cursor-pointer hover:border-midnight-text-subtle transition-colors"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar src={authorProfileImage} alt={author} size="md" />
          
          {/* Author Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
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

        {/* More Button */}
        <button 
          className="p-2 hover:bg-midnight-border rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="w-5 h-5 text-midnight-text-subtle" />
        </button>
      </div>

      {/* Content */}
      <p className="text-midnight-text-secondary text-[15px] leading-[1.7] whitespace-pre-wrap">
        {content}
      </p>

      {/* Image */}
      {imageUrl && (
        <div 
          className="w-full h-48 md:h-64 rounded-lg overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsImageModalOpen(true);
          }}
        >
          <img 
            src={imageUrl} 
            alt="Post image" 
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
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

      {/* Footer */}
      <div className="flex items-center gap-5 pt-2 border-t border-midnight-border">
        <button 
          className={`flex items-center gap-1.5 py-2 rounded hover:bg-midnight-border transition-colors ${
            isReacted ? 'text-status-error' : 'text-midnight-text-subtle'
          }`}
          onClick={onReaction}
        >
          <Heart className={`w-4 h-4 ${isReacted ? 'fill-current' : ''}`} />
          <span className="text-[13px] font-mono font-medium">{reactions}</span>
        </button>
        
        <div className="flex items-center gap-1.5 text-midnight-text-subtle">
          <MessageCircle className="w-4 h-4" />
          <span className="text-[13px] font-mono font-medium">{comments}</span>
        </div>

        <div className="flex items-center gap-1.5 text-midnight-text-subtle">
          <Eye className="w-4 h-4" />
          <span className="text-[13px] font-mono font-medium">{views}</span>
        </div>
      </div>
    </article>
  );
};
