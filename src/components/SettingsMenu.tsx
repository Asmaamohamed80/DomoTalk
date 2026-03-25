import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Flag, Settings } from 'lucide-react';

interface SettingsMenuProps {
  show: boolean;
  onClose: () => void;
}

const SettingsMenu = ({ show, onClose }: SettingsMenuProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-md flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-strong rounded-t-2xl md:rounded-2xl w-full max-w-md p-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                <h2 className="font-display text-lg font-bold">Settings</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="/privacy-policy"
                className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
              >
                <Shield size={18} className="text-info" />
                <span className="text-sm font-medium">Privacy Policy</span>
              </a>

              <button
                onClick={() => alert('Report submitted. Thank you!')}
                className="w-full glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
              >
                <Flag size={18} className="text-accent" />
                <span className="text-sm font-medium">Report Content</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsMenu;
