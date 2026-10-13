import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Save, 
  Volume2, 
  VolumeX, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PhoneCheckWindow, UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    updateSettings, 
    exportDataJson, 
    importDataJson, 
    manualFailRun, 
    performFactoryReset 
  } = useGame();

  const [form, setForm] = useState<UserSettings>({ ...settings });
  const [importText, setImportText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFactoryConfirm, setShowFactoryConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handleAddPhoneWindow = () => {
    const newWindow: PhoneCheckWindow = {
      id: 'pcw-' + Date.now(),
      start: '15:00',
      end: '15:15',
      label: 'Afternoon Check',
    };
    setForm({
      ...form,
      phoneCheckWindows: [...form.phoneCheckWindows, newWindow],
    });
  };

  const handleRemovePhoneWindow = (id: string) => {
    setForm({
      ...form,
      phoneCheckWindows: form.phoneCheckWindows.filter(w => w.id !== id),
    });
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dopamine_zero_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importDataJson(importText);
    if (ok) {
      setImportStatus('Backup data restored successfully!');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus('Error: Invalid JSON backup file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hud-panel w-full max-w-3xl rounded-xl p-6 border border-cyan-500/50 shadow-hud-cyan relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2C4A] pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
              OPERATOR CONFIGURATION & SYSTEM PREFERENCES
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="overflow-y-auto pr-2 space-y-5 text-xs text-slate-300">
          
          {/* Identity & Dates */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-3">
            <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              1. OPERATOR IDENTIFICATION & CAMPAIGN TIMELINE
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Operator Callsign
                </label>
                <input
                  type="text"
                  value={form.callsign}
                  onChange={(e) => setForm({ ...form, callsign: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Campaign Start Date
                </label>
                <input
                  type="date"
                  value={form.campaignStartDate}
                  onChange={(e) => setForm({ ...form, campaignStartDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  required
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Routine & Durations */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-3">
            <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              2. DAILY CIRCADIAN SCHEDULE & FOCUS DURATIONS
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Wake-Up Time</label>
                <input
                  type="time"
                  value={form.wakeUpTime}
                  onChange={(e) => setForm({ ...form, wakeUpTime: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Sleep Time Target</label>
                <input
                  type="time"
                  value={form.sleepTime}
                  onChange={(e) => setForm({ ...form, sleepTime: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Focus Block (Mins)</label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={form.blockDurationMinutes}
                  onChange={(e) => setForm({ ...form, blockDurationMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Break Duration (Mins)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={form.breakDurationMinutes}
                  onChange={(e) => setForm({ ...form, breakDurationMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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

          {/* Scheduled Phone-Check Windows */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                3. SCHEDULED PHONE-CHECK WINDOWS
              </h4>
              <button
                type="button"
                onClick={handleAddPhoneWindow}
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add Window
              </button>
            </div>

            <div className="space-y-2">
              {form.phoneCheckWindows.map((w, idx) => (
                <div key={w.id} className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                  <input
                    type="text"
                    value={w.label}
                    onChange={(e) => {
                      const updated = [...form.phoneCheckWindows];
                      updated[idx].label = e.target.value;
                      setForm({ ...form, phoneCheckWindows: updated });
                    }}
                    placeholder="Window Name"
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 flex-1"
                  />
                  <input
                    type="time"
                    value={w.start}
                    onChange={(e) => {
                      const updated = [...form.phoneCheckWindows];
                      updated[idx].start = e.target.value;
                      setForm({ ...form, phoneCheckWindows: updated });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="time"
                    value={w.end}
                    onChange={(e) => {
                      const updated = [...form.phoneCheckWindows];
                      updated[idx].end = e.target.value;
                      setForm({ ...form, phoneCheckWindows: updated });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoneWindow(w.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audio & Accessibility */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-3">
            <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              4. AUDIO & INTERFACE ACCESSIBILITY
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.soundEnabled}
                  onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Synthesized Audio Effects</span>
                  <span className="text-[10px] text-slate-400">Offline Web Audio chimes for timer and missions</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.reducedMotion}
                  onChange={(e) => setForm({ ...form, reducedMotion: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Reduced Motion Mode</span>
                  <span className="text-[10px] text-slate-400">Disable UI animations for maximum cognitive calm</span>
                </div>
              </label>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="p-3.5 rounded bg-[#080B11] border border-slate-800 space-y-3">
            <h4 className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              5. DATA BACKUP & RESTORE (JSON)
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Export Campaign Backup (.json)
              </button>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste JSON backup text here..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleImport}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Import
                </button>
              </div>
            </div>
            {importStatus && (
              <p className="text-xs font-mono text-cyan-300">{importStatus}</p>
            )}
          </div>

          {/* Dangerous Tactical Zone (Reset Run / Factory Reset) */}
          <div className="p-3.5 rounded bg-red-950/20 border border-red-500/40 space-y-3">
            <h4 className="font-mono text-red-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              6. CRITICAL RUN & SYSTEM CONTROLS
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(!showResetConfirm)}
                className="px-3 py-2 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-600/50 text-red-300 font-mono text-xs text-left"
              >
                Reset Current 7-Day Run (Preserves All History)
              </button>

              <button
                type="button"
                onClick={() => setShowFactoryConfirm(!showFactoryConfirm)}
                className="px-3 py-2 rounded bg-red-900/40 hover:bg-red-900/60 border border-red-700/60 text-red-400 font-mono text-xs text-left"
              >
                Full Factory Reset
              </button>
            </div>

            {showResetConfirm && (
              <div className="p-3 rounded bg-red-950/80 border border-red-500 space-y-2">
                <p className="text-red-200 font-semibold">
                  Confirm 7-Day Run Reset: This will reset your streak to 0, but your historical logs, study minutes, and XP remain preserved.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      manualFailRun('Operator self-reported reset');
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded"
                  >
                    Confirm Run Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showFactoryConfirm && (
              <div className="p-3 rounded bg-red-950/90 border border-red-500 space-y-2">
                <p className="text-red-200 font-semibold">
                  Warning: Factory reset erases all localStorage data including settings, history, and streaks.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={performFactoryReset}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded"
                  >
                    Confirm Factory Wipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFactoryConfirm(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#1E2C4A] flex items-center justify-between shrink-0">
            <span className="font-mono text-emerald-400 text-xs">
              {savedNotice ? 'Settings Saved Successfully!' : ''}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Close
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition shadow-hud-cyan flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
