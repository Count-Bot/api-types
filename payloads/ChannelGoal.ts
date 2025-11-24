export interface APIChannelGoal {
  channelId: string;
  active: boolean;
  target: number;
  lock: boolean;
  reset: boolean;
  roleId: string | null;
}
