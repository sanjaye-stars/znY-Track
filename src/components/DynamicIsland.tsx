import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Dumbbell, Timer, Flame, CheckCircle, Heart } from 'lucide-react';
import { DynamicIslandState } from '../types/fitness';

interface DynamicIslandProps {
  state: DynamicIslandState;
  onTap?: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ state, onTap }) => {
  const isExpanded = state.mode !== 'idle';

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <motion.div
        onClick={onTap}
        layout
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className={`bg-black text-white rounded-full flex items-center justify-between shadow-2xl border border-white/10 cursor-pointer overflow-hidden transition-colors ${
          state.mode === 'workout_tracking'
            ? 'w-[200px] h-[34px] px-3'
            : state.mode === 'rest_timer'
            ? 'w-[190px] h-[34px] px-3.5'
            : state.mode === 'meal_alert'
            ? 'w-[210px] h-[34px] px-3.5'
            : 'w-[118px] h-[28px] px-2'
        }`}
      >
        <AnimatePresence mode="wait">
          {state.mode === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between px-1"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#181a20]" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </motion.div>
          )}

          {state.mode === 'workout_tracking' && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <Dumbbell className="w-3.5 h-3.5 animate-bounce" />
                <span className="text-[11px] font-mono tracking-tight">WORKOUT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-0.5 text-rose-400 text-[10px]">
                  <Heart className="w-2.5 h-2.5 fill-rose-400 animate-pulse" />
                  <span>138</span>
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 font-mono">
                  REP {state.currentRep ?? 0}
                </div>
              </div>
            </motion.div>
          )}

          {state.mode === 'rest_timer' && (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center space-x-1 text-cyan-400">
                <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[11px]">REST</span>
              </div>
              <div className="text-cyan-300 font-mono text-[12px] font-bold tracking-wider">
                {Math.floor((state.timerSecondsRemaining || 0) / 60)}:
                {((state.timerSecondsRemaining || 0) % 60).toString().padStart(2, '0')}
              </div>
            </motion.div>
          )}

          {state.mode === 'meal_alert' && (
            <motion.div
              key="meal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center space-x-1.5 text-amber-400">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] truncate max-w-[100px]">{state.title || 'Logged Meal'}</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-300 text-[10px] font-mono">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{state.subtitle || '+450 kcal'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
