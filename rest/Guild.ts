import { APIGuildMember, GuildMemberLeaderboardMetric } from '../payloads/GuildMember.js';

export interface RESTPostAPIGuildJSONBody {
  id: string;
}

export interface RESTGetAPIGuildMemberLeaderboardQuery {
  page?: number;
  metric?: GuildMemberLeaderboardMetric;
}

export type RESTGetAPIGuildMemberResponse = APIGuildMember;
export type RESTGetAPIGuildMemberLeaderboardResponse = APIGuildMember[];
