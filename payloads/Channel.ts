import { AchievementResult } from './Achievement.js';
import { ItemDropResult } from './Item.js';

export interface CountResult {
  count: number;
  mode: CountingMode;
  valid: boolean;
  achievement?: {
    notification: boolean;
    achievements: AchievementResult[];
  };
  delete?: boolean;
  reaction?: string | null;
  suddenDeath?: boolean;
  itemDrop?: ItemDropResult;
  milestone?: {
    coins: number;
    xp: number;
  };
}

export const CountingModes = [
  'DEFAULT',
  'EVEN',
  'ODD',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'PRIME',
] as const;

export type CountingMode = (typeof CountingModes)[number];

export interface APIChannel {
  id: string;
  guildId: string;
  count: number;
  score: number;
  itemsFound: number;
  itemsUsed: number;
  enabled: boolean;
  mode: CountingMode;
  chatting: boolean;
  itemDrop: boolean;
  itemUse: boolean;
  consecutiveCounting: boolean;
  suddenDeath: boolean;
  deleteIncorrect: boolean;
  achievementNotifications: boolean;
  milestoneNotifications: boolean;
  reactionsEnabled: boolean;
  correctEmoji: string | null;
  incorrectEmoji: string | null;
  lastCountId: string | null;
  lastCountAt: string | null;
}
