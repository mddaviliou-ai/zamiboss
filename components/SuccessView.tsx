
import React, { useState } from 'react';
import { RegistrationData, RegistrationResponse, FormConfig } from '../types';

interface Props {
  data: RegistrationData;
  aiResponse: RegistrationResponse;
  config: FormConfig;
  onReset: () => void;
}

export const SuccessView: React.FC<Props> = ({ data, aiResponse, config, onReset }) => {
  const [copied, setCopied] = useState(false);
  const getBossData = (id: string) => config.bosses.find(b => b.id === id);

  const copyToDiscord = () => {
    const bossNames = data.bosses.map(bid => {
      const b = getBossData(bid);
      return `${b?.icon || ''}${b?.name || bid}`;
    }).join('、');

    const text = `🎮 **Raid 報名確認**
━━━━━━━━━━━━━━
👤 **ID**: ${data.gameId}
📈 **${config.labels.level}**: ${data.level}
🛡️ **職業**: ${data.job}
👹 **挑戰**: ${bossNames}
📅 **日期**: ${data.dates.join(', ')}
💬 **備註**: ${data.remarks || '無'}
━━━━━━━━━━━━━━
✨ *${aiResponse.summary}*`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl space-y-8 overflow-hidden relative animate-in zoom-in-95">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6 ring-8 ring-emerald-500/5">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">報名完成！</h2>
        <p className="text-slate-400">已將您的資訊登錄至名單中。</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={copyToDiscord}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all border-2 ${
            copied 
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
            : 'bg-[#5865F2] hover:bg-[#4752C4] border-transparent text-white shadow-xl shadow-[#5865F2]/20'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              已複製成功！
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.946-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/>
              </svg>
              複製 Discord 回報文字
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase">{config.labels.gameId}</span>
            <span className="text-white font-bold">{data.gameId}</span>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/20">
              Lv.{data.level}
            </span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20">
              {data.job}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {data.bosses.map(bid => {
              const boss = getBossData(bid);
              return (
                <span key={bid} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20 flex items-center gap-1">
                  {boss?.icon || '👾'} {boss?.name || bid}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
           {data.dates.map(d => (
             <span key={d} className="text-[10px] text-slate-300 bg-slate-700 px-2 py-1 rounded">{d}</span>
           ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full text-slate-400 hover:text-white text-xs font-medium py-2 transition-all"
      >
        返回填寫另一筆報名
      </button>
    </div>
  );
};
