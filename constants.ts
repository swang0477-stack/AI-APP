
export const TAROT_RULES_PROMPT = `
Role: You are "Mystic Luna" (or "灵月"), a professional Tarot Reader based on the Rider-Waite-Smith deck.
Tone: Mysterious, empathetic, calm, and deeply insightful. You speak with the wisdom of the ages.
Languages: Chinese (Simplified) and English. Support detection.

Interpretation Guidelines:
- Provide comprehensive, multi-layered interpretations for each card.
- Connect the individual meanings into a cohesive narrative (the "Synthesis").
- Focus on psychological archetypes, spiritual growth, and practical actionable advice.
- Each 'single_meaning' should be roughly 2-3 sentences long, rich with symbolism.
- The 'summary' should be a profound reflection on the energy of the entire spread.

Spread Logic:
- 1-Card: Yes/No, Daily focus.
- 2-Card: Pros/Cons, Balance.
- 3-Card: Past/Present/Future.
- 5-Card Action: Current, Obstacle, Hidden, Advice, Outcome.
- 5-Card Relationship: Me, You, Status, Challenges, Trend.
- 10-Card Celtic Cross: Deep analysis.
- 7-Card Horseshoe: Evolving situations.

Taboos (MUST REJECT):
- Health, Gambling, Illegal acts, Exact exam scores, Privacy of 3rd parties.

Output: Strictly JSON. No Markdown.
Structure:
{
  "status": "success" | "refused",
  "refusal_reason": string | null,
  "spread_type": string,
  "question_topic": string,
  "cards": [{
    "position": string,
    "position_meaning": string,
    "card_name_en": string,
    "card_name_cn": string,
    "orientation": "Upright" | "Reversed",
    "image_id": string,
    "single_meaning": string
  }],
  "synthesis": {
    "summary": string,
    "advice": string,
    "lucky_element": string
  }
}
`;

export const UI_STRINGS = {
  en: {
    title: "Mystic Luna",
    subtitle: "Inner Voice & Cosmic Guidance",
    askPrompt: "Whisper your question to the universe...",
    btnAsk: "Seek Guidance",
    btnRefusal: "The stars are silent on this...",
    history: "Past Reflections",
    taboos: "Rules of the Deck",
    loading: "Shuffling the astral deck...",
    readingTitle: "The Cosmic Mirror",
    summary: "The Essence",
    advice: "Divine Advice",
    lucky: "Amulets",
    noHistory: "Your spiritual journey is just beginning.",
    clearHistory: "Clear Reflection",
    pickCards: (count: number) => `Focus your intent and draw ${count} cards from the deck.`,
    deepen: "Deepen the Query",
    askNew: "Ask Anew",
    confirmSelection: "Reveal the Cards",
    sampleQuestions: [
      "What is my fortune next week?",
      "Should I accept this job offer?",
      "What is the hidden truth in this situation?",
      "How can I attract more abundance?",
      "Is it time to start a new chapter?",
      "What lesson am I currently learning?",
      "Where should I focus my energy?"
    ]
  },
  cn: {
    title: "灵月",
    subtitle: "内在声音与宇宙指引",
    askPrompt: "向宇宙倾诉你的疑惑...",
    btnAsk: "寻求指引",
    btnRefusal: "星象不宜对此占卜...",
    history: "往昔回响",
    taboos: "读牌规则",
    loading: "正在洗涤灵性卡组...",
    readingTitle: "宇宙明镜",
    summary: "灵性核心",
    advice: "行动启示",
    lucky: "护身灵物",
    noHistory: "你的灵性之旅刚刚开始。",
    clearHistory: "清除回响",
    pickCards: (count: number) => `冥想你的问题，并从卡组中抽取 ${count} 张牌。`,
    deepen: "追问细节",
    askNew: "询问新问题",
    confirmSelection: "解开封印",
    sampleQuestions: [
      "我下周的运势如何？",
      "我要不要接下这个offer？",
      "这段关系的真相是什么？",
      "如何吸引更多财富？",
      "现在是开启新篇章的时机吗？",
      "我目前正在学习什么功课？",
      "我应该把能量聚焦在哪里？"
    ]
  }
};
