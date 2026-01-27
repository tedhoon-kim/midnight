import { Flame, ChevronRight } from 'lucide-react';
import { HotPostCard } from './HotPostCard';

const hotPosts = [
  {
    id: 1,
    tag: 'monologue' as const,
    content: '새벽 3시에 라면 끓여 먹으면서 유튜브 보는 이 시간이 제일 좋아...',
    reactions: 47,
    comments: 12,
  },
  {
    id: 2,
    tag: 'comfort' as const,
    content: '오늘 면접 떨어졌어. 세 번째야. 이제 진짜 뭘 해야 할지 모르겠다...',
    reactions: 89,
    comments: 34,
  },
  {
    id: 3,
    tag: 'shout' as const,
    content: '야 나 진짜 행복해!! 오늘 드디어 합격 통보 받았다!!!',
    reactions: 156,
    comments: 45,
  },
];

interface HotPostsSectionProps {
  onPostClick?: (id: number) => void;
}

export const HotPostsSection = ({ onPostClick }: HotPostsSectionProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-[18px] h-[18px] text-status-error" />
          <span className="text-white text-[15px] font-semibold">지금 반응 뜨거운 글</span>
          <div className="bg-status-error/20 px-2 py-0.5 rounded-[10px]">
            <span className="text-status-error font-mono text-[10px] font-bold">LIVE</span>
          </div>
        </div>
        
        <button className="flex items-center gap-1 text-midnight-text-muted hover:text-midnight-text-secondary transition-colors">
          <span className="text-xs">더보기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {hotPosts.map((post) => (
          <HotPostCard
            key={post.id}
            tag={post.tag}
            content={post.content}
            reactions={post.reactions}
            comments={post.comments}
            onClick={() => onPostClick?.(post.id)}
          />
        ))}
      </div>
    </div>
  );
};
