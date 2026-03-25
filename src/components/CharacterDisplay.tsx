import { motion, AnimatePresence } from 'framer-motion';
import { CharacterState, CharacterLevel, CharacterDisplayProps } from '@/types/app';
import { TargetAndTransition } from 'framer-motion';

const stateAnimations: Record<CharacterState, TargetAndTransition> = {

// 1. تعريف الحركات (Animations) لجميع الحالات بما فيها concerne
  idle: {
    y: [0, -5, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    y: [0, -8, 0],
    rotate: [0, -2, 2, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    y: [0, -3, 0],
    scale: [1, 1.01, 1],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    y: [0, -15, 0],
    scale: [1, 1.05, 1],
    rotate: [0, -3, 3, 0],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  concerned: { // إضافة حالة concerned لحل الخط الأحمر
    y: [0, -2, 0],
    rotate: [0, 1, -1, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  }
};

export const CharacterDisplay = ({
  level,
  state,
  avatarIndex,
  videoUrl,      // استقبال الخاصية الجديدة
  isGenerating,  // استقبال الخاصية الجديدة
}: CharacterDisplayProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-black/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          animate={stateAnimations[state] ||stateAnimations.idle}
          className="relative w-full h-full"
        >
          {/* 2. عرض الفيديو إذا توفر، وإلا عرض الصورة الثابتة */}
          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              autoPlay
              loop
              muted={false}
              playsInline
              className="w-full h-full object-cover select-none"
            />
          ) : (
            <img
              src={'/avatar${avatarIndex}.jpg'}
              alt="AI Character"
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 3. مؤشر التحميل (Spinner) يظهر فقط أثناء التوليد */}
      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </div>
  );
};
