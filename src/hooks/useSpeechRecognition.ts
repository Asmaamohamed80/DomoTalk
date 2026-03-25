import { useCallback, useEffect, useRef, useState } from 'react';

type RecognitionStatus = 'idle' | 'listening' | 'error';

interface UseSpeechRecognitionOptions {
  autoSend?: (text: string) => void;
}

export function useSpeechRecognition(options?: UseSpeechRecognitionOptions) {
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionImpl =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    // Heuristic: prefer Arabic if browser language is Arabic, otherwise English.
    const lang = navigator.language.toLowerCase().startsWith('ar') ? 'ar-EG' : 'en-US';
    recognition.lang = lang;

    recognition.onstart = () => {
      setStatus('listening');
      setError(null);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatus('error');
      setError(event.error || 'Unknown speech recognition error');
    };

    recognition.onend = () => {
      setStatus('idle');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .trim();

      if (transcript && options?.autoSend) {
        options.autoSend(transcript);
      }
    };

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [options]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      // Safely ignore repeated calls while already listening
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return {
    status,
    isListening: status === 'listening',
    error,
    startListening,
    stopListening,
  };
}

