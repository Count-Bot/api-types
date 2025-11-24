import { ItemRarity, ItemType } from './Item.js';

export interface APIUserInventory {
  id: string;
  userId: string;
  type: ItemType;
  rarity: ItemRarity;
  quantity: number;
}
