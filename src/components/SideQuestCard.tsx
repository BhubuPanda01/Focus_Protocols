import React from 'react';
import { Sparkles, CheckCircle2, Circle, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const SideQuestCard: React.FC = () => {
  const { activeDay, completeSideQuest } = useGame();
  const quest = activeDay.sideQuest;

  if (!quest) return null;

  return (
    <div className={`hud-panel rounded-xl p-4 border transition-all duration-300 relative ${
      quest.completed
        ? 'border-violet-500/50 bg-violet-950/15 shadow-hud-violet'
        : 'border-slate-800 bg-[#0E1424]/70 hover:border-slate-700'
    }`}>
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
            quest.completed 
              ? 'bg-violet-900/40 text-violet-300 border border-violet-500/40' 
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-violet-400 font-bold">
                MYSTERY SIDE QUEST (OPTIONAL)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-0.5 font-semibold">
                <Award className="w-3 h-3" /> +{quest.xpReward} XP
              </span>
            </div>

            <h4 className="text-sm font-bold font-mono text-slate-100 mt-0.5">
              {quest.title}
            </h4>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {quest.description}
            </p>
          </div>
        </div>

        {/* Complete Toggle Button */}
        <button
          onClick={completeSideQuest}
          disabled={quest.completed}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold transition ${
            quest.completed
              ? 'bg-violet-950/80 border border-violet-500/50 text-violet-300 cursor-default'
              : 'bg-slate-800 hover:bg-violet-900/60 border border-slate-700 hover:border-violet-500/40 text-slate-200 hover:text-white'
          }`}
        >
          {quest.completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              <span>COMPLETED</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>MARK COMPLETE</span>
            </>
          )}
        </button>

      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>* Optional tactical bonus objective. Failure does not penalize run streak.</span>
        <span>Quest ID: {quest.id}</span>
      </div>
    </div>
  );
};
