export interface APIChannelModifiers {
  channelId: string;
  coins: {
    default: number;
    value: number;
    endsAt: string | null;
  };
  luck: {
    default: number;
    value: number;
    endsAt: string | null;
  };
  xp: {
    default: number;
    value: number;
    endsAt: string | null;
  };
}
