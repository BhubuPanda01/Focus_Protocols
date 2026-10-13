import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  X, 
  Check, 
  Save, 
  Radio, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { isCurrentlyInSleepWindow, isTimeInRange, timeToMinutes } from '../utils/time';

interface DailyScheduleEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyScheduleEditor: React.FC<DailyScheduleEditorProps> = ({ isOpen, onClose }) => {
  const { settings, activeDay, saveClassScheduleOverride, updateSettings } = useGame();

  const [hasOverride, setHasOverride] = useState(
    activeDay.classScheduleOverride?.hasOverride || false
  );
  const [startTime, setStartTime] = useState(
    activeDay.classScheduleOverride?.startTime || settings.defaultClassStart || '07:00'
  );
  const [endTime, setEndTime] = useState(
    activeDay.classScheduleOverride?.endTime || settings.defaultClassEnd || '09:15'
  );
  const [isCancelled, setIsCancelled] = useState(
    activeDay.classScheduleOverride?.isCancelled || false
  );
  const [reason, setReason] = useState(
    activeDay.classScheduleOverride?.reason || ''
  );

  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveClassScheduleOverride({
      hasOverride,
      startTime,
      endTime,
      isCancelled,
      extensionMinutes: activeDay.classScheduleOverride?.extensionMinutes || 0,
      reason,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  // Check sleep conflict
  const isClassInSleep = isTimeInRange(startTime, settings.sleepTime, settings.wakeUpTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-2xl rounded-xl p-6 border border-cyan-500/50 shadow-hud-cyan relative overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              VARIABLE SCHEDULE & TIMETABLE EDITOR // DAY {activeDay.campaignDayIndex}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Default vs Override Toggle */}
          <div className="p-3.5 rounded bg-[#080B11]/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold uppercase">
                TODAY'S CLASS SCHEDULE CUSTOMIZATION
              </span>
              <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={hasOverride}
                  onChange={(e) => setHasOverride(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-violet-500 focus:ring-0 w-4 h-4"
                />
                <span>Override Default Schedule Today</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Class Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={!hasOverride}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Class End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!hasOverride}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={isCancelled}
                  onChange={(e) => setIsCancelled(e.target.checked)}
                  disabled={!hasOverride}
                  className="rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-0 w-4 h-4 disabled:opacity-50"
                />
                <span>No Classes Today (Class Cancelled / Free Holiday)</span>
              </label>

              {hasOverride && (
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for timetable shift..."
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs w-full sm:w-60"
                />
              )}
            </div>
          </div>

          {/* Sleep Window Warning */}
          {isClassInSleep && (
            <div className="p-3 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-mono">CIRCADIAN WARNING:</strong>
                Configured class time overlaps with your designated sleep window ({settings.sleepTime} - {settings.wakeUpTime}). Protect your sleep for optimal memory retention.
              </div>
            </div>
          )}

          {/* Tactical Daily Routine Timeline Visualizer */}
          <div className="p-3.5 rounded bg-[#080B11]/80 border border-slate-800 space-y-2">
            <span className="font-mono text-cyan-400 font-bold uppercase block text-[11px]">
              DAILY OPERATIONAL TIMELINE PREVIEW:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px] flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> WAKE-UP
                </span>
                <strong className="text-slate-200">{settings.wakeUpTime}</strong>
              </div>

              <div className="p-2 rounded bg-violet-950/40 border border-violet-500/30">
                <span className="text-violet-400 block text-[9px] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-violet-400" /> CLASS WINDOW
                </span>
                <strong className="text-violet-200">
                  {isCancelled ? 'CANCELLED' : `${startTime} - ${endTime}`}
                </strong>
              </div>

              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
                <span className="text-cyan-400 block text-[9px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> FIRST STUDY TARGET
                </span>
                <strong className="text-cyan-200">{settings.firstStudyStartTarget}</strong>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px] flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" /> SLEEP TARGET
                </span>
                <strong className="text-slate-200">{settings.sleepTime}</strong>
              </div>
            </div>

            {/* Phone Check Windows */}
            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-500">Scheduled Phone Check Windows: </span>
              {settings.phoneCheckWindows.map((w, idx) => (
                <span key={w.id} className="text-cyan-300 mr-2">
                  [{w.start} - {w.end}]
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E2C4A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 shadow-hud-violet"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedNotice ? 'SAVED!' : 'SAVE SCHEDULE OVERRIDE'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
