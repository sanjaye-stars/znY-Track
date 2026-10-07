import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2, LogOut, Sparkles, Award } from 'lucide-react';
import { AuthUser } from '../types/auth';
import { sounds } from '../utils/audioEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onOpenOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onOpenOnboarding,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (role: 'alex' | 'marcus') => {
    sounds.playTap();
    if (role === 'alex') {
      onLogin({
        id: 'usr_alex',
        name: 'Alex Vance',
        username: 'alex_lift',
        email: 'alex.vance@gym.io',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isLoggedIn: true,
        joinDate: 'Jan 2024',
        streakDays: 7,
        fitnessLevel: 'Advanced',
        currentBadge: 'Kinetic Master',
      });
    } else {
      onLogin({
        id: 'usr_marcus',
        name: 'Marcus Chen',
        username: 'marcus_fit',
        email: 'marcus.chen@znjy.app',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        isLoggedIn: true,
        joinDate: 'March 2024',
        streakDays: 14,
        fitnessLevel: 'Elite Athlete',
        currentBadge: 'Form Perfectionist',
      });
    }
    sounds.playSuccessFanfare();
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    sounds.playTap();
    onLogin({
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      username: username || email.split('@')[0].toLowerCase(),
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true,
      joinDate: 'Today',
      streakDays: 1,
      fitnessLevel: 'Intermediate',
      currentBadge: 'Verified Lifter',
    });
    sounds.playSuccessFanfare();
    onClose();
    if (onOpenOnboarding) onOpenOnboarding();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {currentUser.isLoggedIn ? 'Account Profile' : 'znjy track Account'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {currentUser.isLoggedIn ? `@${currentUser.username}` : 'Sync Workouts, Macros & Community Chat'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If already logged in: Profile Screen */}
        {currentUser.isLoggedIn ? (
          <div className="my-4 space-y-4">
            <div className="flex items-center space-x-3.5 bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-bold text-white">{currentUser.name}</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    {currentUser.streakDays}D STREAK
                  </span>
                </div>
                <p className="text-xs text-neutral-400">@{currentUser.username}</p>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium mt-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentUser.currentBadge}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Fitness Level</span>
                <div className="text-xs font-bold text-white mt-0.5">{currentUser.fitnessLevel}</div>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Member Since</span>
                <div className="text-xs font-bold text-white mt-0.5">{currentUser.joinDate}</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
                if (onOpenOnboarding) onOpenOnboarding();
              }}
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 mt-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Update Physique & Dietary Goals</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onLogout();
                onClose();
              }}
              className="w-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 mt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Login / Signup Form */
          <div className="my-3 space-y-3.5">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-1 bg-neutral-900 p-1 rounded-2xl border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-1.5 rounded-xl transition-all ${
                  mode === 'login' ? 'bg-white text-black font-bold shadow' : 'text-neutral-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded-xl transition-all ${
                  mode === 'signup' ? 'bg-white text-black font-bold shadow' : 'text-neutral-400'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick 1-Tap Demo Logins */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Instant Demo Athletes
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('alex')}
                  className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 p-2.5 rounded-2xl text-left transition-all active:scale-95 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                      AV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400">Alex Vance</div>
                      <div className="text-[9px] text-neutral-400">Advanced • 7d Streak</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('marcus')}
                  className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 p-2.5 rounded-2xl text-left transition-all active:scale-95 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center">
                      MC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400">Marcus Chen</div>
                      <div className="text-[9px] text-neutral-400">Elite • 14d Streak</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase text-neutral-500">
                <span className="bg-[#0f1118] px-2 font-mono">or email sign-in</span>
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-2.5 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all mt-2 active:scale-95"
              >
                {mode === 'login' ? 'Sign In to znjy track' : 'Complete Registration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
