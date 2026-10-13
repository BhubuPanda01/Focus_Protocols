import React, { useState } from 'react';
import { EyeOff, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface NearMissModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NearMissModal: React.FC<NearMissModalProps> = ({ isOpen, onClose }) => {
  const { recordNearMiss, activeDay } = useGame();
  const [app, setApp] = useState('YouTube Shorts');
  const [action, setAction] = useState('Closed app immediately within 3 seconds');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordNearMiss(app, action);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="hud-panel w-full max-w-md rounded-xl p-6 border border-amber-500/50 shadow-hud-amber relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              LOG ACCIDENTAL NEAR-MISS
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-sm font-mono font-bold text-white uppercase">
              NEAR-MISS LOGGED
            </h4>
            <p className="text-xs text-slate-400">
              Discipline preserved. Immediate correction prevents relapse. Keep going!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 text-amber-200">
              <span className="font-bold block mb-0.5">Tactical Principle:</span>
              Accidentally tapping an app and immediately closing it is NOT a mission failure. Honest reporting sharpens your threat detection.
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                APPLICATION INVOLVED:
              </label>
              <select
                value={app}
                onChange={(e) => setApp(e.target.value)}
                className="w-full bg-[#080B11] border border-slate-800 rounded px-3 py-2 text-slate-200"
              >
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="X / Twitter Feed">X / Twitter Feed</option>
                <option value="Reddit Infinite Scroll">Reddit Infinite Scroll</option>
                <option value="Other Feeds">Other Entertainment Feed</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                IMMEDIATE ACTION TAKEN:
              </label>
              <input
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="e.g. Realized reflex, closed tab, returned to book"
                className="w-full bg-[#080B11] border border-slate-800 rounded px-3 py-2 text-slate-200"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase"
              >
                Log Event
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
