import React from 'react';
import { CompletedSet, ExerciseItem } from '../types/fitness';
import { ExerciseType } from '../utils/computerVision';
import { WorkoutTrackerView } from './WorkoutTrackerView';

interface ComputerVisionTrackerProps {
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

export const ComputerVisionTracker: React.FC<ComputerVisionTrackerProps> = (props) => {
  return <WorkoutTrackerView {...props} />;
};
