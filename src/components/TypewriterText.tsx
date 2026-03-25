import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onTyping?: (isTyping: boolean) => void;
  className?: string;
  delay?: number;
}

const TypewriterText = ({
  text,
  speed = 40,
  onStart,
  onComplete,
  onTyping,
  className = "",
  delay = 2000,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  const startTyping = useCallback(() => {
    setStarted(true);
    onStart?.();
    onTyping?.(true);
  }, [onStart, onTyping]);

  useEffect(() => {
    const delayTimer = setTimeout(startTyping, delay);
    return () => clearTimeout(delayTimer);
  }, [delay, startTyping]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onTyping?.(false);
      onComplete?.();
    }
  }, [displayedText, text, speed, started, onTyping, onComplete]);

  if (!started) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <span>{displayedText}</span>
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle"
        />
      )}
    </motion.div>
  );
};

export default TypewriterText;
