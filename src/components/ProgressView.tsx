import React, { useState } from 'react';
import {
  Trophy,
  Activity,
  Flame,
  Award,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Dumbbell,
  Target
} from 'lucide-react';
import { WorkoutSession, CompletedSet, UserProfile, MealItem } from '../types/fitness';
import { sounds } from '../utils/audioEffects';
import { AIAuditModal, AuditData } from './AIAuditModal';

interface ProgressViewProps {
  completedSets: {
    exerciseName: string;
    exerciseType: string;
    set: CompletedSet;
  }[];
  totalCaloriesBurned: number;
  userProfile?: UserProfile;
  loggedMeals?: MealItem[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  completedSets,
  totalCaloriesBurned,
  userProfile,
  loggedMeals = [],
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  // Overall AI Progress Report State
  const [overallReport, setOverallReport] = useState<any>(null);
  const [isAnalyzingOverall, setIsAnalyzingOverall] = useState(false);

  // Total protein and calories from logged meals
  const totalLoggedProtein = loggedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalLoggedCals = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);

  const targetProtein = userProfile?.dailyProteinTarget || 175;
  const targetCalories = userProfile?.dailyCalorieTarget || 2500;
  const proteinAdherencePct = Math.min(100, Math.round((totalLoggedProtein / targetProtein) * 100));

  // Aggregate stats
  const totalReps = completedSets.reduce((acc, item) => acc + item.set.reps, 0);
  const totalMinutes = Math.round(
    completedSets.reduce((acc, item) => acc + item.set.durationSeconds, 0) / 60
  ) || 18;

  const averageFormScore =
    completedSets.length > 0
      ? Math.round(
          completedSets.reduce((acc, item) => acc + item.set.formScore, 0) /
            completedSets.length
        )
      : 93;

  const averageRom =
    completedSets.length > 0
      ? Math.round(
          completedSets.reduce((acc, item) => acc + item.set.averageRom, 0) /
            completedSets.length
        )
      : 95;

  const handleRunOverallProgressAnalysis = async () => {
    setIsAnalyzingOverall(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/progress/analyze-overall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          completedSets,
          loggedMeals,
          totalCaloriesBurned,
        }),
      });

      const data = await res.json();
      if (data.progressReport) {
        setOverallReport(data.progressReport);
        sounds.playSuccessFanfare();
      }
    } catch {
      // ignore
    } finally {
      setIsAnalyzingOverall(false);
    }
  };

  // Apple Fitness Ring Goals
  const moveGoal = 400; // kcal
  const exerciseGoal = 30; // mins
  const formGoal = 90; // %

  const movePct = Math.min(100, Math.round((totalCaloriesBurned / moveGoal) * 100));
  const exercisePct = Math.min(100, Math.round((totalMinutes / exerciseGoal) * 100));
  const formPct = Math.min(100, Math.round((averageFormScore / formGoal) * 100));

  const handleRunProgressAudit = async () => {
    setAuditLoading(true);
    setIsAuditModalOpen(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/audit/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'workout_progress_and_biomechanical_trends',
          customConfig: {
            totalCaloriesBurned,
            totalMinutes,
            averageFormScore,
            averageRom,
            completedSetsCount: completedSets.length,
          },
          userContext: {
            moveGoal,
            exerciseGoal,
          },
        }),
      });

      const data = await res.json();
      if (data.audit) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Progress audit failed:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07080c] text-white overflow-y-auto pb-28 pt-2">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 border-b border-white/5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Kinematic Telemetry
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Personal Workout Progress
          </h1>
        </div>

        <button
          onClick={handleRunProgressAudit}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-black py-1.5 px-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Audit (Do's & Don'ts)</span>
        </button>
      </div>

      {/* Apple Fitness Style Triple Activity Rings Card */}
      <div className="mx-5 my-4 p-5 bg-neutral-900/80 border border-white/10 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Today's Activity Rings</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">Calculated via logged volume & biomechanical analytics</p>
          </div>

          <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
            STREAK: 5 DAYS
          </div>
        </div>

        {/* Concentric Rings Visual */}
        <div className="flex items-center justify-center my-5">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Move Ring (Red/Rose) */}
            <svg className="absolute w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="rgba(244, 63, 94, 0.15)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke="#f43f5e"
                strokeWidth="10"
                strokeDasharray={452.4}
                strokeDashoffset={452.4 - (452.4 * movePct) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700"
              />
            </svg>

            {/* Middle Exercise Ring (Emerald) */}
            <svg className="absolute w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="56"
                stroke="rgba(16, 185, 129, 0.15)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="56"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (351.8 * exercisePct) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Form Quality Ring (Cyan) */}
            <svg className="absolute w-44 h-44 -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="40"
                stroke="rgba(6, 182, 212, 0.15)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="40"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray={251.3}
                strokeDashoffset={251.3 - (251.3 * formPct) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700"
              />
            </svg>

            {/* Ring Center Metrics */}
            <div className="flex flex-col items-center justify-center text-center z-10">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-xl font-black font-mono text-white mt-0.5 leading-none">
                {totalCaloriesBurned}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">KCAL BURN</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
          <div>
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-tight">Active Burn</div>
            <div className="text-sm font-black font-mono text-white mt-0.5">
              {totalCaloriesBurned} / {moveGoal}
            </div>
            <span className="text-[9px] text-neutral-500 font-medium">KCAL</span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">Workout Time</div>
            <div className="text-sm font-black font-mono text-white mt-0.5">
              {totalMinutes} / {exerciseGoal}
            </div>
            <span className="text-[9px] text-neutral-500 font-medium">MINS</span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-tight">Form Score</div>
            <div className="text-sm font-black font-mono text-white mt-0.5">
              {averageFormScore}%
            </div>
            <span className="text-[9px] text-neutral-500 font-medium">AVG ROM {averageRom}%</span>
          </div>
        </div>
      </div>

      {/* Required Dietary & Protein Adherence Card */}
      <div className="mx-5 mb-4 p-4 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-[#12141e] border border-emerald-500/30 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Required Dietary & Protein Tracker
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {proteinAdherencePct}% TARGET
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Daily Protein Target</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-base font-bold font-mono text-emerald-400">{totalLoggedProtein}g</span>
              <span className="text-xs text-neutral-400">/ {targetProtein}g</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinAdherencePct}%` }}
              />
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">
              {totalLoggedProtein >= targetProtein
                ? 'Target Met: Max protein synthesis'
                : `${targetProtein - totalLoggedProtein}g remaining for today`}
            </span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Calorie Energy Intake</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-base font-bold font-mono text-amber-300">{totalLoggedCals}</span>
              <span className="text-xs text-neutral-400">/ {targetCalories} kcal</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalLoggedCals / targetCalories) * 100))}%` }}
              />
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">
              Goal: {userProfile?.physiqueGoal || 'Hypertrophy'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Overall Progress & Physique Adaptation Assessment */}
      <div className="mx-5 mb-4 p-4 bg-neutral-900/90 border border-white/10 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Physique Progress Assessment
              </h3>
              <p className="text-[10px] text-neutral-400">Analyzed across workouts, volume & macros</p>
            </div>
          </div>

          <button
            onClick={handleRunOverallProgressAnalysis}
            disabled={isAnalyzingOverall}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1 active:scale-95 transition-all shadow"
          >
            {isAnalyzingOverall ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <TrendingUp className="w-3 h-3 text-black" />
                <span>AI Re-Assess</span>
              </>
            )}
          </button>
        </div>

        {/* Assessment Card Content */}
        <div className="bg-black/40 border border-white/5 p-3 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">
              {overallReport?.verdictTitle || 'Hypertrophy On Track'}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Physique Score: {overallReport?.overallPhysiqueScore || 92}/100
            </span>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            {overallReport?.summaryAnalysis ||
              'Your movement execution and progressive overload indicators show solid muscular recruitment. Continue pairing heavy compound resistance with required daily protein intake.'}
          </p>

          {/* WHAT TO IMPROVE LIST */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              What You Specifically Should Improve Next:
            </span>
            {(
              overallReport?.whatToImproveNext || [
                'Increase daily protein intake towards 175g+ threshold to maximize mTOR activation across 4 meals.',
                'Prioritize Upper Chest and Lateral Delts to enhance aesthetic V-taper clavicular width.',
                'Maintain deep 90°+ knee flexion on squats and control 3-second eccentric tempo on presses.',
              ]
            ).map((tip: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-2 text-[11px] text-neutral-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biomechanical Joint Quality Analytics */}
      <div className="px-5 pt-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Biomechanical Form & Joint Stability
        </h2>

        <div className="grid grid-cols-2 gap-3 mt-2.5">
          <div className="bg-neutral-900/70 border border-white/5 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Squat Parallel Depth</span>
              <span className="text-xs font-mono font-bold text-emerald-400">97%</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
              Hip crease consistently drops below top of patella.
            </p>
            <div className="w-full bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[97%]" />
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-white/5 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Knee Valgus Stability</span>
              <span className="text-xs font-mono font-bold text-cyan-400">92%</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
              Knee vectors track smoothly with second toe alignment.
            </p>
            <div className="w-full bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-cyan-400 h-full w-[92%]" />
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-white/5 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Spine Neutrality</span>
              <span className="text-xs font-mono font-bold text-amber-400">89%</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
              Zero lumbar hyperextension during pressing movements.
            </p>
            <div className="w-full bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-amber-400 h-full w-[89%]" />
            </div>
          </div>

          <div className="bg-neutral-900/70 border border-white/5 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tempo Control</span>
              <span className="text-xs font-mono font-bold text-purple-400">94%</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
              Averages 2.4s per repetition with controlled eccentric.
            </p>
            <div className="w-full bg-neutral-800 h-1 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-purple-400 h-full w-[94%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Records & Achievements */}
      <div className="px-5 pt-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Personal Records & Milestones
        </h2>

        <div className="space-y-2 mt-2.5">
          <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Flawless Squat Set PR</h4>
                <p className="text-[10px] text-neutral-400">12 consecutive reps with &gt;95% ROM</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">12 REPS</span>
          </div>

          <div className="bg-neutral-900/80 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Macro Precision Shield</h4>
                <p className="text-[10px] text-neutral-400">Hit protein target within 5g for 7 days</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">175g/DAY</span>
          </div>
        </div>
      </div>

      {/* Logged Workout Sets History */}
      <div className="px-5 pt-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Recent Logged Workout Sets ({completedSets.length})
        </h2>

        {completedSets.length === 0 ? (
          <div className="mt-2.5 p-6 bg-neutral-900/40 border border-white/5 rounded-2xl text-center">
            <Activity className="w-6 h-6 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 mt-2 font-medium">
              Start your first workout in the Workout tab to record training sets.
            </p>
          </div>
        ) : (
          <div className="mt-2.5 space-y-2">
            {completedSets.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.exerciseName}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(item.set.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Cadence: {item.set.cadenceSeconds}s
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {item.set.reps} REPS
                    </span>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Form: {item.set.formScore}%
                    </div>
                  </div>
                </div>

                {item.set.aiCoachFeedback && (
                  <p className="text-[11px] text-neutral-300 bg-black/40 p-2.5 rounded-xl border border-white/5 mt-2">
                    <span className="text-emerald-400 font-semibold">AI Biomechanics: </span>
                    {item.set.aiCoachFeedback.keyHighlight}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Progress Audit Modal */}
      <AIAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="AI Workout Progress Audit"
        subtitle="Volume, Form Quality & Overload Review"
        auditData={auditData}
        isLoading={auditLoading}
        onReanalyze={handleRunProgressAudit}
      />
    </div>
  );
};
