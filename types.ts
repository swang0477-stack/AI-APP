
export type Language = 'en' | 'cn';

export interface TarotCard {
  position: string;
  position_meaning: string;
  card_name_en: string;
  card_name_cn: string;
  orientation: 'Upright' | 'Reversed';
  image_id: string;
  single_meaning: string;
}

export interface ReadingSynthesis {
  summary: string;
  advice: string;
  lucky_element?: string;
}

export interface TarotReadingResponse {
  status: 'success' | 'refused';
  refusal_reason: string | null;
  spread_type: string;
  question_topic: string;
  cards: TarotCard[];
  synthesis: ReadingSynthesis;
}

export interface ReadingHistoryItem extends TarotReadingResponse {
  id: string;
  timestamp: number;
  question: string;
}

export enum SpreadType {
  DAILY = '1-Card Spread',
  BALANCE = '2-Card Spread',
  TRINITY = '3-Card Spread',
  ACTION = 'X-Spread (5 Cards)',
  RELATIONSHIP = 'Relationship Spread (5 Cards)',
  CELTIC_CROSS = 'Celtic Cross (10 Cards)',
  FORECAST = 'Weekly/Monthly Forecast',
  HORSESHOE = 'The Horseshoe (7 Cards)'
}
