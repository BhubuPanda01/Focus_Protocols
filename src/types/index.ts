export type DifficultyTier = 'RECRUIT' | 'OPERATIVE' | 'VANGUARD' | 'SPECIALIST' | 'ELITE' | 'COMMANDER' | 'APEX';

export type MissionStatus = 
  | 'NOT_STARTED' 
  | 'ACTIVE' 
  | 'READY_FOR_REPORT' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'EMERGENCY_PAUSED';

export interface PhoneCheckWindow {
  id: string;
  start: string; // "13:00"
  end: string;   // "13:15"
  label: string; // "Post-Lunch Check"
}

export interface MealItem {
  id: string;
  name: string; // "Breakfast", "Lunch", "Dinner"
}

export interface UserSettings {
  callsign: string;
  campaignStartDate: string; // YYYY-MM-DD
  examDate: string;          // YYYY-MM-DD (Default: 2027-02-06)
  wakeUpTime: string;        // "06:00"
  sleepTime: string;         // "23:00"
  defaultClassStart: string; // "07:00"
  defaultClassEnd: string;   // "09:15"
  blockDurationMinutes: number; // Default 45
  breakDurationMinutes: number; // Default 10
  firstStudyStartTarget: string; // "09:45"
  phoneCheckWindows: PhoneCheckWindow[];
  meals: MealItem[];
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  reducedMotion: boolean;
  websiteBlockerRecommendations: string;
  hasCompletedOnboarding: boolean;
}

export interface StudyBlock {
  id: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  durationMinutes: number;
  task: string;
  verified: boolean;
  type: 'INDEPENDENT' | 'HARD_TOPIC' | 'QUIZ' | 'TEST_SECTION' | 'TEST_ANALYSIS';
}

export interface UrgeAttackLog {
  id: string;
  timestamp: string; // ISO
  returnedToTask: boolean;
  xpAwarded: boolean;
}

export interface NearMissLog {
  id: string;
  timestamp: string;
  triggerApp: string; // e.g. "YouTube", "Instagram"
  actionTaken: string; // e.g. "Closed tab within 3 seconds"
}

export interface RecallExercise {
  subject: string;
  topic: string;
  remembered: string;
  forgotten: string;
  revisionPlan: string;
  completedAt?: string;
}

export interface PracticeQuestionsLog {
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  completedAt?: string;
}

export interface HardestTopicData {
  topic: string;
  notes: string;
  completedInFirstBlock: boolean;
}

export interface TimedQuizData {
  durationMinutes: number;
  subject: string;
  score: string;
  totalQuestions: number;
  mistakesAnalyzed: string;
  completedAt?: string;
}

export interface BossBattleReviewData {
  totalBlocksCompleted: number;
  totalVerifiedMinutes: number;
  topicsStudied: string;
  sectionalTestResults: string;
  commonMistakes: string;
  mostFrequentDistraction: string;
  bestPerformingSession: string;
  oneImprovementNextRun: string;
  completedAt?: string;
}

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface DailyReport {
  submittedAt: string;
  rating: number; // 1-5
  reflectionNotes: string;
  honestShortVideosAvoided: boolean;
  honestMealsScreenFree: boolean;
  honestPhoneParked: boolean;
  honestClassModeOnlyForClass: boolean;
  emergencyExplanation?: string;
}

export interface DayState {
  dateStr: string; // YYYY-MM-DD in Asia/Kolkata
  campaignDayIndex: number; // 1 to 30
  challengeId: number; // 1 to 7
  status: MissionStatus;
  startedAt?: string;
  completedAt?: string;
  failedReason?: string;
  
  // Trackers
  studyBlocks: StudyBlock[];
  completedBlocksCount: number; // Only verified completed blocks
  
  // Day-specific requirement trackers
  mealsChecked: Record<string, { checked: boolean; notes?: string; skippedReason?: string }>;
  phoneParking: {
    parked: boolean;
    location?: string;
    followedWindows: boolean;
  };
  recallExercise?: RecallExercise;
  practiceQuestions?: PracticeQuestionsLog;
  hardestTopicData?: HardestTopicData;
  timedQuizData?: TimedQuizData;
  bossBattleReview?: BossBattleReviewData;
  
  // Urge & Near Miss trackers
  urgeAttacks: UrgeAttackLog[];
  nearMisses: NearMissLog[];
  
  // Side Quest
  sideQuest: SideQuest;
  
  // Class Mode Schedule Override for this day
  classScheduleOverride?: {
    hasOverride: boolean;
    startTime: string;
    endTime: string;
    isCancelled: boolean;
    extensionMinutes: number;
    reason?: string;
  };
  
  // Emergency pause
  emergencyPause?: {
    active: boolean;
    timestamp: string;
    reason: string;
  };

  // Daily debrief report
  dailyReport?: DailyReport;
}

export interface ChallengeDefinition {
  id: number;
  name: string;
  subtitle: string;
  difficulty: DifficultyTier;
  quote: string;
  xpReward: number;
  description: string;
  primaryObjective: string;
  requiredBlocks: number;
  specialRequirements: string[];
  passConditions: string[];
  failureConditions: string[];
  bonusObjective?: string;
  bonusXp?: number;
}

export interface RunRecord {
  runIndex: number;
  startDate: string;
  endDate?: string;
  completed: boolean;
  daysCompleted: number;
  reasonForReset?: string;
}

export interface CampaignProgress {
  currentRunStreak: number; // 0 to 7. Resets on challenge failure
  totalCompletedMissions: number;
  totalRunsCompleted: number; // Number of times Day 7 is beaten
  totalXp: number;
  totalStudyMinutes: number; // Only verified blocks
  totalStudyBlocks: number;
  activeDateStr: string;
  history: Record<string, DayState>; // Keyed by YYYY-MM-DD
  runHistory: RunRecord[];
}

export interface ActiveTimerState {
  mode: 'FOCUS' | 'BREAK';
  isRunning: boolean;
  task: string;
  blockType: StudyBlock['type'];
  startTime: number | null; // epoch ms
  targetSeconds: number;
  secondsRemaining: number;
  pausedAt: number | null;
  totalElapsedSeconds: number;
}
