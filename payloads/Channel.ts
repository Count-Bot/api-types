import { Reward } from '../utils/reward.js';
import { AchievementResult } from './Achievement.js';
import { ItemDropResult } from './Item.js';

export interface CountResult {
  count: number;
  mode: CountingMode;
  valid: boolean;
  delete?: boolean;
  reaction?: string | null;
  suddenDeath?: boolean;
  achievement?: {
    notification: boolean;
    achievements: AchievementResult[];
  };
  itemDrop?: ItemDropResult;
  milestoneReward?: Reward;
}

export enum CountingMode {
  Default,
  Even,
  Odd,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Prime,
}

export enum CountInputForm {
  PlainDecimal = 1,
  ReverseDecimal = 2,
  Hex = 4,
  Binary = 8,
  Scientific = 16,
}

export interface APIChannel {
  id: string;
  guildId: string;
  count: number;
  score: number;
  itemsFound: number;
  itemsUsed: number;
  enabled: boolean;
  mode: CountingMode;
  inputFormMask: number;
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
