import { CloudMoon, HeartCrack, Megaphone } from 'lucide-react';

type TabType = 'all' | 'monologue' | 'comfort' | 'shout';

interface FilterTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'all' as TabType, label: '전체', icon: null },
  { id: 'monologue' as TabType, label: '혼잣말', icon: CloudMoon, color: '#9B8AA6' },
  { id: 'comfort' as TabType, label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8' },
  { id: 'shout' as TabType, label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9' },
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
