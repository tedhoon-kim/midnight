import { CloudMoon, HeartCrack, Megaphone, Sparkles, Coffee, Music } from 'lucide-react';
import type { TagType } from './database.types';

// 태그 설정 (6종류)
export const TAG_CONFIG: Record<TagType, {
  label: string;
  icon: typeof CloudMoon;
  color: string;
  bg: string;
}> = {
  monologue: { label: '혼잣말', icon: CloudMoon, color: '#9B8AA6', bg: '#1A1520' },
  comfort: { label: '위로가 필요해', icon: HeartCrack, color: '#E8B4B8', bg: '#201518' },
  shout: { label: '세상에 외친다', icon: Megaphone, color: '#7BA3C9', bg: '#151A20' },
  emotion: { label: '새벽감성', icon: Sparkles, color: '#A8D8B9', bg: '#151F18' },
  food: { label: '야식/음료', icon: Coffee, color: '#D4A574', bg: '#1F1A15' },
  music: { label: '음악', icon: Music, color: '#B8A3D4', bg: '#1A1520' },
};

// 태그 배열 (순서 유지)
export const TAGS = Object.entries(TAG_CONFIG).map(([id, config]) => ({
  id: id as TagType,
  ...config,
}));
