import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatMinutesSeconds } from '../utils/time';
import { StudyBlock } from '../types';

export const FocusTimer: React.FC = () => {
  const { 
    settings, 
    timerState, 
    activeDay, 
    startFocusTimer, 
    startBreakTimer, 
    pauseTimer, 
    resumeTimer, 
    endTimerEarly 
  } = useGame();

  const [taskInput, setTaskInput] = useState('');
  const [selectedBlockType, setSelectedBlockType] = useState<StudyBlock['type']>('INDEPENDENT');
  const [taskError, setTaskError] = useState('');

  const TASK_EXAMPLES = [
    'Revise Process Synchronization & Semaphores',
    'Solve 15 Previous-Year Questions on DBMS',
    'Study Memory Management & Paging Concepts',
    'Review Mistake Post-Mortem from Timed Quiz',
    'Closed-Book Recall Drill: Computer Networks',
  ];

  const handleStartFocus = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!taskInput.trim()) {
      setTaskError('Operation Error: Specific academic task required before launching focus block.');
      return;
    }
    setTaskError('');
    startFocusTimer(taskInput, selectedBlockType, settings.blockDurationMinutes);
    setTaskInput('');
  };

  const handleSelectExample = (ex: string) => {
    setTaskInput(ex);
    setTaskError('');
  };

  // Timer calculations
  const totalSeconds = timerState?.targetSeconds || (settings.blockDurationMinutes * 60);
  const remainingSeconds = timerState ? timerState.secondsRemaining : totalSeconds;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

  // Circular gauge calculations
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const isFocus = timerState?.mode === 'FOCUS';
  const isBreak = timerState?.mode === 'BREAK';

  return (
    <div className="hud-panel rounded-xl p-5 border border-[#1E2C4A] shadow-lg relative overflow-hidden">
      
      {/* Decorative Tactical Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2C4A]/70 mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
            TACTICAL FOCUS TIMER
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Blocks Completed Today:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
            {activeDay.completedBlocksCount}
          </span>
        </div>
      </div>

      {/* Main Timer Display Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
        
        {/* Circular HUD Timer Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="#131B2E"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke={isBreak ? '#8B5CF6' : progressPercent > 90 ? '#10B981' : '#00F0FF'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Digital Readout Center */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-[10px] font-mono tracking-widest uppercase font-bold px-2 py-0.5 rounded mb-1 ${
              isBreak
                ? 'bg-violet-950 text-violet-300 border border-violet-500/40'
                : isFocus
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse-subtle'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {isBreak ? 'TACTICAL RECHARGE' : isFocus ? 'FOCUS BLOCK ENGAGED' : 'SYSTEM STANDBY'}
            </span>

            <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider text-white">
              {formatMinutesSeconds(remainingSeconds)}
            </div>

            <div className="text-xs font-mono text-slate-400 mt-1">
              {isFocus ? (
                <span className="text-cyan-400 truncate max-w-[170px] inline-block font-semibold">
                  {timerState?.task}
                </span>
              ) : isBreak ? (
                <span className="text-violet-300 font-semibold">Rest, Hydrate, No Feeds</span>
              ) : (
                <span>Preset: {settings.blockDurationMinutes}m Work / {settings.breakDurationMinutes}m Break</span>
              )}
            </div>

            {/* Current progress indicator */}
            {timerState && (
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {Math.round(progressPercent)}% ELAPSED
              </span>
            )}
          </div>
        </div>

        {/* Timer Controls & Task Selection Form */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          
          {timerState ? (
            /* Active Timer Controls */
            <div className="flex flex-col gap-4 bg-[#080B11]/70 border border-[#1E2C4A] p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    CURRENT MISSION OBJECTIVE:
                  </div>
                  <div className="text-sm font-semibold text-slate-200 break-words">
                    {timerState.task}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    TYPE: {timerState.blockType}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {timerState.isRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold transition shadow-hud-amber"
                  >
                    <Pause className="w-4 h-4" />
                    PAUSE TIMER
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-mono text-xs font-bold transition shadow-hud-cyan"
                  >
                    <Play className="w-4 h-4 fill-slate-900" />
                    RESUME TIMER
                  </button>
                )}

                <button
                  onClick={endTimerEarly}
                  title="Aborting early will NOT award verified study time"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-600/40 text-red-300 font-mono text-xs transition"
                >
                  <Square className="w-3.5 h-3.5" />
                  END EARLY
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Strict Protocol: Ending or abandoning early will NOT record verified study minutes.</span>
              </div>
            </div>
          ) : (
            /* Standby Task Configuration Form */
            <form onSubmit={handleStartFocus} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  WHAT EXACT TASK ARE YOU TACKLING?
                </label>
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => {
                    setTaskInput(e.target.value);
                    if (taskError) setTaskError('');
                  }}
                  placeholder="e.g. Revise OS process synchronization..."
                  className="w-full px-3 py-2 bg-[#080B11] border border-[#1E2C4A] focus:border-cyan-400 focus:outline-hidden rounded text-sm text-slate-100 font-sans placeholder-slate-600 transition"
                />
                {taskError && (
                  <p className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {taskError}
                  </p>
                )}
              </div>

              {/* Block Category Selector */}
              <div>
                <span className="block text-[11px] font-mono text-slate-400 mb-1">
                  SESSION CLASSIFICATION:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                  {(['INDEPENDENT', 'HARD_TOPIC', 'QUIZ'] as StudyBlock['type'][]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedBlockType(type)}
                      className={`px-2 py-1.5 rounded border transition text-center ${
                        selectedBlockType === type
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-[#080B11]/60 border-[#1E2C4A] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type === 'INDEPENDENT' ? 'Standard Study' : type === 'HARD_TOPIC' ? 'Hard Topic' : 'Timed Quiz'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Task Examples */}
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Quick Tactical Templates:
                </span>
                <div className="flex flex-wrap gap-1">
                  {TASK_EXAMPLES.slice(0, 3).map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectExample(ex)}
                      className="text-[10px] font-sans text-slate-400 hover:text-cyan-300 bg-[#080B11] border border-slate-800 hover:border-slate-700 rounded px-2 py-1 transition text-left truncate max-w-full"
                    >
                      + {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Action Launch Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold tracking-wider transition uppercase shadow-hud-cyan"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  START FOCUS ({settings.blockDurationMinutes}M)
                </button>

                <button
                  type="button"
                  onClick={() => startBreakTimer(settings.breakDurationMinutes)}
                  title="Take a short break"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-violet-950/60 hover:bg-violet-900 border border-violet-500/40 text-violet-300 font-mono text-xs transition"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  BREAK ({settings.breakDurationMinutes}M)
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
