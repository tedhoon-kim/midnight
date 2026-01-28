import { useState } from 'react';
import { MessageCircle, Share2, SmilePlus } from 'lucide-react';
import { ReactionChip } from './ReactionChip';
import { ReactionPicker, REACTION_TYPES } from './ReactionPicker';
import type { ReactionType, ReactionsByType } from '../../lib/database.types';

interface ReactionBarProps {
  reactionsByType?: ReactionsByType | null;
  comments: number;
  myReactions?: ReactionType[];
  onReact?: (type: ReactionType) => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const ReactionBar = ({
  reactionsByType,
  comments,
  myReactions = [],
  onReact,
  onComment,
  onShare,
}: ReactionBarProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // 리액션이 있는 타입만 필터링 (순서 유지)
  const activeReactions = REACTION_TYPES.filter(
    type => reactionsByType && reactionsByType[type] && reactionsByType[type]! > 0
  );

  const handleReactionSelect = (type: ReactionType) => {
    onReact?.(type);
    // 피커는 열어둠 (여러 개 선택 가능하도록)
  };

  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Reactions Group */}
        <div className="flex items-center gap-2 relative">
          {/* 리액션 칩들 */}
          {activeReactions.map((type) => (
            <ReactionChip
              key={type}
              type={type}
              count={reactionsByType?.[type] || 0}
              isSelected={myReactions.includes(type)}
              onClick={() => onReact?.(type)}
            />
          ))}

          {/* 리액션 추가 버튼 */}
          <button 
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#333333] hover:bg-[#1E1E24] transition-colors"
          >
            <SmilePlus className="w-4 h-4 text-[#666666]" />
          </button>

          {/* Reaction Picker Popup */}
          <ReactionPicker
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelect={handleReactionSelect}
            selectedTypes={myReactions}
          />
        </div>

        {/* Comment Button */}
        <button 
          onClick={onComment}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-midnight-border transition-colors text-[#666666]"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">댓글</span>
          <span className="text-sm font-medium font-mono">{comments}</span>
        </button>
      </div>

      {/* Share Button */}
      <button 
        onClick={onShare}
        className="p-2.5 rounded-lg hover:bg-midnight-border transition-colors text-[#404040]"
      >
        <Share2 className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};
