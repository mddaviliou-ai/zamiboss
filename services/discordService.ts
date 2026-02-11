
import { RegistrationData, RegistrationResponse, FormConfig } from "../types";

export const sendToDiscord = async (
  data: RegistrationData, 
  aiResponse: RegistrationResponse, 
  config: FormConfig
) => {
  if (!config.discordWebhookUrl) return false;

  const bossNames = data.bosses.map(bid => {
    const b = config.bosses.find(x => x.id === bid);
    return `${b?.icon || '👾'} ${b?.name || bid}`;
  }).join('、');

  const embed = {
    title: `⚔️ 新的突襲報名：${data.gameId}`,
    description: `有人在 **${config.labels.title}** 提交了報名表單！`,
    color: 0x6366f1, // Indigo color
    fields: [
      { name: `📈 ${config.labels.level}`, value: data.level.toString(), inline: true },
      { name: `🛡️ ${config.labels.job}`, value: data.job, inline: true },
      { name: `📅 ${config.labels.dates}`, value: data.dates.join(', '), inline: false },
      { name: `👹 ${config.labels.bosses}`, value: bossNames, inline: false },
      { name: `💬 ${config.labels.remarks}`, value: data.remarks || '無', inline: false },
      { name: `✨ AI 摘要與戰略`, value: `**摘要**: ${aiResponse.summary}\n**建議**: ${aiResponse.tips}`, inline: false }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "RaidMaster 自動報名系統" }
  };

  try {
    const response = await fetch(config.discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
    return response.ok;
  } catch (error) {
    console.error("Discord Webhook Error:", error);
    return false;
  }
};
