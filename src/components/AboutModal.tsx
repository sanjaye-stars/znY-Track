import React from 'react';
import { X, Instagram, Sparkles, Dumbbell, Smartphone, ShieldCheck, Heart, ExternalLink, Award } from 'lucide-react';
import { sounds } from '../utils/audioEffects';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-black flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
                <span>znjy track</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                  PRO
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">Workout Logger & Sports Nutrition</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="my-4 space-y-3.5 text-xs">
          {/* Author Showcase Card */}
          <div className="bg-gradient-to-br from-[#1c1328] via-[#141224] to-[#0f1118] border border-fuchsia-500/30 p-4 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-fuchsia-400" />
                <span>Creator & Developer</span>
              </span>
              <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-full font-bold border border-fuchsia-500/30">
                Official
              </span>
            </div>

            <div className="flex items-center space-x-3.5 mt-2">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2px] shadow-lg shadow-pink-500/20">
                  <div className="w-full h-full bg-[#12131a] rounded-[14px] flex items-center justify-center text-white">
                    <Instagram className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black rounded-full p-0.5">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">@znjyee</h3>
                  <Award className="w-4 h-4 text-pink-400 fill-pink-400/20" />
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Author & Lead Engineer behind znjy track
                </p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <a
                    href="https://instagram.com/znjyee"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playTap()}
                    className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-md shadow-pink-500/25 transition-all active:scale-95"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Follow @znjyee</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Core App Features */}
          <div className="bg-neutral-900/80 border border-white/10 p-3.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Application Capabilities</span>
            </span>

            <ul className="space-y-1.5 text-[11px] text-neutral-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Customizable Sets & Reps:</strong> Customize target sets and rep counts on any exercise on the fly.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Interactive Muscular Anatomy:</strong> 3D front & back muscle map to target specific muscle heads with targeted exercises.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Nutritional Macro Engine:</strong> Custom meals, protein deficits, and AI progression tips.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Device Aesthetics:</strong> iPhone 13 Pro Max, Samsung S24, Pixel 8, and Nothing Phone with interactive Glyph back.</span>
              </li>
            </ul>
          </div>

          {/* Version Info */}
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono px-1">
            <span>Version 2.4.0 • Pro Build</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>for lifters</span>
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 rounded-2xl text-xs transition-all active:scale-95 border border-white/10"
        >
          Close
        </button>
      </div>
    </div>
  );
};
