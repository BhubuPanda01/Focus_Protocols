import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Award, 
  Star, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CHALLENGE_DEFINITIONS } from '../utils/challenges';
import { DailyReport } from '../types';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory: () => void; // Trigger celebration modal if Boss Battle passed
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose, onVictory }) => {
  const { activeDay, submitDailyReport } = useGame();
  const challenge = CHALLENGE_DEFINITIONS[activeDay.challengeId] || CHALLENGE_DEFINITIONS[1];

  const [rating, setRating] = useState<number>(4);
  const [reflection, setReflection] = useState<string>('');
  const [avoidedShortVideos, setAvoidedShortVideos] = useState<boolean>(true);
  const [screenFreeMeals, setScreenFreeMeals] = useState<boolean>(true);
  const [phoneParked, setPhoneParked] = useState<boolean>(true);
  const [classModeHonest, setClassModeHonest] = useState<boolean>(true);

  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    passed: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const report: DailyReport = {
      submittedAt: new Date().toISOString(),
      rating,
      reflectionNotes: reflection.trim(),
      honestShortVideosAvoided: avoidedShortVideos,
      honestMealsScreenFree: screenFreeMeals,
      honestPhoneParked: phoneParked,
      honestClassModeOnlyForClass: classModeHonest,
    };

    const res = submitDailyReport(report);
    setSubmissionResult({
      submitted: true,
      passed: res.passed,
      message: res.message,
    });

    if (res.passed && res.isBossBattle) {
      setTimeout(() => {
        onVictory();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-2xl rounded-xl p-6 border border-cyan-500/50 shadow-hud-cyan relative overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Tactical Corner Marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              MISSION DEBRIEFING & DAILY REPORT // DAY {activeDay.campaignDayIndex}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submissionResult ? (
          /* Submission Result View */
          <div className="space-y-5 py-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 ${
              submissionResult.passed
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-hud-emerald'
                : 'bg-red-950/80 border-red-500 text-red-300 shadow-hud-red'
            }`}>
              {submissionResult.passed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-400" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-mono tracking-wide text-white uppercase">
                {submissionResult.passed ? 'MISSION CLEARED' : 'RUN CYCLE RESET'}
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                {submissionResult.message}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E2C4A]/60 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold tracking-wider uppercase transition shadow-hud-cyan"
              >
                Acknowledge and Close
              </button>
            </div>
          </div>
        ) : (
          /* Main Debriefing Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Mission Summary Quick Review */}
            <div className="p-3.5 rounded bg-[#080B11]/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold uppercase">
                  CURRENT OBJECTIVE: {challenge.name}
                </span>
                <span className="font-mono text-slate-400">
                  REQUIRED: {challenge.requiredBlocks} BLOCKS ({challenge.requiredBlocks * 45} MINS)
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="text-slate-300">Your Verified Study Blocks:</span>
                <strong className={`px-2 py-0.5 rounded ${
                  activeDay.completedBlocksCount >= challenge.requiredBlocks
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}>
                  {activeDay.completedBlocksCount} / {challenge.requiredBlocks} BLOCKS
                </strong>
                {activeDay.completedBlocksCount < challenge.requiredBlocks && (
                  <span className="text-amber-400">
                    * Submitting with insufficient blocks will reset the 7-day run streak.
                  </span>
                )}
              </div>
            </div>

            {/* Performance Self-Rating */}
            <div>
              <label className="block font-mono text-slate-300 uppercase tracking-wider mb-1.5 font-semibold">
                OPERATIONAL EFFICIENCY RATING:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded font-mono border transition ${
                      rating >= val
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${rating >= val ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                    <span>{val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Honest Commitment Verification Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="block font-mono text-slate-300 uppercase tracking-wider font-semibold">
                HONEST COMMITMENT VERIFICATION:
              </label>

              <div className="space-y-1.5">
                <label className="flex items-start gap-2.5 p-2 rounded bg-[#080B11] border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={avoidedShortVideos}
                    onChange={(e) => setAvoidedShortVideos(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-slate-300">
                    <strong>Rule A:</strong> I did NOT deliberately consume short-video feeds (YouTube Shorts, Reels) today.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-[#080B11] border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={screenFreeMeals}
                    onChange={(e) => setScreenFreeMeals(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-slate-300">
                    <strong>Rule B:</strong> All meals were completed screen-free with zero video streaming.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-[#080B11] border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={phoneParked}
                    onChange={(e) => setPhoneParked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-slate-300">
                    <strong>Rule C:</strong> Phone was physically kept away from my study desk during independent sessions.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded bg-[#080B11] border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={classModeHonest}
                    onChange={(e) => setClassModeHonest(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-slate-300">
                    <strong>Rule D:</strong> Any phone usage was strictly limited to authorized online class requirements.
                  </span>
                </label>
              </div>
            </div>

            {/* Reflection Notes */}
            <div>
              <label className="block font-mono text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                DAILY OPERATIONAL REFLECTION & NOTES:
              </label>
              <textarea
                rows={3}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What went well today? When did distractions test your discipline? What adjustments are needed for tomorrow?"
                className="w-full bg-[#080B11] border border-slate-800 focus:border-cyan-400 rounded p-2.5 text-slate-200 text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1E2C4A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold tracking-wider uppercase transition shadow-hud-cyan flex items-center gap-2"
              >
                <span>SUBMIT FINAL DEBRIEF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
