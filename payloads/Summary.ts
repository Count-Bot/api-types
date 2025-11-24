export interface APICountingSummary {
  id: string;
  /**
   * If the summary is the current one
   */
  current: boolean;
  /**
   * Number of achievements users earned for the day
   */
  achievements: number;
  /**
   * Number of Counting Channels created for the day
   */
  channels: number;
  /**
   * Number of counts for the day
   */
  counts: number;
  /**
   * Number of new guilds for the day
   */
  guilds: number;
  /**
   * Number of items bought for the day
   */
  itemsBought: number;
  /**
   * Number of items used for the day
   */
  itemsUsed: number;
  /**
   * Number of new users for the day
   */
  users: number;
  /**
   * Number of votes for the day
   */
  votes: number;
  /**
   * End of the day timestamp (milliseconds since epoch)
   */
  endOfDayTimestamp: number;
}
