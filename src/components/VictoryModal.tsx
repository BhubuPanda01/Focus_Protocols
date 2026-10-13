import React, { useEffect } from 'react';
import { Trophy, Award, Flame, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, onClose }) => {
  const { progress, activeDay, settings } = useGame();

  useEffect(() => {
    if (isOpen) {
      // Fire tactical confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#8B5CF6', '#10B981', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-xl rounded-xl p-6 border-2 border-red-500/80 shadow-hud-red relative overflow-hidden text-center space-y-5 animate-in zoom-in-95 duration-300">
        
        {/* Decorative corner glows */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400" />

        <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-400 flex items-center justify-center mx-auto text-red-300 shadow-hud-red">
          <Trophy className="w-8 h-8 text-red-400 animate-bounce" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            OPERATION CLIMAX ACHIEVED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-mono text-white uppercase tracking-wider">
            THE BOSS BATTLE CONQUERED!
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You stood firm across all 7 operational protocols without falling to short-video dopamine traps.
          </p>
        </div>

        {/* 7-Day Run Summary Card */}
        <div className="p-4 rounded-lg bg-[#080B11]/90 border border-slate-800 text-xs font-mono space-y-2 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 uppercase">7-DAY CAMPAIGN CYCLE:</span>
            <span className="text-emerald-400 font-bold">CYCLE #{progress.totalRunsCompleted} COMPLETE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-slate-500 block">TOTAL VERIFIED FOCUS:</span>
              <strong className="text-cyan-300 text-sm">{progress.totalStudyMinutes} minutes</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">COMPLETED STUDY BLOCKS:</span>
              <strong className="text-cyan-300 text-sm">{progress.totalStudyBlocks} blocks</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">TOTAL XP ACCUMULATED:</span>
              <strong className="text-amber-300 text-sm">{progress.totalXp} XP</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">TOTAL MISSIONS CLEARED:</span>
              <strong className="text-emerald-300 text-sm">{progress.totalCompletedMissions} cleared</strong>
            </div>
          </div>
        </div>

        {/* Tactical Quote */}
        <div className="p-3 rounded bg-red-950/20 border border-red-500/30 text-xs text-red-200 italic">
          "You do not need a perfect score. You need honest effort, completed work, and a clear understanding of your mistakes."
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-extrabold uppercase tracking-wider transition shadow-hud-red"
        >
          Proceed to Next Strategic Cycle
        </button>

      </div>
    </div>
  );
};
