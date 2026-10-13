import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Flame, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Calendar, 
  Settings, 
  BarChart3, 
  AlertOctagon,
  EyeOff
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { calculateExamCountdown, CountdownResult } from '../utils/time';
import { CHALLENGE_DEFINITIONS, getDifficultyColor } from '../utils/challenges';

interface HeaderProps {
  onOpenRules: () => void;
  onOpenSchedule: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenEmergency: () => void;
  onOpenNearMiss: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  onOpenSchedule,
  onOpenSettings,
  onOpenHistory,
  onOpenEmergency,
  onOpenNearMiss,
}) => {
  const { settings, progress, activeDay } = useGame();
  const [countdown, setCountdown] = useState<CountdownResult>(() => 
    calculateExamCountdown(settings.examDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateExamCountdown(settings.examDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.examDate]);

  const currentChallenge = CHALLENGE_DEFINITIONS[activeDay.challengeId] || CHALLENGE_DEFINITIONS[1];
  const diffColors = getDifficultyColor(currentChallenge.difficulty);

  // Operator Rank based on Total XP
  const getRank = (xp: number) => {
    if (xp >= 2000) return 'COMMANDER';
    if (xp >= 1400) return 'VANGUARD OPERATIVE';
    if (xp >= 800) return 'SPECIALIST';
    if (xp >= 400) return 'OPERATOR';
    return 'RECRUIT';
  };

  // Scheduled study minutes for today based on challenge required blocks
  const scheduledMinutes = currentChallenge.requiredBlocks * settings.blockDurationMinutes;
  const verifiedMinutes = activeDay.completedBlocksCount * settings.blockDurationMinutes;

  return (
    <header className="w-full bg-[#0E1424]/90 border-b border-[#1E2C4A] hud-grid sticky top-0 z-30 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Protocol Title */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded-lg shadow-hud-cyan">
              <Shield className="w-6 h-6 text-cyan-400 animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/40 text-violet-300 font-mono">
                  {settings.callsign || 'OPERATOR'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                  {getRank(progress.totalXp)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-widest text-white uppercase">
                DOPAMINE ZERO
              </h1>
              <p className="text-[11px] text-slate-400 italic hidden sm:block">
                "Zero feeds. Pure execution. Earn your focus."
              </p>
            </div>
          </div>

          {/* Exam Countdown HUD Display */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#080B11]/90 border border-cyan-500/30 rounded-lg px-4 py-2 shadow-hud-cyan">
            <div className="text-right">
              <div className="text-[10px] font-mono text-cyan-400/90 tracking-wider uppercase flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                EXAM COUNTDOWN [IST]
              </div>
              <div className="text-base sm:text-lg font-mono font-bold tracking-widest text-white flex items-center gap-1.5">
                <span><span className="text-cyan-400">{countdown.days}</span>d</span>
                <span className="text-slate-500">:</span>
                <span><span className="text-cyan-400">{String(countdown.hours).padStart(2, '0')}</span>h</span>
                <span className="text-slate-500">:</span>
                <span><span className="text-cyan-400">{String(countdown.minutes).padStart(2, '0')}</span>m</span>
                <span className="text-slate-500">:</span>
                <span className="text-xs text-slate-400">{String(countdown.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Quick Tactical Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={onOpenRules}
              title="Tactical Protocol Rules"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-cyan-300 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Rules</span>
            </button>

            <button
              onClick={onOpenSchedule}
              title="Daily Schedule & Timetable"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-cyan-300 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Schedule</span>
            </button>

            <button
              onClick={onOpenNearMiss}
              title="Log Accidental App Open (Near-Miss)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 text-xs text-amber-300 hover:text-amber-200 transition"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Near-Miss</span>
            </button>

            <button
              onClick={onOpenHistory}
              title="Campaign Analytics & History"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-cyan-300 transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={onOpenEmergency}
              title="Emergency / Health Pause"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-900/40 border border-red-600/40 text-xs text-red-300 hover:text-red-200 transition"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Pause</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Operator Settings"
              className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tactical Status & Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-3 pt-3 border-t border-[#1E2C4A]/70 text-xs font-mono">
          
          {/* Campaign Day */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <span className="text-[10px] text-slate-400 block">CAMPAIGN DAY</span>
            <span className="text-cyan-400 font-bold text-sm">
              DAY {activeDay.campaignDayIndex} <span className="text-slate-500 text-xs">/30</span>
            </span>
          </div>

          {/* Challenge & Difficulty */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <span className="text-[10px] text-slate-400 block">CHALLENGE #{activeDay.challengeId}</span>
            <span className={`font-bold text-xs truncate block ${diffColors.text}`}>
              {currentChallenge.name}
            </span>
          </div>

          {/* 7-Day Run Streak */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">7-DAY STREAK</span>
              <Flame className="w-3 h-3 text-amber-400" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-amber-400 font-bold text-sm">{progress.currentRunStreak}/7</span>
              <div className="flex gap-0.5 ml-1">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className={`w-1.5 h-3 rounded-xs ${
                      num <= progress.currentRunStreak
                        ? num === 7 ? 'bg-red-400 shadow-hud-red' : 'bg-amber-400 shadow-hud-amber'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">TOTAL XP</span>
              <Award className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-cyan-300 font-bold text-sm">
              {progress.totalXp} <span className="text-[10px] text-slate-500">XP</span>
            </span>
          </div>

          {/* Completed Missions */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <span className="text-[10px] text-slate-400 block">MISSIONS CLEARED</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {progress.totalCompletedMissions}
            </span>
          </div>

          {/* 7-Day Runs Beaten */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2">
            <span className="text-[10px] text-slate-400 block">RUNS COMPLETED</span>
            <span className="text-violet-400 font-bold text-sm">
              {progress.totalRunsCompleted} <span className="text-[10px] text-slate-500">Cycles</span>
            </span>
          </div>

          {/* Verified Study Minutes */}
          <div className="bg-[#080B11]/60 border border-[#1E2C4A] rounded p-2 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">VERIFIED / SCHEDULED</span>
              <span className="text-[10px] text-emerald-400">TODAY</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-emerald-400 font-bold text-sm">
                {verifiedMinutes}m
              </span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-slate-400 text-xs">
                {scheduledMinutes}m req
              </span>
              <span className="text-[10px] text-cyan-400 ml-auto hidden sm:inline">
                ({progress.totalStudyMinutes}m all-time)
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
