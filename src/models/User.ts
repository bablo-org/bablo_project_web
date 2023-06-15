export interface UserSettings {
  enableTelegramNotifications?: boolean;
  favoriteCurrencies?: string[];
}

export interface PrivateData {
  telegramUser?: string;
  telegramId?: string;
  settings?: UserSettings;
  email: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  created: number;
  privateData?: PrivateData;
  active?: boolean;
}

export default User;
