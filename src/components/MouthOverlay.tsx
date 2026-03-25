import { motion } from "framer-motion";

interface MouthOverlayProps {
  isSpeaking: boolean;
  /** Position offset from bottom of portrait as percentage */
  bottomPercent?: number;
}

const MouthOverlay = ({ isSpeaking, bottomPercent = 30 }: MouthOverlayProps) => {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{ bottom: `${bottomPercent}%` }}
    >
      {/* Jaw / chin area that moves */}
      <motion.div
        className="relative w-[120px] md:w-[160px] lg:w-[180px] h-[30px] md:h-[40px]"
        animate={
          isSpeaking
            ? {
                y: [0, 3, 0, 4, 0, 2, 0],
                scaleY: [1, 1.08, 1, 1.12, 1, 1.05, 1],
              }
            : { y: 0, scaleY: 1 }
        }
        transition={
          isSpeaking
            ? {
                duration: 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: 0.2 }
        }
      >
        {/* Dark overlay bar that blends with the portrait chin area */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-transparent" />
      </motion.div>

      {/* Glow effect when speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 -inset-x-2"
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <div className="w-full h-full bg-primary/20 blur-md" />
        </motion.div>
      )}
    </div>
  );
};

export default MouthOverlay;
