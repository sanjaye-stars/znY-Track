import React from 'react';
import { X, Globe, Check, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, useTranslation } from '../utils/i18n';
import { sounds } from '../utils/audioEffects';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t('lang.select', 'Select Language')}</h3>
              <p className="text-[10px] text-neutral-400">9 Global Languages Supported</p>
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

        {/* Language Grid */}
        <div className="my-3 space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => {
                  sounds.playTap();
                  setLanguage(item.code);
                  setTimeout(() => {
                    onClose();
                  }, 150);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-white shadow-lg'
                    : 'bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/5 text-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>{item.name}</span>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">({item.code})</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-medium">{item.nativeName}</div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-white/10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 text-center">
          <p className="text-[10px] text-neutral-500 flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Translations apply dynamically to all screens & AI responses</span>
          </p>
        </div>
      </div>
    </div>
  );
};
