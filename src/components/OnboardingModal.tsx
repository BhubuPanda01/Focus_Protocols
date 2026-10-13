import React, { useState } from 'react';
import { 
  Shield, 
  CheckSquare, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Volume2, 
  Eye, 
  Radio, 
  Smartphone, 
  Sparkles,
  AlertTriangle 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { UserSettings } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { settings, updateSettings } = useGame();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Configuration, Step 2: Protocol Briefing & Acknowledgements
  const [form, setForm] = useState<UserSettings>({ ...settings });

  // Acknowledgement checkboxes
  const [ackShorts, setAckShorts] = useState(false);
  const [ackMeals, setAckMeals] = useState(false);
  const [ackPhone, setAckPhone] = useState(false);
  const [ackClass, setAckClass] = useState(false);
  const [ackEmergency, setAckEmergency] = useState(false);
  const [ackReset, setAckReset] = useState(false);

  if (!isOpen) return null;

  const allAcknowledged = ackShorts && ackMeals && ackPhone && ackClass && ackEmergency && ackReset;

  const handleFinishOnboarding = () => {
    if (!allAcknowledged) return;
    updateSettings({
      ...form,
      hasCompletedOnboarding: true,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-2xl rounded-xl p-6 border-2 border-cyan-500/80 shadow-hud-cyan relative overflow-hidden my-8">
        
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Header */}
        <div className="text-center space-y-1 pb-4 border-b border-[#1E2C4A]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            <Shield className="w-4 h-4 text-cyan-400 animate-pulse-subtle" />
            INITIAL OPERATIONAL BRIEFING
          </div>
          <h2 className="text-2xl font-black font-mono tracking-wider text-white uppercase">
            FOCUS PROTOCOL // OPERATION FEBRUARY 6
          </h2>
          <p className="text-xs text-slate-400 italic">
            "Defeat the distractions. Complete the mission. Earn your focus."
          </p>
        </div>

        {step === 1 ? (
          /* Step 1: Tactical Configuration */
          <div className="space-y-4 py-4 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>STEP 1 OF 2: CAMPAIGN PARAMETERS</span>
              <span className="text-cyan-400 font-bold">TIMETABLE INITIALIZATION</span>
            </div>

            <div className="p-3 rounded bg-[#080B11] border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    Callsign / Codename (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.callsign}
                    onChange={(e) => setForm({ ...form, callsign: e.target.value })}
                    placeholder="e.g. OPERATOR"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    Campaign Start Date (Asia/Kolkata)
                  </label>
                  <input
                    type="date"
                    value={form.campaignStartDate}
                    onChange={(e) => setForm({ ...form, campaignStartDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    Target Exam Date
                  </label>
                  <input
                    type="date"
                    value={form.examDate}
                    onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#080B11] border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Wake-up Time</label>
                  <input
                    type="time"
                    value={form.wakeUpTime}
                    onChange={(e) => setForm({ ...form, wakeUpTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Sleep Time</label>
                  <input
                    type="time"
                    value={form.sleepTime}
                    onChange={(e) => setForm({ ...form, sleepTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Default Class Start</label>
                  <input
                    type="time"
                    value={form.defaultClassStart}
                    onChange={(e) => setForm({ ...form, defaultClassStart: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Default Class End</label>
                  <input
                    type="time"
                    value={form.defaultClassEnd}
                    onChange={(e) => setForm({ ...form, defaultClassEnd: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Study Block (Minutes)</label>
                  <input
                    type="number"
                    value={form.blockDurationMinutes}
                    onChange={(e) => setForm({ ...form, blockDurationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Break Duration (Minutes)</label>
                  <input
                    type="number"
                    value={form.breakDurationMinutes}
                    onChange={(e) => setForm({ ...form, breakDurationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">First Study Start Target</label>
                  <input
                    type="time"
                    value={form.firstStudyStartTarget}
                    onChange={(e) => setForm({ ...form, firstStudyStartTarget: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#080B11] border border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={form.soundEnabled}
                  onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 w-4 h-4"
                />
                <span>Enable Tactical Web Audio Sound Effects</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={form.reducedMotion}
                  onChange={(e) => setForm({ ...form, reducedMotion: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 w-4 h-4"
                />
                <span>Reduced Motion</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition shadow-hud-cyan flex items-center gap-2"
              >
                <span>Proceed to Standing Commitments</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Standing Commitments Acknowledgment */
          <div className="space-y-4 py-4 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>STEP 2 OF 2: RULES OF ENGAGEMENT</span>
              <span className="text-cyan-400 font-bold">MANDATORY COMMITMENT OATH</span>
            </div>

            <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-2.5">
              <p className="text-slate-300 leading-relaxed">
                Before commencing Operation February 6, verify your pledge to the six tactical covenants:
              </p>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackShorts}
                    onChange={(e) => setAckShorts(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>1. No short-video feeds:</strong> I will not deliberately scroll YouTube Shorts, Reels, or infinite video feeds during this 30-day campaign.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackMeals}
                    onChange={(e) => setAckMeals(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>2. Screen-free meals:</strong> I will consume all meals without videos or social media feeds.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackPhone}
                    onChange={(e) => setAckPhone(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>3. Phone parking:</strong> During independent study blocks, my phone will remain physically away from my study desk.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackClass}
                    onChange={(e) => setAckClass(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>4. Authorized Class Phone Use:</strong> Phone use is 100% permitted during Class Mode for microphone, speaking, and attendance.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackEmergency}
                    onChange={(e) => setAckEmergency(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>5. Health & Emergencies First:</strong> Genuine emergencies and illnesses take priority over the game. Sleep deprivation is forbidden.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={ackReset}
                    onChange={(e) => setAckReset(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 w-4 h-4"
                  />
                  <span className="text-slate-200">
                    <strong>6. Run Streak Reset Rule:</strong> A failed primary challenge resets the current 7-day challenge run streak to 0, but historical logs are never erased.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Back to Settings
              </button>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={!allAcknowledged}
                className={`px-6 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition ${
                  allAcknowledged
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-hud-cyan cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {allAcknowledged ? 'ENGAGE FOCUS PROTOCOL' : 'Acknowledge All Commitments to Begin'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
