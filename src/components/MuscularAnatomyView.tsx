import React, { useState } from 'react';
import {
  Activity,
  Dumbbell,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  Info,
  ShieldCheck,
  Flame,
  X
} from 'lucide-react';
import { ExerciseItem } from '../types/fitness';
import { ExerciseType } from '../utils/computerVision';
import { sounds } from '../utils/audioEffects';

export interface MuscleGroupDetail {
  id: string;
  name: string;
  latinName: string;
  view: 'front' | 'back' | 'both';
  physiqueImpact: string;
  recoveryStatus: number; // 0 to 100%
  recommendedExercises: {
    name: string;
    sets: number;
    reps: string;
    rpe: string;
    type: ExerciseType;
    focusCue: string;
  }[];
  aiBiomechanicTip: string;
  optimalRepRange: string;
}

export const MUSCLE_GROUPS: Record<string, MuscleGroupDetail> = {
  chest: {
    id: 'chest',
    name: 'Pectorals (Chest)',
    latinName: 'Pectoralis Major & Minor',
    view: 'front',
    physiqueImpact: 'Creates the full upper-torso armor shelf and athletic chest line.',
    recoveryStatus: 92,
    recommendedExercises: [
      {
        name: 'Incline Dumbbell Press',
        sets: 4,
        reps: '8-10',
        rpe: '8.5',
        type: 'pushup',
        focusCue: 'Touch dumbbells together at peak, 3s eccentric stretch.',
      },
      {
        name: 'Deficit Push-Ups',
        sets: 3,
        reps: '12-15',
        rpe: '9',
        type: 'pushup',
        focusCue: 'Chest grazes floor before locking out at top.',
      },
      {
        name: 'Low-to-High Cable Flyes',
        sets: 3,
        reps: '12-15',
        rpe: '8',
        type: 'pushup',
        focusCue: 'Isolates clavicular upper pectoralis head.',
      },
    ],
    aiBiomechanicTip: 'Set bench to 30° incline rather than 45° to minimize front deltoid dominance and keep tension centered on upper clavicular fibers.',
    optimalRepRange: '6-12 Reps (Mechanical Tension & Stretch)',
  },
  shoulders: {
    id: 'shoulders',
    name: 'Deltoids (Shoulders)',
    latinName: 'Anterior, Lateral & Posterior Deltoid',
    view: 'both',
    physiqueImpact: 'Caps the upper body frame to establish broad shoulders and wide V-taper ratio.',
    recoveryStatus: 85,
    recommendedExercises: [
      {
        name: 'Overhead Dumbbell Press',
        sets: 4,
        reps: '8-10',
        rpe: '8.5',
        type: 'shoulder_press',
        focusCue: 'Keep core braced, press directly overhead to ear alignment.',
      },
      {
        name: 'Strict Dumbbell Lateral Raises',
        sets: 4,
        reps: '12-15',
        rpe: '9',
        type: 'shoulder_press',
        focusCue: 'Lead with elbows, slight 15° forward torso tilt.',
      },
      {
        name: 'Rear Delt Face Pulls',
        sets: 3,
        reps: '15-20',
        rpe: '8',
        type: 'shoulder_press',
        focusCue: 'Externally rotate forearms backward at peak squeeze.',
      },
    ],
    aiBiomechanicTip: 'Lateral deltoids have a predominantly pennate fiber structure. Combine heavy 8-rep presses with high-volume 15-20 rep lateral raises for 3D shoulder capping.',
    optimalRepRange: '10-20 Reps (Metabolic Stress & High Volume)',
  },
  lats: {
    id: 'lats',
    name: 'Lats & Upper Back',
    latinName: 'Latissimus Dorsi & Rhomboids',
    view: 'back',
    physiqueImpact: 'The wings of the torso; expands upper back width for the aesthetic V-taper.',
    recoveryStatus: 95,
    recommendedExercises: [
      {
        name: 'Wide-Grip Lat Pulldowns / Pull-Ups',
        sets: 4,
        reps: '8-10',
        rpe: '8.5',
        type: 'bicep_curl',
        focusCue: 'Drive elbows down to hips, depress scapulae before pulling.',
      },
      {
        name: 'Chest Supported Dumbbell Rows',
        sets: 4,
        reps: '10-12',
        rpe: '8',
        type: 'bicep_curl',
        focusCue: 'Eliminates momentum, full 1s isometric squeeze at apex.',
      },
      {
        name: 'Single-Arm Cable Lat Sweep',
        sets: 3,
        reps: '12-15',
        rpe: '8',
        type: 'bicep_curl',
        focusCue: 'Align cable directly with latissimus fiber direction.',
      },
    ],
    aiBiomechanicTip: 'Pull with your elbows rather than your hands. Thinking "elbows to back pockets" eliminates bicep takeover and spikes lat motor unit recruitment by up to 34%.',
    optimalRepRange: '8-12 Reps (Heavy Pulling & Scapular Control)',
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps & Forearms',
    latinName: 'Biceps Brachii & Brachialis',
    view: 'front',
    physiqueImpact: 'Defines upper arm peak and thickness in front aesthetic poses.',
    recoveryStatus: 90,
    recommendedExercises: [
      {
        name: 'Standing Supinated Dumbbell Curls',
        sets: 4,
        reps: '10-12',
        rpe: '8.5',
        type: 'bicep_curl',
        focusCue: 'Rotate pinky outward toward shoulder at top inflection.',
      },
      {
        name: 'Incline Dumbbell Stretch Curls',
        sets: 3,
        reps: '10-12',
        rpe: '8',
        type: 'bicep_curl',
        focusCue: 'Full stretch at bottom with elbows pinned behind torso.',
      },
      {
        name: 'Cross-Body Hammer Curls',
        sets: 3,
        reps: '12-15',
        rpe: '8.5',
        type: 'bicep_curl',
        focusCue: 'Targets brachialis to push bicep peak upward.',
      },
    ],
    aiBiomechanicTip: 'Do not allow elbows to drift forward on curls; keep them fixed at your ribs to prevent momentum cheating and isolate the biceps brachii.',
    optimalRepRange: '8-15 Reps (Full Range Stretch & Squeeze)',
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps',
    latinName: 'Triceps Brachii (3 Heads)',
    view: 'back',
    physiqueImpact: 'Accounts for 65% of total upper arm mass and side-arm horseshoe definition.',
    recoveryStatus: 88,
    recommendedExercises: [
      {
        name: 'Overhead Cable Tricep Extension',
        sets: 4,
        reps: '10-12',
        rpe: '8.5',
        type: 'pushup',
        focusCue: 'Targets the long head in fully stretched overhead position.',
      },
      {
        name: 'Close-Grip Push-Ups / Dips',
        sets: 3,
        reps: '12-15',
        rpe: '9',
        type: 'pushup',
        focusCue: 'Keep elbows tucked tightly to ribs, full lockout.',
      },
      {
        name: 'Straight Bar Cable Pressdowns',
        sets: 3,
        reps: '12-15',
        rpe: '8',
        type: 'pushup',
        focusCue: 'Flare hands at bottom to hit the lateral tricep head.',
      },
    ],
    aiBiomechanicTip: 'The long head of the tricep only experiences maximal stretch when the shoulder is elevated overhead. Include at least 1 overhead tricep movement in every push split.',
    optimalRepRange: '10-15 Reps (Overhead Tension & Lockout)',
  },
  core: {
    id: 'core',
    name: 'Abs & Obliques',
    latinName: 'Rectus Abdominis & Transverse Abdominis',
    view: 'front',
    physiqueImpact: 'Chiseled six-pack definition and tight tapered waistline.',
    recoveryStatus: 94,
    recommendedExercises: [
      {
        name: 'Hanging Knee / Leg Raises',
        sets: 3,
        reps: '12-15',
        rpe: '8.5',
        type: 'pushup',
        focusCue: 'Posterior pelvic tilt, curl pelvis toward sternum.',
      },
      {
        name: 'Cable Woodchoppers (Obliques)',
        sets: 3,
        reps: '15 per side',
        rpe: '8',
        type: 'shoulder_press',
        focusCue: 'Rotate through thoracic spine, lock hips in place.',
      },
      {
        name: 'Decline Weighted Crunches',
        sets: 3,
        reps: '15-20',
        rpe: '8',
        type: 'pushup',
        focusCue: 'Round the back into flexion, squeeze rectus abdominis.',
      },
    ],
    aiBiomechanicTip: 'The rectus abdominis only contracts when the spine flexes. Hip flexor dominant leg raises will not isolate abs unless you curl your pelvis upward.',
    optimalRepRange: '12-20 Reps (Controlled Flexion & Breathing)',
  },
  quads: {
    id: 'quads',
    name: 'Quadriceps (Front Thighs)',
    latinName: 'Vastus Lateralis, Medialis & Rectus Femoris',
    view: 'front',
    physiqueImpact: 'Constructs the athletic quad sweep and teardrop aesthetic above the knee.',
    recoveryStatus: 82,
    recommendedExercises: [
      {
        name: 'Barbell Back Squats',
        sets: 4,
        reps: '8-10',
        rpe: '8.5',
        type: 'squat',
        focusCue: 'Break at knees and hips together, deep 90°+ depth below parallel.',
      },
      {
        name: 'Walking Dumbbell Lunges',
        sets: 3,
        reps: '10-12 per leg',
        rpe: '8.5',
        type: 'lunge',
        focusCue: 'Drive through lead heel, upright vertical torso.',
      },
      {
        name: 'Elevated Heel Goblet Squats',
        sets: 3,
        reps: '12-15',
        rpe: '8',
        type: 'squat',
        focusCue: 'Elevate heels on 5lb plates for maximum quad knee-flexion.',
      },
    ],
    aiBiomechanicTip: 'Elevating the heels shifts the center of gravity forward, allowing deeper knee flexion and recruiting up to 28% more vastus medialis (teardrop) muscle tissue.',
    optimalRepRange: '6-12 Reps (Deep Knee Flexion & Heavy Squats)',
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings & Glutes',
    latinName: 'Biceps Femoris & Gluteus Maximus',
    view: 'back',
    physiqueImpact: 'Powerhouse of the posterior chain, sprint propulsion and glute shape.',
    recoveryStatus: 89,
    recommendedExercises: [
      {
        name: 'Romanian Dumbbell Deadlifts',
        sets: 4,
        reps: '8-10',
        rpe: '8.5',
        type: 'squat',
        focusCue: 'Hinge at hips, push pelvis backward, soft bend in knees.',
      },
      {
        name: 'Lying Hamstring Leg Curls',
        sets: 3,
        reps: '10-12',
        rpe: '9',
        type: 'lunge',
        focusCue: 'Keep hips pinned to pad, slow 3s eccentric descent.',
      },
      {
        name: 'Barbell Hip Thrusts',
        sets: 4,
        reps: '10-12',
        rpe: '8.5',
        type: 'squat',
        focusCue: 'Full hip lockout at top, 1s squeeze with posterior tilt.',
      },
    ],
    aiBiomechanicTip: 'Hamstrings cross both the hip and knee joint. You must perform both a hip hinge (RDL) and a knee flexion (Leg Curl) for complete hamstring hypertrophy.',
    optimalRepRange: '8-12 Reps (Deep Stretch & Hip Hinge)',
  },
  calves: {
    id: 'calves',
    name: 'Calves',
    latinName: 'Gastrocnemius & Soleus',
    view: 'both',
    physiqueImpact: 'Symmetrical lower leg aesthetics that balance quad development.',
    recoveryStatus: 96,
    recommendedExercises: [
      {
        name: 'Standing Machine Calf Raises',
        sets: 4,
        reps: '12-15',
        rpe: '8.5',
        type: 'squat',
        focusCue: 'Full 2s pause at bottom stretch, explode up onto big toes.',
      },
      {
        name: 'Seated Calf Raises (Soleus)',
        sets: 3,
        reps: '15-20',
        rpe: '8',
        type: 'squat',
        focusCue: 'Knees bent at 90° isolates the slow-twitch soleus muscle.',
      },
    ],
    aiBiomechanicTip: 'Pause for 2 full seconds at the bottom stretch of every calf repetition to dissipate Achilles tendon elastic recoil, forcing muscle fibers to do all the work.',
    optimalRepRange: '12-20 Reps (Deep Stretch & High Tension)',
  },
};

interface MuscularAnatomyViewProps {
  onAddExerciseToPlan?: (exercise: ExerciseItem) => void;
  onSelectForLogging?: (exercise: { name: string; type: ExerciseType; targetReps: string; rpe: string; targetSets: number; restSeconds: number }) => void;
  onSelectForCV?: (exercise: { name: string; type: ExerciseType; targetReps: string; rpe: string; targetSets: number; restSeconds: number }) => void;
  onClose?: () => void;
}

export const MuscularAnatomyView: React.FC<MuscularAnatomyViewProps> = ({
  onAddExerciseToPlan,
  onSelectForLogging,
  onSelectForCV,
  onClose,
}) => {
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');

  const selectedMuscle = MUSCLE_GROUPS[selectedMuscleId] || MUSCLE_GROUPS.chest;

  const handleSelectMuscle = (id: string) => {
    sounds.playTap();
    setSelectedMuscleId(id);
  };

  const handleAddRecommended = (ex: MuscleGroupDetail['recommendedExercises'][0]) => {
    sounds.playSuccessFanfare();
    if (onAddExerciseToPlan) {
      const newEx: ExerciseItem = {
        id: `rec_${Date.now()}`,
        name: ex.name,
        targetSets: ex.sets,
        targetReps: ex.reps,
        rpe: ex.rpe,
        restSeconds: 90,
        cvTrackable: false,
        cvExerciseType: ex.type,
        primaryMuscle: selectedMuscle.name,
        coachingCue: ex.focusCue,
        biomechanicNotes: selectedMuscle.aiBiomechanicTip,
      };
      onAddExerciseToPlan(newEx);
    }
  };

  const handleStartWorkout = (ex: MuscleGroupDetail['recommendedExercises'][0]) => {
    sounds.playTap();
    const targetHandler = onSelectForLogging || onSelectForCV;
    if (targetHandler) {
      targetHandler({
        name: ex.name,
        type: ex.type,
        targetReps: ex.reps,
        rpe: ex.rpe,
        targetSets: ex.sets,
        restSeconds: 90,
      });
    }
  };

  return (
    <div className="bg-[#0a0c12] text-white rounded-3xl p-4 border border-white/10 shadow-2xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Muscular Anatomy Architecture</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                AI BIO
              </span>
            </h3>
            <p className="text-[10px] text-neutral-400">
              Tap any major muscle group to inspect biomechanics & workouts
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Front / Back Body Toggle */}
      <div className="flex items-center justify-between my-3">
        <div className="flex bg-neutral-900 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => {
              sounds.playTap();
              setBodyView('front');
              if (selectedMuscle.view === 'back') setSelectedMuscleId('chest');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              bodyView === 'front'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setBodyView('back');
              if (selectedMuscle.view === 'front') setSelectedMuscleId('lats');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              bodyView === 'back'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
        </div>

        <span className="text-[10px] text-neutral-400 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Interactive Kinetics</span>
        </span>
      </div>

      {/* Muscle Selector Grid Badges */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 mb-3">
        {Object.values(MUSCLE_GROUPS)
          .filter((m) => m.view === bodyView || m.view === 'both')
          .map((m) => {
            const isSelected = selectedMuscleId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMuscle(m.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] whitespace-nowrap font-bold transition-all active:scale-95 border flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                    : 'bg-neutral-900/80 text-neutral-300 border-white/5 hover:border-white/20'
                }`}
              >
                <span>{m.name.split(' ')[0]}</span>
                <span
                  className={`text-[9px] px-1 rounded font-mono ${
                    isSelected ? 'bg-black/20 text-black font-black' : 'text-emerald-400'
                  }`}
                >
                  {m.recoveryStatus}%
                </span>
              </button>
            );
          })}
      </div>

      {/* Visual Muscle Body Diagram Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Anatomy Graphical Diagram (SVG stylized silhouette) */}
        <div className="md:col-span-5 bg-gradient-to-b from-neutral-900 to-[#10121a] border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative min-h-[220px]">
          <span className="absolute top-2 left-3 text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
            {bodyView === 'front' ? 'Anterior View' : 'Posterior View'}
          </span>

          {/* SVG Silhouette with interactive muscle hotspot regions */}
          <div className="w-36 h-48 relative flex items-center justify-center">
            <svg
              viewBox="0 0 160 220"
              className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head / Neck */}
              <circle cx="80" cy="22" r="14" fill="#1e2230" stroke="#333a4d" strokeWidth="1.5" />
              <path d="M74 36 L86 36 L88 44 L72 44 Z" fill="#242938" />

              {bodyView === 'front' ? (
                <>
                  {/* Shoulders Left/Right */}
                  <path
                    d="M48 48 C48 44, 70 42, 72 45 L68 62 L46 56 Z"
                    onClick={() => handleSelectMuscle('shoulders')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'shoulders' ? '#10b981' : '#2a3142'}
                    stroke={selectedMuscleId === 'shoulders' ? '#34d399' : '#3f475c'}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M112 48 C112 44, 90 42, 88 45 L92 62 L114 56 Z"
                    onClick={() => handleSelectMuscle('shoulders')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'shoulders' ? '#10b981' : '#2a3142'}
                    stroke={selectedMuscleId === 'shoulders' ? '#34d399' : '#3f475c'}
                    strokeWidth="1.5"
                  />

                  {/* Chest */}
                  <path
                    d="M56 50 C68 49, 92 49, 104 50 L102 78 C90 84, 70 84, 58 78 Z"
                    onClick={() => handleSelectMuscle('chest')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'chest' ? '#10b981' : '#323a4f'}
                    stroke={selectedMuscleId === 'chest' ? '#34d399' : '#4a5570'}
                    strokeWidth="1.5"
                  />

                  {/* Biceps */}
                  <rect
                    x="36"
                    y="58"
                    width="14"
                    height="28"
                    rx="6"
                    onClick={() => handleSelectMuscle('biceps')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'biceps' ? '#10b981' : '#262c3d'}
                    stroke={selectedMuscleId === 'biceps' ? '#34d399' : '#3a445c'}
                  />
                  <rect
                    x="110"
                    y="58"
                    width="14"
                    height="28"
                    rx="6"
                    onClick={() => handleSelectMuscle('biceps')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'biceps' ? '#10b981' : '#262c3d'}
                    stroke={selectedMuscleId === 'biceps' ? '#34d399' : '#3a445c'}
                  />

                  {/* Abs / Core */}
                  <path
                    d="M62 82 C72 82, 88 82, 98 82 L94 120 C88 123, 72 123, 66 120 Z"
                    onClick={() => handleSelectMuscle('core')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'core' ? '#10b981' : '#252b3b'}
                    stroke={selectedMuscleId === 'core' ? '#34d399' : '#3a4359'}
                    strokeWidth="1.5"
                  />

                  {/* Quads */}
                  <path
                    d="M58 126 C70 126, 76 128, 77 172 L55 170 Z"
                    onClick={() => handleSelectMuscle('quads')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'quads' ? '#10b981' : '#2a3144'}
                    stroke={selectedMuscleId === 'quads' ? '#34d399' : '#3d4761'}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M102 126 C90 126, 84 128, 83 172 L105 170 Z"
                    onClick={() => handleSelectMuscle('quads')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'quads' ? '#10b981' : '#2a3144'}
                    stroke={selectedMuscleId === 'quads' ? '#34d399' : '#3d4761'}
                    strokeWidth="1.5"
                  />

                  {/* Calves */}
                  <rect
                    x="56"
                    y="178"
                    width="16"
                    height="32"
                    rx="6"
                    onClick={() => handleSelectMuscle('calves')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'calves' ? '#10b981' : '#202636'}
                    stroke={selectedMuscleId === 'calves' ? '#34d399' : '#353e54'}
                  />
                  <rect
                    x="88"
                    y="178"
                    width="16"
                    height="32"
                    rx="6"
                    onClick={() => handleSelectMuscle('calves')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'calves' ? '#10b981' : '#202636'}
                    stroke={selectedMuscleId === 'calves' ? '#34d399' : '#353e54'}
                  />
                </>
              ) : (
                <>
                  {/* Back: Traps / Upper Back */}
                  <path
                    d="M62 45 L98 45 L106 68 L54 68 Z"
                    onClick={() => handleSelectMuscle('lats')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'lats' ? '#10b981' : '#323a4f'}
                    stroke={selectedMuscleId === 'lats' ? '#34d399' : '#45506b'}
                    strokeWidth="1.5"
                  />

                  {/* Lats Wings */}
                  <path
                    d="M52 68 L108 68 L98 108 L62 108 Z"
                    onClick={() => handleSelectMuscle('lats')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'lats' ? '#10b981' : '#2b3346'}
                    stroke={selectedMuscleId === 'lats' ? '#34d399' : '#3f4b66'}
                    strokeWidth="1.5"
                  />

                  {/* Triceps */}
                  <rect
                    x="34"
                    y="58"
                    width="14"
                    height="28"
                    rx="6"
                    onClick={() => handleSelectMuscle('triceps')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'triceps' ? '#10b981' : '#262c3d'}
                    stroke={selectedMuscleId === 'triceps' ? '#34d399' : '#3a445c'}
                  />
                  <rect
                    x="112"
                    y="58"
                    width="14"
                    height="28"
                    rx="6"
                    onClick={() => handleSelectMuscle('triceps')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'triceps' ? '#10b981' : '#262c3d'}
                    stroke={selectedMuscleId === 'triceps' ? '#34d399' : '#3a445c'}
                  />

                  {/* Glutes & Hamstrings */}
                  <path
                    d="M60 112 C72 110, 88 110, 100 112 L96 142 C88 145, 72 145, 64 142 Z"
                    onClick={() => handleSelectMuscle('hamstrings')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'hamstrings' ? '#10b981' : '#2a3142'}
                    stroke={selectedMuscleId === 'hamstrings' ? '#34d399' : '#3e475e'}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M58 144 C68 144, 76 145, 76 174 L56 172 Z"
                    onClick={() => handleSelectMuscle('hamstrings')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'hamstrings' ? '#10b981' : '#232938'}
                    stroke={selectedMuscleId === 'hamstrings' ? '#34d399' : '#343c52'}
                  />
                  <path
                    d="M102 144 C92 144, 84 145, 84 174 L104 172 Z"
                    onClick={() => handleSelectMuscle('hamstrings')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'hamstrings' ? '#10b981' : '#232938'}
                    stroke={selectedMuscleId === 'hamstrings' ? '#34d399' : '#343c52'}
                  />

                  {/* Calves */}
                  <rect
                    x="56"
                    y="178"
                    width="16"
                    height="32"
                    rx="6"
                    onClick={() => handleSelectMuscle('calves')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'calves' ? '#10b981' : '#202636'}
                    stroke={selectedMuscleId === 'calves' ? '#34d399' : '#353e54'}
                  />
                  <rect
                    x="88"
                    y="178"
                    width="16"
                    height="32"
                    rx="6"
                    onClick={() => handleSelectMuscle('calves')}
                    className="cursor-pointer transition-all hover:opacity-80"
                    fill={selectedMuscleId === 'calves' ? '#10b981' : '#202636'}
                    stroke={selectedMuscleId === 'calves' ? '#34d399' : '#353e54'}
                  />
                </>
              )}
            </svg>
          </div>

          <span className="text-[10px] text-emerald-400 font-bold mt-2">
            Selected: {selectedMuscle.name}
          </span>
        </div>

        {/* Selected Muscle Deep Dive Info */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-2">
          {/* Header Info */}
          <div className="bg-neutral-900/80 border border-white/5 p-3 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{selectedMuscle.name}</h4>
                <p className="text-[10px] text-neutral-400 italic">{selectedMuscle.latinName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {selectedMuscle.recoveryStatus}% RECOVERED
                </span>
                <div className="text-[9px] text-neutral-500">Ready to train</div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              <span className="text-emerald-400 font-semibold">Physique Role: </span>
              {selectedMuscle.physiqueImpact}
            </p>
          </div>

          {/* AI Biomechanic Coaching Tip Card */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Biomechanics Tip & Rep Protocol</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed">
              {selectedMuscle.aiBiomechanicTip}
            </p>
            <div className="mt-1 text-[10px] font-mono text-emerald-400">
              Protocol: {selectedMuscle.optimalRepRange}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Exercises Section */}
      <div className="mt-2 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Exercises for {selectedMuscle.name}</span>
          </span>
          <span className="text-[10px] text-neutral-400">1-Tap Add or Log Workout</span>
        </div>

        <div className="space-y-2">
          {selectedMuscle.recommendedExercises.map((ex, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 p-2.5 rounded-2xl flex items-center justify-between transition-all"
            >
              <div className="flex-1 pr-2">
                <div className="flex items-center space-x-2">
                  <h5 className="text-xs font-bold text-white">{ex.name}</h5>
                  <span className="text-[9px] bg-neutral-800 text-neutral-300 font-mono px-1.5 py-0.2 rounded border border-white/5">
                    {ex.sets} Sets • {ex.reps}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                  💡 {ex.focusCue}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                {onAddExerciseToPlan && (
                  <button
                    onClick={() => handleAddRecommended(ex)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold px-2 py-1.5 rounded-xl border border-white/10 flex items-center space-x-1 active:scale-95"
                    title="Add to daily plan"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>Plan</span>
                  </button>
                )}

                {(onSelectForLogging || onSelectForCV) && (
                  <button
                    onClick={() => handleStartWorkout(ex)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 active:scale-95 shadow"
                    title="Log sets for this exercise"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>Log</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
