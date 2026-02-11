
import React, { useState } from 'react';
import { FormConfig, Boss } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  config: FormConfig;
  onSave: (config: FormConfig) => void;
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

export const SettingsView: React.FC<Props> = ({ config, onSave, isAuthenticated, onAuthenticate }) => {
  const [localConfig, setLocalConfig] = useState<FormConfig>(config);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // 新增狀態
  const [newJob, setNewJob] = useState('');
  const [newBoss, setNewBoss] = useState({ name: '', icon: '👾', difficulty: 'Normal' });
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const isBlobUrl = window.location.href.startsWith('blob:');

  const labelFriendlyNames: Record<string, string> = {
    title: '網頁主標題 (例如: MyGuild HUB)',
    subtitle: '網頁副標題 (小字描述)',
    gameId: '遊戲 ID 欄位名稱',
    job: '職業欄位名稱',
    bosses: 'BOSS 選擇欄位名稱',
    dates: '日期選擇欄位名稱',
    remarks: '備註欄位名稱'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPwd = storageService.getAdminPassword();
    if (passwordInput === correctPwd) {
      onAuthenticate();
      setLoginError(false);
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleLabelChange = (key: keyof FormConfig['labels'], value: string) => {
    setLocalConfig({
      ...localConfig,
      labels: { ...localConfig.labels, [key]: value }
    });
  };

  const addJob = () => {
    if (newJob.trim()) {
      setLocalConfig({ ...localConfig, jobs: [...localConfig.jobs, newJob.trim()] });
      setNewJob('');
    }
  };

  const removeJob = (index: number) => {
    const next = [...localConfig.jobs];
    next.splice(index, 1);
    setLocalConfig({ ...localConfig, jobs: next });
  };

  const addBoss = () => {
    if (newBoss.name.trim()) {
      const boss: Boss = {
        id: 'b' + Date.now(),
        name: newBoss.name.trim(),
        icon: newBoss.icon,
        difficulty: newBoss.difficulty
      };
      setLocalConfig({ ...localConfig, bosses: [...localConfig.bosses, boss] });
      setNewBoss({ name: '', icon: '👾', difficulty: 'Normal' });
    }
  };

  const removeBoss = (id: string) => {
    setLocalConfig({ ...localConfig, bosses: localConfig.bosses.filter(b => b.id !== id) });
  };

  const handleFinalSave = () => {
    // 如果有輸入新密碼，則更新密碼
    if (newAdminPassword.trim()) {
      storageService.setAdminPassword(newAdminPassword.trim());
      setNewAdminPassword('');
    }
    onSave(localConfig);
    alert('所有設定已成功儲存！');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="glass-panel p-8 rounded-3xl border border-slate-700 shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">管理員存取限制</h2>
          <p className="text-slate-400 text-sm mb-8">請輸入管理密碼以修改表單設定</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="輸入密碼..."
              autoFocus
              className={`w-full bg-slate-900/50 border ${loginError ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest`}
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
            />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
              進入設定頁面
            </button>
          </form>
          <p className="mt-6 text-[10px] text-slate-500">提示：預設密碼為 admin888</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="p-2 bg-indigo-500/20 rounded-lg">⚙️</span>
          自定義表單內容
        </h2>
        <button 
          onClick={handleFinalSave}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20"
        >
          儲存所有設定
        </button>
      </div>

      {/* URL & Sharing Config */}
      <section className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-cyan-500">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          網址與分享設定
        </h3>
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-bold">正式公開報名網址</label>
          <input
            type="text"
            placeholder="https://yourname.github.io/raid-form/"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none"
            value={localConfig.publicUrl || ''}
            onChange={e => setLocalConfig({...localConfig, publicUrl: e.target.value})}
          />
        </div>
      </section>

      {/* Boss Management */}
      <section className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          挑戰 BOSS 管理
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {localConfig.bosses.map((boss) => (
            <div key={boss.id} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-xl group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{boss.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{boss.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{boss.difficulty}</div>
                </div>
              </div>
              <button onClick={() => removeBoss(boss.id)} className="text-slate-500 hover:text-rose-400 p-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] text-slate-500 uppercase">BOSS 名稱</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                value={newBoss.name}
                onChange={e => setNewBoss({...newBoss, name: e.target.value})}
                placeholder="例如: 暗黑龍王"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase">圖示 (Emoji)</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-center"
                value={newBoss.icon}
                onChange={e => setNewBoss({...newBoss, icon: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              value={newBoss.difficulty}
              onChange={e => setNewBoss({...newBoss, difficulty: e.target.value})}
            >
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Extreme">Extreme</option>
              <option value="Chaos">Chaos</option>
            </select>
            <button onClick={addBoss} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-bold transition-all">
              新增 BOSS
            </button>
          </div>
        </div>
      </section>

      {/* Security - Password Change */}
      <section className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-rose-500">
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          安全設定 (管理密碼)
        </h3>
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-bold">變更管理密碼 (留空則不更改)</label>
          <input
            type="password"
            placeholder="輸入新密碼..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-rose-500 outline-none"
            value={newAdminPassword}
            onChange={e => setNewAdminPassword(e.target.value)}
          />
          <p className="text-[10px] text-slate-500 italic">
            提醒：密碼更改後將立即生效，下次進入自定義頁面請使用新密碼。
          </p>
        </div>
      </section>

      {/* Label Config */}
      <section className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          文字標題自定義
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(localConfig.labels).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">{labelFriendlyNames[key] || key}</label>
              <input
                type="text"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                value={label}
                onChange={e => handleLabelChange(key as any, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Jobs Config */}
      <section className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          職業清單管理
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {localConfig.jobs.map((job, idx) => (
            <span key={idx} className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs flex items-center gap-2 group">
              {job}
              <button onClick={() => removeJob(idx)} className="text-slate-500 hover:text-rose-400 font-bold">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="新增職業名稱..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            value={newJob}
            onChange={e => setNewJob(e.target.value)}
          />
          <button onClick={addJob} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold">新增</button>
        </div>
      </section>

      <div className="pt-8 text-center">
        <button 
          onClick={handleFinalSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          儲存所有變更
        </button>
      </div>
    </div>
  );
};
