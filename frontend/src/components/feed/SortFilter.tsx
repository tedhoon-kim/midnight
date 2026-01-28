import { Flame, Eye, Clock3, ArrowUpDown } from 'lucide-react';
import type { SortType } from '../../lib/database.types';

interface SortFilterProps {
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const sortOptions: { id: SortType; label: string; icon: typeof Flame }[] = [
  { id: 'reactions', label: '인기', icon: Flame },
  { id: 'views', label: '조회수', icon: Eye },
  { id: 'latest', label: '최신', icon: Clock3 },
];

export const SortFilter = ({ activeSort, onSortChange }: SortFilterProps) => {
  return (
    <div className="w-full flex items-center justify-between">
      {/* Sort Label */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
        <span className="text-[13px] font-medium text-[#666666]">정렬</span>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className="flex items-center gap-1 transition-all"
            >
              <Icon
                className="w-[13px] h-[13px]"
                style={{ color: isActive ? '#FFFFFF' : '#555555' }}
              />
              <span
                className="text-xs"
                style={{
                  color: isActive ? '#FFFFFF' : '#555555',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
