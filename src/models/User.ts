import { Timestamp } from 'firebase/firestore';

export interface UserSettings {
  enableTelegramNotifications?: boolean;
  favoriteCurrencies?: string[];
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  created: Timestamp;
  email: string;
  settings?: UserSettings;
  telegramId?: string;
  telegramUser?: string;
}

export default User;
