
import { GoogleGenAI, Type } from "@google/genai";
import { TarotReadingResponse } from "../types";
import { TAROT_RULES_PROMPT } from "../constants";

export class TarotService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getReading(question: string, lang: 'en' | 'cn'): Promise<TarotReadingResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Language: ${lang === 'cn' ? 'Chinese Simplified' : 'English'}. Question: "${question}". Perform a reading as Mystic Luna following all defined rules and spread logic.`,
        config: {
          systemInstruction: TAROT_RULES_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              refusal_reason: { type: Type.STRING, nullable: true },
              spread_type: { type: Type.STRING },
              question_topic: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    position: { type: Type.STRING },
                    position_meaning: { type: Type.STRING },
                    card_name_en: { type: Type.STRING },
                    card_name_cn: { type: Type.STRING },
                    orientation: { type: Type.STRING },
                    image_id: { type: Type.STRING },
                    single_meaning: { type: Type.STRING }
                  },
                  required: ["position", "position_meaning", "card_name_en", "card_name_cn", "orientation", "image_id", "single_meaning"]
                }
              },
              synthesis: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  advice: { type: Type.STRING },
                  lucky_element: { type: Type.STRING }
                },
                required: ["summary", "advice"]
              }
            },
            required: ["status", "spread_type", "question_topic", "cards", "synthesis"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}') as TarotReadingResponse;
      return result;
    } catch (error) {
      console.error("Tarot Reading Error:", error);
      return {
        status: 'refused',
        refusal_reason: lang === 'cn' ? '宇宙连结中断，请稍后再试。' : 'Cosmic connection lost, please try again later.',
        spread_type: '',
        question_topic: '',
        cards: [],
        synthesis: { summary: '', advice: '' }
      };
    }
  }
}

export const tarotService = new TarotService();
