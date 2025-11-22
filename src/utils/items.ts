import { AchievementReward } from './Achievement.js';
import { APIItem } from '../payloads/Item.js';

export interface ItemDrop {
  item: APIItem;
  result: ItemExecuteResult;
}

export interface UserInventoryEntry extends APIItem {
  quantity: number;
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
  inventory: UserInventoryEntry[];
  result: ItemExecuteResult;
  achievement?: AchievementReward;
}

export type ItemRarityString = keyof typeof ItemRarity;
export type ItemTypeString = keyof typeof ItemType;
export type ItemTypeStringUppercase = Uppercase<ItemTypeString>;
export type ItemTypeStringLowercase = Lowercase<ItemTypeString>;
export type ItemString = `${ItemRarityString}_${ItemTypeString}`;

export enum ItemMode {
  FOUND = 'FOUND',
  USED = 'USED',
}

export enum ItemRarity {
  Common = 1,
  Rare,
  Epic,
  Mythic,
}

export enum ItemType {
  Skip = 1024,
  Luck = 2048,
  CoinBooster = 4096,
  XPBooster = 8192,
  Lightning = 16384,
  Freeze = 32768,
  LootCrate = 65536,
}

export type ShopItem = [APIItem, number];

export const ITEM_STRINGS: Record<ItemType, ItemTypeString> = {
  [ItemType.Skip]: 'Skip',
  [ItemType.Luck]: 'Luck',
  [ItemType.CoinBooster]: 'CoinBooster',
  [ItemType.XPBooster]: 'XPBooster',
  [ItemType.Lightning]: 'Lightning',
  [ItemType.Freeze]: 'Freeze',
  [ItemType.LootCrate]: 'LootCrate',
};

export const RARITY_STRINGS: Record<ItemRarity, ItemRarityString> = {
  [ItemRarity.Common]: 'Common',
  [ItemRarity.Rare]: 'Rare',
  [ItemRarity.Epic]: 'Epic',
  [ItemRarity.Mythic]: 'Mythic',
};

/**
 * Convert a rarity to a string
 * @param {ItemRarity} rarity The rarity type
 * @returns {ItemRarityString} The item rarity string
 */
export function rarityToString(rarity: ItemRarity): ItemRarityString {
  return RARITY_STRINGS[rarity];
}

/**
 * Convert a rarity to a string
 * @param {ItemType} type The item type
 * @returns {ItemTypeString} Item type string
 */
export function typeToString(type: ItemType): ItemTypeString {
  return ITEM_STRINGS[type];
}

/**
 * Convert an item string to its rarity and type
 * @param {ItemString} item The item string in the format "Rarity_Type"
 * @returns {[ItemRarity, ItemType]} A tuple containing the rarity and type
 */
export function itemStringToRarityAndType(item: ItemString): [rarity: ItemRarity, type: ItemType] {
  const [rarityStr, typeStr] = itemStringToRarityAndTypeString(item);

  return [ItemRarity[rarityStr], ItemType[typeStr]];
}

/**
 * Convert an item string to its rarity and type strings
 * @param {ItemString} item The item string in the format "Rarity_Type"
 * @returns {[ItemRarityString, ItemTypeString]} A tuple containing the rarity and type strings
 */
export function itemStringToRarityAndTypeString(item: ItemString): [rarity: ItemRarityString, type: ItemTypeString] {
  const [rarityStr, typeStr] = item.split('_') as [ItemRarityString, ItemTypeString];

  return [rarityStr, typeStr];
}
