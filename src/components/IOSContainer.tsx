import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles, Info, X, Check, Cpu, Zap, RotateCcw, Lightbulb, Globe, User, LogIn } from 'lucide-react';
import { DynamicIsland } from './DynamicIsland';
import { IOSStatusBar } from './IOSStatusBar';
import { IOSTabBar, TabType } from './IOSTabBar';
import { DynamicIslandState } from '../types/fitness';
import { AuthUser } from '../types/auth';
import { sounds } from '../utils/audioEffects';
import { useTranslation } from '../utils/i18n';
import { NothingGlyphBack } from './NothingGlyphBack';

export type MobileDeviceModel =
  | 'iphone_13_promax'
  | 'iphone_16_pro'
  | 'nothing_phone'
  | 'galaxy_s24'
  | 'pixel_8'
  | 'fullscreen';

interface IOSContainerProps {
  children: React.ReactNode;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  dynamicIslandState: DynamicIslandState;
  onDynamicIslandTap?: () => void;
  isWorkoutActive?: boolean;
  currentUser?: AuthUser;
  onOpenAuthModal?: () => void;
  onOpenLanguageModal?: () => void;
}

export const IOSContainer: React.FC<IOSContainerProps> = ({
  children,
  activeTab,
  onChangeTab,
  dynamicIslandState,
  onDynamicIslandTap,
  isWorkoutActive,
  currentUser,
  onOpenAuthModal,
  onOpenLanguageModal,
}) => {
  const { currentOption } = useTranslation();
  const [deviceModel, setDeviceModel] = useState<MobileDeviceModel>('iphone_13_promax');
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [isNothingBackView, setIsNothingBackView] = useState(false);
  const [ambientGlyphLit, setAmbientGlyphLit] = useState(true);

  const isAndroid =
    deviceModel === 'galaxy_s24' ||
    deviceModel === 'pixel_8' ||
    deviceModel === 'nothing_phone';

  // Dimension presets for phone models
  const getContainerStyle = () => {
    switch (deviceModel) {
      case 'iphone_13_promax':
        return 'w-full md:w-[428px] h-screen md:h-[880px] md:rounded-[52px]';
      case 'nothing_phone':
        return 'w-full md:w-[412px] h-screen md:h-[872px] md:rounded-[46px]';
      case 'galaxy_s24':
        return 'w-full md:w-[416px] h-screen md:h-[876px] md:rounded-[42px]';
      case 'pixel_8':
        return 'w-full md:w-[410px] h-screen md:h-[866px] md:rounded-[48px]';
      case 'iphone_16_pro':
        return 'w-full md:w-[408px] h-screen md:h-[864px] md:rounded-[54px]';
      case 'fullscreen':
      default:
        return 'w-full max-w-4xl h-screen md:h-[90vh] md:rounded-3xl';
    }
  };

  const hasDynamicIsland = deviceModel === 'iphone_16_pro';

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-start md:justify-center p-0 md:p-6 overflow-x-hidden">
      {/* Top Floating Control Bar for Device Mode */}
      <div className="hidden md:flex items-center space-x-2 mb-4 bg-neutral-900/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl text-xs z-50">
        <div className="flex items-center space-x-1.5 text-neutral-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="capitalize font-bold tracking-tight text-white">znjy track</span>
        </div>

        <div className="h-3 w-px bg-white/20" />

        {/* Model Switcher Buttons: iPhone 13 Pro Max 1st */}
        <div className="flex items-center space-x-1">
          {/* 1st: iPhone 13 Pro Max */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('iphone_13_promax');
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
              deviceModel === 'iphone_13_promax'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>13 Pro Max</span>
            <span className="text-[9px] opacity-80 font-mono">6.7"</span>
          </button>

          {/* 2nd: iPhone 16 Pro */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('iphone_16_pro');
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-all ${
              deviceModel === 'iphone_16_pro'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            iPhone 16 Pro
          </button>

          {/* 3rd: Nothing Phone */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('nothing_phone');
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
              deviceModel === 'nothing_phone'
                ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Nothing Phone</span>
          </button>

          {/* 4th: Galaxy S24 */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('galaxy_s24');
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
              deviceModel === 'galaxy_s24'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Galaxy S24</span>
          </button>

          {/* 5th: Pixel 8 Pro */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('pixel_8');
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
              deviceModel === 'pixel_8'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Pixel 8</span>
          </button>

          {/* Full Viewport */}
          <button
            onClick={() => {
              sounds.playTap();
              setDeviceModel('fullscreen');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs transition-all ${
              deviceModel === 'fullscreen'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Viewport</span>
          </button>
        </div>

        {/* Nothing Phone Glyph Flip Button (Only visible when Nothing Phone is active) */}
        {deviceModel === 'nothing_phone' && (
          <>
            <div className="h-3 w-px bg-white/20" />
            <button
              onClick={() => {
                sounds.playTap();
                setIsNothingBackView(!isNothingBackView);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
                isNothingBackView
                  ? 'bg-white text-black shadow-[0_0_15px_#ffffff]'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-white/20'
              }`}
              title="Flip Nothing Phone to inspect back Glyph LED lights"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isNothingBackView ? 'FRONT SCREEN' : 'GLYPH BACK'}</span>
            </button>
          </>
        )}

        <div className="h-3 w-px bg-white/20" />

        {/* Compatibility Specs Button */}
        <button
          onClick={() => {
            sounds.playTap();
            setShowCompatibilityModal(true);
          }}
          className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded-full hover:bg-white/5 transition-all"
          title="View Supported Devices (iPhone & Android 2020+)"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Device Specs</span>
        </button>

        <div className="h-3 w-px bg-white/20" />

        {/* Language Switcher */}
        {onOpenLanguageModal && (
          <button
            onClick={() => {
              sounds.playTap();
              onOpenLanguageModal();
            }}
            className="flex items-center space-x-1.5 text-neutral-300 hover:text-white px-2 py-1 rounded-full hover:bg-white/5 transition-all"
            title="Change App Language (9 Languages)"
          >
            <span>{currentOption.flag}</span>
            <span className="uppercase font-mono font-bold">{currentOption.code}</span>
          </button>
        )}

        <div className="h-3 w-px bg-white/20" />

        {/* User Account / Login Button */}
        {onOpenAuthModal && (
          <button
            onClick={() => {
              sounds.playTap();
              onOpenAuthModal();
            }}
            className="flex items-center space-x-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-full border border-white/10 transition-all active:scale-95"
            title={currentUser?.isLoggedIn ? `Profile: @${currentUser.username}` : 'Sign In / Account'}
          >
            {currentUser?.isLoggedIn ? (
              <>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
                  {currentUser.streakDays}d
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Container */}
      <div
        className={`relative transition-all duration-300 overflow-hidden ${getContainerStyle()} ${
          deviceModel === 'nothing_phone'
            ? 'md:border-[10px] md:border-[#17181c] md:shadow-[0_0_90px_rgba(255,255,255,0.12),0_0_0_2px_rgba(255,255,255,0.2)] bg-[#07080c]'
            : deviceModel !== 'fullscreen'
            ? 'md:border-[10px] md:border-[#20222a] md:shadow-[0_0_80px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.08)] bg-[#07080c]'
            : 'md:border md:border-white/10 bg-[#07080c] shadow-2xl'
        }`}
      >
        {/* Nothing Phone Glyph Interface Lighting Bars (Corners & Center) */}
        {deviceModel === 'nothing_phone' && (
          <>
            {/* Top-Right Glyph Arc Light */}
            <div
              className={`hidden md:block absolute top-3 right-4 w-12 h-1 rounded-full transition-all duration-500 z-50 ${
                isWorkoutActive || dynamicIslandState.mode !== 'idle'
                  ? 'bg-white shadow-[0_0_12px_#ffffff]'
                  : 'bg-white/30'
              }`}
            />
            {/* Left Glyph Pill Light */}
            <div
              className={`hidden md:block absolute top-20 left-1 w-1 h-16 rounded-full transition-all duration-500 z-50 ${
                isWorkoutActive
                  ? 'bg-white shadow-[0_0_12px_#ffffff] animate-pulse'
                  : 'bg-white/20'
              }`}
            />
            {/* Nothing Red Recording Dot Indicator */}
            <div className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse z-40" />
          </>
        )}

        {/* Device Top Speaker Earpiece Line */}
        {deviceModel !== 'fullscreen' && (
          <div className="hidden md:block absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-800 rounded-full z-40" />
        )}

        {/* iPhone 13 Pro Max Signature Notch (20% reduced notch with earpiece above) */}
        {deviceModel === 'iphone_13_promax' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl border-b border-x border-neutral-800 z-40 flex items-center justify-between px-3 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a0e14] border border-neutral-700/60" />
            <div className="w-2 h-2 rounded-full bg-[#181a24] border border-neutral-800" />
          </div>
        )}

        {/* System Status Bar (Adaptive for iOS vs Android) */}
        <IOSStatusBar platform={isAndroid ? 'android' : 'ios'} />

        {/* Dynamic Island (For iPhone 16 Pro) */}
        {hasDynamicIsland && (
          <DynamicIsland
            state={dynamicIslandState}
            onTap={onDynamicIslandTap}
          />
        )}

        {/* Android / Nothing OS Pulse Notification Pill when workout or alert is active */}
        {isAndroid && dynamicIslandState.mode !== 'idle' && (
          <div
            className={`absolute top-9 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-2 shadow-lg backdrop-blur-md animate-in fade-in ${
              deviceModel === 'nothing_phone'
                ? 'bg-neutral-900/95 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-neutral-900/90 text-white border border-emerald-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                deviceModel === 'nothing_phone' ? 'bg-white' : 'bg-emerald-400'
              } animate-ping`}
            />
            <span
              className={`font-mono ${
                deviceModel === 'nothing_phone' ? 'text-white' : 'text-emerald-400'
              }`}
            >
              {dynamicIslandState.mode === 'workout_tracking'
                ? `ACTIVE REP ${dynamicIslandState.currentRep || 0}`
                : dynamicIslandState.mode === 'rest_timer'
                ? `REST ${dynamicIslandState.timerSecondsRemaining || 0}s`
                : dynamicIslandState.title || 'Logged Meal'}
            </span>
          </div>
        )}

        {/* App Content Area or Nothing Phone Glyph Back View */}
        {deviceModel === 'nothing_phone' && isNothingBackView ? (
          <main className="w-full h-full overflow-hidden relative">
            <NothingGlyphBack
              isWorkoutActive={isWorkoutActive}
              currentRep={dynamicIslandState.currentRep}
              formStatus={dynamicIslandState.formStatus}
              restSecondsRemaining={dynamicIslandState.timerSecondsRemaining}
              onClose={() => setIsNothingBackView(false)}
            />
          </main>
        ) : (
          <>
            {/* Quick Floating Glyph Flip Pill for Nothing Phone */}
            {deviceModel === 'nothing_phone' && (
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsNothingBackView(true);
                }}
                className="absolute top-11 right-3 z-30 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/25 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 shadow-lg backdrop-blur-md transition-all active:scale-95"
                title="Inspect Nothing Phone Glyph Back Light"
              >
                <Zap className="w-3 h-3 text-white" />
                <span>GLYPH BACK ↻</span>
              </button>
            )}

            {/* App Content Area */}
            <main className="w-full h-[calc(100%-46px)] overflow-hidden relative">
              {children}
            </main>

            {/* Bottom Tab Bar */}
            <IOSTabBar
              activeTab={activeTab}
              onChangeTab={onChangeTab}
              isWorkoutActive={isWorkoutActive}
            />
          </>
        )}
      </div>

      {/* Comprehensive iOS, Nothing Phone & Android Compatibility Modal */}
      {showCompatibilityModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Supported Devices (iOS & Android 2020+)</h3>
                  <p className="text-[10px] text-neutral-400">Includes Nothing Phone Series • WebRTC 60 FPS</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompatibilityModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-xs max-h-[65vh] overflow-y-auto pr-1">
              {/* Nothing Phone Spotlight */}
              <div className="bg-neutral-900 border border-white/20 p-3.5 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Nothing Phone Series (Fully Supported)</span>
                  </span>
                  <span className="text-[9px] bg-white/10 text-white font-mono px-1.5 py-0.5 rounded">
                    Nothing OS
                  </span>
                </div>
                <p className="text-neutral-300 mt-1 text-[11px] leading-relaxed">
                  Optimized for Nothing Phone's transparent hardware aesthetic and high-refresh 120Hz OLED:
                </p>
                <ul className="mt-2 space-y-1 text-white font-medium">
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Nothing Phone (2) — Snapdragon 8+ Gen 1</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Nothing Phone (2a) & (2a) Plus — Dimensity 7200 Pro</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Nothing Phone (1) — Snapdragon 778G+</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>CMF Phone 1 by Nothing</span>
                  </li>
                </ul>
              </div>

              {/* Samsung, Pixel & Other Androids */}
              <div className="bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Other Android Flagships (2020 – 2026)</span>
                </div>
                <p className="text-neutral-300 mt-1 text-[11px]">
                  Samsung Galaxy S20 to S24 (Ultra/+/FE), Google Pixel 5 to 9 Pro, OnePlus 8 to 12, Xiaomi 11 to 14, and Motorola Edge.
                </p>
              </div>

              {/* iOS */}
              <div className="bg-neutral-900/80 border border-white/10 p-3.5 rounded-2xl">
                <div className="text-cyan-400 font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Apple iPhone Models (iOS 14.3+)</span>
                </div>
                <div className="mt-1.5 space-y-1 text-white font-medium">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>iPhone 13 Pro Max (6.7" Super Retina XDR, A15 Bionic) — Primary Device</span>
                  </div>
                  <div className="text-neutral-300 text-[11px]">
                    Also supports iPhone 16 / 15 / 14 / 13 / 12 / 11 series, SE, and all iPads.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCompatibilityModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
