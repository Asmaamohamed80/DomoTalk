import { useState, useCallback, useRef, useEffect } from 'react';

function detectLanguage(text: string): 'ar' | 'en' {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const arabicCount = (text.match(arabicRegex) || []).length;
  return arabicCount > text.length * 0.3 ? 'ar' : 'en';
}

export function useTTS(gender: 'female' | 'male' = 'female') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getVoice = useCallback((lang: 'ar' | 'en') => {
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === 'ar' ? 'ar' : 'en';
    const genderHints = gender === 'female'
      ? ['female', 'woman', 'samantha', 'zira', 'hazel', 'susan']
      : ['male', 'man', 'daniel', 'david', 'james', 'mark'];

    // Try to find a matching gendered voice
    let voice = voices.find(v =>
      v.lang.startsWith(langCode) &&
      genderHints.some(h => v.name.toLowerCase().includes(h))
    );

    // Fallback to any voice in the language
    if (!voice) voice = voices.find(v => v.lang.startsWith(langCode));
    return voice || voices[0];
  }, [gender]);

  const speakNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      speakingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    const sentence = queueRef.current.shift()!;
    const lang = detectLanguage(sentence);
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.voice = getVoice(lang);
    utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    // Slightly different pacing for genders to reinforce persona tone
    utterance.rate = gender === 'female' ? 1.02 : 0.96;
    utterance.pitch = gender === 'female' ? 1.1 : 0.9;

    utterance.onend = () => speakNext();
    utterance.onerror = () => speakNext();

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoice, gender]);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();

    // Split into sentences for natural pacing
    const sentences = text
      .split(/(?<=[.!?،؟])\s+/)
      .filter(s => s.trim().length > 0);

    queueRef.current = sentences;
    speakingRef.current = true;
    setIsSpeaking(true);
    speakNext();
  }, [speakNext]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    speakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  // Stream sentence-by-sentence as text arrives
  const speakStreaming = useCallback((sentence: string) => {
    queueRef.current.push(sentence);
    if (!speakingRef.current) {
      speakingRef.current = true;
      setIsSpeaking(true);
      speakNext();
    }
  }, [speakNext]);

  return { isSpeaking, speak, stop, speakStreaming };
}
