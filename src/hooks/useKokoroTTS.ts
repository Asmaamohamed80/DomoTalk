import { useCallback, useMemo, useRef, useState } from "react";

// Lightweight "professional" integration: load Kokoro lazily on first use.
// This avoids blocking initial UI and keeps speech smooth.
type Gender = "female" | "male";

type KokoroModule = {
  KokoroTTS: {
    from_pretrained: (
      repo: string,
      opts: { dtype?: string; device?: string },
    ) => Promise<{
      generate: (opts: { text: string; voice?: string }) => Promise<{
        audio: Float32Array | number[] | ArrayLike<number>;
        sampling_rate: number;
      }>;
    }>;
  };
};

function float32ToWavBlob(audio: Float32Array, sampleRate: number) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = audio.length * 2;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // PCM16
  let offset = 44;
  for (let i = 0; i < audio.length; i++) {
    const s = Math.max(-1, Math.min(1, audio[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export function useKokoroTTS() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kokoroRef = useRef<Awaited<ReturnType<KokoroModule["KokoroTTS"]["from_pretrained"]>> | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const voices = useMemo(() => {
    // Kokoro voice IDs vary by build; we pick common “anime-ish” bright female vs deep male defaults.
    // If a voice is missing, kokoro-js typically falls back to its default voice.
    return {
      female: "af_heart",
      male: "am_michael",
    } satisfies Record<Gender, string>;
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (kokoroRef.current) return kokoroRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const mod = (await import("kokoro-js")) as unknown as KokoroModule;
      const tts = await mod.KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
        dtype: "q8",
        device: "wasm",
      });
      kokoroRef.current = tts;
      return tts;
    } catch (e: any) {
      setError(e?.message || "Failed to load Kokoro TTS");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    setIsSpeaking(false);
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const speak = useCallback(
    async (text: string, gender: Gender) => {
      const cleaned = text.trim();
      if (!cleaned) return;

      stop();
      const tts = await ensureLoaded();
      setIsSpeaking(true);

      const result = await tts.generate({
        text: cleaned,
        voice: voices[gender],
      });

      const audio = result.audio instanceof Float32Array ? result.audio : Float32Array.from(Array.from(result.audio as any));
      const blob = float32ToWavBlob(audio, result.sampling_rate);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audioEl = audioElRef.current ?? new Audio();
      audioElRef.current = audioEl;
      audioEl.src = url;
      audioEl.onended = () => setIsSpeaking(false);
      audioEl.onerror = () => setIsSpeaking(false);

      // Let browser schedule playback smoothly.
      await audioEl.play();
    },
    [ensureLoaded, stop, voices],
  );

  return {
    isLoading,
    isSpeaking,
    error,
    speak,
    stop,
  };
}

