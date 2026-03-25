import { useState, useCallback, useRef } from 'react';
import { CharacterState } from '@/types/app'; 

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
  currentDataSegment?: any; // ميزة جديدة: لتحديد أي جزء من البيانات يتم شرحه الآن
}

export const useDomoAvatar = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // التحكم في البيانات المستوردة وظهورها
  const [isDataVisible, setIsDataVisible] = useState(false); 
  const [importedData, setImportedData] = useState<any>(null);
  const [activeDataSegment, setActiveDataSegment] = useState<any>(null); // الجزء النشط حالياً

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

  const generateVideo = useCallback(async ({ 
    avatarIndex, 
    state, 
    audioBlob, 
    currentDataSegment 
  }: GenerateOptions) => {
    const emotion = STATE_TO_EMOTION[state];
    const cacheKey = `avatar${avatarIndex}_${emotion}_${audioBlob ? 'audio' : 'noaudio'}`;

    // تحديث الجزء النشط من البيانات في الواجهة
    if (currentDataSegment) setActiveDataSegment(currentDataSegment);

    if (!audioBlob && cache.current.has(cacheKey)) {
      setVideoUrl(cache.current.get(cacheKey)!);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imgRes = await fetch(`/avatar${avatarIndex}.jpg`);
      const imgBlob = await imgRes.blob();
      const imageBase64 = await blobToBase64(imgBlob);

      let audioBase64: string | undefined;
      if (audioBlob) {
        audioBase64 = await blobToBase64(audioBlob);
      }

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

  const toggleDataView = useCallback(() => setIsDataVisible(prev => !prev), []);
  const clearVideo = useCallback(() => {
    setVideoUrl(null);
    setActiveDataSegment(null);
  }, []);

  return { 
    videoUrl, 
    isGenerating, 
    error, 
    generateVideo, 
    clearVideo,
    isDataVisible,
    toggleDataView,
    importedData,
    setImportedData,
    activeDataSegment // يمكنك استخدامه لعمل Highlighting للبيانات في الـ Overlay
  };
};
