import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
}

interface LeaderboardOverlayProps {
  show: boolean;
  onClose: () => void;
  userPoints: number;
}

// Mock data until Supabase is integrated
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Ahmed K.', points: 580, level: 3 },
  { rank: 2, name: 'Sara M.', points: 420, level: 3 },
  { rank: 3, name: 'Omar H.', points: 310, level: 3 },
  { rank: 4, name: 'Nour A.', points: 195, level: 2 },
  { rank: 5, name: 'Yasmin R.', points: 140, level: 2 },
];

const rankColors = ['text-warning', 'text-muted-foreground', 'text-accent'];

const LeaderboardOverlay = ({ show, onClose, userPoints }: LeaderboardOverlayProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-strong rounded-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-warning" />
                <h2 className="font-display text-lg font-bold">Leaderboard</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* Entries */}
            <div className="p-4 space-y-2">
              {mockLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <span className={`font-display text-lg font-bold w-8 ${rankColors[i] || 'text-foreground'}`}>
                    #{entry.rank}
                  </span>
                  {i < 3 && <Medal size={16} className={rankColors[i]} />}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground">Level {entry.level}</p>
                  </div>
                  <span className="font-display text-sm font-semibold text-primary">{entry.points} pts</span>
                </motion.div>
              ))}
            </div>

            {/* Your score */}
            <div className="px-4 pb-4">
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-primary/30 glow-primary">
                <span className="font-display text-lg font-bold w-8 text-primary">You</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">Your Score</p>
                </div>
                <span className="font-display text-sm font-semibold text-primary">{userPoints} pts</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardOverlay;
