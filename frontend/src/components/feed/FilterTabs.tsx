import { TAGS } from '../../lib/constants';
import type { TagType } from '../../lib/database.types';

export type TabType = 'all' | TagType;

interface FilterTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'all' as TabType, label: '전체', icon: null, color: undefined },
  ...TAGS.map(tag => ({ id: tag.id as TabType, label: tag.label, icon: tag.icon, color: tag.color })),
];

export const FilterTabs = ({ activeTab, onTabChange }: FilterTabsProps) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
              isActive 
                ? 'bg-white text-black' 
                : 'bg-transparent border border-midnight-text-dim text-[#888888] hover:border-midnight-text-subtle'
            }`}
          >
            {Icon && (
              <Icon 
                className="w-3.5 h-3.5" 
                style={{ color: isActive ? '#000000' : tab.color }} 
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
