
export interface Boss {
  id: string;
  name: string;
  difficulty: string;
  icon: string;
}

export interface FormConfig {
  labels: {
    title: string;
    subtitle: string;
    gameId: string;
    level: string; // 新增等級標籤
    job: string;
    bosses: string;
    dates: string;
    remarks: string;
  };
  jobs: string[];
  bosses: Boss[];
  discordWebhookUrl?: string;
  publicUrl?: string;
}

export interface RegistrationData {
  id: string;
  timestamp: number;
  gameId: string;
  level: string; // 新增等級資料
  job: string;
  bosses: string[];
  dates: string[];
  remarks: string;
}

export interface RegistrationResponse {
  summary: string;
  tips: string;
}
