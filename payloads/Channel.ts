import { Reward } from '../utils/reward.js';
import { AchievementResult } from './Achievement.js';
import { ItemDropResult } from './Item.js';

export interface BaseCountResult {
  channelId: string;
  messageId: string;
  userId: string;
  delete?: boolean;
  reaction?: string | null;
  achievement?: {
    notification: boolean;
    achievements: AchievementResult[];
  };
  itemDrop?: ItemDropResult;
}

export interface WithCountAndModeCountResult extends BaseCountResult {
  count: number;
  mode: CountingMode;
}

export interface SuddenDeathCountResult extends WithCountAndModeCountResult {
  suddenDeath: true;
}

export interface MilestoneCountResult extends WithCountAndModeCountResult {
  milestone: Reward;
}

export type CountResult = BaseCountResult | SuddenDeathCountResult | MilestoneCountResult;

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
