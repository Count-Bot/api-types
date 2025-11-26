import { Reward } from '../utils/reward.js';

export enum AchievementId {
  FirstCount = 'FIRST_COUNT',
  CounterAmateur = 'COUNTER_AMATEUR',
  CounterExperienced = 'COUNTER_EXPERIENCED',
  CounterLegendary = 'COUNTER_LEGENDARY',
  ItemScavenger = 'ITEM_SCAVENGER',
  ItemSeeker = 'ITEM_SEEKER',
  ItemHunter = 'ITEM_HUNTER',
  ItemCollector = 'ITEM_COLLECTOR',
  ItemSpammer = 'ITEM_SPAMMER',
  ItemAbuser = 'ITEM_ABUSER',
  CountBotHero = 'COUNTBOT_HERO',
  CountBotChampion = 'COUNTBOT_CHAMPION',
  CountBotVillain = 'COUNTBOT_VILLAIN',
  SelflessCounter = 'SELFLESS_COUNTER',
  BotKiller = 'BOT_KILLER',
}

export interface AchievementResult {
  id: AchievementId;
  reward: Reward;
}

export interface APIAchievement {
  id: string;
  /**
   * The Discord Snowflake ID of the user who earned the achievement.
   */
  userId: string;
  /**
   * The ID of the achievement that was earned.
   */
  achievement: AchievementId;
  /**
   * The date when the achievement was awarded.
   */
  awardedAt: string;
}
