import { REACTION_CONFIG } from './ReactionPicker';
import type { ReactionType } from '../../lib/database.types';

interface ReactionChipProps {
  type: ReactionType;
  count: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ReactionChip = ({ 
  type, 
  count, 
  isSelected = false,
  onClick 
}: ReactionChipProps) => {
  const config = REACTION_CONFIG[type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-colors ${
        isSelected 
          ? 'bg-[#2A2A2A] border border-[#444444]' 
          : 'bg-[#1E1E24] hover:bg-[#2A2A2A]'
      }`}
    >
      <Icon 
        className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`}
        style={{ color: config.color }} 
      />
      <span className="text-xs font-semibold text-[#AAAAAA] font-mono">
        {count}
      </span>
    </button>
  );
};
