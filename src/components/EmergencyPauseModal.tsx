import React, { useState } from 'react';
import { AlertOctagon, HeartPulse, X, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface EmergencyPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyPauseModal: React.FC<EmergencyPauseModalProps> = ({ isOpen, onClose }) => {
  const { triggerEmergencyPause, activeDay } = useGame();
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    triggerEmergencyPause(reason.trim());
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="hud-panel w-full max-w-md rounded-xl p-6 border border-red-500/50 shadow-hud-red relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              EMERGENCY / HEALTH PROTOCOL PAUSE
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="py-6 text-center space-y-2">
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-sm font-mono font-bold text-white uppercase">
              EMERGENCY PAUSE ENGAGED
            </h4>
            <p className="text-xs text-slate-400">
              Today's challenge is frozen. Take care of your health or emergency. Stand by for recovery.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded bg-red-950/20 border border-red-500/30 text-red-200 leading-relaxed">
              <span className="font-bold block mb-1 font-mono">STAND-DOWN DIRECTIVE:</span>
              A legitimate illness, acute health need, or genuine family emergency is NOT a failure of character.
              This pause freezes the day without resetting your streak or awarding illegitimate XP.
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1 font-semibold">
                REASON FOR EMERGENCY STAND-DOWN:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Acute migraine / family emergency requiring travel..."
                className="w-full bg-[#080B11] border border-slate-800 rounded p-2.5 text-slate-200 text-xs"
                required
              />
            </div>

            <p className="text-[10px] text-slate-500 italic">
              * Emergency pauses do not award completion XP and do not advance mission progress.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2C4A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition shadow-hud-red"
              >
                Confirm Emergency Stand-Down
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
