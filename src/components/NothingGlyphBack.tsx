import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap, Volume2, Timer, AlertTriangle, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface NothingGlyphBackProps {
  isWorkoutActive?: boolean;
  currentRep?: number;
  formStatus?: 'optimal' | 'warning';
  restSecondsRemaining?: number;
  onClose?: () => void;
}

export type GlyphMode = 'workout_reactive' | 'torch_ringlight' | 'rest_timer' | 'strobe_warning' | 'idle_breathing';

export const NothingGlyphBack: React.FC<NothingGlyphBackProps> = ({
  isWorkoutActive,
  currentRep = 0,
  formStatus = 'optimal',
  restSecondsRemaining = 0,
  onClose,
}) => {
  const [glyphPower, setGlyphPower] = useState<boolean>(true);
  const [glyphMode, setGlyphMode] = useState<GlyphMode>('workout_reactive');
  const [brightness, setBrightness] = useState<number>(100);
  const [pulseState, setPulseState] = useState<boolean>(false);
  const [strobeWarningActive, setStrobeWarningActive] = useState<boolean>(false);
  const [glyphProgress, setGlyphProgress] = useState<number>(75);

  // Sound-synchronized clicks for Nothing Glyph
  const playGlyphClick = () => {
    sounds.playTap();
  };

  // Pulse animation when reps change or form alerts trigger
  useEffect(() => {
    if (currentRep > 0 && glyphPower) {
      // Flash glyph on rep complete
      setPulseState(true);
      const timer = setTimeout(() => setPulseState(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentRep, glyphPower]);

  // Form warning strobe
  useEffect(() => {
    if (formStatus === 'warning' && glyphPower) {
      setStrobeWarningActive(true);
      const timer = setTimeout(() => setStrobeWarningActive(false), 900);
      return () => clearTimeout(timer);
    }
  }, [formStatus, glyphPower]);

  // Rest timer animation for the lower progress glyph bar
  useEffect(() => {
    if (restSecondsRemaining > 0) {
      const pct = Math.max(0, Math.min(100, (restSecondsRemaining / 90) * 100));
      setGlyphProgress(pct);
    } else {
      setGlyphProgress(100);
    }
  }, [restSecondsRemaining]);

  // Active brightness calculation
  const getLightOpacity = (isTorch: boolean = false) => {
    if (!glyphPower) return 'opacity-0 shadow-none';
    if (strobeWarningActive) return 'opacity-100 shadow-[0_0_25px_#ffffff] animate-ping';
    if (isTorch || glyphMode === 'torch_ringlight') return 'opacity-100 shadow-[0_0_24px_#ffffff]';
    if (pulseState) return 'opacity-100 shadow-[0_0_35px_#ffffff] scale-[1.02]';
    if (glyphMode === 'workout_reactive' && isWorkoutActive) {
      return 'opacity-90 shadow-[0_0_15px_#ffffff]';
    }
    return 'opacity-60 shadow-[0_0_8px_rgba(255,255,255,0.4)]';
  };

  return (
    <div className="flex flex-col h-full bg-[#090a0d] text-white p-4 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
                Glyph Interface 2.0
              </h3>
            </div>
            <p className="text-[10px] text-neutral-400">Nothing Phone Hardware LED Backlight</p>
          </div>
        </div>

        {/* Master Power Toggle */}
        <button
          onClick={() => {
            playGlyphClick();
            setGlyphPower(!glyphPower);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
            glyphPower
              ? 'bg-white text-black shadow-[0_0_15px_#ffffff]'
              : 'bg-neutral-800 text-neutral-400 border border-white/10'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{glyphPower ? 'GLYPH ON' : 'GLYPH OFF'}</span>
        </button>
      </div>

      {/* Main Transparent Nothing Phone Back Chassis */}
      <div className="relative my-4 flex-1 min-h-[360px] max-h-[440px] rounded-[44px] bg-[#0c0d12] border-2 border-neutral-700/80 shadow-2xl overflow-hidden p-6 flex flex-col items-center justify-between">
        {/* Subtle internal mechanical screws & ribbon cables (Nothing aesthetic) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Red Recording Tally LED at top right */}
        <div
          className={`absolute top-6 right-8 w-2 h-2 rounded-full transition-all duration-300 ${
            glyphPower && (isWorkoutActive || strobeWarningActive)
              ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'
              : 'bg-neutral-800'
          }`}
        />

        {/* TOP GLYPH: Camera Ring & Slash Light */}
        <div className="relative w-44 h-28 flex items-center justify-center">
          {/* Dual Camera Module Cutout */}
          <div className="absolute top-2 left-6 w-14 h-24 rounded-full border border-neutral-700/90 bg-black/90 p-1 flex flex-col items-center justify-around z-20">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner" />
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner" />
            </div>
          </div>

          {/* Camera Ring Glyph LED Arc */}
          <div
            className={`absolute top-0 left-4 w-18 h-28 rounded-full border-[3px] border-white transition-all duration-300 ${getLightOpacity()}`}
          />

          {/* Top-Right Diagonal Slash Glyph */}
          <div
            className={`absolute top-3 right-6 w-14 h-2 rounded-full bg-white rotate-[-35deg] transition-all duration-300 ${getLightOpacity()}`}
          />
        </div>

        {/* CENTER GLYPH: Wireless Charging Coil C-Shape LED Arc */}
        <div className="relative w-44 h-36 flex items-center justify-center my-1">
          {/* Center Wireless Charging Coil Coil Texture */}
          <div className="w-28 h-28 rounded-full border border-neutral-800 bg-neutral-950/60 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-neutral-800/80 flex items-center justify-center">
              <div className="text-[10px] font-mono text-neutral-600 font-bold uppercase tracking-wider">
                NOTHING
              </div>
            </div>
          </div>

          {/* C-Shape Horseshoe LED Light Segment Left */}
          <div
            className={`absolute inset-4 rounded-full border-[3.5px] border-transparent border-l-white border-t-white transition-all duration-300 ${getLightOpacity()}`}
          />

          {/* Center Lower Arc Light Segment */}
          <div
            className={`absolute bottom-2 w-20 h-1.5 rounded-full bg-white transition-all duration-300 ${getLightOpacity()}`}
          />
        </div>

        {/* BOTTOM GLYPH: Exclamation Line (Timer & Rep Progress Bar) */}
        <div className="relative w-full flex flex-col items-center space-y-2 mt-2">
          {/* Vertical Glyph Progress Bar Strip */}
          <div className="relative w-2 h-20 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
            <div
              className={`absolute bottom-0 w-full rounded-full bg-white transition-all duration-300 ${
                glyphPower ? 'shadow-[0_0_12px_#ffffff]' : 'opacity-0'
              }`}
              style={{
                height: glyphMode === 'rest_timer' ? `${glyphProgress}%` : `${Math.min(100, currentRep * 10)}%`,
              }}
            />
          </div>

          {/* Exclamation Point Dot Glyph */}
          <div
            className={`w-2 h-2 rounded-full bg-white transition-all duration-300 ${
              glyphPower ? 'shadow-[0_0_10px_#ffffff]' : 'opacity-20'
            }`}
          />
        </div>

        {/* Bottom Logo Tag */}
        <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mt-2">
          (1) DESIGNED BY NOTHING
        </div>
      </div>

      {/* Interactive Glyph Modes & Controls */}
      <div className="space-y-3 mt-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span>Glyph Workout Modes</span>
          <span className="font-mono text-white text-[11px]">
            {glyphMode === 'workout_reactive'
              ? 'REP KINETICS'
              : glyphMode === 'torch_ringlight'
              ? 'TORCH RING'
              : 'REST TIMER'}
          </span>
        </div>

        {/* Mode Selector Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* 1. Kinetic Workout Pulse */}
          <button
            onClick={() => {
              playGlyphClick();
              setGlyphMode('workout_reactive');
              setGlyphPower(true);
            }}
            className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
              glyphMode === 'workout_reactive' && glyphPower
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-neutral-900 border-white/10 text-neutral-300'
            }`}
          >
            <Zap className="w-4 h-4 mb-2" />
            <div>
              <div className="text-[11px] font-bold">Rep Kinetics</div>
              <div className="text-[9px] opacity-75">Flashes on bottom depth</div>
            </div>
          </button>

          {/* 2. Gym Torch / Fill Light */}
          <button
            onClick={() => {
              playGlyphClick();
              setGlyphMode('torch_ringlight');
              setGlyphPower(true);
            }}
            className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
              glyphMode === 'torch_ringlight' && glyphPower
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-neutral-900 border-white/10 text-neutral-300'
            }`}
          >
            <Lightbulb className="w-4 h-4 mb-2" />
            <div>
              <div className="text-[11px] font-bold">Gym Torch Ring</div>
              <div className="text-[9px] opacity-75">100% video fill light</div>
            </div>
          </button>

          {/* 3. Rest Timer Strip */}
          <button
            onClick={() => {
              playGlyphClick();
              setGlyphMode('rest_timer');
              setGlyphPower(true);
            }}
            className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
              glyphMode === 'rest_timer' && glyphPower
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-neutral-900 border-white/10 text-neutral-300'
            }`}
          >
            <Timer className="w-4 h-4 mb-2" />
            <div>
              <div className="text-[11px] font-bold">Rest Countdown</div>
              <div className="text-[9px] opacity-75">Vertical drain bar</div>
            </div>
          </button>
        </div>

        {/* Test Trigger Actions */}
        <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold text-white block">Test Glyph Light Pulse</span>
            <span className="text-[10px] text-neutral-400">Trigger simulated rep flash or form strobe</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                playGlyphClick();
                setPulseState(true);
                setTimeout(() => setPulseState(false), 300);
              }}
              className="bg-white/15 hover:bg-white text-white hover:text-black font-mono text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all"
            >
              +1 Rep Flash
            </button>
            <button
              onClick={() => {
                playGlyphClick();
                setStrobeWarningActive(true);
                setTimeout(() => setStrobeWarningActive(false), 900);
              }}
              className="bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white font-mono text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all"
            >
              Form Strobe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
