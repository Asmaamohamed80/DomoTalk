// src/types/app.ts

// 1. تحديث حالات الشخصية لتشمل الحالات التي يحتاجها DomoAI
export type CharacterState = 'idle' | 'thinking' | 'speaking' | 'happy' | 'concerned';

export type CharacterLevel = 1 | 2 | 3;

// 2. تحديث واجهة المكون لتشمل الفيديو وحالة التحميل
export interface CharacterDisplayProps {
  level: CharacterLevel;
  state: CharacterState;
  avatarIndex: number;
  isListening?: boolean;
  isSpeaking?: boolean;
  // أضف هذه الأسطر الجديدة هنا
  videoUrl?: string | null;      // لرابط الفيديو من DomoAI
  isGenerating?: boolean;       // لحالة الانتظار أثناء توليد الفيديو
}

export interface UserProgress {
  points: number;
  level: CharacterLevel;
  lastLoginDate: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface FileData {
  name: string;
  headers: string[];
  rows: string[][];
}

// الوظائف المساعدة الموجودة مسبقاً في ملفك
export function getLevel(points: number): CharacterLevel {
  if (points >= 301) return 3;
  if (points >= 101) return 2;
  return 1;
}

export function getLevelLabel(level: CharacterLevel): string {
  switch (level) {
    case 1: return 'Novice Analyst';
    case 2: return 'Data Specialist';
    case 3: return 'AI Commander';
  }
}

export function getPointsToNextLevel(points: number): { current: number; needed: number; progress: number } {
  if (points >= 301) return { current: points, needed: 0, progress: 100 };
  if (points >= 101) return { current: points - 101, needed: 200, progress: ((points - 101) / 200) * 100 };
  return { current: points, needed: 100, progress: (points / 100) * 100 };
}
export interface KPIItem {
  label: string;
  value: string | number;
}

export interface DashboardAnalysis {
  chartData: Record<string, string | number>[];
  numericHeaders: string[];
  kpis: KPIItem[];
}
