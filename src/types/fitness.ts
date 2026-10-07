import { ExerciseType, FormMetric, RepData } from '../utils/computerVision';

export interface UserProfile {
  name: string;
  weightKg: number;
  heightCm: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoal: 'Hypertrophy & Muscle Gain' | 'Strength & Power' | 'Athletic Conditioning & Lean' | 'Body Recomposition' | string;
  physiqueGoal?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  dailyWaterTargetMl: number;
  whatToImprove?: string[];
  targetMuscleAreas?: string[];
  onboardingCompleted?: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  rpe: string;
  restSeconds: number;
  cvTrackable: boolean;
  cvExerciseType: ExerciseType;
  primaryMuscle: string;
  coachingCue: string;
  biomechanicNotes: string;
  completedSets?: CompletedSet[];
}

export interface TrainingDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  estimatedDuration: string;
  exercises: ExerciseItem[];
}

export interface TrainingPlan {
  planName: string;
  philosophy: string;
  weeklyFrequency: number;
  recommendedCalorieAdjustment: string;
  days: TrainingDay[];
  recoveryProtocol: string;
}

export interface CompletedSet {
  setNumber: number;
  reps: number;
  weightKg?: number;
  averageRom: number;
  formScore: number;
  cadenceSeconds: number;
  flawsDetected: string[];
  durationSeconds: number;
  timestamp: number;
  aiCoachFeedback?: {
    summaryRating: string;
    keyHighlight: string;
    formCorrections: string[];
    muscleFatigueAnalysis: string;
    nextSetRecommendation: string;
  };
}

export interface WorkoutSession {
  id: string;
  title: string;
  dayName: string;
  startTime: number;
  endTime?: number;
  totalVolumeKg: number;
  totalReps: number;
  caloriesBurned: number;
  completedSets: {
    exerciseName: string;
    exerciseType: ExerciseType;
    set: CompletedSet;
  }[];
  overallFormScore: number;
}

export interface MealIngredient {
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface MealItem {
  id: string;
  foodName: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Post-Workout Snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  timestamp: string;
  imagePreview?: string;
  fitnessImpact: string;
  coachVerdict?: string;
  ingredientsDetected?: MealIngredient[];
}

export interface DynamicIslandState {
  mode: 'idle' | 'workout_tracking' | 'rest_timer' | 'meal_alert';
  title?: string;
  subtitle?: string;
  timerSecondsRemaining?: number;
  currentRep?: number;
  formStatus?: 'optimal' | 'warning';
}
