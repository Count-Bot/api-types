export interface APICountingUserModifiers {
  userId: string;
  freeze: {
    value: boolean;
    endsAt: string | null;
  };
}
