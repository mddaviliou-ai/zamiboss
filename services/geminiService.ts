
import { GoogleGenAI, Type } from "@google/genai";
import { RegistrationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRaidSummary = async (data: RegistrationData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `幫我生成一段專業的遊戲突襲(Raid)報名簡短摘要與給該職業的戰鬥建議。
      角色ID: ${data.gameId}
      等級: ${data.level}
      職業: ${data.job}
      挑戰BOSS: ${data.bosses.join(', ')}
      報名日期: ${data.dates.join(', ')}
      備註: ${data.remarks || '無'}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional 1-2 sentence summary of the registration."
            },
            tips: {
              type: Type.STRING,
              description: "A quick tactical tip for this specific job, level, and these bosses."
            }
          },
          required: ["summary", "tips"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: `${data.gameId} (Lv.${data.level} ${data.job}) 已成功報名參加突襲任務。`,
      tips: "請準時上線，並準備好足夠的水藥與增益道具。"
    };
  }
};
