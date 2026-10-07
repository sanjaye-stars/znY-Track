import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Target,
  Dumbbell,
  Scale,
  Ruler,
  User,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { UserProfile } from '../types/fitness';
import { sounds } from '../utils/audioEffects';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [age, setAge] = useState<number>(currentUserProfile.age || 24);
  const [weightKg, setWeightKg] = useState<number>(currentUserProfile.weightKg || 78);
  const [heightCm, setHeightCm] = useState<number>(currentUserProfile.heightCm || 180);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentUserProfile.gender || 'male');
  const [physiqueGoal, setPhysiqueGoal] = useState<string>(
    currentUserProfile.physiqueGoal || 'Aesthetic V-Taper (Wide Shoulders & Lats)'
  );
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    currentUserProfile.experienceLevel || 'Intermediate'
  );
  const [selectedMuscleFocus, setSelectedMuscleFocus] = useState<string[]>([
    'Chest & Shoulders',
    'Back & Lats',
  ]);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!isOpen) return null;

  const toggleFocusArea = (area: string) => {
    sounds.playTap();
    if (selectedMuscleFocus.includes(area)) {
      setSelectedMuscleFocus(selectedMuscleFocus.filter((a) => a !== area));
    } else {
      setSelectedMuscleFocus([...selectedMuscleFocus, area]);
    }
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTap();
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/onboarding/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          weightKg,
          heightCm,
          gender,
          physiqueGoal,
          experienceLevel,
          targetAreas: selectedMuscleFocus,
          daysPerWeek,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        sounds.playSuccessFanfare();
        setStep('results');
      }
    } catch (err) {
      console.error('Error during onboarding analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAndFinish = () => {
    sounds.playSuccessFanfare();
    const updated: UserProfile = {
      ...currentUserProfile,
      age,
      weightKg,
      heightCm,
      gender,
      fitnessGoal: physiqueGoal,
      physiqueGoal,
      experienceLevel,
      dailyCalorieTarget: analysisResult?.dailyCalorieTarget || currentUserProfile.dailyCalorieTarget,
      dailyProteinTarget: analysisResult?.dailyProteinTarget || currentUserProfile.dailyProteinTarget,
      dailyCarbTarget: analysisResult?.dailyCarbTarget || currentUserProfile.dailyCarbTarget,
      dailyFatTarget: analysisResult?.dailyFatTarget || currentUserProfile.dailyFatTarget,
      dailyWaterTargetMl: analysisResult?.dailyWaterTargetMl || currentUserProfile.dailyWaterTargetMl,
      whatToImprove: analysisResult?.whatToImprove || [
        `Target ${Math.round(weightKg * 2.2)}g daily protein for maximal muscle protein synthesis.`,
        'Focus on Upper Chest and Lateral Deltoids for the V-taper ratio.',
      ],
      targetMuscleAreas: selectedMuscleFocus,
      onboardingCompleted: true,
    };

    onSaveProfile(updated);
    onClose();
  };

  const PHYSIQUE_GOALS = [
    {
      id: 'Aesthetic V-Taper (Wide Shoulders & Lats)',
      title: '🔱 Aesthetic V-Taper',
      desc: 'Broad shoulders, wide lat wings, tight narrow waist & lean core',
    },
    {
      id: 'Hypertrophy & Full Muscle Mass',
      title: '🦁 Hypertrophy Mass',
      desc: 'Max muscle belly volume, high mechanical tension & calorie surplus',
    },
    {
      id: 'Six-Pack Shred & Lean Cut',
      title: '⚡ Six-Pack Shred',
      desc: 'Caloric deficit, crisp abdominal striations & muscle retention',
    },
    {
      id: 'Powerlifter Raw Strength',
      title: '🦾 Powerlifter Strength',
      desc: 'Heavy compound barbell squat, bench, deadlift & neural adaptation',
    },
    {
      id: 'Athletic Conditioning & Lean Tone',
      title: '🏃 Athletic Definition',
      desc: 'Functional kinetic agility, explosive work capacity & lean tone',
    },
  ];

  const FOCUS_AREAS = [
    'Chest & Shoulders',
    'Back & Lats',
    'Arms (Biceps & Triceps)',
    'Legs & Quads',
    'Glutes & Hamstrings',
    'Core & Six-Pack',
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {step === 'form' ? 'Physique & Nutrition Assessment' : 'AI Physique Plan Generated'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {step === 'form'
                  ? 'Customized for your body metrics, goals & required dietary macros'
                  : 'Calculated targets & scientific improvements for your goal'}
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

        {step === 'form' ? (
          <form onSubmit={handleRunAnalysis} className="my-4 space-y-4 text-xs">
            {/* Physical Attributes Grid */}
            <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                1. Body Metrics
              </span>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-neutral-400 font-medium">Age</label>
                  <input
                    type="number"
                    min="14"
                    max="99"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono font-bold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    min="35"
                    max="220"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    required
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono font-bold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-medium">Height (cm)</label>
                  <input
                    type="number"
                    min="120"
                    max="240"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    required
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono font-bold focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-[10px] text-neutral-400 font-medium">Gender</label>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-1.5 rounded-xl capitalize text-xs font-bold transition-all ${
                        gender === g
                          ? 'bg-emerald-500 text-black shadow'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Physique Goal Selection */}
            <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                2. Physique & Aesthetics Goal
              </span>

              <div className="space-y-1.5">
                {PHYSIQUE_GOALS.map((g) => {
                  const isSelected = physiqueGoal === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => {
                        sounds.playTap();
                        setPhysiqueGoal(g.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                          : 'bg-neutral-900/60 border-white/5 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{g.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Muscle Focus Areas */}
            <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  3. Muscles to Prioritize
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">Select 2-3</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {FOCUS_AREAS.map((area) => {
                  const isSelected = selectedMuscleFocus.includes(area);
                  return (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-left transition-all border ${
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                          : 'bg-neutral-900 text-neutral-300 border-white/5'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frequency & Level */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-white/5">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Weekly Days</label>
                <select
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white font-bold text-xs"
                >
                  <option value={3}>3 Days (Full Body)</option>
                  <option value={4}>4 Days (Upper / Lower)</option>
                  <option value={5}>5 Days (Push / Pull / Legs)</option>
                  <option value={6}>6 Days (PPL Arnold Split)</option>
                </select>
              </div>

              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-white/5">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Experience</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white font-bold text-xs"
                >
                  <option value="Beginner">Beginner (&lt;1 yr)</option>
                  <option value="Intermediate">Intermediate (1-3 yrs)</option>
                  <option value="Advanced">Advanced (3+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Calculating Dietary & Biomechanical Needs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Required Dietary & Training Protocol</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Results & What You Should Improve Breakdown */
          <div className="my-4 space-y-4 text-xs animate-in fade-in">
            {/* Required Dietary Targets Card */}
            <div className="bg-neutral-900 border border-emerald-500/40 p-4 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Required Daily Dietary Targets</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {analysisResult?.proteinPerKgRatio || 2.2}g Protein / kg
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center mt-3">
                <div className="bg-neutral-950 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-neutral-400 uppercase">Calories</div>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                    {analysisResult?.dailyCalorieTarget}
                  </div>
                  <div className="text-[8px] text-neutral-500">kcal/day</div>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-neutral-400 uppercase">Protein</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {analysisResult?.dailyProteinTarget}g
                  </div>
                  <div className="text-[8px] text-neutral-500">Essential</div>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-neutral-400 uppercase">Carbs</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                    {analysisResult?.dailyCarbTarget}g
                  </div>
                  <div className="text-[8px] text-neutral-500">Fuel</div>
                </div>

                <div className="bg-neutral-950 p-2 rounded-xl border border-white/5">
                  <div className="text-[9px] text-neutral-400 uppercase">Hydration</div>
                  <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                    {analysisResult?.dailyWaterTargetMl}ml
                  </div>
                  <div className="text-[8px] text-neutral-500">Water</div>
                </div>
              </div>
            </div>

            {/* WHAT YOU SHOULD IMPROVE SECTION */}
            <div className="bg-neutral-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center space-x-1.5 text-white font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>What You Should Specifically Improve</span>
              </div>

              <div className="space-y-2">
                {analysisResult?.whatToImprove?.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 bg-black/40 p-2.5 rounded-xl border border-white/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[11px] text-neutral-200 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Summary */}
            {analysisResult?.physiqueStrategySummary && (
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                  AI Scientific Strategy
                </span>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  {analysisResult.physiqueStrategySummary}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="py-2.5 rounded-2xl bg-neutral-800 text-neutral-300 font-bold text-xs hover:bg-neutral-700 transition-all active:scale-95"
              >
                ← Edit Inputs
              </button>

              <button
                type="button"
                onClick={handleApplyAndFinish}
                className="py-2.5 rounded-2xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1"
              >
                <span>Apply to My Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
