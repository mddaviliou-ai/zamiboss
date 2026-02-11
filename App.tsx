
import React, { useState, useEffect } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessView } from './components/SuccessView';
import { RecordsView } from './components/RecordsView';
import { SettingsView } from './components/SettingsView';
import { RegistrationData, RegistrationResponse, FormConfig } from './types';
import { generateRaidSummary } from './services/geminiService';
import { storageService } from './services/storageService';
import { sendToDiscord } from './services/discordService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'records' | 'settings'>('register');
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [config, setConfig] = useState<FormConfig>(storageService.getConfig());
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);
  const [aiResponse, setAiResponse] = useState<RegistrationResponse | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [shareStatus, setShareStatus] = useState<'none' | 'copied' | 'error'>('none');

  const handleSubmit = async (data: Omit<RegistrationData, 'id' | 'timestamp'>) => {
    setStep('loading');
    
    const newRecord: RegistrationData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    const response = await generateRaidSummary(newRecord);
    setAiResponse(response);
    setSubmittedData(newRecord);
    storageService.addRecord(newRecord);

    if (config.discordWebhookUrl) {
      await sendToDiscord(newRecord, response, config);
    }
    
    setTimeout(() => {
      setStep('success');
    }, 800);
  };

  const updateConfig = (newConfig: FormConfig) => {
    setConfig(newConfig);
    storageService.saveConfig(newConfig);
  };

  const handleShareLink = () => {
    let urlToCopy = config.publicUrl || window.location.href;

    // 檢測是否為無效的 blob 網址
    if (urlToCopy.startsWith('blob:') && !config.publicUrl) {
      alert('檢測到當前為臨時開發網址 (blob:)。請先到「自定義」設定中填寫您的「公開報名網址」，否則朋友將無法開啟！');
      setActiveTab('settings');
      setShareStatus('error');
      setTimeout(() => setShareStatus('none'), 3000);
      return;
    }

    navigator.clipboard.writeText(urlToCopy).then(() => {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('none'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 antialiased px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              {config.labels.title.split(' ')[0]}
            </span> 
            {config.labels.title.split(' ').slice(1).length > 0 && (
              <span className="px-2 py-1 bg-white/10 rounded-lg text-lg border border-white/10 uppercase">
                {config.labels.title.split(' ').slice(1).join(' ')}
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm font-medium">{config.labels.subtitle}</p>
        </div>

        {/* Navigation Tabs with Share Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex p-1 bg-slate-800/50 rounded-2xl border border-slate-700 w-fit">
            {[
              { id: 'register', label: '我要報名', icon: '📝' },
              { id: 'records', label: '報名清冊', icon: '📊' },
              { id: 'settings', label: '自定義', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setStep('form'); }}
                className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleShareLink}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all text-sm font-bold ${
              shareStatus === 'copied' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : shareStatus === 'error'
              ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {shareStatus === 'copied' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : shareStatus === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              )}
            </svg>
            {shareStatus === 'copied' ? '已複製連結' : shareStatus === 'error' ? '網址無效' : '分享報名網址'}
          </button>
        </div>

        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            {step === 'form' && <RegistrationForm config={config} onSubmit={handleSubmit} />}
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl animate-pulse">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-indigo-400 font-medium text-lg">正在處理報名資訊...</p>
              </div>
            )}
            {step === 'success' && submittedData && aiResponse && (
              <SuccessView 
                data={submittedData} 
                aiResponse={aiResponse} 
                config={config}
                onReset={() => setStep('form')} 
              />
            )}
          </div>
        )}

        {activeTab === 'records' && <RecordsView config={config} />}
        {activeTab === 'settings' && (
          <SettingsView 
            config={config} 
            onSave={updateConfig} 
            isAuthenticated={isAdminAuthenticated}
            onAuthenticate={() => setIsAdminAuthenticated(true)}
          />
        )}

        <footer className="mt-16 text-center text-slate-600 text-xs">
          <p>© 2024 {config.labels.title} - 專為遊戲社群設計的報名方案</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
