import { useState, useCallback, useRef } from 'react';
import { CharacterState } from '@/types/app'; // تأكد من وجود هذا النوع في مشروعك

const STATE_TO_EMOTION: Record<CharacterState, string> = {
  idle: 'neutral',
  thinking: 'thinking',
  speaking: 'speaking',
  happy: 'happy',
  concerned:'concerned',
};

interface GenerateOptions {
  avatarIndex: number;
  state: CharacterState;
  audioBlob?: Blob | null;
}

export const useDomoAvatar = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Map<string, string>>(new Map());

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateVideo = useCallback(async ({ avatarIndex, state, audioBlob }: GenerateOptions) => {
    const emotion = STATE_TO_EMOTION[state];
    const cacheKey = `avatar${avatarIndex}_${emotion}_${audioBlob ? 'audio' : 'noaudio'}`;

    if (!audioBlob && cache.current.has(cacheKey)) {
      setVideoUrl(cache.current.get(cacheKey)!);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. جلب صورة الأنمي وتحويلها
      const imgRes = await fetch(`/avatar${avatarIndex}.jpg`);
      const imgBlob = await imgRes.blob();
      const imageBase64 = await blobToBase64(imgBlob);

      // 2. تحويل الصوت إذا وجد
      let audioBase64: string | undefined;
      if (audioBlob) {
        audioBase64 = await blobToBase64(audioBlob);
      }

      // 3. نداء الـ API الخاص بك (الذي أنشأناه في src/pages/api/domo-video.ts)
      const res = await fetch('/api/domo-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, audioBase64, emotion }),
      });

      if (!res.ok) throw new Error('DomoAI request failed');
      
      const { videoUrl: url } = await res.json();
      setVideoUrl(url);
      if (!audioBlob) cache.current.set(cacheKey, url);
      
    } catch (err) {
      setError('Failed to generate animation');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearVideo = useCallback(() => setVideoUrl(null), []);

  return { videoUrl, isGenerating, error, generateVideo, clearVideo };
};