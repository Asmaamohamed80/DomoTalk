import { motion } from 'framer-motion';
import { UserProgress, getLevelLabel, getPointsToNextLevel } from '@/types/app';
import { Star, Zap } from 'lucide-react';

interface LevelBarProps {
  progress: UserProgress;
}

const LevelBar = ({ progress }: LevelBarProps) => {
  const { current, needed, progress: pct } = getPointsToNextLevel(progress.points);

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 w-full max-w-md">
      <div className="flex items-center gap-1.5">
        <Star size={16} className="text-warning" />
        <span className="font-display text-sm font-semibold text-foreground">Lv.{progress.level}</span>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            {getLevelLabel(progress.level)}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Zap size={10} className="text-primary" />
            {progress.points} pts
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelBar;
