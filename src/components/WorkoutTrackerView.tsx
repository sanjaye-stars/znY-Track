import React, { useState } from 'react';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Plus,
  Trash2,
  Timer,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Activity,
  Flame,
  ChevronRight,
  TrendingUp,
  Award,
  Sliders,
  RotateCcw,
  X
} from 'lucide-react';
import { CompletedSet, ExerciseItem } from '../types/fitness';
import { ExerciseType } from '../utils/computerVision';
import { sounds } from '../utils/audioEffects';
import { MuscularAnatomyView, MUSCLE_GROUPS } from './MuscularAnatomyView';
import { AIAuditModal, AuditData } from './AIAuditModal';

interface WorkoutTrackerViewProps {
  currentExercise?: {
    name: string;
    type: ExerciseType;
    targetReps: string;
    rpe: string;
    targetSets: number;
    restSeconds: number;
  };
  onSetCompleted: (set: CompletedSet, exerciseName: string, exerciseType: ExerciseType) => void;
  onStartRestTimer: (seconds: number) => void;
  onAddExerciseToDay?: (exercise: ExerciseItem) => void;
}

export const WorkoutTrackerView: React.FC<WorkoutTrackerViewProps> = ({
  currentExercise,
  onSetCompleted,
  onStartRestTimer,
  onAddExerciseToDay,
}) => {
  // Active View Tab: 'sets' vs 'muscle_anatomy'
  const [activeViewMode, setActiveViewMode] = useState<'sets' | 'muscle_anatomy'>('sets');

  // Daily Exercises List (Customizable: Add / Remove)
  const [dailyExercises, setDailyExercises] = useState<ExerciseItem[]>([
    {
      id: 'ex_1',
      name: currentExercise?.name || 'Barbell Back Squats',
      targetSets: 4,
      targetReps: currentExercise?.targetReps || '8-10',
      rpe: currentExercise?.rpe || '8.5',
      restSeconds: 90,
      cvTrackable: false,
      cvExerciseType: currentExercise?.type || 'squat',
      primaryMuscle: 'Quadriceps & Glutes',
      coachingCue: 'Keep vertical chest posture, drive through whole foot.',
      biomechanicNotes: 'Target deep 90°+ knee flexion for maximum quad recruitment.',
    },
    {
      id: 'ex_2',
      name: 'Incline Dumbbell Bench Press',
      targetSets: 4,
      targetReps: '10-12',
      rpe: '8',
      restSeconds: 90,
      cvTrackable: false,
      cvExerciseType: 'pushup',
      primaryMuscle: 'Upper Pectorals & Front Delts',
      coachingCue: 'Retract scapulae into bench, 3-second eccentric stretch.',
      biomechanicNotes: 'Upper clavicular chest focus for aesthetic V-taper frame.',
    },
    {
      id: 'ex_3',
      name: 'Standing Supinated Bicep Curls',
      targetSets: 3,
      targetReps: '10-12',
      rpe: '8.5',
      restSeconds: 75,
      cvTrackable: false,
      cvExerciseType: 'bicep_curl',
      primaryMuscle: 'Biceps Brachii',
      coachingCue: 'Pin elbows to ribs, rotate pinkies outward at top.',
      biomechanicNotes: 'Eliminate shoulder swing to isolate biceps.',
    },
    {
      id: 'ex_4',
      name: 'Overhead Dumbbell Shoulder Press',
      targetSets: 3,
      targetReps: '10-12',
      rpe: '8',
      restSeconds: 90,
      cvTrackable: false,
      cvExerciseType: 'shoulder_press',
      primaryMuscle: 'Lateral & Anterior Deltoids',
      coachingCue: 'Brace core, full extension with bicep adjacent to ear.',
      biomechanicNotes: 'Builds 3D capped shoulder aesthetic.',
    },
  ]);

  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const activeEx = dailyExercises[activeExerciseIndex] || dailyExercises[0];

  // Set Logging inputs
  const [currentWeight, setCurrentWeight] = useState<number>(80);
  const [currentReps, setCurrentReps] = useState<number>(10);
  const [currentRpe, setCurrentRpe] = useState<string>('8.5');
  const [restSecondsInput, setRestSecondsInput] = useState<number>(activeEx?.restSeconds || 90);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Completed sets for active exercise
  const [loggedSets, setLoggedSets] = useState<
    {
      setNumber: number;
      weight: number;
      reps: number;
      rpe: string;
      timestamp: string;
    }[]
  >([]);

  // Add Exercise Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSets, setCustomSets] = useState(3);
  const [customReps, setCustomReps] = useState('10-12');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [customCue, setCustomCue] = useState('');

  // AI Technique Audit State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  const handleCompleteSet = () => {
    sounds.playSetBell();
    const newSetNum = loggedSets.length + 1;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLogItem = {
      setNumber: newSetNum,
      weight: currentWeight,
      reps: currentReps,
      rpe: currentRpe,
      timestamp: nowTime,
    };

    setLoggedSets((prev) => [...prev, newLogItem]);

    const completedObj: CompletedSet = {
      setNumber: newSetNum,
      reps: currentReps,
      weightKg: currentWeight,
      averageRom: 96,
      formScore: 95,
      cadenceSeconds: 2.5,
      flawsDetected: [],
      durationSeconds: 45,
      timestamp: Date.now(),
      aiCoachFeedback: {
        summaryRating: 'Strong Effort',
        keyHighlight: `${currentReps} reps at ${currentWeight}kg logged with strict tempo.`,
      },
    };

    onSetCompleted(completedObj, activeEx.name, activeEx.cvExerciseType);
    onStartRestTimer(restSecondsInput);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    sounds.playTap();

    const created: ExerciseItem = {
      id: `ex_${Date.now()}`,
      name: customName.trim(),
      targetSets: customSets,
      targetReps: customReps,
      rpe: '8.5',
      restSeconds: 90,
      cvTrackable: false,
      cvExerciseType: 'squat',
      primaryMuscle: customMuscle,
      coachingCue: customCue.trim() || 'Control eccentric phase, full muscular engagement.',
      biomechanicNotes: 'Custom exercise added by user.',
    };

    setDailyExercises((prev) => [...prev, created]);
    if (onAddExerciseToDay) onAddExerciseToDay(created);

    setIsAddModalOpen(false);
    setCustomName('');
    setCustomCue('');
    setActiveExerciseIndex(dailyExercises.length);
  };

  const handleRemoveExercise = (exId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    if (dailyExercises.length <= 1) return;

    setDailyExercises((prev) => prev.filter((item) => item.id !== exId));
    if (activeExerciseIndex >= dailyExercises.length - 1) {
      setActiveExerciseIndex(Math.max(0, dailyExercises.length - 2));
    }
  };

  const handleAddFromAnatomy = (exercise: ExerciseItem) => {
    sounds.playSuccessFanfare();
    setDailyExercises((prev) => [...prev, exercise]);
    if (onAddExerciseToDay) onAddExerciseToDay(exercise);
    setActiveExerciseIndex(dailyExercises.length);
    setActiveViewMode('sets');
  };

  const handleRunAudit = async () => {
    setAuditLoading(true);
    setIsAuditModalOpen(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/audit/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'workout_tracking_and_progressive_overload',
          customConfig: {
            activeExercise: activeEx.name,
            weightKg: currentWeight,
            reps: currentReps,
            rpe: currentRpe,
            restSeconds: restSecondsInput,
            dailyExercisesCount: dailyExercises.length,
            loggedSetsToday: loggedSets.length,
          },
          userContext: {
            primaryMuscle: activeEx.primaryMuscle,
            coachingCue: activeEx.coachingCue,
          },
        }),
      });

      const data = await res.json();
      if (data.audit) setAuditData(data.audit);
    } catch {
      // ignore
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07080c] text-white overflow-y-auto pb-28 pt-2">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
              <span>Gym Workout Logger</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded font-bold">
                PRO TRACK
              </span>
            </h1>
          </div>
          <p className="text-[10px] text-neutral-400">Tactile sets, weights, reps & rest timer</p>
        </div>

        {/* View Mode Toggle: Sets vs Muscular Anatomy */}
        <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveViewMode('sets');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              activeViewMode === 'sets'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏋️ Logger
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveViewMode('muscle_anatomy');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              activeViewMode === 'muscle_anatomy'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🦾 Muscle Map
          </button>
        </div>
      </div>

      {/* Main Content: If Anatomy View is active */}
      {activeViewMode === 'muscle_anatomy' ? (
        <div className="p-4">
          <MuscularAnatomyView
            onAddExerciseToPlan={handleAddFromAnatomy}
            onSelectForLogging={(ex) => {
              // Add and switch
              const created: ExerciseItem = {
                id: `ex_${Date.now()}`,
                name: ex.name,
                targetSets: ex.targetSets,
                targetReps: ex.targetReps,
                rpe: ex.rpe,
                restSeconds: ex.restSeconds,
                cvTrackable: false,
                cvExerciseType: ex.type,
                primaryMuscle: 'Target Muscle',
                coachingCue: 'Strict eccentric tempo, full contraction.',
                biomechanicNotes: 'Added from Muscle Map.',
              };
              handleAddFromAnatomy(created);
            }}
          />
        </div>
      ) : (
        <>
          {/* Daily Exercises Selector & Customizer */}
          <div className="px-5 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
                <span>Today's Exercises ({dailyExercises.length})</span>
                <span className="text-emerald-400 font-mono">• Customizable</span>
              </span>

              <button
                onClick={() => {
                  sounds.playTap();
                  setIsAddModalOpen(true);
                }}
                className="text-[10px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Add Exercise</span>
              </button>
            </div>

            {/* Horizontal Exercise Pills List */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              {dailyExercises.map((ex, idx) => {
                const isActive = activeExerciseIndex === idx;
                return (
                  <div
                    key={ex.id}
                    onClick={() => {
                      sounds.playTap();
                      setActiveExerciseIndex(idx);
                      setLoggedSets([]);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl cursor-pointer text-xs whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md'
                        : 'bg-neutral-900 text-neutral-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span>{ex.name}</span>
                    {dailyExercises.length > 1 && (
                      <button
                        onClick={(e) => handleRemoveExercise(ex.id, e)}
                        className={`p-0.5 rounded-full hover:bg-black/20 ${
                          isActive ? 'text-black' : 'text-neutral-500 hover:text-rose-400'
                        }`}
                        title="Remove exercise from today"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Exercise Focus Card */}
          <div className="px-5 pt-2">
            <div className="bg-gradient-to-r from-neutral-900 to-[#12141e] border border-white/10 rounded-3xl p-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {activeEx.primaryMuscle}
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">{activeEx.name}</h2>
                  <p className="text-[11px] text-neutral-400 mt-1 flex items-center space-x-2 font-mono">
                    <span>Target: {activeEx.targetSets} Sets × {activeEx.targetReps}</span>
                    <span>• RPE {activeEx.rpe}</span>
                  </p>
                </div>

                <button
                  onClick={handleRunAudit}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl border border-white/10 flex items-center space-x-1 transition-all"
                  title="AI Biomechanical Technique Audit"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>AI Audit</span>
                </button>
              </div>

              {/* Coaching Cue Pill */}
              <div className="mt-3 bg-black/40 border border-white/5 rounded-2xl p-2.5 flex items-start space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-300 leading-relaxed font-medium">
                  {activeEx.coachingCue}
                </p>
              </div>
            </div>
          </div>

          {/* Set Logger Inputs Card */}
          <div className="px-5 pt-3">
            <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-4 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>Log Set #{loggedSets.length + 1}</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {loggedSets.length} / {activeEx.targetSets} Sets Complete
                </span>
              </div>

              {/* Weight & Reps Counter Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Weight Input */}
                <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Weight (kg)</span>
                  <div className="flex items-center justify-center space-x-3 my-1.5">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setCurrentWeight((w) => Math.max(0, w - 2.5));
                      }}
                      className="w-7 h-7 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold font-mono text-white min-w-[50px]">
                      {currentWeight}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setCurrentWeight((w) => w + 2.5);
                      }}
                      className="w-7 h-7 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-[9px] text-neutral-500 font-mono">
                    <button onClick={() => setCurrentWeight((w) => w - 5)} className="hover:text-white">-5</button>
                    <span>|</span>
                    <button onClick={() => setCurrentWeight((w) => w + 5)} className="hover:text-white">+5</button>
                    <span>|</span>
                    <button onClick={() => setCurrentWeight((w) => w + 10)} className="hover:text-white">+10</button>
                  </div>
                </div>

                {/* Reps Input */}
                <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Reps</span>
                  <div className="flex items-center justify-center space-x-3 my-1.5">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setCurrentReps((r) => Math.max(1, r - 1));
                      }}
                      className="w-7 h-7 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold font-mono text-emerald-400 min-w-[40px]">
                      {currentReps}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setCurrentReps((r) => r + 1);
                      }}
                      className="w-7 h-7 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5 text-[9px] text-neutral-500 font-mono">
                    <button onClick={() => setCurrentReps(8)} className="hover:text-white">8</button>
                    <span>|</span>
                    <button onClick={() => setCurrentReps(10)} className="hover:text-white">10</button>
                    <span>|</span>
                    <button onClick={() => setCurrentReps(12)} className="hover:text-white">12</button>
                    <span>|</span>
                    <button onClick={() => setCurrentReps(15)} className="hover:text-white">15</button>
                  </div>
                </div>
              </div>

              {/* Rest Timer Selector */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase flex items-center space-x-1">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rest Timer After Set</span>
                </span>
                <div className="flex items-center space-x-1 text-[10px] font-mono">
                  {[60, 90, 120].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRestSecondsInput(s)}
                      className={`px-2 py-0.5 rounded-lg border ${
                        restSecondsInput === s
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                          : 'bg-neutral-800 text-neutral-400 border-white/5'
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Set Button */}
              <button
                onClick={handleCompleteSet}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Complete Set #{loggedSets.length + 1} & Start Rest ({restSecondsInput}s)</span>
              </button>
            </div>
          </div>

          {/* Today's Logged Sets Table for this Exercise */}
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Logged Sets History ({loggedSets.length})
              </span>
              <span className="text-[10px] text-neutral-500">
                Total Volume: {loggedSets.reduce((a, b) => a + b.weight * b.reps, 0)} kg
              </span>
            </div>

            {loggedSets.length === 0 ? (
              <div className="p-6 bg-neutral-900/40 border border-white/5 rounded-2xl text-center">
                <Dumbbell className="w-7 h-7 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  No sets logged yet for {activeEx.name}.
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Adjust weight & reps above, then tap Complete Set!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {loggedSets.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-900/80 border border-white/10 rounded-2xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono text-[11px]">
                        {s.setNumber}
                      </div>
                      <div>
                        <span className="font-bold text-white font-mono">{s.weight} kg</span>
                        <span className="text-neutral-400 mx-1.5">×</span>
                        <span className="font-bold text-emerald-400 font-mono">{s.reps} reps</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-neutral-400 font-mono">
                      <span>RPE {s.rpe}</span>
                      <span>• {s.timestamp}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Custom Exercise Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Exercise</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="my-3 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Bulgarian Split Squat"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Target Sets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={customSets}
                    onChange={(e) => setCustomSets(Number(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Target Reps</label>
                  <input
                    type="text"
                    value={customReps}
                    onChange={(e) => setCustomReps(e.target.value)}
                    placeholder="8-12"
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Primary Muscle</label>
                <select
                  value={customMuscle}
                  onChange={(e) => setCustomMuscle(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Chest">Chest (Pectorals)</option>
                  <option value="Shoulders">Shoulders (Deltoids)</option>
                  <option value="Back & Lats">Back & Lats</option>
                  <option value="Biceps">Biceps</option>
                  <option value="Triceps">Triceps</option>
                  <option value="Quads">Quads (Quadriceps)</option>
                  <option value="Hamstrings & Glutes">Hamstrings & Glutes</option>
                  <option value="Core & Abs">Core & Abs</option>
                  <option value="Calves">Calves</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Coaching Cue</label>
                <input
                  type="text"
                  value={customCue}
                  onChange={(e) => setCustomCue(e.target.value)}
                  placeholder="e.g. 3-second descent, full stretch"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-2xl text-xs transition-all mt-2 active:scale-95 shadow"
              >
                Add to Today's Exercises
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Technique Audit Modal */}
      <AIAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title={`${activeEx.name} Technique Audit`}
        subtitle="Progressive Overload & Biomechanical Analysis"
        auditData={auditData}
        isLoading={auditLoading}
        onReanalyze={handleRunAudit}
      />
    </div>
  );
};
