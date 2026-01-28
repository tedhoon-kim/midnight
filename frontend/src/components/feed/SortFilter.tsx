import { Flame, Eye, Clock3, ArrowUpDown } from 'lucide-react';
import type { SortType } from '../../lib/database.types';

interface SortFilterProps {
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const sortOptions: { id: SortType; label: string; icon: typeof Flame }[] = [
  { id: 'reactions', label: '반응순', icon: Flame },
  { id: 'views', label: '조회순', icon: Eye },
  { id: 'latest', label: '최신순', icon: Clock3 },
];

export const SortFilter = ({ activeSort, onSortChange }: SortFilterProps) => {
  return (
    <div className="w-full flex items-center justify-between">
      {/* Sort Label */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-midnight-text-muted" />
        <span className="text-[13px] font-medium text-midnight-text-muted">정렬</span>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-black'
                  : 'bg-transparent border border-midnight-text-dim text-[#888888] hover:border-midnight-text-subtle'
              }`}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: isActive ? '#000000' : '#888888' }}
              />
              <span className={isActive ? 'font-semibold' : 'font-medium'}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
