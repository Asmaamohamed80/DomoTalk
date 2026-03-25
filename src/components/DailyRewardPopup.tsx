import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

interface DailyRewardPopupProps {
  show: boolean;
  onDismiss: () => void;
}

const DailyRewardPopup = ({ show, onDismiss }: DailyRewardPopupProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="glass-strong rounded-2xl p-8 text-center max-w-xs mx-4 glow-primary"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <Gift size={48} className="mx-auto text-warning mb-4" />
            </motion.div>

            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Daily Reward! 🎉
            </h2>
            <p className="text-muted-foreground text-sm mb-1">
              Welcome back! You earned
            </p>
            <p className="font-display text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <Sparkles size={20} /> +10 Points
            </p>

            <button
              onClick={onDismiss}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Awesome! Let's Go
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyRewardPopup;
