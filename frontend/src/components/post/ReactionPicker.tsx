import { useEffect, useRef } from 'react';
import { HandHeart, Heart, Moon, Smile, Beer, Coffee } from 'lucide-react';
import type { ReactionType } from '../../lib/database.types';

// 리액션 설정 (.pen 디자인 시안 기반)
export const REACTION_CONFIG: Record<ReactionType, {
  icon: typeof Heart;
  color: string;
  label: string;
}> = {
  'hand-heart': { icon: HandHeart, color: '#E8B4B8', label: '공감' },
  'heart': { icon: Heart, color: '#6B8DD6', label: '좋아요' },
  'moon': { icon: Moon, color: '#B8A9C9', label: '새벽감성' },
  'smile': { icon: Smile, color: '#F0D9A0', label: '응원' },
  'beer': { icon: Beer, color: '#D4A574', label: '건배' },
  'coffee': { icon: Coffee, color: '#A67B5B', label: '커피' },
};

export const REACTION_TYPES: ReactionType[] = ['hand-heart', 'heart', 'moon', 'smile', 'beer', 'coffee'];

interface ReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ReactionType) => void;
  selectedTypes?: ReactionType[];
}

export const ReactionPicker = ({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedTypes = []
}: ReactionPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-[#1A1A1A] rounded-2xl shadow-lg p-3 flex items-center gap-3 z-50"
      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
    >
      {REACTION_TYPES.map((type) => {
        const config = REACTION_CONFIG[type];
        const Icon = config.icon;
        const isSelected = selectedTypes.includes(type);

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
              isSelected ? 'bg-[#333333]' : 'bg-[#252525] hover:bg-[#333333]'
            }`}
            title={config.label}
          >
            <Icon 
              className={`w-6 h-6 ${isSelected ? 'fill-current' : ''}`}
              style={{ color: config.color }} 
            />
          </button>
        );
      })}
    </div>
  );
};
