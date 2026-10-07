import React from 'react';
import { Dumbbell, CalendarRange, UtensilsCrossed, LineChart, Sparkles, MessageSquare } from 'lucide-react';
import { sounds } from '../utils/audioEffects';
import { useTranslation } from '../utils/i18n';

export type TabType = 'workout' | 'plan' | 'nutrition' | 'progress' | 'chat' | 'coach';

interface IOSTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isWorkoutActive?: boolean;
}

export const IOSTabBar: React.FC<IOSTabBarProps> = ({ activeTab, onChangeTab, isWorkoutActive }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'workout' as TabType, label: t('nav.workout', 'Workout'), icon: Dumbbell, badge: isWorkoutActive ? 'LIVE' : null },
    { id: 'plan' as TabType, label: t('nav.plan', 'Plan'), icon: CalendarRange, badge: null },
    { id: 'nutrition' as TabType, label: t('nav.dietary', 'Dietary'), icon: UtensilsCrossed, badge: null },
    { id: 'progress' as TabType, label: t('nav.progress', 'Progress'), icon: LineChart, badge: null },
    { id: 'chat' as TabType, label: t('nav.chat', 'Community'), icon: MessageSquare, badge: 'NEW' },
    { id: 'coach' as TabType, label: t('nav.coach', 'AI Coach'), icon: Sparkles, badge: 'AI' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0e14]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 pt-2 pb-6 max-w-full">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playTap();
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 transition-all duration-200 group active:scale-90 ${
                isActive ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[7.5px] font-black tracking-tighter px-1 rounded-full ${
                      tab.badge === 'LIVE'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : tab.badge === 'NEW'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-emerald-500/90 text-black'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] mt-1 tracking-tight font-medium truncate max-w-[50px] ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2 pointer-events-none" />
    </div>
  );
};
