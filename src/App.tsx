/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { IOSContainer } from './components/IOSContainer';
import { TabType } from './components/IOSTabBar';
import { ComputerVisionTracker } from './components/ComputerVisionTracker';
import { TrainingPlanView } from './components/TrainingPlanView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { AICoachChat } from './components/AICoachChat';
import { CommunityChatView } from './components/CommunityChatView';
import { AuthModal } from './components/AuthModal';
import { LanguageModal } from './components/LanguageModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LanguageProvider } from './utils/i18n';
import { AuthUser } from './types/auth';
import {
  UserProfile,
  TrainingPlan,
  CompletedSet,
  MealItem,
  DynamicIslandState,
  ExerciseItem
} from './types/fitness';
import { ExerciseType } from './utils/computerVision';
import { sounds } from './utils/audioEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('workout');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('znjy_track_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'usr_alex',
      name: 'Alex Vance',
      username: 'alex_lift',
      email: 'alex.vance@gym.io',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true,
      joinDate: 'Jan 2024',
      streakDays: 7,
      fitnessLevel: 'Advanced',
      currentBadge: 'Kinetic Master',
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // User Profile with Onboarding State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('znjy_track_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'Alex Vance',
      weightKg: 78,
      heightCm: 182,
      age: 24,
      gender: 'male',
      fitnessGoal: 'Aesthetic V-Taper (Wide Shoulders & Lats)',
      physiqueGoal: 'Aesthetic V-Taper (Wide Shoulders & Lats)',
      experienceLevel: 'Intermediate',
      dailyCalorieTarget: 2650,
      dailyProteinTarget: 175,
      dailyCarbTarget: 290,
      dailyFatTarget: 70,
      dailyWaterTargetMl: 3600,
      whatToImprove: [
        'Increase daily protein intake towards 175g+ across 4 meals to keep muscle protein synthesis peaked.',
        'Prioritize Upper Clavicular Chest and Lateral Deltoids to maximize the aesthetic V-Taper ratio.',
        'Maintain deep 90°+ knee flexion on squats and control 3-second eccentric tempo on presses.',
      ],
      targetMuscleAreas: ['Chest & Shoulders', 'Back & Lats'],
      onboardingCompleted: true,
    };
  });

  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('znjy_track_profile', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('znjy_track_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setUserProfile((prev) => ({ ...prev, name: user.name }));

    // If new user or without profile, open onboarding
    const saved = localStorage.getItem('znjy_track_profile');
    if (!saved) {
      setIsOnboardingModalOpen(true);
    }
  };

  const handleLogout = () => {
    const guestUser: AuthUser = {
      id: 'usr_guest',
      name: 'Guest Lifter',
      username: 'guest',
      email: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: false,
      joinDate: 'Today',
      streakDays: 0,
      fitnessLevel: 'Intermediate',
      currentBadge: 'Rookie Lifter',
    };
    setCurrentUser(guestUser);
    try {
      localStorage.removeItem('znjy_track_user');
    } catch {
      // ignore
    }
  };

  // Default Initial Training Plan
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>({
    planName: 'znjy track Kinetic Hypertrophy Split',
    philosophy: 'Periodized high-tension training focused on computer vision tracked full range-of-motion lifts and progressive overload.',
    weeklyFrequency: 4,
    recommendedCalorieAdjustment: '+300 kcal moderate surplus with 1.8g/kg protein',
    days: [
      {
        dayNumber: 1,
        dayName: 'Day 1: Lower Body Kinetic Power (Legs & Core)',
        focus: 'Quad recruitment, hamstring deceleration & glute hip drive',
        estimatedDuration: '50 mins',
        exercises: [
          {
            id: 'ex_1',
            name: 'Barbell Back Squats',
            targetSets: 4,
            targetReps: '8-10',
            rpe: '8',
            restSeconds: 90,
            cvTrackable: true,
            cvExerciseType: 'squat',
            primaryMuscle: 'Quadriceps & Glutes',
            coachingCue: 'Break at knees and hips together, maintain vertical torso posture.',
            biomechanicNotes: 'Ensure hip crease drops below top of patella for true 90°+ depth.'
          },
          {
            id: 'ex_2',
            name: 'Walking Dumbbell Lunges',
            targetSets: 3,
            targetReps: '10-12 per leg',
            rpe: '8',
            restSeconds: 90,
            cvTrackable: true,
            cvExerciseType: 'lunge',
            primaryMuscle: 'Quads & Gluteus Medius',
            coachingCue: 'Drive through front heel, keep front knee aligned with second toe.',
            biomechanicNotes: 'Maintain pelvis level to avoid hip drop.'
          },
          {
            id: 'ex_3',
            name: 'Hanging Knee Raises & Plank',
            targetSets: 3,
            targetReps: '15 reps / 45s',
            rpe: '9',
            restSeconds: 60,
            cvTrackable: true,
            cvExerciseType: 'pushup',
            primaryMuscle: 'Rectus Abdominis',
            coachingCue: 'Posterior pelvic tilt, avoid swinging hips.',
            biomechanicNotes: 'Engage transverse abdominis throughout.'
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Day 2: Upper Body Kinetic Push (Chest, Delts & Triceps)',
        focus: 'Horizontal & vertical pressing with joint stack alignment',
        estimatedDuration: '48 mins',
        exercises: [
          {
            id: 'ex_4',
            name: 'Incline Dumbbell Press',
            targetSets: 4,
            targetReps: '8-10',
            rpe: '8.5',
            restSeconds: 90,
            cvTrackable: true,
            cvExerciseType: 'pushup',
            primaryMuscle: 'Clavicular Pectoralis Major',
            coachingCue: 'Wrists directly above elbows at lowest turnaround point.',
            biomechanicNotes: 'Control the descent for 3 seconds to maximize mechanical tension.'
          },
          {
            id: 'ex_5',
            name: 'Overhead Dumbbell Press',
            targetSets: 3,
            targetReps: '10-12',
            rpe: '8',
            restSeconds: 90,
            cvTrackable: true,
            cvExerciseType: 'shoulder_press',
            primaryMuscle: 'Anterior & Lateral Deltoids',
            coachingCue: 'Lock core tight to avoid lumbar hyperextension.',
            biomechanicNotes: 'Full overhead lockout with bicep adjacent to ear.'
          },
          {
            id: 'ex_6',
            name: 'Deficit Push-Ups',
            targetSets: 3,
            targetReps: '12-15',
            rpe: '9',
            restSeconds: 60,
            cvTrackable: true,
            cvExerciseType: 'pushup',
            primaryMuscle: 'Chest & Triceps',
            coachingCue: 'Maintain rigid plank posture from heels to crown.',
            biomechanicNotes: 'Chest touches ground before lockout.'
          }
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Day 3: Upper Body Kinetic Pull (Back & Biceps)',
        focus: 'Scapular retraction, latissimus engagement & arm hypertrophy',
        estimatedDuration: '50 mins',
        exercises: [
          {
            id: 'ex_7',
            name: 'Chest Supported Dumbbell Rows',
            targetSets: 4,
            targetReps: '10-12',
            rpe: '8',
            restSeconds: 90,
            cvTrackable: true,
            cvExerciseType: 'bicep_curl',
            primaryMuscle: 'Latissimus Dorsi & Rhomboids',
            coachingCue: 'Pull with elbows towards hips, squeeze scapulae for 1s pause.',
            biomechanicNotes: 'Eliminates momentum, isolating mid-back musculature.'
          },
          {
            id: 'ex_8',
            name: 'Standing Supinated Bicep Curls',
            targetSets: 4,
            targetReps: '10-12',
            rpe: '8.5',
            restSeconds: 75,
            cvTrackable: true,
            cvExerciseType: 'bicep_curl',
            primaryMuscle: 'Biceps Brachii',
            coachingCue: 'Keep upper arms pinned to torso, rotate pinkies upward at peak.',
            biomechanicNotes: 'Computer vision monitors elbow stability to prevent shoulder swing.'
          }
        ]
      }
    ],
    recoveryProtocol: 'Nightly 8 hours sleep, 10-minute post-workout dynamic hip opening, minimum 140g protein daily.'
  });

  // Currently Selected Exercise for Computer Vision
  const [currentExerciseForCV, setCurrentExerciseForCV] = useState<ExerciseItem | undefined>({
    id: 'ex_1',
    name: 'Barbell Back Squats',
    targetSets: 4,
    targetReps: '8-10',
    rpe: '8',
    restSeconds: 90,
    cvTrackable: true,
    cvExerciseType: 'squat',
    primaryMuscle: 'Quadriceps & Glutes',
    coachingCue: 'Break at knees and hips together, maintain vertical torso posture.',
    biomechanicNotes: 'Ensure hip crease drops below top of patella for true 90°+ depth.'
  });

  // Completed Sets History
  const [completedSets, setCompletedSets] = useState<{
    exerciseName: string;
    exerciseType: string;
    set: CompletedSet;
  }[]>([
    {
      exerciseName: 'Barbell Back Squats',
      exerciseType: 'squat',
      set: {
        setNumber: 1,
        reps: 10,
        averageRom: 96,
        formScore: 94,
        cadenceSeconds: 2.3,
        flawsDetected: [],
        durationSeconds: 24,
        timestamp: Date.now() - 3600000,
        aiCoachFeedback: {
          summaryRating: 'Excellent',
          keyHighlight: 'Flawless hip depth below parallel with pristine knee alignment.',
          formCorrections: [],
          muscleFatigueAnalysis: 'Optimal quad motor unit recruitment.',
          nextSetRecommendation: 'Add 2.5kg or increase pause time.'
        }
      }
    }
  ]);

  // Total Workout Calories Burned
  const [workoutCaloriesBurned, setWorkoutCaloriesBurned] = useState<number>(310);

  // Daily Logged Meals
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>([
    {
      id: 'meal_1',
      foodName: 'Avocado Toast & Pasture Eggs',
      mealType: 'Breakfast',
      calories: 460,
      protein: 26,
      carbs: 38,
      fats: 22,
      fiber: 6,
      timestamp: '8:15 AM',
      fitnessImpact: 'Clean Sustained Energy',
      coachVerdict: 'High micronutrient density with healthy fats and complete amino acid profile.',
    },
    {
      id: 'meal_2',
      foodName: 'Grilled Chicken & Sweet Potato Power Bowl',
      mealType: 'Lunch',
      calories: 590,
      protein: 52,
      carbs: 58,
      fats: 16,
      fiber: 7,
      timestamp: '1:00 PM',
      fitnessImpact: 'High Protein Muscle Recovery',
      coachVerdict: 'Ideal training fuel providing >3g leucine to trigger muscle protein synthesis.',
    }
  ]);

  // Water intake
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(2250);

  // Dynamic Island State
  const [dynamicIslandState, setDynamicIslandState] = useState<DynamicIslandState>({
    mode: 'idle'
  });

  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);

  // Rest timer countdown effect
  useEffect(() => {
    if (restTimerSeconds === null || restTimerSeconds <= 0) return;

    setDynamicIslandState({
      mode: 'rest_timer',
      timerSecondsRemaining: restTimerSeconds
    });

    const timer = setInterval(() => {
      setRestTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          sounds.playCountdownBeep(true);
          setDynamicIslandState({ mode: 'idle' });
          return null;
        }
        setDynamicIslandState({
          mode: 'rest_timer',
          timerSecondsRemaining: prev - 1
        });
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restTimerSeconds]);

  // Handler: When a set is finished in CV tracker
  const handleSetCompleted = (set: CompletedSet, exerciseName: string, exerciseType: ExerciseType) => {
    setCompletedSets((prev) => [
      { exerciseName, exerciseType, set },
      ...prev
    ]);
    const addedCals = Math.round(set.reps * 2.5);
    setWorkoutCaloriesBurned((prev) => prev + addedCals);
  };

  // Handler: Start rest timer
  const handleStartRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
  };

  // Handler: Add a logged meal
  const handleAddMeal = (meal: MealItem) => {
    setLoggedMeals((prev) => [meal, ...prev]);

    // Flash meal alert in Dynamic Island
    setDynamicIslandState({
      mode: 'meal_alert',
      title: meal.foodName,
      subtitle: `+${meal.calories} kcal`
    });

    setTimeout(() => {
      setDynamicIslandState((curr) => curr.mode === 'meal_alert' ? { mode: 'idle' } : curr);
    }, 4500);
  };

  // Handler: Remove/delete a logged meal
  const handleRemoveMeal = (mealId: string) => {
    sounds.playTap();
    setLoggedMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  // Handler: Add water
  const handleUpdateWater = (amountMl: number) => {
    setWaterIntakeMl((prev) => Math.min(6000, prev + amountMl));
  };

  // Handler: Select exercise from plan and switch to CV tab
  const handleSelectExerciseForCV = (exercise: ExerciseItem) => {
    setCurrentExerciseForCV(exercise);
    setActiveTab('workout');
    setDynamicIslandState({
      mode: 'workout_tracking',
      currentRep: 0,
      title: exercise.name
    });
  };

  return (
    <LanguageProvider>
      <IOSContainer
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        dynamicIslandState={dynamicIslandState}
        isWorkoutActive={dynamicIslandState.mode === 'workout_tracking'}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onDynamicIslandTap={() => {
          if (dynamicIslandState.mode === 'rest_timer') {
            // Tap dynamic island to dismiss rest timer early
            setRestTimerSeconds(null);
            setDynamicIslandState({ mode: 'idle' });
          }
        }}
      >
        {activeTab === 'workout' && (
          <ComputerVisionTracker
            currentExercise={
              currentExerciseForCV
                ? {
                    name: currentExerciseForCV.name,
                    type: currentExerciseForCV.cvExerciseType,
                    targetReps: currentExerciseForCV.targetReps,
                    rpe: currentExerciseForCV.rpe,
                    targetSets: currentExerciseForCV.targetSets,
                    restSeconds: currentExerciseForCV.restSeconds,
                  }
                : undefined
            }
            onSetCompleted={handleSetCompleted}
            onStartRestTimer={handleStartRestTimer}
          />
        )}

        {activeTab === 'plan' && (
          <TrainingPlanView
            plan={trainingPlan}
            onUpdatePlan={setTrainingPlan}
            onSelectExerciseForCV={handleSelectExerciseForCV}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            userProfile={userProfile}
            loggedMeals={loggedMeals}
            workoutCaloriesBurned={workoutCaloriesBurned}
            onAddMeal={handleAddMeal}
            onRemoveMeal={handleRemoveMeal}
            onUpdateWater={handleUpdateWater}
            waterIntakeMl={waterIntakeMl}
            onUpdateTargets={(newTargets) => setUserProfile((prev) => ({ ...prev, ...newTargets }))}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            completedSets={completedSets}
            totalCaloriesBurned={workoutCaloriesBurned}
            userProfile={userProfile}
            loggedMeals={loggedMeals}
          />
        )}

        {activeTab === 'chat' && (
          <CommunityChatView
            currentUser={currentUser}
            latestCompletedSet={
              completedSets.length > 0
                ? {
                    exerciseName: completedSets[0].exerciseName,
                    set: completedSets[0].set,
                  }
                : null
            }
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachChat
            userContext={{
              userProfile,
              activePlan: trainingPlan.planName,
              completedSetsToday: completedSets.length,
              totalCaloriesBurned: workoutCaloriesBurned,
              loggedCalories: loggedMeals.reduce((a, b) => a + b.calories, 0),
              loggedProtein: loggedMeals.reduce((a, b) => a + b.protein, 0),
            }}
          />
        )}
      </IOSContainer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        currentUserProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />
    </LanguageProvider>
  );
}
