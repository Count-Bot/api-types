export interface APICountingChannelModifiers {
  channelId: string;
  coinDefault: number;
  coinValue: number;
  coinEndsAt: string | null;
  luckDefault: number;
  luckValue: number;
  luckEndsAt: string | null;
  xpDefault: number;
  xpValue: number;
  xpEndsAt: string | null;
}
