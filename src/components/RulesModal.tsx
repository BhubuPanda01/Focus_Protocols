import React from 'react';
import { 
  BookOpen, 
  X, 
  ShieldAlert, 
  VideoOff, 
  Smartphone, 
  Radio, 
  Moon, 
  Flame, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-3xl rounded-xl p-6 border border-cyan-500/50 shadow-hud-cyan relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
              FOCUS PROTOCOL // STANDING ENGAGEMENT RULES
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          
          {/* Mission Core Axiom */}
          <div className="p-3.5 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
            <h4 className="font-mono font-bold text-cyan-300 uppercase tracking-wider mb-1">
              THE CORE COMMITMENT
            </h4>
            <p>
              This protocol is designed to train cognitive resilience for competitive exams. Rules are strict, but reasonable.
              We measure <strong>actual verified focused output</strong>, not mere butt-in-chair hours.
            </p>
          </div>

          {/* Rule A */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase">
              <VideoOff className="w-4 h-4 text-cyan-400" />
              RULE A: ZERO SHORT-VIDEO SCROLLING
            </div>
            <p>
              • Deliberate consumption of short-video feeds (YouTube Shorts, Instagram Reels, TikTok) is strictly prohibited throughout the 30-day campaign.
            </p>
            <p>
              • <strong>Educational Exception:</strong> Opening YouTube specifically to attend a scheduled, planned educational lecture or test solution is permitted. However, autoplaying unrelated recommendations or switching to leisure feeds constitutes a violation.
            </p>
            <p>
              • <strong>Near-Miss Protocol:</strong> If you accidentally tap a short video and close the application within 3 seconds upon realizing, log a <em>Near-Miss</em>. A genuine near-miss does not fail the mission.
            </p>
          </div>

          {/* Rule B */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              RULE B: SCREEN-FREE MEALS
            </div>
            <p>
              • Food is biological fuel; a meal is not an invitation to scroll. All scheduled meals must be eaten with zero videos or social streaming.
            </p>
            <p>
              • After eating, clear your dining area immediately and return to your scheduled academic or recovery block.
            </p>
          </div>

          {/* Rule C */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs uppercase">
              <Smartphone className="w-4 h-4 text-blue-400" />
              RULE C: PHYSICAL PHONE PARKING
            </div>
            <p>
              • Peripheral vision of a phone causes attentional leakage. The phone must remain physically away from the study desk during independent study blocks.
            </p>
            <p>
              • Record your parking location (e.g. charging dock in another room). Check messages strictly during scheduled phone-check windows.
            </p>
          </div>

          {/* Rule D */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-violet-400 font-mono font-bold text-xs uppercase">
              <Radio className="w-4 h-4 text-violet-400" />
              RULE D: AUTHORIZED ONLINE CLASS PHONE USE
            </div>
            <p>
              • We recognize that online students frequently require a phone for live class microphone access, speaking, attendance, or live polls.
            </p>
            <p>
              • When <strong>CLASS MODE</strong> is active, phone use for class participation is 100% permitted and will never trigger a violation.
            </p>
            <p>
              • Class Mode permits academic communication only; social entertainment during class remains forbidden.
            </p>
          </div>

          {/* Rule E */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase">
              <Moon className="w-4 h-4 text-amber-400" />
              RULE E: SLEEP HYGIENE & GENUINE EMERGENCIES
            </div>
            <p>
              • Sleep deprivation severely impairs memory consolidation and exam performance. We do NOT encourage midnight cramming to compensate for unfinished work.
            </p>
            <p>
              • Genuine illnesses or family emergencies must not be treated as moral failures. Use the <strong>Emergency Pause</strong> protocol to freeze progress without losing streak or claiming fake XP.
            </p>
          </div>

          {/* Streak Mechanics */}
          <div className="p-3.5 rounded bg-red-950/20 border border-red-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase">
              <Flame className="w-4 h-4 text-red-400" />
              7-DAY RUN STREAK & RESET MECHANICS
            </div>
            <p>
              • If a primary daily challenge is failed or deliberately violated, the <strong>current 7-day challenge run streak resets to 0</strong>.
            </p>
            <p>
              • <strong>Historical Preservation:</strong> A run reset NEVER deletes your previous logs, study minutes, or XP. It merely requires you to restart the 7-day cycle from Day 1 (Cold Start) to sharpen your discipline.
            </p>
          </div>

          {/* Recommended Blockers */}
          <div className="p-3.5 rounded bg-slate-900 border border-slate-800 space-y-1">
            <h5 className="font-mono text-cyan-400 font-bold uppercase text-[11px]">
              RECOMMENDED OPERATIONAL BLOCKERS (FREE / OFFLINE SETUP):
            </h5>
            <p className="text-[11px] text-slate-400">
              Browser applications cannot monitor installed phone software. To lock down feeds at the OS level, consider:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">Cold Turkey Blocker (PC)</div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">Freedom.to (Multi-platform)</div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">AppBlock (Android/iOS)</div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">StayFocusd / uBlock Origin</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1E2C4A] flex justify-end shrink-0 mt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition"
          >
            Rules Understood
          </button>
        </div>

      </div>
    </div>
  );
};
