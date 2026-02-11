
import { Boss } from './types';

export const AVAILABLE_BOSSES: Boss[] = [
  { id: 'b1', name: '炎魔巴洛克', difficulty: 'Hard', icon: '🔥' },
  { id: 'b2', name: '寒冰龍王', difficulty: 'Extreme', icon: '❄️' },
  { id: 'b3', name: '深淵之主', difficulty: 'Normal', icon: '🌌' },
  { id: 'b4', name: '墮落大天使', difficulty: 'Hard', icon: '👼' },
  { id: 'b5', name: '遠古石像鬼', difficulty: 'Normal', icon: '🗿' },
];

export const NEXT_7_DAYS = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    value: date.toISOString().split('T')[0],
    label: date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', weekday: 'short' }),
  };
});

export const GAME_CLASSES = [
  '戰士', '法師', '弓箭手', '牧師', '刺客', '聖騎士', '術士', '德魯伊'
];
