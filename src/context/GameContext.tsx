import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserSettings,
  CampaignProgress,
  DayState,
  ActiveTimerState,
  StudyBlock,
  RecallExercise,
  PracticeQuestionsLog,
  HardestTopicData,
  TimedQuizData,
  BossBattleReviewData,
  DailyReport,
} from '../types';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  loadProgress,
  saveProgress,
  loadTimerState,
  saveTimerState,
  loadClassModeState,
  saveClassModeState,
  ClassModeStoredState,
  resetCurrentRun,
  factoryReset,
  createInitialDayState,
} from '../utils/storage';
import { 
  getKolkataDateString, 
  getKolkataTimeString, 
  calculateCampaignDayIndex, 
  addMinutesToTime 
} from '../utils/time';
import { CHALLENGE_DEFINITIONS } from '../utils/challenges';
import { tacticalAudio } from '../utils/audio';

interface GameContextType {
  settings: UserSettings;
  progress: CampaignProgress;
  activeDay: DayState;
  timerState: ActiveTimerState | null;
  classMode: ClassModeStoredState;
  
  // Timer Actions
  startFocusTimer: (task: string, blockType?: StudyBlock['type'], customDuration?: number) => void;
  startBreakTimer: (customDuration?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  endTimerEarly: () => void;
  
  // Mission Actions
  startMission: () => void;
  completeSideQuest: () => void;
  
  // Daily Tracking Handlers
  updateMealCheck: (mealId: string, checked: boolean, notes?: string, skippedReason?: string) => void;
  updatePhoneParking: (parked: boolean, location?: string, followedWindows?: boolean) => void;
  saveRecallExercise: (data: RecallExercise) => void;
  savePracticeQuestions: (data: PracticeQuestionsLog) => void;
  saveHardestTopic: (data: HardestTopicData) => void;
  saveTimedQuiz: (data: TimedQuizData) => void;
  saveBossBattleReview: (data: BossBattleReviewData) => void;
  
  // Urge Attack & Near Miss
  logUrgeAttack: () => string; // returns urge id
  resolveUrgeAttack: (urgeId: string, returnedToTask: boolean) => void;
  recordNearMiss: (triggerApp: string, actionTaken: string) => void;
  
  // Class Mode Actions
  toggleClassMode: (forceState?: boolean) => void;
  extendClassMode: (minutes: number) => void;
  saveClassScheduleOverride: (override: NonNullable<DayState['classScheduleOverride']>) => void;
  
  // Debrief & Lifecycle
  submitDailyReport: (report: DailyReport) => { passed: boolean; message: string; isBossBattle: boolean };
  triggerEmergencyPause: (reason: string) => void;
  manualFailRun: (reason: string) => void;
  
  // Challenge switching
  changeActiveChallenge: (challengeId: number) => void;

  // Settings & System
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  performFactoryReset: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<UserSettings>(() => loadSettings());
  const [progress, setProgressState] = useState<CampaignProgress>(() => loadProgress(settings));
  const [timerState, setTimerState] = useState<ActiveTimerState | null>(() => loadTimerState());
  const [classMode, setClassModeState] = useState<ClassModeStoredState>(() => loadClassModeState());

  const activeDateStr = getKolkataDateString();
  
  // Initialize audio volume and status
  useEffect(() => {
    tacticalAudio.init(settings.soundEnabled, settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Ensure active day exists
  const activeDay: DayState = progress.history[activeDateStr] || (() => {
    const campaignDay = calculateCampaignDayIndex(settings.campaignStartDate, activeDateStr);
    const challengeId = Math.min(7, Math.max(1, (progress.currentRunStreak || 0) + 1));
    return createInitialDayState(activeDateStr, campaignDay, challengeId);
  })();

  // Synchronize state updates helper
  const updateActiveDay = (updater: (prev: DayState) => DayState) => {
    setProgressState(prev => {
      const currentDay = prev.history[activeDateStr] || activeDay;
      const updatedDay = updater(currentDay);
      const updatedProgress = {
        ...prev,
        activeDateStr,
        history: {
          ...prev.history,
          [activeDateStr]: updatedDay,
        },
      };
      saveProgress(updatedProgress);
      return updatedProgress;
    });
  };

  // Timer Tick Interval
  const timerTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerState && timerState.isRunning) {
      timerTickRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (!prev || !prev.isRunning) return prev;
          if (prev.secondsRemaining <= 1) {
            // Timer Finished!
            handleTimerComplete(prev);
            return null;
          }
          const next = {
            ...prev,
            secondsRemaining: prev.secondsRemaining - 1,
            totalElapsedSeconds: prev.totalElapsedSeconds + 1,
          };
          saveTimerState(next);
          return next;
        });
      }, 1000);
    } else {
      if (timerTickRef.current) {
        clearInterval(timerTickRef.current);
        timerTickRef.current = null;
      }
    }

    return () => {
      if (timerTickRef.current) clearInterval(timerTickRef.current);
    };
  }, [timerState?.isRunning]);

  // Handle completion of a timer block
  const handleTimerComplete = (finishedTimer: ActiveTimerState) => {
    tacticalAudio.playSessionComplete();

    if (finishedTimer.mode === 'FOCUS') {
      const durationMins = Math.round(finishedTimer.targetSeconds / 60);
      const nowIso = new Date().toISOString();
      const newBlock: StudyBlock = {
        id: 'block-' + Date.now(),
        startTime: finishedTimer.startTime ? new Date(finishedTimer.startTime).toISOString() : nowIso,
        endTime: nowIso,
        durationMinutes: durationMins,
        task: finishedTimer.task,
        verified: true,
        type: finishedTimer.blockType,
      };

      setProgressState(prev => {
        const currentDay = prev.history[activeDateStr] || activeDay;
        const newBlocks = [...currentDay.studyBlocks, newBlock];
        const newCompletedCount = newBlocks.filter(b => b.verified).length;
        
        // Check if mission became ready for report
        const currentChallenge = CHALLENGE_DEFINITIONS[currentDay.challengeId];
        const requiredBlocks = currentChallenge ? currentChallenge.requiredBlocks : 2;
        const newStatus = (newCompletedCount >= requiredBlocks && currentDay.status === 'ACTIVE') 
          ? 'READY_FOR_REPORT' 
          : currentDay.status === 'NOT_STARTED' ? 'ACTIVE' : currentDay.status;

        const updatedDay: DayState = {
          ...currentDay,
          studyBlocks: newBlocks,
          completedBlocksCount: newCompletedCount,
          status: newStatus,
        };

        const updatedProgress: CampaignProgress = {
          ...prev,
          totalStudyMinutes: prev.totalStudyMinutes + durationMins,
          totalStudyBlocks: prev.totalStudyBlocks + 1,
          totalXp: prev.totalXp + 15, // Award small 15 XP for every successfully completed block
          history: {
            ...prev.history,
            [activeDateStr]: updatedDay,
          },
        };

        saveProgress(updatedProgress);
        return updatedProgress;
      });
    }

    saveTimerState(null);
  };

  // Timer Actions
  const startFocusTimer = (task: string, blockType: StudyBlock['type'] = 'INDEPENDENT', customDuration?: number) => {
    if (!task.trim()) return;
    const durationMins = customDuration || settings.blockDurationMinutes || 45;
    const targetSeconds = durationMins * 60;

    const newTimer: ActiveTimerState = {
      mode: 'FOCUS',
      isRunning: true,
      task: task.trim(),
      blockType,
      startTime: Date.now(),
      targetSeconds,
      secondsRemaining: targetSeconds,
      pausedAt: null,
      totalElapsedSeconds: 0,
    };

    setTimerState(newTimer);
    saveTimerState(newTimer);
    tacticalAudio.playMissionStart();

    // Auto-mark day as ACTIVE if not already
    if (activeDay.status === 'NOT_STARTED') {
      updateActiveDay(d => ({ ...d, status: 'ACTIVE', startedAt: new Date().toISOString() }));
    }
  };

  const startBreakTimer = (customDuration?: number) => {
    const durationMins = customDuration || settings.breakDurationMinutes || 10;
    const targetSeconds = durationMins * 60;

    const newTimer: ActiveTimerState = {
      mode: 'BREAK',
      isRunning: true,
      task: 'Tactical Recharge & Hydration',
      blockType: 'INDEPENDENT',
      startTime: Date.now(),
      targetSeconds,
      secondsRemaining: targetSeconds,
      pausedAt: null,
      totalElapsedSeconds: 0,
    };

    setTimerState(newTimer);
    saveTimerState(newTimer);
    tacticalAudio.playClick();
  };

  const pauseTimer = () => {
    if (!timerState) return;
    const updated: ActiveTimerState = {
      ...timerState,
      isRunning: false,
      pausedAt: Date.now(),
    };
    setTimerState(updated);
    saveTimerState(updated);
    tacticalAudio.playClick();
  };

  const resumeTimer = () => {
    if (!timerState) return;
    const updated: ActiveTimerState = {
      ...timerState,
      isRunning: true,
      pausedAt: null,
    };
    setTimerState(updated);
    saveTimerState(updated);
    tacticalAudio.playClick();
  };

  const endTimerEarly = () => {
    // Crucial rule: Never count an incomplete timer as completed study time!
    setTimerState(null);
    saveTimerState(null);
    tacticalAudio.playClick();
  };

  // Start Mission button
  const startMission = () => {
    updateActiveDay(d => ({
      ...d,
      status: 'ACTIVE',
      startedAt: d.startedAt || new Date().toISOString(),
    }));
    tacticalAudio.playMissionStart();
  };

  // Side Quest
  const completeSideQuest = () => {
    if (activeDay.sideQuest.completed) return;
    updateActiveDay(d => ({
      ...d,
      sideQuest: { ...d.sideQuest, completed: true },
    }));
    setProgressState(p => {
      const next = { ...p, totalXp: p.totalXp + 25 };
      saveProgress(next);
      return next;
    });
    tacticalAudio.playSessionComplete();
  };

  // Meal Check
  const updateMealCheck = (mealId: string, checked: boolean, notes?: string, skippedReason?: string) => {
    updateActiveDay(d => ({
      ...d,
      mealsChecked: {
        ...d.mealsChecked,
        [mealId]: { checked, notes, skippedReason },
      },
    }));
    tacticalAudio.playClick();
  };

  // Phone Parking
  const updatePhoneParking = (parked: boolean, location?: string, followedWindows?: boolean) => {
    updateActiveDay(d => ({
      ...d,
      phoneParking: {
        parked,
        location: location !== undefined ? location : d.phoneParking.location,
        followedWindows: followedWindows !== undefined ? followedWindows : d.phoneParking.followedWindows,
      },
    }));
    tacticalAudio.playClick();
  };

  // Recall Exercise
  const saveRecallExercise = (data: RecallExercise) => {
    updateActiveDay(d => ({
      ...d,
      recallExercise: { ...data, completedAt: new Date().toISOString() },
    }));
    tacticalAudio.playClick();
  };

  // Practice Questions
  const savePracticeQuestions = (data: PracticeQuestionsLog) => {
    updateActiveDay(d => ({
      ...d,
      practiceQuestions: { ...data, completedAt: new Date().toISOString() },
    }));
    tacticalAudio.playClick();
  };

  // Hard Topic
  const saveHardestTopic = (data: HardestTopicData) => {
    updateActiveDay(d => ({
      ...d,
      hardestTopicData: data,
    }));
    tacticalAudio.playClick();
  };

  // Timed Quiz
  const saveTimedQuiz = (data: TimedQuizData) => {
    updateActiveDay(d => ({
      ...d,
      timedQuizData: { ...data, completedAt: new Date().toISOString() },
    }));
    tacticalAudio.playClick();
  };

  // Boss Battle
  const saveBossBattleReview = (data: BossBattleReviewData) => {
    updateActiveDay(d => ({
      ...d,
      bossBattleReview: { ...data, completedAt: new Date().toISOString() },
    }));
    tacticalAudio.playClick();
  };

  // Urge Attack
  const logUrgeAttack = (): string => {
    const urgeId = 'urge-' + Date.now();
    const newLog = {
      id: urgeId,
      timestamp: new Date().toISOString(),
      returnedToTask: false,
      xpAwarded: false,
    };
    updateActiveDay(d => ({
      ...d,
      urgeAttacks: [...d.urgeAttacks, newLog],
    }));
    tacticalAudio.playGroundingBell();
    return urgeId;
  };

  const resolveUrgeAttack = (urgeId: string, returnedToTask: boolean) => {
    // Check how many urges have already received XP today (max 3)
    const existingAwardedCount = activeDay.urgeAttacks.filter(u => u.xpAwarded).length;
    const canAwardXp = returnedToTask && existingAwardedCount < 3;

    updateActiveDay(d => ({
      ...d,
      urgeAttacks: d.urgeAttacks.map(u => {
        if (u.id === urgeId) {
          return { ...u, returnedToTask, xpAwarded: canAwardXp };
        }
        return u;
      }),
    }));

    if (canAwardXp) {
      setProgressState(p => {
        const next = { ...p, totalXp: p.totalXp + 10 };
        saveProgress(next);
        return next;
      });
      tacticalAudio.playClick();
    }
  };

  // Near Miss
  const recordNearMiss = (triggerApp: string, actionTaken: string) => {
    const newNearMiss = {
      id: 'nm-' + Date.now(),
      timestamp: new Date().toISOString(),
      triggerApp,
      actionTaken,
    };
    updateActiveDay(d => ({
      ...d,
      nearMisses: [...d.nearMisses, newNearMiss],
    }));
    tacticalAudio.playClick();
  };

  // Class Mode
  const toggleClassMode = (forceState?: boolean) => {
    const nextState = forceState !== undefined ? forceState : !classMode.active;
    const nowHHmm = getKolkataTimeString();
    const authorizedUntil = nextState ? (settings.defaultClassEnd || '09:15') : null;

    const updated: ClassModeStoredState = {
      active: nextState,
      modeStartTime: nextState ? nowHHmm : null,
      authorizedUntil,
      manualOverride: true,
      currentExtensionMinutes: 0,
    };

    setClassModeState(updated);
    saveClassModeState(updated);
    tacticalAudio.playClick();
  };

  const extendClassMode = (minutes: number) => {
    if (!classMode.active) return;
    const baseTime = classMode.authorizedUntil || settings.defaultClassEnd || '09:15';
    const extended = addMinutesToTime(baseTime, minutes);

    const updated: ClassModeStoredState = {
      ...classMode,
      authorizedUntil: extended,
      currentExtensionMinutes: classMode.currentExtensionMinutes + minutes,
    };

    setClassModeState(updated);
    saveClassModeState(updated);
    tacticalAudio.playClick();
  };

  const saveClassScheduleOverride = (override: NonNullable<DayState['classScheduleOverride']>) => {
    updateActiveDay(d => ({
      ...d,
      classScheduleOverride: override,
    }));
    tacticalAudio.playClick();
  };

  // Daily Report / Mission Debriefing
  const submitDailyReport = (report: DailyReport) => {
    const challengeId = activeDay.challengeId;
    const challengeDef = CHALLENGE_DEFINITIONS[challengeId];
    const isBossBattle = challengeId === 7;

    // Check pass conditions:
    let passed = true;
    let failReason = '';

    // Condition 1: Verified blocks
    const requiredBlocks = challengeDef?.requiredBlocks || 2;
    if (activeDay.completedBlocksCount < requiredBlocks) {
      passed = false;
      failReason = `Required ${requiredBlocks} blocks, but completed ${activeDay.completedBlocksCount}.`;
    }

    // Condition 2: Honest short videos commitment
    if (!report.honestShortVideosAvoided) {
      passed = false;
      failReason = 'Deliberate short-video scrolling reported.';
    }

    // Condition 3: Challenge-specific requirements
    if (challengeId === 2) {
      // Day 2: Silent table
      const mealsValid = settings.meals.every(m => {
        const item = activeDay.mealsChecked[m.id];
        return item && (item.checked || !!item.skippedReason);
      });
      if (!mealsValid) {
        passed = false;
        failReason = 'Meals were not completed screen-free or accounted for.';
      }
    } else if (challengeId === 3) {
      // Day 3: Phantom phone
      if (!activeDay.phoneParking.parked || !activeDay.phoneParking.location) {
        passed = false;
        failReason = 'Phone was not parked away with recorded location.';
      }
    } else if (challengeId === 4) {
      // Day 4: Memory raid
      if (!activeDay.recallExercise?.topic || (activeDay.practiceQuestions?.attempted || 0) < 15) {
        passed = false;
        failReason = 'Closed-book recall or 15 practice questions not completed.';
      }
    } else if (challengeId === 5) {
      // Day 5: Hardest first
      if (!activeDay.hardestTopicData?.topic || !activeDay.hardestTopicData?.completedInFirstBlock) {
        passed = false;
        failReason = 'First block was not dedicated to the hardest avoided topic.';
      }
    } else if (challengeId === 6) {
      // Day 6: Distraction ambush
      if (!activeDay.timedQuizData?.subject || !activeDay.timedQuizData?.mistakesAnalyzed) {
        passed = false;
        failReason = 'Timed quiz or mistake analysis not submitted.';
      }
    } else if (challengeId === 7) {
      // Day 7: Boss battle
      if (!activeDay.bossBattleReview?.sectionalTestResults || !activeDay.bossBattleReview?.oneImprovementNextRun) {
        passed = false;
        failReason = 'Sectional test review or weekly operational report incomplete.';
      }
    }

    const nowIso = new Date().toISOString();

    if (passed) {
      // Mission Complete!
      const xpEarned = challengeDef?.xpReward || 100;
      tacticalAudio.playVictory();

      const nextStreak = isBossBattle ? 7 : (progress.currentRunStreak + 1);
      const nextRunsCompleted = isBossBattle ? (progress.totalRunsCompleted + 1) : progress.totalRunsCompleted;

      const updatedDay: DayState = {
        ...activeDay,
        status: 'COMPLETED',
        completedAt: nowIso,
        dailyReport: report,
      };

      const updatedProgress: CampaignProgress = {
        ...progress,
        currentRunStreak: nextStreak,
        totalCompletedMissions: progress.totalCompletedMissions + 1,
        totalRunsCompleted: nextRunsCompleted,
        totalXp: progress.totalXp + xpEarned,
        history: {
          ...progress.history,
          [activeDateStr]: updatedDay,
        },
      };

      setProgressState(updatedProgress);
      saveProgress(updatedProgress);

      return {
        passed: true,
        message: isBossBattle 
          ? `OPERATION SUCCESS! 7-Day Campaign Run #${nextRunsCompleted} Conquered! +${xpEarned} XP awarded!`
          : `MISSION ACCOMPLISHED! Run streak advanced to ${nextStreak}/7! +${xpEarned} XP awarded!`,
        isBossBattle,
      };
    } else {
      // Failed Mission -> Resets 7-day run streak, but keeps historical records!
      tacticalAudio.playWarning();
      const updatedProgress = resetCurrentRun(progress, failReason);
      
      const failedDay: DayState = {
        ...activeDay,
        status: 'FAILED',
        failedReason: failReason,
        dailyReport: report,
      };

      const finalProgress: CampaignProgress = {
        ...updatedProgress,
        history: {
          ...updatedProgress.history,
          [activeDateStr]: failedDay,
        },
      };

      setProgressState(finalProgress);
      saveProgress(finalProgress);

      return {
        passed: false,
        message: `CHALLENGE FAILED: ${failReason}. Current run streak reset to 0. Historical logs preserved. Stand up and prepare for tomorrow's run!`,
        isBossBattle: false,
      };
    }
  };

  // Emergency Pause
  const triggerEmergencyPause = (reason: string) => {
    updateActiveDay(d => ({
      ...d,
      status: 'EMERGENCY_PAUSED',
      emergencyPause: {
        active: true,
        timestamp: new Date().toISOString(),
        reason,
      },
    }));
    tacticalAudio.playClick();
  };

  // Manual Fail
  const manualFailRun = (reason: string) => {
    tacticalAudio.playWarning();
    const updatedProgress = resetCurrentRun(progress, reason);
    setProgressState(updatedProgress);
  };

  // Switch Active Challenge Day
  const changeActiveChallenge = (challengeId: number) => {
    const clamped = Math.min(7, Math.max(1, challengeId));
    updateActiveDay(d => ({
      ...d,
      challengeId: clamped,
    }));
    tacticalAudio.playClick();
  };

  // Settings
  const updateSettings = (newPartial: Partial<UserSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettingsState(updated);
    saveSettings(updated);
    tacticalAudio.playClick();
  };

  // Export / Import
  const exportDataJson = (): string => {
    const backup = {
      settings,
      progress,
      exportedAt: new Date().toISOString(),
      app: 'DOPAMINE_ZERO_OP_FEB_6',
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings && data.progress) {
        setSettingsState(data.settings);
        setProgressState(data.progress);
        saveSettings(data.settings);
        saveProgress(data.progress);
        tacticalAudio.playMissionStart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const performFactoryReset = () => {
    factoryReset();
    window.location.reload();
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        progress,
        activeDay,
        timerState,
        classMode,
        startFocusTimer,
        startBreakTimer,
        pauseTimer,
        resumeTimer,
        endTimerEarly,
        startMission,
        completeSideQuest,
        updateMealCheck,
        updatePhoneParking,
        saveRecallExercise,
        savePracticeQuestions,
        saveHardestTopic,
        saveTimedQuiz,
        saveBossBattleReview,
        logUrgeAttack,
        resolveUrgeAttack,
        recordNearMiss,
        toggleClassMode,
        extendClassMode,
        saveClassScheduleOverride,
        submitDailyReport,
        triggerEmergencyPause,
        manualFailRun,
        changeActiveChallenge,
        updateSettings,
        exportDataJson,
        importDataJson,
        performFactoryReset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
