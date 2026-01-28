import type { TagType } from '../../lib/database.types';
import { TAGS } from '../../lib/constants';

interface TagSelectorProps {
  selectedTag: TagType | null;
  onSelect: (tag: TagType) => void;
  disabled?: boolean;
}

export const TagSelector = ({ selectedTag, onSelect, disabled }: TagSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[#888888] text-[13px] font-medium">태그 선택</span>
      
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => {
          const Icon = tag.icon;
          const isSelected = selectedTag === tag.id;
          
          return (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected 
                  ? 'ring-2 ring-offset-2 ring-offset-midnight-bg' 
                  : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: tag.bg, 
                color: tag.color,
                ...(isSelected && { boxShadow: `0 0 0 2px ${tag.color}` })
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: tag.color }} />
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
