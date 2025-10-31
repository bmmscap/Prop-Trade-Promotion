import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { Account } from "../types";
import { fileToBase64 } from "../utils/helpers";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPerformanceReview = async (account: Account): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Analyze the following trading performance data for a proprietary firm account.
    Provide a brief, objective performance review in 3-4 sentences, highlighting strengths and weaknesses.
    The tone should be that of a professional trading coach.

    Data:
    - Platform: ${account.platform}
    - Firm: ${account.firm}
    - Account Balance: $${account.balance.toLocaleString()}
    - P&L Cushion: $${account.cushion.toLocaleString()}
    - Rule 1: ${account.rules[0].name}, Limit: $${account.rules[0].limit}, Current: $${account.rules[0].current} used.
    - Rule 2: ${account.rules[1].name}, Limit: $${account.rules[1].limit}, Current: $${account.rules[1].current} used.
    - Recent P&L Trend (last 5 days): ${account.pnlHistory.slice(-5).map(p => p.pnl).join(', ')}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting performance review:", error);
    return "Error: Could not retrieve AI performance review.";
  }
};

export const getPreMarketPlan = async (account: Account): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a trading coach for a futures trader.
      Based on the following account risk limits, generate a disciplined, process-oriented trading plan for the upcoming market session.
      The plan should be concise, using bullet points, and focus on risk management, entry/exit criteria, and maintaining discipline.

      Account Details:
      - Daily Loss Limit: $${account.rules.find(r => r.name.includes('Daily'))?.limit.toLocaleString()}
      - Max Drawdown: $${account.rules.find(r => r.name.includes('Drawdown'))?.limit.toLocaleString()}
    `;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating pre-market plan:", error);
        return "Error: Could not generate pre-market plan.";
    }
};

export const getMarketBriefing = async (): Promise<{ text: string, sources: any[] }> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Provide a summary of the latest market-moving news and economic data relevant to US equity index futures (ES, NQ) and commodities (Crude Oil - CL, Gold - GC).
      Focus on events from the last 24 hours and upcoming catalysts for today's session.
      The summary should be structured and easy to read.
    `;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              tools: [{googleSearch: {}}],
            },
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error fetching market briefing:", error);
        return { text: "Error: Could not fetch market briefing.", sources: [] };
    }
};

export const getJournalAnalysis = async (journalText: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a trading psychologist. Analyze the following trading journal entry to identify psychological and behavioral patterns
      like FOMO (Fear of Missing Out), revenge trading, impatience, or lack of discipline.
      Provide constructive, actionable feedback in bullet points on how the trader can improve.

      Journal Entry:
      "${journalText}"
    `;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing journal:", error);
        return "Error: Could not analyze journal.";
    }
};


export const getChartReview = async (imageFile: File, question: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    try {
        const base64Image = await fileToBase64(imageFile);
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageFile.type,
            },
        };
        const textPart = {
            text: `As a trading expert specializing in technical analysis, review this trading chart. The user's question is: "${question}"`,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error reviewing chart:", error);
        return "Error: Could not review chart image.";
    }
};

export const getTextToSpeechAudio = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read this market briefing: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating text-to-speech audio:", error);
        return null;
    }
};
