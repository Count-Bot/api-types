export interface APICountingUserModifiers {
  userId: string;
  coins: {
    value: number;
    default: number;
    endsAt: string | null;
  };
  luck: {
    value: number;
    default: number;
    endsAt: string | null;
  };
  xp: {
    value: number;
    default: number;
    endsAt: string | null;
  };
  freeze: {
    value: boolean;
    endsAt: string | null;
  };
}
