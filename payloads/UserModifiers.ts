export interface APICountingUserModifiers {
  userId: string;
  freeze: {
    value: boolean;
    endsAt: number | null;
  };
}
