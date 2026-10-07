import React, { useState, useRef } from 'react';
import {
  UtensilsCrossed,
  Camera,
  Plus,
  Flame,
  Dumbbell,
  Sparkles,
  Droplets,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Zap,
  RefreshCw,
  Search,
  Sliders,
  Trash2,
  X
} from 'lucide-react';
import { MealItem, UserProfile } from '../types/fitness';
import { sounds } from '../utils/audioEffects';
import { AIAuditModal, AuditData } from './AIAuditModal';

interface NutritionViewProps {
  userProfile: UserProfile;
  loggedMeals: MealItem[];
  workoutCaloriesBurned: number;
  onAddMeal: (meal: MealItem) => void;
  onRemoveMeal?: (mealId: string) => void;
  onUpdateWater: (amountMl: number) => void;
  waterIntakeMl: number;
  onUpdateTargets?: (newTargets: Partial<UserProfile>) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  userProfile,
  loggedMeals,
  workoutCaloriesBurned,
  onAddMeal,
  onRemoveMeal,
  onUpdateWater,
  waterIntakeMl,
  onUpdateTargets,
}) => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isCustomMealModalOpen, setIsCustomMealModalOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState<MealItem['mealType']>('Lunch');
  const [textDescription, setTextDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manual Custom Meal State
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCals, setCustomCals] = useState<number>(450);
  const [customProtein, setCustomProtein] = useState<number>(35);
  const [customCarbs, setCustomCarbs] = useState<number>(45);
  const [customFats, setCustomFats] = useState<number>(12);
  const [customMealType, setCustomMealType] = useState<MealItem['mealType']>('Lunch');

  // Custom Macro Targets State
  const [isCustomizeTargetsOpen, setIsCustomizeTargetsOpen] = useState(false);
  const [customCalorieTarget, setCustomCalorieTarget] = useState(userProfile.dailyCalorieTarget);
  const [customProteinTarget, setCustomProteinTarget] = useState(userProfile.dailyProteinTarget);
  const [customCarbTarget, setCustomCarbTarget] = useState(userProfile.dailyCarbTarget);
  const [customFatTarget, setCustomFatTarget] = useState(userProfile.dailyFatTarget);
  const [customWaterTarget, setCustomWaterTarget] = useState(userProfile.dailyWaterTargetMl);

  // AI Nutrition Audit State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  const handleRunNutritionAudit = async () => {
    setAuditLoading(true);
    setIsAuditModalOpen(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/audit/feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'dietary_and_metabolic_macros',
          customConfig: {
            calorieTarget: customCalorieTarget,
            proteinTarget: customProteinTarget,
            carbTarget: customCarbTarget,
            fatTarget: customFatTarget,
            waterTargetMl: customWaterTarget,
            todayWorkoutBurnKcal: workoutCaloriesBurned,
            todayCaloriesLogged: totalCaloriesLogged,
            todayProteinLogged: totalProteinLogged,
          },
          userContext: {
            weightKg: userProfile.weightKg,
            goal: userProfile.fitnessGoal,
          },
        }),
      });

      const data = await res.json();
      if (data.audit) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Nutrition audit failed:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSaveCustomTargets = () => {
    sounds.playTap();
    if (onUpdateTargets) {
      onUpdateTargets({
        dailyCalorieTarget: customCalorieTarget,
        dailyProteinTarget: customProteinTarget,
        dailyCarbTarget: customCarbTarget,
        dailyFatTarget: customFatTarget,
        dailyWaterTargetMl: customWaterTarget,
      });
    }
    setIsCustomizeTargetsOpen(false);
  };

  // Compute Daily Aggregates
  const totalCaloriesLogged = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinLogged = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbsLogged = loggedMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFatsLogged = loggedMeals.reduce((acc, m) => acc + m.fats, 0);

  // Dynamic Adjusted Calorie Budget with Workout Synergy
  const adjustedCalorieBudget = userProfile.dailyCalorieTarget + workoutCaloriesBurned;
  const remainingCalories = Math.max(0, adjustedCalorieBudget - totalCaloriesLogged);

  // Macro Target Percentages
  const caloriePercent = Math.min(100, Math.round((totalCaloriesLogged / adjustedCalorieBudget) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProteinLogged / userProfile.dailyProteinTarget) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbsLogged / userProfile.dailyCarbTarget) * 100));
  const fatsPercent = Math.min(100, Math.round((totalFatsLogged / userProfile.dailyFatTarget) * 100));

  // Quick Preset Sample Meals
  const presetMeals = [
    {
      name: 'Wild Salmon & Quinoa Bowl',
      type: 'Dinner' as const,
      desc: '180g Atlantic wild salmon, steamed tri-color quinoa, roasted broccoli, avocado slice',
      cals: 580,
      p: 46,
      c: 48,
      f: 22,
    },
    {
      name: 'Post-Workout Whey & Oatmeal',
      type: 'Post-Workout Snack' as const,
      desc: '50g rolled oats with 1 scoop vanilla isolate whey, 1 sliced banana, 15g raw honey',
      cals: 420,
      p: 38,
      c: 58,
      f: 6,
    },
    {
      name: 'Ribeye Steak & Sweet Potato',
      type: 'Dinner' as const,
      desc: '220g grass-fed ribeye steak, roasted Japanese sweet potato with cinnamon and sea salt',
      cals: 690,
      p: 54,
      c: 42,
      f: 32,
    },
    {
      name: 'Greek Yogurt & Berry Parfait',
      type: 'Breakfast' as const,
      desc: '250g 0% Greek yogurt, mixed organic blueberries, 20g crushed walnuts, chia seeds',
      cals: 340,
      p: 32,
      c: 28,
      f: 12,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeAndLog = async () => {
    if (!textDescription && !previewImage) return;

    setIsAnalyzing(true);
    sounds.playTap();

    try {
      const res = await fetch('/api/nutrition/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewImage,
          textDescription,
          mealType: selectedMealCategory,
        }),
      });

      const data = await res.json();
      if (data.meal) {
        const newMeal: MealItem = {
          id: `meal_${Date.now()}`,
          foodName: data.meal.foodName || textDescription || 'Logged Meal',
          mealType: selectedMealCategory,
          calories: data.meal.calories || 500,
          protein: data.meal.protein || 35,
          carbs: data.meal.carbs || 45,
          fats: data.meal.fats || 15,
          fiber: data.meal.fiber || 5,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          imagePreview: previewImage || undefined,
          fitnessImpact: data.meal.fitnessImpact || 'High Protein Muscle Recovery',
          coachVerdict: data.meal.coachVerdict,
          ingredientsDetected: data.meal.ingredientsDetected,
        };

        onAddMeal(newMeal);
        sounds.playSuccessFanfare();
        setIsScanModalOpen(false);
        setPreviewImage(null);
        setTextDescription('');
      }
    } catch (err) {
      console.error('Error logging meal:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogPreset = (preset: typeof presetMeals[0]) => {
    sounds.playTap();
    const newMeal: MealItem = {
      id: `meal_${Date.now()}`,
      foodName: preset.name,
      mealType: preset.type,
      calories: preset.cals,
      protein: preset.p,
      carbs: preset.c,
      fats: preset.f,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fitnessImpact: 'Targeted Macro Fuel',
      coachVerdict: `Optimally balanced for ${preset.type.toLowerCase()}. Delivers high bioavailability protein alongside glycogen replenishment.`,
    };
    onAddMeal(newMeal);
    sounds.playSuccessFanfare();
  };

  return (
    <div className="flex flex-col h-full bg-[#07080c] text-white overflow-y-auto pb-28 pt-2">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Metabolic Engine
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Dietary & Macro Tracking
          </h1>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              sounds.playTap();
              setIsCustomMealModalOpen(true);
            }}
            className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
            title="Add Custom Food / Meal Item"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Meal</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setIsCustomizeTargetsOpen(true);
            }}
            className="flex items-center space-x-1 bg-neutral-900 border border-white/10 hover:border-emerald-500/50 text-neutral-200 hover:text-emerald-400 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Customize Daily Target Macros"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Targets</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setIsScanModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-emerald-500/20"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Scan</span>
          </button>
        </div>
      </div>

      {/* Required Dietary Targets & What to Improve Banner */}
      <div className="mx-5 my-2.5 p-3.5 bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-[#12141e] border border-emerald-500/30 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Required Dietary Targets
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            Goal: {userProfile.physiqueGoal || userProfile.fitnessGoal}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div className="bg-neutral-950/80 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Daily Protein Required</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-sm font-bold text-emerald-400 font-mono">{userProfile.dailyProteinTarget}g</span>
              <span className="text-[10px] text-neutral-400">
                ({totalProteinLogged}g logged • {Math.max(0, userProfile.dailyProteinTarget - totalProteinLogged)}g left)
              </span>
            </div>
          </div>

          <div className="bg-neutral-950/80 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Daily Calorie Target</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-sm font-bold text-amber-300 font-mono">{adjustedCalorieTarget} kcal</span>
              <span className="text-[10px] text-neutral-400">({remainingCalories} kcal left)</span>
            </div>
          </div>
        </div>

        {/* What to Improve Tip */}
        <div className="mt-2 text-[11px] text-neutral-300 bg-black/40 p-2 rounded-xl border border-white/5 flex items-start space-x-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-emerald-400 font-bold">What to improve: </span>
            {userProfile.whatToImprove?.[0] ||
              `Hit at least ${userProfile.dailyProteinTarget}g protein across 4 meals to keep muscle protein synthesis peaked.`}
          </p>
        </div>
      </div>

      {/* Dynamic Workout Synergy Banner */}
      <div className="mx-5 my-3 p-3.5 bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-cyan-950/40 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Flame className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Workout Energy Sync</span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                +{workoutCaloriesBurned} KCAL
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Active workout calorie burn dynamically increased your daily calorie allowance.
            </p>
          </div>
        </div>
      </div>

      {/* AI Nutrition Audit Quick Bar */}
      <div className="mx-5 mb-3 flex items-center justify-between bg-neutral-900/60 border border-white/10 p-2.5 px-3.5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-neutral-200">
            AI Metabolic Audit & Guidance
          </span>
        </div>
        <button
          onClick={handleRunNutritionAudit}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-black font-bold text-xs px-3 py-1 rounded-xl shadow-md transition-all active:scale-95"
        >
          Audit Nutrition (Do's & Don'ts)
        </button>
      </div>

      {/* Main Calorie & Macro Target Rings Card */}
      <div className="mx-5 p-4 bg-neutral-900/80 border border-white/10 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Remaining Energy Budget
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-3xl font-black font-mono text-white tracking-tight">
                {remainingCalories}
              </span>
              <span className="text-xs text-neutral-400 font-medium">/ {adjustedCalorieBudget} kcal</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Burn vs Consumed</span>
            <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
              {totalCaloriesLogged} kcal eaten
            </div>
          </div>
        </div>

        {/* 3 Macro Target Bars (Apple Health style) */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {/* Protein */}
          <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-400">Protein</span>
              <span className="text-white font-mono text-[10px]">{proteinPercent}%</span>
            </div>
            <div className="text-lg font-black font-mono text-white mt-1">
              {totalProteinLogged}g
            </div>
            <span className="text-[10px] text-neutral-400">Goal: {userProfile.dailyProteinTarget}g</span>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-cyan-400">Carbs</span>
              <span className="text-white font-mono text-[10px]">{carbsPercent}%</span>
            </div>
            <div className="text-lg font-black font-mono text-white mt-1">
              {totalCarbsLogged}g
            </div>
            <span className="text-[10px] text-neutral-400">Goal: {userProfile.dailyCarbTarget}g</span>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-rose-400">Fats</span>
              <span className="text-white font-mono text-[10px]">{fatsPercent}%</span>
            </div>
            <div className="text-lg font-black font-mono text-white mt-1">
              {totalFatsLogged}g
            </div>
            <span className="text-[10px] text-neutral-400">Goal: {userProfile.dailyFatTarget}g</span>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${fatsPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Water Hydration Quick Logger */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-neutral-300 font-medium">
              Hydration: <span className="font-mono font-bold text-white">{waterIntakeMl} ml</span> / {userProfile.dailyWaterTargetMl} ml
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onUpdateWater(250);
            }}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all active:scale-95"
          >
            +250 ml
          </button>
        </div>
      </div>

      {/* Quick Tap Athletic Presets */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Quick Fitness Meal Presets
          </h2>
          <span className="text-[10px] text-emerald-400 font-medium">1-Tap Log</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
          {presetMeals.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLogPreset(preset)}
              className="bg-neutral-900/70 border border-white/5 hover:border-emerald-500/40 p-3 rounded-2xl text-left transition-all active:scale-95 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                  {preset.type}
                </span>
                <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-400">
                  {preset.cals} kcal
                </span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1 truncate">
                {preset.name}
              </h3>
              <div className="flex items-center space-x-2 text-[10px] text-neutral-400 font-mono mt-1">
                <span>P: {preset.p}g</span>
                <span>C: {preset.c}g</span>
                <span>F: {preset.f}g</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Logged Meals Feed */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Today's Logged Meals ({loggedMeals.length})
          </h2>
          <span className="text-xs text-neutral-400">Total: {totalCaloriesLogged} kcal</span>
        </div>

        {loggedMeals.length === 0 ? (
          <div className="mt-3 p-8 bg-neutral-900/40 border border-white/5 rounded-2xl text-center">
            <UtensilsCrossed className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 mt-2 font-medium">
              No meals logged yet today.
            </p>
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
            >
              Scan meal with AI Vision
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5">
            {loggedMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {meal.imagePreview ? (
                      <img
                        src={meal.imagePreview}
                        alt={meal.foodName}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-white/5 flex items-center justify-center text-emerald-400">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">
                          {meal.mealType}
                        </span>
                        <span className="text-[10px] text-neutral-500">• {meal.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{meal.foodName}</h4>
                      <div className="flex items-center space-x-2 text-[11px] font-mono mt-1">
                        <span className="text-amber-300 font-bold">{meal.calories} kcal</span>
                        <span className="text-neutral-500">|</span>
                        <span className="text-emerald-400">P: {meal.protein}g</span>
                        <span className="text-cyan-400">C: {meal.carbs}g</span>
                        <span className="text-rose-400">F: {meal.fats}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {meal.fitnessImpact}
                    </span>

                    {onRemoveMeal && (
                      <button
                        onClick={() => {
                          sounds.playTap();
                          onRemoveMeal(meal.id);
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded-lg hover:bg-neutral-800 transition-all active:scale-95"
                        title="Delete meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {meal.coachVerdict && (
                  <p className="text-[11px] text-neutral-300 bg-black/40 p-2.5 rounded-xl border border-white/5 mt-2.5 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Nutrition Insight: </span>
                    {meal.coachVerdict}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Vision Food Scanner Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Vision Meal Scanner</h3>
                  <p className="text-[10px] text-neutral-400">Gemini 3.8 Flash Multimodal</p>
                </div>
              </div>
              <button
                onClick={() => setIsScanModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* Category */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Post-Workout Snack'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedMealCategory(cat)}
                      className={`py-1.5 rounded-xl text-[10px] font-semibold border transition-all text-center truncate ${
                        selectedMealCategory === cat
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-neutral-900 border-white/10 text-neutral-400'
                      }`}
                    >
                      {cat === 'Post-Workout Snack' ? 'Post-Wkt' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload / Camera Area */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Plate Photo (Camera or Gallery)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {previewImage ? (
                  <div className="relative mt-2 rounded-2xl overflow-hidden border border-emerald-500/40 h-36">
                    <img
                      src={previewImage}
                      alt="Meal Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full mt-2 border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col items-center justify-center text-neutral-400 hover:text-emerald-400 transition-all bg-neutral-900/40"
                  >
                    <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Snap or Upload Food Photo</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">AI automatically scans portions & macros</span>
                  </button>
                )}
              </div>

              {/* Text Description */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Description / Natural Language
                </label>
                <textarea
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  placeholder="e.g. 200g chicken breast with 1 cup jasmine rice, steamed broccoli and olive oil"
                  rows={2}
                  className="w-full mt-1.5 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyzeAndLog}
              disabled={isAnalyzing || (!textDescription && !previewImage)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Macros with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Log to Daily Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Customize Daily Targets Modal */}
      {isCustomizeTargetsOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e111a] border border-white/15 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Customize Macro Targets</h3>
                  <p className="text-[10px] text-neutral-400">Personalized Calorie & Nutrient Budget</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeTargetsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 my-3.5 text-xs">
              {/* Daily Calories */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Daily Calorie Target
                  </label>
                  <span className="font-mono text-amber-400 font-bold">{customCalorieTarget} kcal</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={4500}
                  step={50}
                  value={customCalorieTarget}
                  onChange={(e) => setCustomCalorieTarget(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Protein Target */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Protein Target (g)
                  </label>
                  <span className="font-mono text-emerald-400 font-bold">{customProteinTarget}g</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={280}
                  step={5}
                  value={customProteinTarget}
                  onChange={(e) => setCustomProteinTarget(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Carbs Target */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Carbohydrate Target (g)
                  </label>
                  <span className="font-mono text-cyan-400 font-bold">{customCarbTarget}g</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={customCarbTarget}
                  onChange={(e) => setCustomCarbTarget(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Fats Target */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Fats Target (g)
                  </label>
                  <span className="font-mono text-rose-400 font-bold">{customFatTarget}g</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={140}
                  step={5}
                  value={customFatTarget}
                  onChange={(e) => setCustomFatTarget(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Hydration Target */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Water Hydration Target
                  </label>
                  <span className="font-mono text-cyan-300 font-bold">{customWaterTarget} ml</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={5000}
                  step={250}
                  value={customWaterTarget}
                  onChange={(e) => setCustomWaterTarget(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={handleRunNutritionAudit}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-black py-2.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Audit Custom Targets (Do's & Don'ts)</span>
              </button>

              <button
                onClick={handleSaveCustomTargets}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all"
              >
                Save Custom Target Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Custom Meal Modal */}
      {isCustomMealModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-white/15 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Log Custom Meal</span>
              </h3>
              <button
                onClick={() => setIsCustomMealModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customFoodName.trim()) return;
                sounds.playTap();

                const newMeal: MealItem = {
                  id: `meal_${Date.now()}`,
                  foodName: customFoodName.trim(),
                  mealType: customMealType,
                  calories: customCals,
                  protein: customProtein,
                  carbs: customCarbs,
                  fats: customFats,
                  fiber: 5,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  fitnessImpact: 'Custom Macro Fuel',
                  coachVerdict: `Logged custom ${customFoodName}: ${customProtein}g protein providing high amino acid support for active training.`,
                };

                onAddMeal(newMeal);
                setIsCustomMealModalOpen(false);
                setCustomFoodName('');
              }}
              className="my-3 space-y-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Food / Meal Name</label>
                <input
                  type="text"
                  required
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  placeholder="e.g. Greek Yogurt & Honey Bowl"
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Meal Category</label>
                <select
                  value={customMealType}
                  onChange={(e) => setCustomMealType(e.target.value as any)}
                  className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Pre-Workout">Pre-Workout Fuel</option>
                  <option value="Post-Workout">Post-Workout Recovery</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={customCals}
                    onChange={(e) => setCustomCals(Number(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-cyan-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Fats (g)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={customFats}
                    onChange={(e) => setCustomFats(Number(e.target.value))}
                    className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-rose-400 font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-2xl text-xs transition-all mt-2 active:scale-95 shadow-md shadow-emerald-500/20"
              >
                Add Meal to Today's Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Nutrition Audit Modal */}
      <AIAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="AI Metabolic & Macro Audit"
        subtitle="Dietary Plan & Training Fuel Check"
        auditData={auditData}
        isLoading={auditLoading}
        onReanalyze={handleRunNutritionAudit}
      />
    </div>
  );
};
