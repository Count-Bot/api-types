export type GuildMemberLeaderboardMetric = 'numbersCounted' | 'highestCount';

export interface APIGuildMember {
  guildId: string;
  userId: string;
  numbersCounted: number;
  highestCount: number;
  createdAt: string;
  updatedAt: string;
}
