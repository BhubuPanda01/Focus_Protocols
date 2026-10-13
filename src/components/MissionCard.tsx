import React from 'react';
import { 
  ShieldAlert, 
  Target, 
  Award, 
  CheckCircle2, 
  Play, 
  BookOpen, 
  Check, 
  AlertCircle,
  FileText,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CHALLENGE_DEFINITIONS, getDifficultyColor } from '../utils/challenges';
import { 
  Day2SilentTableForm, 
  Day3PhantomPhoneForm, 
  Day4MemoryRaidForm, 
  Day5HardestFirstForm, 
  Day6DistractionAmbushForm, 
  Day7BossBattleForm 
} from './ChallengeActionForms';

interface MissionCardProps {
  onOpenRules: () => void;
  onOpenReport: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ onOpenRules, onOpenReport }) => {
  const { activeDay, startMission } = useGame();

  const challenge = CHALLENGE_DEFINITIONS[activeDay.challengeId] || CHALLENGE_DEFINITIONS[1];
  const diffColors = getDifficultyColor(challenge.difficulty);

  const isCompleted = activeDay.status === 'COMPLETED';
  const isFailed = activeDay.status === 'FAILED';
  const isPaused = activeDay.status === 'EMERGENCY_PAUSED';
  const isReady = activeDay.completedBlocksCount >= challenge.requiredBlocks;

  return (
    <div className={`hud-panel rounded-xl p-5 border transition-all duration-300 relative ${
      isCompleted 
        ? 'border-emerald-500/50 shadow-hud-emerald bg-emerald-950/10'
        : isFailed
        ? 'border-red-500/50 shadow-hud-red bg-red-950/10'
        : isPaused
        ? 'border-amber-500/50 shadow-hud-amber bg-amber-950/10'
        : 'border-cyan-500/40 shadow-hud-cyan'
    }`}>
      
      {/* Top Tactical Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2C4A]/80 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              DAILY PRIMARY DIRECTIVE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">
              CHALLENGE #{challenge.id} OF 7
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${diffColors.text} ${diffColors.bg} ${diffColors.border}`}>
              TIER: {challenge.difficulty}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-mono tracking-wider text-white uppercase mt-1">
            {challenge.name}
          </h3>
          <p className="text-xs font-mono text-slate-400">{challenge.subtitle}</p>
        </div>

        {/* Mission Status Badge & XP Available */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">REWARD</span>
            <div className="flex items-center gap-1 text-cyan-300 font-mono font-bold text-sm">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>+{challenge.xpReward} XP</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded font-mono text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
            isCompleted
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
              : isFailed
              ? 'bg-red-950/80 border-red-500/60 text-red-300'
              : isPaused
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
              : activeDay.status === 'ACTIVE'
              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {isFailed && <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>STATUS: {activeDay.status.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* Tactical Operational Quote Banner */}
      <div className="my-4 px-4 py-2.5 rounded-lg bg-[#080B11]/80 border-l-4 border-cyan-400 border-y border-r border-[#1E2C4A] text-xs sm:text-sm text-cyan-200/90 italic font-sans flex items-center justify-between">
        <span>"{challenge.quote}"</span>
        <span className="text-[10px] font-mono not-italic text-slate-500 shrink-0 ml-3">
          TACTICAL MOTTO
        </span>
      </div>

      {/* Description & Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        
        {/* Mission Briefing */}
        <div className="bg-[#080B11]/50 border border-[#1E2C4A] rounded-lg p-3.5 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            MISSION DIRECTIVE:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {challenge.description}
          </p>

          <div className="pt-2 border-t border-[#1E2C4A]/60">
            <span className="text-[10px] font-mono text-cyan-400 block mb-1">
              PRIMARY CLEAR OBJECTIVE:
            </span>
            <p className="text-xs font-semibold text-slate-100">
              {challenge.primaryObjective}
            </p>
          </div>
        </div>

        {/* Requirements Checklist with Live Progress */}
        <div className="bg-[#080B11]/50 border border-[#1E2C4A] rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              ENGAGEMENT CRITERIA:
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {activeDay.completedBlocksCount} / {challenge.requiredBlocks} BLOCKS COMPLETE
            </span>
          </div>

          {/* Progress bar for blocks */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                activeDay.completedBlocksCount >= challenge.requiredBlocks 
                  ? 'bg-emerald-400 shadow-hud-emerald' 
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (activeDay.completedBlocksCount / challenge.requiredBlocks) * 100)}%` }}
            />
          </div>

          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                activeDay.completedBlocksCount >= challenge.requiredBlocks 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {activeDay.completedBlocksCount >= challenge.requiredBlocks ? '✓' : '•'}
              </span>
              <span>
                Complete <strong>{challenge.requiredBlocks} verified study blocks</strong> ({challenge.requiredBlocks * 45} mins).
              </span>
            </li>

            {challenge.specialRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  •
                </span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Dynamic Day-Specific Action Form */}
      <div className="my-4">
        {challenge.id === 2 && <Day2SilentTableForm />}
        {challenge.id === 3 && <Day3PhantomPhoneForm />}
        {challenge.id === 4 && <Day4MemoryRaidForm />}
        {challenge.id === 5 && <Day5HardestFirstForm />}
        {challenge.id === 6 && <Day6DistractionAmbushForm />}
        {challenge.id === 7 && <Day7BossBattleForm />}
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1E2C4A]/80">
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 transition w-full sm:w-auto justify-center"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>VIEW PROTOCOL RULES</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeDay.status === 'NOT_STARTED' && (
            <button
              onClick={startMission}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold tracking-wider uppercase transition shadow-hud-cyan"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              START MISSION
            </button>
          )}

          <button
            onClick={onOpenReport}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded font-mono text-xs font-extrabold tracking-wider uppercase transition ${
              isCompleted
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                : isReady
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-hud-emerald animate-pulse-subtle'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-hud-violet'
            }`}
          >
            <FileText className="w-4 h-4" />
            {isCompleted ? 'VIEW DEBRIEF REPORT' : isReady ? 'SUBMIT MISSION REPORT (READY)' : 'SUBMIT DAILY DEBRIEF'}
          </button>
        </div>
      </div>

    </div>
  );
};
