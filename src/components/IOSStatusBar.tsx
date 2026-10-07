import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

interface StatusBarProps {
  platform?: 'ios' | 'android';
}

export const IOSStatusBar: React.FC<StatusBarProps> = ({ platform = 'ios' }) => {
  const [time, setTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (platform === 'android') {
    return (
      <div className="flex items-center justify-between px-6 pt-2.5 pb-2 text-xs font-medium text-white/90 select-none z-30 pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="text-[12px] font-mono tracking-tight font-semibold">{time}</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded text-center">5G</span>
        </div>

        {/* Centered Android Punch-hole Camera */}
        <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-800 shadow-inner -mt-0.5 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700/60" />
        </div>

        <div className="flex items-center space-x-2 text-white/80">
          <Wifi className="w-3.5 h-3.5" />
          <SignalHigh className="w-3.5 h-3.5" />
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-mono text-white/80">95%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-7 pt-3.5 pb-2 text-xs font-semibold text-white/90 select-none z-30 pointer-events-none">
      <span className="tracking-tight text-[13px] font-medium">{time}</span>
      <div className="flex items-center space-x-2 text-white/80">
        <SignalHigh className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-white/70">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
