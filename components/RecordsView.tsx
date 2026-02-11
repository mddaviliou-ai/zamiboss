
import React, { useState, useEffect } from 'react';
import { RegistrationData, FormConfig } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  config: FormConfig;
}

export const RecordsView: React.FC<Props> = ({ config }) => {
  const [records, setRecords] = useState<RegistrationData[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setRecords(storageService.getRecords());
  }, []);

  const handleClear = () => {
    if (window.confirm('確定要清除所有報名紀錄嗎？這無法還原。')) {
      storageService.clearRecords();
      setRecords([]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('確定要刪除這筆報名紀錄嗎？')) {
      storageService.removeRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const getBossData = (id: string) => config.bosses.find(b => b.id === id);

  const exportAllToDiscord = () => {
    if (records.length === 0) return;

    let text = `📅 **最新 Raid 報名統計總表** (${new Date().toLocaleDateString('zh-TW')})\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    records.forEach((r, idx) => {
      const bossIcons = r.bosses.map(bid => getBossData(bid)?.icon || '👾').join('');
      text += `${idx + 1}. **${r.gameId}** (Lv.${r.level} ${r.job}) | ${bossIcons} | 日期: ${r.dates.map(d => d.split('-').slice(1).join('/')).join(', ')}\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `共計 ${records.length} 人次報名`;

    navigator.clipboard.writeText(text).then(() => {
      setExporting(true);
      setTimeout(() => setExporting(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="p-2 bg-indigo-500/20 rounded-lg">📊</span>
          目前報名清單 ({records.length})
        </h2>
        <div className="flex items-center gap-4">
          {records.length > 0 && (
            <button
              onClick={exportAllToDiscord}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 border ${
                exporting 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20'
              }`}
            >
              {exporting ? '✅ 已複製總表' : '📥 匯出 Discord 總表'}
            </button>
          )}
          {records.length > 0 && (
            <button 
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-4"
            >
              全部清除
            </button>
          )}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <p className="text-slate-500">尚無任何報名紀錄。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div key={record.id} className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group relative">
              <button 
                onClick={() => handleDeleteRecord(record.id)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                title="刪除"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pr-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-white">{record.gameId}</span>
                    <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded font-medium">Lv.{record.level}</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded font-medium">{record.job}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {record.bosses.map(bid => {
                      const boss = getBossData(bid);
                      return (
                        <span key={bid} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300">
                          <span className="text-base leading-none">{boss?.icon || '👾'}</span>
                          <span className="font-medium">{boss?.name || bid}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                    日期清單
                  </div>
                  <div className="flex flex-wrap gap-1 justify-start md:justify-end">
                    {record.dates.map(d => (
                      <span key={d} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                        {d.split('-').slice(1).join('/')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {record.remarks && (
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 italic flex gap-2 items-start">
                  <span className="opacity-50">💬</span>
                  <p className="flex-1">{record.remarks}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
