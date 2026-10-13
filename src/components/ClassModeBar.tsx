import React from 'react';
import { 
  Radio, 
  Mic, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getKolkataTimeString } from '../utils/time';

export const ClassModeBar: React.FC = () => {
  const { classMode, settings, activeDay, toggleClassMode, extendClassMode } = useGame();

  const currentTime = getKolkataTimeString();
  const effectiveEndTime = classMode.authorizedUntil || settings.defaultClassEnd || '09:15';

  return (
    <div className={`w-full transition-all duration-300 border-b ${
      classMode.active 
        ? 'bg-violet-950/40 border-violet-500/50 shadow-hud-violet' 
        : 'bg-[#0B101C]/60 border-[#1E2C4A]/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Status Badge & Information */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleClassMode()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono font-bold tracking-wider transition uppercase ${
                classMode.active
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-hud-violet animate-pulse-subtle'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${classMode.active ? 'animate-spin' : ''}`} />
              {classMode.active ? 'CLASS MODE: ACTIVE' : 'ACTIVATE CLASS MODE'}
            </button>

            <div className="flex items-center gap-2">
              {classMode.active ? (
                <div className="flex items-center gap-2 text-violet-300">
                  <span className="flex items-center gap-1 font-mono font-semibold">
                    <Mic className="w-3.5 h-3.5 text-violet-400" />
                    MIC & COMMS AUTHORIZED
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" />
                    Authorized until: <strong className="text-white">{effectiveEndTime}</strong>
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px] hidden md:flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  Independent Study Rules Active (Phone Parked Away)
                </span>
              )}
            </div>
          </div>

          {/* Action controls (Extensions & Info) */}
          <div className="flex items-center gap-2">
            {classMode.active ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-violet-300 font-mono hidden lg:inline">
                  Lecture running late?
                </span>
                <button
                  onClick={() => extendClassMode(15)}
                  className="px-2 py-1 rounded bg-violet-900/60 hover:bg-violet-800 border border-violet-500/40 text-[11px] font-mono text-violet-200 transition flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  +15m
                </button>
                <button
                  onClick={() => extendClassMode(30)}
                  className="px-2 py-1 rounded bg-violet-900/60 hover:bg-violet-800 border border-violet-500/40 text-[11px] font-mono text-violet-200 transition flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  +30m
                </button>
                <button
                  onClick={() => toggleClassMode(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-mono text-slate-300 transition"
                >
                  End Class
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Default Timetable: {settings.defaultClassStart} - {settings.defaultClassEnd}</span>
              </div>
            )}
          </div>

        </div>

        {/* Tactical Sub-Notice when Active */}
        {classMode.active && (
          <div className="mt-1.5 pt-1.5 border-t border-violet-900/40 flex items-center justify-between text-[10px] text-violet-300/80">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-violet-400" />
              Phone permitted strictly for class microphone, attendance, and polls. Social video feeds remain prohibited.
            </span>
            <span className="font-mono text-slate-400">Current Time: {currentTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};
