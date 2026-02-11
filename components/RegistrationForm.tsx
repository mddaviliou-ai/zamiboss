
import React, { useState, useMemo, useEffect } from 'react';
import { RegistrationData, FormConfig } from '../types';

interface Props {
  config: FormConfig;
  onSubmit: (data: Omit<RegistrationData, 'id' | 'timestamp'>) => void;
}

export const RegistrationForm: React.FC<Props> = ({ config, onSubmit }) => {
  const [formData, setFormData] = useState({
    gameId: '',
    level: '',
    job: '',
    bosses: [] as string[],
    dates: [] as string[],
    remarks: ''
  });

  useEffect(() => {
    const savedId = localStorage.getItem('last_game_id');
    const savedJob = localStorage.getItem('last_job');
    const savedLevel = localStorage.getItem('last_level');
    if (savedId || savedJob || savedLevel) {
      setFormData(prev => ({
        ...prev,
        gameId: savedId || '',
        job: savedJob || '',
        level: savedLevel || ''
      }));
    }
  }, []);

  const [viewDate, setViewDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        full: d.toISOString().split('T')[0],
        day: i,
        isPast: d < new Date(new Date().setHours(0,0,0,0)),
        isToday: d.toDateString() === new Date().toDateString()
      });
    }
    return days;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(viewDate.getMonth() + offset);
    setViewDate(next);
  };

  const toggleItem = (list: string[], item: string) => 
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gameId || !formData.job || !formData.level || formData.bosses.length === 0 || formData.dates.length === 0) {
      alert('請填寫完整資訊（包含 ID、職業、等級、目標及至少一個日期）');
      return;
    }
    localStorage.setItem('last_game_id', formData.gameId);
    localStorage.setItem('last_job', formData.job);
    localStorage.setItem('last_level', formData.level);
    
    onSubmit(formData);
  };

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{config.labels.gameId}</label>
          <input
            type="text"
            placeholder="輸入 ID"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            value={formData.gameId}
            onChange={e => setFormData({...formData, gameId: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{config.labels.level}</label>
          <input
            type="number"
            placeholder="LV"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            value={formData.level}
            onChange={e => setFormData({...formData, level: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{config.labels.job}</label>
          <select
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={formData.job}
            onChange={e => setFormData({...formData, job: e.target.value})}
          >
            <option value="">選擇職業</option>
            {config.jobs.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{config.labels.bosses}</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {config.bosses.map(boss => (
            <button
              key={boss.id}
              type="button"
              onClick={() => setFormData({...formData, bosses: toggleItem(formData.bosses, boss.id)})}
              className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                formData.bosses.includes(boss.id) 
                ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20' 
                : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-xl">{boss.icon}</span>
              <span className="text-[10px] font-bold truncate w-full text-center text-slate-200">{boss.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{config.labels.dates}</label>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => changeMonth(-1)} className="text-slate-400 hover:text-white p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-xs font-bold text-indigo-400 min-w-[80px] text-center">
              {viewDate.getFullYear()} {monthNames[viewDate.getMonth()]}
            </span>
            <button type="button" onClick={() => changeMonth(1)} className="text-slate-400 hover:text-white p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-600">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="aspect-square"></div>;
              const isSelected = formData.dates.includes(day.full);
              return (
                <button
                  key={day.full}
                  type="button"
                  disabled={day.isPast}
                  onClick={() => setFormData({...formData, dates: toggleItem(formData.dates, day.full)})}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all relative ${
                    day.isPast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    isSelected ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-700 text-slate-400'
                  } ${day.isToday && !isSelected ? 'text-indigo-400 ring-1 ring-indigo-500/50' : ''}`}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{config.labels.remarks}</label>
        <textarea
          rows={2}
          placeholder="有什麼想說的嗎？"
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
          value={formData.remarks}
          onChange={e => setFormData({...formData, remarks: e.target.value})}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span>確認報名並送出</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
      </button>
    </form>
  );
};
