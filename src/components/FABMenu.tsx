import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, Trophy, Plus, X } from 'lucide-react';

interface FABMenuProps {
  onImportFile: () => void;
  onViewDashboard: () => void;
  onLeaderboard: () => void;
}

const FABMenu = ({ onImportFile, onViewDashboard, onLeaderboard }: FABMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { icon: Upload, label: 'Import File', action: onImportFile, color: 'bg-primary' },
    { icon: BarChart3, label: 'Dashboard', action: onViewDashboard, color: 'bg-info' },
    { icon: Trophy, label: 'Leaderboard', action: onLeaderboard, color: 'bg-warning' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg glow-primary"
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </motion.button>

      {/* FAB items */}
      <AnimatePresence>
        {isOpen && items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="glass-strong text-xs font-medium px-3 py-1.5 rounded-lg text-foreground whitespace-nowrap">
              {item.label}
            </span>
            <button
              onClick={() => { item.action(); setIsOpen(false); }}
              className={`w-12 h-12 rounded-full ${item.color} text-primary-foreground flex items-center justify-center shadow-lg`}
            >
              <item.icon size={20} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FABMenu;
