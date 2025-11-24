import { AchievementResult } from './Achievement.js';
import { APIUserInventory } from './UserInventory.js';

export enum ItemRarity {
  Common = 1,
  Rare,
  Epic,
  Mythic,
}

export enum ItemType {
  Skip = 'Skip',
  Luck = 'Luck',
  CoinBooster = 'CoinBooster',
  XPBooster = 'XPBooster',
  Lightning = 'Lightning',
  Freeze = 'Freeze',
  LootCrate = 'LootCrate',
}

export interface APIItem {
  type: ItemType;
  rarity: ItemRarity;
}

export interface ItemDropResult {
  item: APIItem;
  result: ItemExecuteResult;
}

export interface ItemExecuteResult {
  count: number;
  skipped?: number;
  lightning?: number;
  duration?: number;
  boost?: number;
  luck?: number;
  coins?: number;
  xp?: number;
  item?: APIItem;
}

export interface ItemUseResult {
  inventory: APIUserInventory[];
  result: ItemExecuteResult;
  achievement?: AchievementResult;
}

export interface ShopItem extends APIItem {
  price: number;
}
