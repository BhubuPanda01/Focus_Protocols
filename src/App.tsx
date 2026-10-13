import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Award, 
  Target, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Zap, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Brain,
  VideoOff
} from 'lucide-react';
import { useGame, GameProvider } from './context/GameContext';
import { Header } from './components/Header';
import { ClassModeBar } from './components/ClassModeBar';
import { FocusTimer } from './components/FocusTimer';
import { TodayHeroChallenge } from './components/TodayHeroChallenge';
import { MissionCard } from './components/MissionCard';
import { SideQuestCard } from './components/SideQuestCard';
import { UrgeAttackModal } from './components/UrgeAttackModal';
import { DailyReportModal } from './components/DailyReportModal';
import { RulesModal } from './components/RulesModal';
import { NearMissModal } from './components/NearMissModal';
import { DailyScheduleEditor } from './components/DailyScheduleEditor';
import { HistoryAnalytics } from './components/HistoryAnalytics';
import { EmergencyPauseModal } from './components/EmergencyPauseModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CHALLENGE_DEFINITIONS } from './utils/challenges';

const DashboardContent: React.FC = () => {
  const { settings, activeDay, progress } = useGame();

  // Modal State Triggers
  const [isUrgeOpen, setIsUrgeOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isNearMissOpen, setIsNearMissOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check if onboarding is required
  const showOnboarding = !settings.hasCompletedOnboarding;

  const currentChallenge = CHALLENGE_DEFINITIONS[activeDay.challengeId] || CHALLENGE_DEFINITIONS[1];
  const remainingBlocks = Math.max(0, currentChallenge.requiredBlocks - activeDay.completedBlocksCount);

  return (
    <div className={`min-h-screen bg-[#080B11] text-[#E2E8F0] ${settings.reducedMotion ? 'reduced-motion' : ''}`}>
      
      {/* Tactical Top Header */}
      <Header
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenNearMiss={() => setIsNearMissOpen(true)}
      />

      {/* Online Class Mode HUD Bar */}
      <ClassModeBar />

      {/* Main Tactical Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ⭐ PRIORITY 1: TODAY'S HIGHLIGHTED CHALLENGE HERO & 7-DAY ROADMAP */}
        <TodayHeroChallenge
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          onScrollToTimer={() => {
            const el = document.getElementById('focus-timer-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Urgent Action Floating Bar / Urge Intercept Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-cyan-950/30 border border-amber-500/30 shadow-hud-amber">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400">
              <ShieldAlert className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase block">
                DOPAMINE IMPULSE DEFENSE SYSTEM
              </span>
              <p className="text-[11px] text-slate-400">
                Feeling an overwhelming reflex to check YouTube Shorts or Reels? Intercept it now.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUrgeOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-extrabold tracking-wider uppercase transition shadow-hud-amber"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>I WANT TO SCROLL (URGE INTERCEPT)</span>
          </button>
        </div>

        {/* Tactical 2-Column Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Operational Column: Primary Challenge & Side Quests */}
          <div className="lg:col-span-7 space-y-6">
            <MissionCard
              onOpenRules={() => setIsRulesOpen(true)}
              onOpenReport={() => setIsReportOpen(true)}
            />

            <SideQuestCard />

            {/* Quick Tactical Checklist Summary */}
            <div className="hud-panel rounded-xl p-4 border border-[#1E2C4A] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                DAILY THREAT & COMMITMENT SUMMARY
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-[#080B11] border border-slate-800 flex items-center gap-2">
                  <VideoOff className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">
                    Short-Videos Blocked: <strong>Active</strong>
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#080B11] border border-slate-800 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300">
                    Phone Status: {activeDay.phoneParking.parked ? (
                      <strong className="text-blue-300">Parked ({activeDay.phoneParking.location || 'Air-Gapped'})</strong>
                    ) : (
                      <strong className="text-amber-400">Not Marked Parked</strong>
                    )}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#080B11] border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="text-slate-300">
                    Next Phone Window: <strong>{settings.phoneCheckWindows[0]?.start || '13:00'}</strong>
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#080B11] border border-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300">
                    Urge Interceptions Today: <strong>{activeDay.urgeAttacks.length}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Operational Column: Focus Timer & Progress Metrics */}
          <div className="lg:col-span-5 space-y-6">
            {/* The Main HUD Focus Timer Engine */}
            <div id="focus-timer-section">
              <FocusTimer />
            </div>

            {/* Daily Operational Progress Box */}
            <div className="hud-panel rounded-xl p-5 border border-[#1E2C4A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
                    DAILY TARGET PROGRESSION
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {Math.round((activeDay.completedBlocksCount / currentChallenge.requiredBlocks) * 100)}% COMPLETE
                </span>
              </div>

              {/* Study Blocks Status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Required Study Blocks:</span>
                  <span className="font-bold text-white">{currentChallenge.requiredBlocks} Blocks</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Verified Completed:</span>
                  <span className="font-bold text-emerald-400">{activeDay.completedBlocksCount} Blocks</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Remaining to Pass:</span>
                  <span className={`font-bold ${remainingBlocks === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {remainingBlocks === 0 ? 'OBJECTIVE MET ✓' : `${remainingBlocks} Blocks`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    activeDay.completedBlocksCount >= currentChallenge.requiredBlocks
                      ? 'bg-emerald-400 shadow-hud-emerald'
                      : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, (activeDay.completedBlocksCount / currentChallenge.requiredBlocks) * 100)}%` }}
                />
              </div>

              {/* XP Breakdown Card */}
              <div className="p-3 rounded bg-[#080B11]/80 border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                  XP EARNING BREAKDOWN:
                </span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Primary Mission ({currentChallenge.name}):</span>
                  <span className="text-cyan-400">+{currentChallenge.xpReward} XP</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Mystery Side Quest:</span>
                  <span className={activeDay.sideQuest.completed ? 'text-emerald-400' : 'text-slate-500'}>
                    {activeDay.sideQuest.completed ? '+25 XP (Claimed)' : '+25 XP (Pending)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Urge Intercept Coping ({activeDay.urgeAttacks.filter(u => u.xpAwarded).length}/3):</span>
                  <span className="text-amber-400">
                    +{activeDay.urgeAttacks.filter(u => u.xpAwarded).length * 10} XP
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Verified Study Blocks ({activeDay.completedBlocksCount}):</span>
                  <span className="text-emerald-400">
                    +{activeDay.completedBlocksCount * 15} XP
                  </span>
                </div>
              </div>

              {/* App Blocker Recommendation */}
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1 text-slate-400 text-[11px]">
                <strong className="text-slate-300 block font-mono">
                  Enforce Habit With OS-Level Tools:
                </strong>
                <p>
                  To reinforce your browser commitment, pair Dopamine Zero with <strong>Cold Turkey Blocker</strong> on PC and <strong>AppBlock</strong> or <strong>Digital Wellbeing</strong> on your smartphone.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* All Application Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => {}}
      />

      <UrgeAttackModal
        isOpen={isUrgeOpen}
        onClose={() => setIsUrgeOpen(false)}
      />

      <DailyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onVictory={() => setIsVictoryOpen(true)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <NearMissModal
        isOpen={isNearMissOpen}
        onClose={() => setIsNearMissOpen(false)}
      />

      <DailyScheduleEditor
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      <HistoryAnalytics
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <EmergencyPauseModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <DashboardContent />
    </GameProvider>
  );
}

export default App;
