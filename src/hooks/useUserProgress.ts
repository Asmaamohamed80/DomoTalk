import { useState, useEffect, useCallback } from 'react';
import { UserProgress, getLevel } from '@/types/app';

const STORAGE_KEY = 'ai-agent-progress';

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { points: 0, level: 1, lastLoginDate: null };
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showDailyReward, setShowDailyReward] = useState(false);

  // Check daily login reward
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastLoginDate !== today) {
      const updated = {
        ...progress,
        points: progress.points + 10,
        level: getLevel(progress.points + 10),
        lastLoginDate: today,
      };
      setProgress(updated);
      saveProgress(updated);
      setShowDailyReward(true);
    }
  }, []);

  const addPoints = useCallback((amount: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        points: prev.points + amount,
        level: getLevel(prev.points + amount),
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const dismissDailyReward = useCallback(() => setShowDailyReward(false), []);

  return { progress, addPoints, showDailyReward, dismissDailyReward };
}
