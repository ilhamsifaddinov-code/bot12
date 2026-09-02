export type TariffType = 'LIGHT' | 'PRO';
export type BodyStatusType = 'Saǵlam' | 'Salmaǵı kem (Arıq)' | 'Salmaǵı artıq (Arıqlaw kerek)';

export interface User {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  status: BodyStatusType;
  tariff: TariffType;
  groupTime: string;
  registeredAt: string;
  streak: number;
  checkInCount: number;
}

export interface Video {
  id: string;
  title: string;
  category: 'cardio' | 'strength' | 'stretch' | 'warmup';
  duration: string;
  difficulty: 'Ańsat' | 'Ortasha' | 'Qıyın';
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
}

export interface CheckInLog {
  id: string;
  date: string;
  time: string;
  status: string;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

export interface FoodLogItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
}
