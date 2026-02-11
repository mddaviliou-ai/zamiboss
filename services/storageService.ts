
import { FormConfig, RegistrationData } from '../types';

const STORAGE_KEYS = {
  CONFIG: 'raid_master_config',
  RECORDS: 'raid_master_records',
  ADMIN_PWD: 'raid_master_admin_pwd'
};

const DEFAULT_CONFIG: FormConfig = {
  labels: {
    title: 'RaidMaster HUB',
    subtitle: '專業突襲王團報名系統',
    gameId: '遊戲名稱 ID',
    level: '等級', // 預設值
    job: '職業',
    bosses: '挑戰 BOSS',
    dates: '報名日期',
    remarks: '備註'
  },
  jobs: ['戰士', '法師', '弓箭手', '牧師', '刺客', '聖騎士', '術士', '德魯伊'],
  bosses: [
    { id: 'b1', name: '炎魔巴洛克', difficulty: 'Hard', icon: '🔥' },
    { id: 'b2', name: '寒冰龍王', difficulty: 'Extreme', icon: '❄️' }
  ],
  discordWebhookUrl: '',
  publicUrl: ''
};

export const storageService = {
  getConfig: (): FormConfig => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    const config = saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    // 確保舊版資料也能正確抓到新欄位
    if (!config.labels.level) config.labels.level = DEFAULT_CONFIG.labels.level;
    return config;
  },
  saveConfig: (config: FormConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },
  getRecords: (): RegistrationData[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : [];
  },
  addRecord: (record: RegistrationData) => {
    const records = storageService.getRecords();
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([record, ...records]));
  },
  removeRecord: (id: string) => {
    const records = storageService.getRecords();
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filtered));
  },
  clearRecords: () => {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
  },
  getAdminPassword: (): string => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || 'admin888';
  },
  setAdminPassword: (newPwd: string) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, newPwd);
  }
};
