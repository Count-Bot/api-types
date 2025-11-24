import { CountingMode } from '../v1.js';

export interface RESTPostAPIChannelJSONBody {
  id: string;
  guildId: string;
}

export interface RESTPatchAPIChannelJSONBody {
  mode?: CountingMode;
  chatting?: boolean;
  itemDrop?: boolean;
  itemUse?: boolean;
  consecutiveCounting?: boolean;
  suddenDeath?: boolean;
  deleteIncorrect?: boolean;
  achievementNotifications?: boolean;
  milestoneNotifications?: boolean;
  reactionsEnabled?: boolean;
}

export interface RESTPatchAPIChannelReactionsJSONBody {
  enabled: boolean;
  emojis?: {
    incorrect?: string;
    correct?: string;
  };
}
