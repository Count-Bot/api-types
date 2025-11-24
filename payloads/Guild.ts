import { LanguageCode } from '../utils/LanguageCode.js';

export interface APIGuild {
  id: string;
  language: LanguageCode;
  premium: boolean;
}
