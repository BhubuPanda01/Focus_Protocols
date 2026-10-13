import { 
  UserSettings, 
  CampaignProgress, 
  DayState, 
  ActiveTimerState 
} from '../types';
import { getKolkataDateString, calculateCampaignDayIndex } from './time';
import { getSideQuestForDay } from './challenges';

const STORAGE_KEYS = {
  SETTINGS: 'focus_protocol_settings_v1',
  PROGRESS: 'focus_protocol_progress_v1',
  TIMER: 'focus_protocol_timer_v1',
  CLASS_MODE: 'focus_protocol_class_mode_v1',
};

// Calculate default start date as tomorrow in Asia/Kolkata
export function getDefaultStartDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getKolkataDateString(tomorrow);
}

export const DEFAULT_SETTINGS: UserSettings = {
  callsign: 'OPERATOR',
  campaignStartDate: getDefaultStartDate(),
  examDate: '2027-02-06',
  wakeUpTime: '06:00',
  sleepTime: '23:00',
  defaultClassStart: '07:00',
  defaultClassEnd: '09:15',
  blockDurationMinutes: 45,
  breakDurationMinutes: 10,
  firstStudyStartTarget: '09:45',
  phoneCheckWindows: [
    { id: 'pcw-1', start: '13:00', end: '13:15', label: 'Midday Recon' },
    { id: 'pcw-2', start: '17:30', end: '17:45', label: 'Sunset Comms' },
    { id: 'pcw-3', start: '21:00', end: '21:15', label: 'Nightfall Check' },
  ],
  meals: [
    { id: 'meal-1', name: 'Breakfast' },
    { id: 'meal-2', name: 'Lunch' },
    { id: 'meal-3', name: 'Dinner' },
  ],
  soundEnabled: true,
  soundVolume: 0.6,
  reducedMotion: false,
  websiteBlockerRecommendations: 'Recommend Cold Turkey Blocker (PC), Freedom, StayFocusd, or AppBlock (Mobile) to enforce short-form video blacklists.',
  hasCompletedOnboarding: false,
};

export function createInitialDayState(dateStr: string, campaignDay: number, challengeId: number): DayState {
  return {
    dateStr,
    campaignDayIndex: campaignDay,
    challengeId,
    status: 'NOT_STARTED',
    studyBlocks: [],
    completedBlocksCount: 0,
    mealsChecked: {
      'meal-1': { checked: false },
      'meal-2': { checked: false },
      'meal-3': { checked: false },
    },
    phoneParking: {
      parked: false,
      location: '',
      followedWindows: true,
    },
    urgeAttacks: [],
    nearMisses: [],
    sideQuest: getSideQuestForDay(dateStr, campaignDay),
  };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadProgress(settings: UserSettings): CampaignProgress {
  const todayStr = getKolkataDateString();
  const campaignDay = calculateCampaignDayIndex(settings.campaignStartDate, todayStr);
  // Challenge ID is mapped by streak (0 -> Day 1, 1 -> Day 2 ... 6 -> Day 7 Boss Battle)
  
  const defaultProgress: CampaignProgress = {
    currentRunStreak: 0,
    totalCompletedMissions: 0,
    totalRunsCompleted: 0,
    totalXp: 0,
    totalStudyMinutes: 0,
    totalStudyBlocks: 0,
    activeDateStr: todayStr,
    history: {},
    runHistory: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      const challengeId = 1;
      const initialDay = createInitialDayState(todayStr, campaignDay, challengeId);
      defaultProgress.history[todayStr] = initialDay;
      return defaultProgress;
    }
    const parsed: CampaignProgress = JSON.parse(raw);
    
    // Ensure active date day state exists
    const currentStreak = parsed.currentRunStreak ?? 0;
    const challengeId = Math.min(7, Math.max(1, currentStreak + 1));
    
    if (!parsed.history) parsed.history = {};
    if (!parsed.history[todayStr]) {
      parsed.history[todayStr] = createInitialDayState(todayStr, campaignDay, challengeId);
    }
    parsed.activeDateStr = todayStr;
    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: CampaignProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

export function loadTimerState(): ActiveTimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTimerState(timer: ActiveTimerState | null): void {
  try {
    if (!timer) {
      localStorage.removeItem(STORAGE_KEYS.TIMER);
    } else {
      localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(timer));
    }
  } catch (err) {
    console.error('Failed to save timer:', err);
  }
}

export interface ClassModeStoredState {
  active: boolean;
  modeStartTime: string | null;
  authorizedUntil: string | null;
  manualOverride: boolean;
  currentExtensionMinutes: number;
}

export function loadClassModeState(): ClassModeStoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_MODE);
    if (!raw) return { active: false, modeStartTime: null, authorizedUntil: null, manualOverride: false, currentExtensionMinutes: 0 };
    return JSON.parse(raw);
  } catch {
    return { active: false, modeStartTime: null, authorizedUntil: null, manualOverride: false, currentExtensionMinutes: 0 };
  }
}

export function saveClassModeState(state: ClassModeStoredState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASS_MODE, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save class mode state:', err);
  }
}

// Reset current 7-day challenge run (preserves total history & XP records!)
export function resetCurrentRun(progress: CampaignProgress, reason: string): CampaignProgress {
  const currentStreak = progress.currentRunStreak;
  const newRunHistory = [
    ...(progress.runHistory || []),
    {
      runIndex: (progress.runHistory?.length || 0) + 1,
      startDate: progress.activeDateStr,
      endDate: getKolkataDateString(),
      completed: false,
      daysCompleted: currentStreak,
      reasonForReset: reason,
    }
  ];

  const todayStr = getKolkataDateString();
  const currentDayState = progress.history[todayStr];
  
  if (currentDayState) {
    currentDayState.status = 'FAILED';
    currentDayState.failedReason = reason;
  }

  const updated: CampaignProgress = {
    ...progress,
    currentRunStreak: 0, // Reset run streak to 0
    runHistory: newRunHistory,
  };

  saveProgress(updated);
  return updated;
}

// Full factory reset
export function factoryReset(): void {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.TIMER);
  localStorage.removeItem(STORAGE_KEYS.CLASS_MODE);
}
