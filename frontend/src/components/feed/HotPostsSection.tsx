import { Flame, ChevronRight } from 'lucide-react';
import { HotPostCard } from './HotPostCard';
import { Spinner } from '../ui/Spinner';
import { useHotPosts } from '../../hooks/usePosts';

interface HotPostsSectionProps {
  onPostClick?: (id: string) => void;
}

export const HotPostsSection = ({ onPostClick }: HotPostsSectionProps) => {
  const { posts, isLoading } = useHotPosts(3);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

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
        {posts.map((post) => (
          <HotPostCard
            key={post.id}
            tag={post.tag}
            content={post.content}
            reactions={post.reactions_count}
            comments={post.comments_count}
            onClick={() => onPostClick?.(post.id)}
          />
        ))}
      </div>
    </div>
  );
};
