export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
  joinDate: string;
  streakDays: number;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Athlete';
  currentBadge: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  text: string;
  timestamp: string;
  workoutSetAttachment?: {
    exerciseName: string;
    reps: number;
    romPercent: number;
    formScore: number;
  };
  reactions: {
    emoji: string;
    count: number;
    userReacted?: boolean;
  }[];
}
