import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Wind, 
  CheckCircle, 
  X, 
  Clock, 
  Award, 
  Sparkles, 
  AlertCircle,
  HelpCircle 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { tacticalAudio } from '../utils/audio';

interface UrgeAttackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrgeAttackModal: React.FC<UrgeAttackModalProps> = ({ isOpen, onClose }) => {
  const { activeDay, logUrgeAttack, resolveUrgeAttack } = useGame();
  
  const [activeUrgeId, setActiveUrgeId] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [breathingPhase, setBreathingPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE' | 'REST'>('INHALE');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [hasFinishedCountdown, setHasFinishedCountdown] = useState(false);
  const [resolutionStep, setResolutionStep] = useState(false);

  // Today's rewards count
  const awardedTodayCount = activeDay.urgeAttacks.filter(u => u.xpAwarded).length;

  useEffect(() => {
    if (isOpen) {
      // Start 60s countdown
      const id = logUrgeAttack();
      setActiveUrgeId(id);
      setSecondsRemaining(60);
      setIsCountingDown(true);
      setHasFinishedCountdown(false);
      setResolutionStep(false);
    } else {
      setIsCountingDown(false);
    }
  }, [isOpen]);

  // 60-second timer and 4-second box breathing cycle
  useEffect(() => {
    if (!isCountingDown) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsCountingDown(false);
          setHasFinishedCountdown(true);
          setResolutionStep(true);
          tacticalAudio.playGroundingBell();
          return 0;
        }

        // Box breathing phases every 4 seconds
        const elapsed = 60 - (prev - 1);
        const phaseIndex = Math.floor((elapsed % 16) / 4);
        const phases: ('INHALE' | 'HOLD' | 'EXHALE' | 'REST')[] = ['INHALE', 'HOLD', 'EXHALE', 'REST'];
        setBreathingPhase(phases[phaseIndex]);

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountingDown]);

  const handleResolution = (returned: boolean) => {
    if (activeUrgeId) {
      resolveUrgeAttack(activeUrgeId, returned);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="hud-panel w-full max-w-lg rounded-xl p-6 border border-cyan-500/50 shadow-hud-cyan relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Tactical Corner Marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              URGE INTERCEPT PROTOCOL
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!resolutionStep ? (
          /* 60s Grounding and Breathing Step */
          <div className="flex flex-col items-center text-center space-y-6 py-2">
            
            {/* Grounding Mantra */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-cyan-300 tracking-wide">
                "An urge is not an instruction."
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Notice the dopamine reflex without reacting to it. You do not need to satisfy the itch. Stay still for 60 seconds.
              </p>
            </div>

            {/* Tactical Breathing Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/40 transition-all duration-1000 ${
                breathingPhase === 'INHALE' ? 'scale-110 border-cyan-400 bg-cyan-500/10' :
                breathingPhase === 'HOLD' ? 'scale-110 border-violet-400 bg-violet-500/10' :
                breathingPhase === 'EXHALE' ? 'scale-90 border-cyan-500/30' : 'scale-90 border-slate-700'
              }`} />

              {/* Inner glowing circle */}
              <div className="w-32 h-32 rounded-full bg-[#080B11] border border-cyan-400/50 flex flex-col items-center justify-center shadow-hud-cyan z-10">
                <span className="text-3xl font-mono font-black text-white">
                  {secondsRemaining}s
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase mt-1">
                  {breathingPhase === 'INHALE' ? 'BREATHE IN (4s)' :
                   breathingPhase === 'HOLD' ? 'HOLD AIR (4s)' :
                   breathingPhase === 'EXHALE' ? 'BREATHE OUT (4s)' : 'HOLD STILL (4s)'}
                </span>
              </div>
            </div>

            {/* Tactical Coping Prompts */}
            <div className="p-3 rounded-lg bg-[#080B11]/90 border border-slate-800 text-xs text-slate-300 text-left space-y-1.5 w-full">
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                <Wind className="w-3 h-3" />
                NEURO-GROUNDING OBSERVATIONS:
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Short-video feeds are designed by teams of engineers to hijack dopamine receptors.</li>
                <li>• Opening a 15-second reel costs 45 minutes of fractured cognitive focus.</li>
                <li>• You committed to Operation February 6. The urge peaks in 90 seconds and dissolves.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsCountingDown(false);
                setResolutionStep(true);
              }}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition underline"
            >
              Skip countdown directly to debrief
            </button>

          </div>
        ) : (
          /* Resolution & XP Award Step */
          <div className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center mx-auto text-cyan-300 mb-2">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                INTERCEPTION CYCLE COMPLETED
              </h3>
              <p className="text-xs text-slate-300">
                Did you successfully defeat the urge and return to your planned task?
              </p>
            </div>

            <div className="p-3 rounded bg-[#080B11] border border-slate-800 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                URGE RESISTANCE XP STATUS TODAY:
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {awardedTodayCount} / 3 REWARDS CLAIMED TODAY (+10 XP EACH)
              </span>
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleResolution(false)}
                className="py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold transition"
              >
                No, lost momentum
              </button>

              <button
                onClick={() => handleResolution(true)}
                className="py-2.5 px-4 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold tracking-wider uppercase transition shadow-hud-cyan flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Yes, Resumed Focus (+10 XP)
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center italic mt-2">
              Note: This is a self-reported tactical coping tool. It does not monitor installed mobile apps or device activity.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
