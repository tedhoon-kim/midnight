import { CloudMoon, HeartCrack, Megaphone, Heart, MessageCircle } from 'lucide-react';

type TagType = 'monologue' | 'comfort' | 'shout';

interface HotPostCardProps {
  tag: TagType;
  content: string;
  reactions: number;
  comments: number;
  onClick?: () => void;
}

const tagConfig = {
  monologue: { label: '혼잣말', icon: CloudMoon, color: '#9B8AA6', bg: '#1A1520' },
  comfort: { label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8', bg: '#201518' },
  shout: { label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9', bg: '#151A20' },
};

export const HotPostCard = ({ tag, content, reactions, comments, onClick }: HotPostCardProps) => {
  const config = tagConfig[tag];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="w-[200px] flex-shrink-0 bg-midnight-card border border-midnight-border rounded-xl p-4 flex flex-col gap-2.5 text-left hover:border-midnight-text-subtle transition-colors"
    >
      {/* Tag */}
      <div 
        className="flex items-center gap-1 px-2 py-0.5 rounded-lg w-fit"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-2.5 h-2.5" style={{ color: config.color }} />
        <span className="text-[10px] font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>

      {/* Content */}
      <p className="text-[#AAAAAA] text-[13px] leading-[1.5] line-clamp-3">
        {content}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-midnight-text-subtle" />
          <span className="text-midnight-text-muted text-[11px]">{reactions}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3 text-midnight-text-subtle" />
          <span className="text-midnight-text-muted text-[11px]">{comments}</span>
        </div>
      </div>
    </button>
  );
};
