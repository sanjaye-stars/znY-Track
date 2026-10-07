import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Dumbbell,
  Clock,
  Zap,
  Target,
  ChevronRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Play,
  Plus,
  Trash2,
  Activity,
  X
} from 'lucide-react';
import { TrainingPlan, TrainingDay, ExerciseItem } from '../types/fitness';
import { ExerciseType } from '../utils/computerVision';
import { sounds } from '../utils/audioEffects';
import { AIAuditModal, AuditData } from './AIAuditModal';
import { MuscularAnatomyView } from './MuscularAnatomyView';

interface TrainingPlanViewProps {
  plan: TrainingPlan;
  onUpdatePlan: (newPlan: TrainingPlan) => void;
  onSelectExerciseForLogging?: (exercise: ExerciseItem) => void;
  onSelectExerciseForCV?: (exercise: ExerciseItem) => void;
}

export const TrainingPlanView: React.FC<TrainingPlanViewProps> = ({
  plan,
  onUpdatePlan,
  onSelectExerciseForLogging,
  onSelectExerciseForCV,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnatomyModalOpen, setIsAnatomyModalOpen] = useState(false);

  const handleSelectExercise = (exercise: ExerciseItem) => {
    if (onSelectExerciseForLogging) {
      onSelectExerciseForLogging(exercise);
    } else if (onSelectExerciseForCV) {
      onSelectExerciseForCV(exercise);
    }
  };

  // Custom Exercise Modal State
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExRpe, setNewExRpe] = useState('8');
  const [newExMuscle, setNewExMuscle] = useState('Chest');
  const [newExType, setNewExType] = useState<ExerciseType>('pushup');
  const [newExCue, setNewExCue] = useState('');

  // Plan AI Audit State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  // AI Architect Onboarding Form State
  const [goal, setGoal] = useState<string>('Hypertrophy & Muscle Gain');
  const [level, setLevel] = useState<string>('Intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [equipment, setEquipment] = useState<string>('Full Commercial Gym');
  const [focusArea, setFocusArea] = useState<string>('Aesthetic V-Taper & Core');
  const [injuries, setInjuries] = useState<string>('None');

  const activeDay = plan.days[selectedDayIndex] || plan.days[0];

  const handleRunPlanAudit = async () => {
    setAuditLoading(true);
    setIsAuditModalOpen(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/audit/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'training_plan_and_splits',
          customConfig: {
            planName: plan.planName,
            activeDayName: activeDay?.dayName,
            exercises: activeDay?.exercises,
            weeklyFrequency: plan.weeklyFrequency,
            philosophy: plan.philosophy,
          },
          userContext: {
            goal,
            experienceLevel: level,
          },
        }),
      });

      const data = await res.json();
      if (data.audit) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Plan audit failed:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleAddCustomExercise = () => {
    if (!newExName.trim()) return;
    sounds.playTap();

    const created: ExerciseItem = {
      id: `custom_ex_${Date.now()}`,
      name: newExName.trim(),
      targetSets: newExSets,
      targetReps: newExReps,
      rpe: newExRpe,
      restSeconds: 90,
      cvTrackable: true,
      cvExerciseType: newExType,
      primaryMuscle: newExMuscle,
      coachingCue: newExCue.trim() || 'Control the eccentric tempo, maintain solid spinal alignment.',
      biomechanicNotes: 'Customized exercise added by athlete.',
    };

    const updatedDays = [...plan.days];
    updatedDays[selectedDayIndex] = {
      ...activeDay,
      exercises: [...activeDay.exercises, created],
    };

    onUpdatePlan({
      ...plan,
      days: updatedDays,
    });

    setIsAddExerciseModalOpen(false);
    setNewExName('');
    setNewExCue('');
  };

  const handleDeleteExercise = (exId: string) => {
    sounds.playTap();
    const updatedDays = [...plan.days];
    updatedDays[selectedDayIndex] = {
      ...activeDay,
      exercises: activeDay.exercises.filter((e) => e.id !== exId),
    };
    onUpdatePlan({
      ...plan,
      days: updatedDays,
    });
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    sounds.playTap();

    try {
      const response = await fetch('/api/training/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          level,
          daysPerWeek,
          equipment,
          focusArea,
          injuries,
        }),
      });

      const data = await response.json();
      if (data.plan) {
        onUpdatePlan(data.plan);
        sounds.playSuccessFanfare();
        setIsGeneratorModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to generate training plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07080c] text-white overflow-y-auto pb-28 pt-2">
      {/* Header Banner */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Gemini Periodization
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            {plan.planName}
          </h1>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            setIsGeneratorModalOpen(true);
          }}
          className="flex items-center space-x-1.5 bg-neutral-900 border border-white/10 hover:border-emerald-500/50 text-neutral-200 hover:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>New AI Plan</span>
        </button>
      </div>

      {/* Plan Philosophy Pill */}
      <div className="mx-5 my-3 p-3.5 bg-neutral-900/60 border border-white/5 rounded-2xl">
        <p className="text-xs text-neutral-300 leading-relaxed">
          {plan.philosophy}
        </p>
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Split: {plan.weeklyFrequency} Days / Week</span>
          <span className="text-emerald-400 font-medium">{plan.recommendedCalorieAdjustment}</span>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="px-5 pb-2 overflow-x-auto scrollbar-none flex space-x-2">
        {plan.days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                sounds.playTap();
                setSelectedDayIndex(idx);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex flex-col items-center ${
                isSelected
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-neutral-900/80 border border-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] uppercase font-bold opacity-80">Day {day.dayNumber}</span>
              <span className="text-xs mt-0.5 truncate max-w-[120px]">{day.dayName.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Overview Card */}
      {activeDay && (
        <div className="px-5 py-3">
          <div className="bg-gradient-to-r from-neutral-900/90 to-neutral-950 border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">{activeDay.dayName}</h2>
              <div className="flex items-center space-x-1 text-xs text-neutral-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{activeDay.estimatedDuration}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-medium">{activeDay.focus}</p>

            {/* Quick Actions: AI Audit, Add Custom Exercise & Muscular Anatomy */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center space-x-2">
              <button
                onClick={handleRunPlanAudit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black py-2 px-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Audit</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  setIsAnatomyModalOpen(true);
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 py-2 px-2.5 rounded-xl font-semibold text-xs flex items-center space-x-1 transition-all active:scale-95"
                title="Inspect Muscular Anatomy Structure"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Muscle Map</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  setIsAddExerciseModalOpen(true);
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 py-2 px-2.5 rounded-xl font-semibold text-xs flex items-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Exercises List for Selected Day */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
              <span>Programmed Exercises ({activeDay.exercises.length})</span>
              <span>Tactile Workout Tracking</span>
            </div>

            {activeDay.exercises.map((exercise, idx) => (
              <div
                key={exercise.id || idx}
                className="bg-neutral-900/70 border border-white/10 rounded-2xl p-4 shadow-md hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                        {exercise.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                        {exercise.targetSets} SETS × {exercise.targetReps}
                      </span>
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                        RPE {exercise.rpe}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {exercise.primaryMuscle}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 mt-2.5 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-emerald-400 font-semibold">Form Cue: </span>
                      {exercise.coachingCue}
                    </p>
                  </div>

                  {/* Actions: Log Set & Delete Exercise */}
                  <div className="shrink-0 flex flex-col items-center space-y-1.5">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        handleSelectExercise(exercise);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-2.5 py-2 rounded-2xl flex flex-col items-center justify-center space-y-0.5 shadow-md shadow-emerald-500/20 active:scale-90 transition-all"
                      title="Log Sets for this Exercise"
                    >
                      <Dumbbell className="w-4 h-4 text-black" />
                      <span className="text-[8.5px] font-black uppercase tracking-tight">LOG SET</span>
                    </button>

                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-all"
                      title="Remove exercise from day"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recovery Protocol Footer */}
          <div className="mt-5 p-3.5 bg-neutral-900/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Recovery & Neuromuscular Guidance</span>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {plan.recoveryProtocol}
            </p>
          </div>
        </div>
      )}

      {/* AI Plan Architect Generation Modal */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border border-white/15 rounded-3xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Training Plan Architect</h3>
                  <p className="text-[10px] text-neutral-400">Powered by Gemini 3.8 Flash</p>
                </div>
              </div>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* Goal */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Primary Fitness Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hypertrophy & Muscle Gain">Hypertrophy & Maximum Muscle Growth</option>
                  <option value="Strength & Power">Raw Strength & Olympic Power</option>
                  <option value="Athletic Conditioning & Lean">Lean Athletic Conditioning & Fat Loss</option>
                  <option value="Body Recomposition">Body Recomposition (Build Muscle + Drop Fat)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        level === lvl
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                          : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Frequency */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Days Per Week ({daysPerWeek} Days)
                </label>
                <input
                  type="range"
                  min={3}
                  max={6}
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                  className="w-full mt-2 accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>3 Days</span>
                  <span>4 Days</span>
                  <span>5 Days</span>
                  <span>6 Days</span>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Equipment Setup
                </label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Full Commercial Gym (Barbell, Dumbbells, Cables, Machines)">
                    Full Gym (Barbell, Cables & Machines)
                  </option>
                  <option value="Home Gym (Dumbbells & Adjustable Bench)">
                    Home Gym (Dumbbells & Bench)
                  </option>
                  <option value="Bodyweight / Calisthenics Only">
                    Bodyweight & Calisthenics
                  </option>
                </select>
              </div>

              {/* Focus Area */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Target Aesthetic Focus
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="e.g. V-Taper Back, Chest, Glute Drive"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Limitations / Injuries */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Injuries / Biomechanical Limitations
                </label>
                <input
                  type="text"
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  placeholder="e.g. Mild lower back sensitivity, none"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Bio-Periodization...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Customized Split</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border border-white/15 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Add Custom Exercise</h3>
                  <p className="text-[10px] text-neutral-400">{activeDay?.dayName.split(':')[0]}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 my-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="e.g. Bulgarian Split Squat"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Target Sets
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newExSets}
                    onChange={(e) => setNewExSets(parseInt(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Target Reps
                  </label>
                  <input
                    type="text"
                    value={newExReps}
                    onChange={(e) => setNewExReps(e.target.value)}
                    placeholder="8-10"
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Target RPE
                  </label>
                  <input
                    type="text"
                    value={newExRpe}
                    onChange={(e) => setNewExRpe(e.target.value)}
                    placeholder="8.5"
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Target Muscle
                  </label>
                  <input
                    type="text"
                    value={newExMuscle}
                    onChange={(e) => setNewExMuscle(e.target.value)}
                    placeholder="Quads & Glutes"
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Movement Pattern & Mechanics
                </label>
                <select
                  value={newExType}
                  onChange={(e) => setNewExType(e.target.value as ExerciseType)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="squat">Squat / Lower Body Hinge</option>
                  <option value="pushup">Push-Up / Press</option>
                  <option value="bicep_curl">Bicep Curl / Pull</option>
                  <option value="shoulder_press">Overhead Shoulder Press</option>
                  <option value="lunge">Lunge / Unilateral</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Custom Form Cue (Optional)
                </label>
                <input
                  type="text"
                  value={newExCue}
                  onChange={(e) => setNewExCue(e.target.value)}
                  placeholder="e.g. Chest up, drive through midfoot"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleAddCustomExercise}
              disabled={!newExName.trim()}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all"
            >
              Add to Active Split
            </button>
          </div>
        </div>
      )}

      {/* AI Plan Audit Modal */}
      <AIAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="AI Training Split Audit"
        subtitle={`${activeDay?.dayName} • Kinetic Balance Check`}
        auditData={auditData}
        isLoading={auditLoading}
        onReanalyze={handleRunPlanAudit}
      />

      {/* Muscular Anatomy Structure Modal */}
      {isAnatomyModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95">
            <MuscularAnatomyView
              onClose={() => setIsAnatomyModalOpen(false)}
              onAddExerciseToPlan={(ex) => {
                sounds.playSuccessFanfare();
                const updatedDays = [...plan.days];
                updatedDays[selectedDayIndex] = {
                  ...activeDay,
                  exercises: [...activeDay.exercises, ex],
                };
                onUpdatePlan({ ...plan, days: updatedDays });
                setIsAnatomyModalOpen(false);
              }}
              onSelectForLogging={(ex) => {
                const newEx: ExerciseItem = {
                  id: `rec_${Date.now()}`,
                  name: ex.name,
                  targetSets: ex.targetSets,
                  targetReps: ex.targetReps,
                  rpe: ex.rpe,
                  restSeconds: ex.restSeconds,
                  cvTrackable: false,
                  cvExerciseType: ex.type,
                  primaryMuscle: 'Target Muscle',
                  coachingCue: 'Strict eccentric tempo, full contraction.',
                  biomechanicNotes: 'Selected from Anatomy Map.',
                };
                setIsAnatomyModalOpen(false);
                handleSelectExercise(newEx);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
