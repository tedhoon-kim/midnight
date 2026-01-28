import { useState } from 'react';
import { CloudMoon, HeartCrack, Megaphone, Heart, MessageCircle, Ellipsis } from 'lucide-react';
import { ImageModal } from '../ui/ImageModal';
import { Avatar } from '../ui/Avatar';
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
  isReacted?: boolean;
  onClick?: () => void;
  onReaction?: (e: React.MouseEvent) => void;
}

const tagConfig = {
  monologue: { label: '혼잣말', icon: CloudMoon, color: '#9B8AA6', bg: '#1A1520' },
  comfort: { label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8', bg: '#201518' },
  shout: { label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9', bg: '#151A20' },
};

export const PostCard = ({
  author,
  authorProfileImage,
  time,
  tag,
  content,
  imageUrl,
  reactions,
  comments,
  isReacted = false,
  onClick,
  onReaction,
}: PostCardProps) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const config = tagConfig[tag];
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
      <div className="flex items-center gap-4 pt-2 border-t border-midnight-border">
        <button 
          className={`flex items-center gap-1.5 py-2 px-3 rounded hover:bg-midnight-border transition-colors ${
            isReacted ? 'text-status-error' : 'text-midnight-text-subtle'
          }`}
          onClick={onReaction}
        >
          <Heart className={`w-4 h-4 ${isReacted ? 'fill-current' : ''}`} />
          <span className="text-[13px] font-medium">{reactions}</span>
        </button>
        
        <button 
          className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-midnight-border transition-colors text-midnight-text-subtle"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[13px] font-medium">{comments}</span>
        </button>
      </div>
    </article>
  );
};
