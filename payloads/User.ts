export interface APIUser {
  id: string;
  coins: number;
  xp: number;
  numbersCounted: number;
  highestCount: number;
  itemsBought: number;
  itemsFound: number;
  itemsUsed: number;
  votes: number;
  votedAt: string | null;
  premium: boolean;
  itemUseCooldownEndAt: string | null;
  lastCountAt: string | null;
}
