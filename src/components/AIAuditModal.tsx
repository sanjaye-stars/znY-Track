import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  X,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { sounds } from '../utils/audioEffects';

export interface AuditData {
  overallVerdict: string;
  score: number;
  summaryAnalysis: string;
  doList: {
    action: string;
    reason: string;
    impact: string;
  }[];
  doNotList: {
    action: string;
    risk: string;
    severity: string;
  }[];
  proCoachTip: string;
}

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  auditData: AuditData | null;
  isLoading: boolean;
  onReanalyze?: () => void;
}

export const AIAuditModal: React.FC<AIAuditModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  auditData,
  isLoading,
  onReanalyze,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-5 max-w-md w-full max-h-[88vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
              <p className="text-[10px] text-neutral-400">{subtitle}</p>
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

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <div className="text-xs font-bold text-white">Running Biomechanical & Metabolic Audit...</div>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              Gemini 3.8 Flash is analyzing kinematic stresses, progressive overload ratios, and nutritional synergies.
            </p>
          </div>
        )}

        {/* Completed Audit Results */}
        {!isLoading && auditData && (
          <div className="space-y-4 my-3">
            {/* Score & Verdict Banner */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  AI Optimization Rating
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-base font-bold text-white tracking-tight">
                    {auditData.overallVerdict}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-black font-mono text-emerald-400 leading-none">
                  {auditData.score}/100
                </span>
                <span className="text-[9px] uppercase font-bold text-neutral-400 mt-1">Efficacy Score</span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
              {auditData.summaryAnalysis}
            </p>

            {/* DO THIS SECTION */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT YOU SHOULD DO</span>
              </div>

              {auditData.doList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-950/20 border border-emerald-500/25 p-3 rounded-2xl space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item.action}</span>
                    </h4>
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0 ml-2">
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed pl-3">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>

            {/* DO NOT DO THIS SECTION */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4" />
                <span>WHAT YOU SHOULD NOT DO (AVOID)</span>
              </div>

              {auditData.doNotList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-rose-950/20 border border-rose-500/25 p-3 rounded-2xl space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{item.action}</span>
                    </h4>
                    <span className="text-[9px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20 shrink-0 ml-2">
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed pl-3">
                    <span className="text-rose-400 font-semibold">Risk: </span>
                    {item.risk}
                  </p>
                </div>
              ))}
            </div>

            {/* Pro Coach Tip */}
            {auditData.proCoachTip && (
              <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-2xl flex items-start space-x-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Olympic Coach Tip
                  </span>
                  <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">
                    {auditData.proCoachTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-white/10 flex items-center space-x-2">
          {onReanalyze && (
            <button
              onClick={() => {
                sounds.playTap();
                onReanalyze();
              }}
              disabled={isLoading}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-Analyze</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-1"
          >
            <span>Apply & Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
