import { ItemRarity, ItemType } from '../utils/items.js';

export interface APIItem {
  type: ItemType;
  rarity: ItemRarity;
}
