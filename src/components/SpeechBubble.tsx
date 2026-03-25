import { motion, AnimatePresence } from 'framer-motion';
import { CharacterState } from '@/types/app';

interface SpeechBubbleProps {
  text: string;
  state: CharacterState;
  isStreaming?: boolean;
}

const SpeechBubble = ({ text, state, isStreaming }: SpeechBubbleProps) => {
  const showThinking = state === 'thinking' && !text;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showThinking ? 'thinking' : 'text'}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl p-4 md:p-5 max-w-[90vw] md:max-w-[500px] relative"
      >
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass rotate-45 border-t-0 border-l-0" />

        {showThinking ? (
          <div className="flex items-center gap-2">
            <motion.span
              className="text-muted-foreground text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Thinking
            </motion.span>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm md:text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {text || 'مرحباً! أنا مساعدك الذكي. اضغط على زر تحليل البيانات لنبدأ! 🚀\n\nHi! I\'m your AI assistant. Upload a file to get started!'}
            {isStreaming && (
              <motion.span
                className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SpeechBubble;
