import { User, CloudMoon, HeartCrack, Megaphone, Ellipsis } from 'lucide-react';

type TagType = 'monologue' | 'comfort' | 'shout';

interface PostDetailCardProps {
  author: string;
  time: string;
  tag: TagType;
  content: string;
  imageUrl?: string;
  onMoreClick?: () => void;
}

const tagConfig = {
  monologue: { label: '혼잣말', icon: CloudMoon, color: '#9B8AA6', bg: '#1A1520' },
  comfort: { label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8', bg: '#201518' },
  shout: { label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9', bg: '#151A20' },
};

export const PostDetailCard = ({
  author,
  time,
  tag,
  content,
  imageUrl,
  onMoreClick,
}: PostDetailCardProps) => {
  const config = tagConfig[tag];
  const TagIcon = config.icon;

  return (
    <article className="w-full bg-midnight-card border border-midnight-border p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-midnight-border rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-midnight-text-subtle" />
          </div>
          
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

        {/* More Button */}
        <button 
          className="p-2 hover:bg-midnight-border rounded transition-colors"
          onClick={onMoreClick}
        >
          <Ellipsis className="w-5 h-5 text-midnight-text-subtle" />
        </button>
      </div>

      {/* Content */}
      <p className="text-midnight-text-secondary text-base leading-[1.8] whitespace-pre-wrap">
        {content}
      </p>

      {/* Image */}
      {imageUrl && (
        <div className="w-full rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Post image" 
            className="w-full h-auto max-h-[400px] object-cover"
          />
        </div>
      )}
    </article>
  );
};
