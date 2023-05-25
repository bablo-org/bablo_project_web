import { Timestamp } from 'firebase/firestore';

interface Currency {
  id: string;
  name: string;
  rate: number;
  symbol: string;
  updated: Timestamp;
}

export default Currency;
