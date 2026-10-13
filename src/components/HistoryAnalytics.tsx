import React, { useState } from 'react';
import { 
  BarChart3, 
  X, 
  Calendar, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CHALLENGE_DEFINITIONS } from '../utils/challenges';
import { DayState } from '../types';

interface HistoryAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryAnalytics: React.FC<HistoryAnalyticsProps> = ({ isOpen, onClose }) => {
  const { progress, settings } = useGame();
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const historyEntries = Object.entries(progress.history || {}).sort((a, b) => 
    b[0].localeCompare(a[0]) // Sort newest first
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-4xl rounded-xl p-6 border border-emerald-500/50 shadow-hud-emerald relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
              CAMPAIGN HISTORICAL INTELLIGENCE & ANALYTICS
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 shrink-0 font-mono text-xs">
          <div className="p-3 rounded bg-[#080B11] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TOTAL VERIFIED FOCUS</span>
            <span className="text-emerald-400 font-bold text-lg">
              {progress.totalStudyMinutes} <span className="text-xs text-slate-500">mins</span>
            </span>
          </div>

          <div className="p-3 rounded bg-[#080B11] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TOTAL FOCUS BLOCKS</span>
            <span className="text-cyan-400 font-bold text-lg">
              {progress.totalStudyBlocks} <span className="text-xs text-slate-500">blocks</span>
            </span>
          </div>

          <div className="p-3 rounded bg-[#080B11] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">MISSIONS CLEARED</span>
            <span className="text-violet-400 font-bold text-lg">
              {progress.totalCompletedMissions} <span className="text-xs text-slate-500">days</span>
            </span>
          </div>

          <div className="p-3 rounded bg-[#080B11] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">7-DAY CYCLES CLEARED</span>
            <span className="text-amber-400 font-bold text-lg">
              {progress.totalRunsCompleted} <span className="text-xs text-slate-500">runs</span>
            </span>
          </div>
        </div>

        {/* 7-Day Run History Log */}
        {progress.runHistory && progress.runHistory.length > 0 && (
          <div className="mb-4 shrink-0 p-3 rounded bg-[#080B11]/70 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
              7-DAY RUN CYCLES ATTEMPTS:
            </span>
            <div className="space-y-1 text-xs">
              {progress.runHistory.map((run, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                  <span>Run #{run.runIndex} ({run.startDate} ~ {run.endDate || 'Active'})</span>
                  <span className="text-amber-400">Streak: {run.daysCompleted} days</span>
                  <span className="text-slate-400 truncate max-w-xs">{run.reasonForReset || 'Active'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Logs List */}
        <div className="overflow-y-auto pr-2 space-y-2.5 text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
            INDIVIDUAL MISSION LOGS ({historyEntries.length} DAYS LOGGED):
          </span>

          {historyEntries.length === 0 ? (
            <p className="text-slate-500 font-mono italic text-center py-6">
              No historical logs recorded yet. Begin Day 1 Cold Start!
            </p>
          ) : (
            historyEntries.map(([dateStr, dayState]) => {
              const ch = CHALLENGE_DEFINITIONS[dayState.challengeId] || CHALLENGE_DEFINITIONS[1];
              const isExpanded = selectedDayKey === dateStr;

              return (
                <div 
                  key={dateStr}
                  className={`rounded-lg border transition-all ${
                    dayState.status === 'COMPLETED'
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : dayState.status === 'FAILED'
                      ? 'bg-red-950/15 border-red-500/30'
                      : 'bg-[#080B11] border-slate-800'
                  }`}
                >
                  {/* Summary Bar */}
                  <div 
                    onClick={() => setSelectedDayKey(isExpanded ? null : dateStr)}
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 font-bold">
                        {dateStr}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="font-mono font-semibold text-slate-200">
                        DAY {dayState.campaignDayIndex}: {ch.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        dayState.status === 'COMPLETED' ? 'bg-emerald-900/60 text-emerald-300' :
                        dayState.status === 'FAILED' ? 'bg-red-900/60 text-red-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {dayState.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>{dayState.completedBlocksCount} Blocks</span>
                      <span>{dayState.completedBlocksCount * settings.blockDurationMinutes}m</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Detailed Log */}
                  {isExpanded && (
                    <div className="p-3.5 border-t border-slate-800/80 bg-[#0E1424]/90 space-y-3 font-sans">
                      
                      {/* Completed Study Blocks */}
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">
                          VERIFIED STUDY BLOCKS ({dayState.studyBlocks.length}):
                        </span>
                        {dayState.studyBlocks.length === 0 ? (
                          <span className="text-slate-500 text-[11px]">No completed blocks.</span>
                        ) : (
                          <div className="space-y-1">
                            {dayState.studyBlocks.map((b, idx) => (
                              <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300 text-[11px]">
                                <span className="font-semibold text-white">• {b.task}</span>
                                <span className="font-mono text-cyan-400">{b.durationMinutes} mins ({b.type})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Urge Attacks & Near Misses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-[#080B11] border border-slate-800">
                          <span className="font-mono text-slate-400 block font-bold mb-0.5">
                            Urge Intercepts ({dayState.urgeAttacks?.length || 0}):
                          </span>
                          <span className="text-slate-400">
                            {dayState.urgeAttacks?.filter(u => u.returnedToTask).length || 0} successfully resisted and returned to work.
                          </span>
                        </div>

                        <div className="p-2 rounded bg-[#080B11] border border-slate-800">
                          <span className="font-mono text-slate-400 block font-bold mb-0.5">
                            Accidental Near-Misses ({dayState.nearMisses?.length || 0}):
                          </span>
                          <span className="text-slate-400">
                            {dayState.nearMisses?.map(nm => nm.triggerApp).join(', ') || 'Zero near-misses.'}
                          </span>
                        </div>
                      </div>

                      {/* Debrief reflection */}
                      {dayState.dailyReport?.reflectionNotes && (
                        <div className="p-2 rounded bg-[#080B11] border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 block font-bold">
                            Operator Debrief Notes:
                          </span>
                          <p className="text-slate-300 italic text-[11px] mt-0.5">
                            "{dayState.dailyReport.reflectionNotes}"
                          </p>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1E2C4A] flex justify-end shrink-0 mt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase"
          >
            Close Intelligence Log
          </button>
        </div>

      </div>
    </div>
  );
};
