import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  Play, 
  FileText, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  VideoOff,
  Smartphone,
  BrainCircuit,
  FileCheck2,
  Trophy
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CHALLENGE_DEFINITIONS, getDifficultyColor } from '../utils/challenges';

interface TodayHeroChallengeProps {
  onOpenRules: () => void;
  onOpenReport: () => void;
  onScrollToTimer: () => void;
}

export const TodayHeroChallenge: React.FC<TodayHeroChallengeProps> = ({
  onOpenRules,
  onOpenReport,
  onScrollToTimer,
}) => {
  const { activeDay, progress, settings, startMission, changeActiveChallenge } = useGame();

  const challenge = CHALLENGE_DEFINITIONS[activeDay.challengeId] || CHALLENGE_DEFINITIONS[1];
  const diffColors = getDifficultyColor(challenge.difficulty);

  const isCompleted = activeDay.status === 'COMPLETED';
  const isFailed = activeDay.status === 'FAILED';
  const isPaused = activeDay.status === 'EMERGENCY_PAUSED';
  const isReady = activeDay.completedBlocksCount >= challenge.requiredBlocks;

  const challengeIcons: Record<number, React.ReactNode> = {
    1: <Clock className="w-5 h-5 text-cyan-400" />,
    2: <VideoOff className="w-5 h-5 text-emerald-400" />,
    3: <Smartphone className="w-5 h-5 text-blue-400" />,
    4: <BrainCircuit className="w-5 h-5 text-violet-400" />,
    5: <Flame className="w-5 h-5 text-amber-400" />,
    6: <FileCheck2 className="w-5 h-5 text-orange-400" />,
    7: <Trophy className="w-5 h-5 text-red-400" />,
  };

  return (
    <section className="w-full space-y-4">
      
      {/* 7-Day Interactive Sequence Stepper (How the challenge changes every day) */}
      <div className="hud-panel rounded-xl p-3 sm:p-4 border border-[#1E2C4A] shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E2C4A]/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              7-DAY CHALLENGE PROGRESSION CYCLE
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              Rotates daily to systematically eliminate distractions and rebuild deep work
            </span>
          </div>

          <span className="text-[11px] text-amber-400 font-bold">
            Current Run: Day {activeDay.challengeId} of 7
          </span>
        </div>

        {/* The 7 Day Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((id) => {
            const def = CHALLENGE_DEFINITIONS[id];
            const isToday = id === activeDay.challengeId;
            const isPast = id < activeDay.challengeId;
            const tierStyle = getDifficultyColor(def.difficulty);

            return (
              <button
                key={id}
                type="button"
                onClick={() => changeActiveChallenge(id)}
                className={`relative p-2.5 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between ${
                  isToday
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-hud-cyan ring-1 ring-cyan-400/50 scale-[1.02] z-10'
                    : isPast
                    ? 'bg-[#0E1424]/60 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#080B11]/60 border-[#1E2C4A] opacity-75 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                {/* Active Indicator Pin */}
                {isToday && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 text-[9px] font-mono font-black tracking-wider uppercase shadow-hud-cyan animate-pulse">
                    TODAY
                  </span>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold ${isToday ? 'text-cyan-300' : 'text-slate-400'}`}>
                    DAY {id}
                  </span>
                  <span className="text-xs">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isToday ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500">{def.requiredBlocks}B</span>
                    )}
                  </span>
                </div>

                <div className={`text-xs font-bold font-mono truncate ${isToday ? 'text-white' : 'text-slate-300'}`}>
                  {def.name}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80 text-[9px] font-mono">
                  <span className={tierStyle.text}>{def.difficulty}</span>
                  <span className="text-slate-400">{def.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ⭐ HERO SECTION: TODAY'S PRIMARY CHALLENGE (PROMINENTLY HIGHLIGHTED) */}
      <div className={`hud-panel rounded-2xl p-6 sm:p-7 border-2 relative overflow-hidden transition-all duration-300 shadow-xl ${
        isCompleted
          ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-950/30 via-[#0E1424] to-[#080B11] shadow-hud-emerald'
          : isFailed
          ? 'border-red-500/60 bg-gradient-to-br from-red-950/30 via-[#0E1424] to-[#080B11] shadow-hud-red'
          : isPaused
          ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/30 via-[#0E1424] to-[#080B11] shadow-hud-amber'
          : 'border-cyan-400 bg-gradient-to-br from-cyan-950/40 via-[#0E1424] to-[#080B11] shadow-hud-cyan'
      }`}>
        
        {/* Radar Corner Brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-cyan-400" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-cyan-400" />

        {/* Priority 1 Directive Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 font-mono text-xs font-black tracking-widest uppercase animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              PRIORITY 1 // TODAY'S PRIMARY DIRECTIVE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
              DAY {activeDay.campaignDayIndex} OF 30 (CHALLENGE #{challenge.id} OF 7)
            </span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-bold ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}>
              TIER: {challenge.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Clear Reward:</span>
            <div className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm shadow-hud-cyan">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>+{challenge.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Main Challenge Title and Objective Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Title & Mission Statement */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-hud-cyan">
                {challengeIcons[challenge.id] || <Target className="w-6 h-6 text-cyan-400" />}
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-wider text-white uppercase">
                  DAY {challenge.id}: {challenge.name}
                </h1>
                <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
                  {challenge.subtitle}
                </p>
              </div>
            </div>

            {/* Tactical Quote Banner */}
            <div className="p-3 rounded-lg bg-[#080B11]/90 border-l-4 border-cyan-400 border-y border-r border-slate-800 text-sm text-cyan-200 italic font-sans flex items-center justify-between">
              <span>"{challenge.quote}"</span>
              <span className="text-[10px] font-mono not-italic text-slate-500 ml-2 shrink-0">
                DAILY AXIOM
              </span>
            </div>

            {/* Clear Primary Objective */}
            <div className="p-3.5 rounded-lg bg-[#080B11]/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                EXACT CRITERIA TO PASS TODAY'S CHALLENGE:
              </span>
              <p className="text-sm font-semibold text-slate-100 leading-snug">
                {challenge.primaryObjective}
              </p>
            </div>
          </div>

          {/* Right Live Status & Progress Box */}
          <div className="lg:col-span-4 bg-[#080B11]/90 border border-[#1E2C4A] rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                TODAY'S MISSION STATUS:
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${
                isCompleted
                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                  : isFailed
                  ? 'bg-red-950 border-red-500/60 text-red-300'
                  : isReady
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 animate-pulse'
                  : activeDay.status === 'ACTIVE'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {isCompleted ? 'CLEARED ✓' : isReady ? 'READY TO SUBMIT' : activeDay.status}
              </span>
            </div>

            {/* Study Blocks Visual Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Focus Blocks Progress:</span>
                <span className="text-cyan-400 font-bold">
                  {activeDay.completedBlocksCount} / {challenge.requiredBlocks} Blocks ({activeDay.completedBlocksCount * settings.blockDurationMinutes}m)
                </span>
              </div>

              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    activeDay.completedBlocksCount >= challenge.requiredBlocks 
                      ? 'bg-emerald-400 shadow-hud-emerald' 
                      : 'bg-cyan-400 shadow-hud-cyan'
                  }`}
                  style={{ width: `${Math.min(100, (activeDay.completedBlocksCount / challenge.requiredBlocks) * 100)}%` }}
                />
              </div>

              <span className="text-[10px] font-mono text-slate-400 block text-right">
                {activeDay.completedBlocksCount >= challenge.requiredBlocks 
                  ? '✓ Required block duration achieved!' 
                  : `${challenge.requiredBlocks - activeDay.completedBlocksCount} more 45m block(s) needed today.`}
              </span>
            </div>

            {/* Quick Action Buttons inside Hero */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {activeDay.status === 'NOT_STARTED' ? (
                <button
                  onClick={startMission}
                  className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider transition shadow-hud-cyan flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  START TODAY'S CHALLENGE
                </button>
              ) : (
                <button
                  onClick={onScrollToTimer}
                  className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider transition shadow-hud-cyan flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 fill-slate-950" />
                  LAUNCH NEXT 45M FOCUS BLOCK
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenReport}
                  className={`py-2 px-2.5 rounded font-mono text-[11px] font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                    isReady
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-hud-emerald animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {isCompleted ? 'View Debrief' : 'Submit Debrief'}
                </button>

                <button
                  onClick={onOpenRules}
                  className="py-2 px-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Rules
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
