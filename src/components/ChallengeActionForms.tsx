import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Smartphone, 
  BrainCircuit, 
  HelpCircle, 
  Flame, 
  FileCheck2, 
  Trophy, 
  Sparkles, 
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { 
  RecallExercise, 
  PracticeQuestionsLog, 
  HardestTopicData, 
  TimedQuizData, 
  BossBattleReviewData 
} from '../types';

export const Day2SilentTableForm: React.FC = () => {
  const { settings, activeDay, updateMealCheck } = useGame();

  return (
    <div className="bg-[#080B11]/70 border border-[#1E2C4A] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1E2C4A]/60 pb-2">
        <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          DAY 2: SCREEN-FREE MEAL PROTOCOL
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">No YouTube / Shorts / Reels</span>
      </div>

      <div className="space-y-2">
        {settings.meals.map((meal) => {
          const state = activeDay.mealsChecked[meal.id] || { checked: false };
          return (
            <div 
              key={meal.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-[#0E1424] border border-slate-800 gap-2"
            >
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={state.checked}
                  onChange={(e) => updateMealCheck(meal.id, e.target.checked, state.notes, undefined)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 w-4 h-4"
                />
                <span>{meal.name}: Screen-Free Completed</span>
              </label>

              {!state.checked && (
                <div className="flex items-center gap-2 text-[11px]">
                  <input
                    type="text"
                    value={state.skippedReason || ''}
                    onChange={(e) => updateMealCheck(meal.id, false, state.notes, e.target.value)}
                    placeholder="Skipped / altered schedule reason..."
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs w-48"
                  />
                </div>
              )}

              {state.checked && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3" /> Screen-Free Verified
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Day3PhantomPhoneForm: React.FC = () => {
  const { activeDay, updatePhoneParking, settings } = useGame();
  const [locationInput, setLocationInput] = useState(activeDay.phoneParking.location || '');

  const handleSaveLocation = () => {
    updatePhoneParking(activeDay.phoneParking.parked, locationInput, activeDay.phoneParking.followedWindows);
  };

  return (
    <div className="bg-[#080B11]/70 border border-[#1E2C4A] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1E2C4A]/60 pb-2">
        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-blue-400" />
          DAY 3: PHYSICAL PHONE PARKING CHECKLIST
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">Air-Gap Protection</span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-2.5 rounded bg-[#0E1424] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={activeDay.phoneParking.parked}
              onChange={(e) => updatePhoneParking(e.target.checked, locationInput, activeDay.phoneParking.followedWindows)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 w-4 h-4"
            />
            <span>Phone Physically Deposited Away from Study Zone</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onBlur={handleSaveLocation}
              placeholder="e.g. Living room charging dock..."
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs w-56"
            />
            <button
              onClick={handleSaveLocation}
              className="px-2 py-1 bg-blue-900/60 hover:bg-blue-800 border border-blue-500/40 rounded text-blue-200 font-mono text-[10px]"
            >
              SAVE
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded bg-[#0E1424] border border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={activeDay.phoneParking.followedWindows}
              onChange={(e) => updatePhoneParking(activeDay.phoneParking.parked, locationInput, e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 w-4 h-4"
            />
            <span>Adhered strictly to scheduled phone-check windows only</span>
          </label>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            {settings.phoneCheckWindows.map(w => w.start).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Day4MemoryRaidForm: React.FC = () => {
  const { activeDay, saveRecallExercise, savePracticeQuestions } = useGame();

  const [recall, setRecall] = useState<RecallExercise>(activeDay.recallExercise || {
    subject: '',
    topic: '',
    remembered: '',
    forgotten: '',
    revisionPlan: '',
  });

  const [questions, setQuestions] = useState<PracticeQuestionsLog>(activeDay.practiceQuestions || {
    attempted: 15,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  });

  const [savedRecallNotice, setSavedRecallNotice] = useState(false);
  const [savedQuestionsNotice, setSavedQuestionsNotice] = useState(false);

  const handleSaveRecall = (e: React.FormEvent) => {
    e.preventDefault();
    saveRecallExercise(recall);
    setSavedRecallNotice(true);
    setTimeout(() => setSavedRecallNotice(false), 2000);
  };

  const handleSaveQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    savePracticeQuestions(questions);
    setSavedQuestionsNotice(true);
    setTimeout(() => setSavedQuestionsNotice(false), 2000);
  };

  return (
    <div className="bg-[#080B11]/70 border border-[#1E2C4A] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1E2C4A]/60 pb-2">
        <h4 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
          <BrainCircuit className="w-4 h-4 text-violet-400" />
          DAY 4: CLOSED-BOOK RECALL & PRACTICE QUESTIONS
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">Active Retrieval</span>
      </div>

      {/* Part 1: Closed-Book Recall Drill */}
      <form onSubmit={handleSaveRecall} className="p-3 rounded bg-[#0E1424] border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-200">1. CLOSED-BOOK RECALL DRILL</span>
          {savedRecallNotice && <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Subject</label>
            <input
              type="text"
              value={recall.subject}
              onChange={(e) => setRecall({ ...recall, subject: e.target.value })}
              placeholder="e.g. Operating Systems"
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Topic</label>
            <input
              type="text"
              value={recall.topic}
              onChange={(e) => setRecall({ ...recall, topic: e.target.value })}
              placeholder="e.g. Deadlock Detection Algorithms"
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-mono text-emerald-400 block mb-0.5">What I Remembered</label>
            <textarea
              rows={2}
              value={recall.remembered}
              onChange={(e) => setRecall({ ...recall, remembered: e.target.value })}
              placeholder="Key concepts retrieved..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-amber-400 block mb-0.5">What I Forgot / Blanks</label>
            <textarea
              rows={2}
              value={recall.forgotten}
              onChange={(e) => setRecall({ ...recall, forgotten: e.target.value })}
              placeholder="Gaps noticed..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-cyan-400 block mb-0.5">Specific Revision Plan</label>
            <textarea
              rows={2}
              value={recall.revisionPlan}
              onChange={(e) => setRecall({ ...recall, revisionPlan: e.target.value })}
              placeholder="Formulas / diagrams to re-check..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3 py-1 bg-violet-600 hover:bg-violet-500 rounded font-mono text-xs text-white font-bold"
          >
            Save Recall Exercise
          </button>
        </div>
      </form>

      {/* Part 2: 15+ Practice Questions */}
      <form onSubmit={handleSaveQuestions} className="p-3 rounded bg-[#0E1424] border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-200">2. PRACTICE QUESTIONS (MINIMUM 15)</span>
          {savedQuestionsNotice && <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Attempted</label>
            <input
              type="number"
              min="0"
              value={questions.attempted}
              onChange={(e) => setQuestions({ ...questions, attempted: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-emerald-400 block mb-0.5">Correct</label>
            <input
              type="number"
              min="0"
              value={questions.correct}
              onChange={(e) => setQuestions({ ...questions, correct: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-emerald-300 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-red-400 block mb-0.5">Incorrect</label>
            <input
              type="number"
              min="0"
              value={questions.incorrect}
              onChange={(e) => setQuestions({ ...questions, incorrect: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-red-300 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Unanswered</label>
            <input
              type="number"
              min="0"
              value={questions.unanswered}
              onChange={(e) => setQuestions({ ...questions, unanswered: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-slate-400">
            {questions.attempted >= 15 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Target requirement met ({questions.attempted}/15)
              </span>
            ) : (
              <span className="text-amber-400">
                Minimum 15 questions required ({questions.attempted}/15)
              </span>
            )}
          </span>
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded font-mono text-xs text-slate-950 font-bold"
          >
            Save Questions Log
          </button>
        </div>
      </form>
    </div>
  );
};

export const Day5HardestFirstForm: React.FC = () => {
  const { activeDay, saveHardestTopic } = useGame();
  const [data, setData] = useState<HardestTopicData>(activeDay.hardestTopicData || {
    topic: '',
    notes: '',
    completedInFirstBlock: false,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveHardestTopic(data);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#080B11]/70 border border-[#1E2C4A] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1E2C4A]/60 pb-2">
        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" />
          DAY 5: HARDEST AVOIDED TOPIC TARGETING
        </h4>
        {savedNotice && <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>}
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">
            Identify the single most avoided academic topic:
          </label>
          <input
            type="text"
            value={data.topic}
            onChange={(e) => setData({ ...data, topic: e.target.value })}
            placeholder="e.g. Compiler Design Bottom-Up Parsing..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">
            Document actual work and breakthroughs completed during Block 1:
          </label>
          <textarea
            rows={2}
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            placeholder="Key derivations completed, problems tackled..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
            required
          />
        </div>

        <div className="p-2.5 rounded bg-[#0E1424] border border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={data.completedInFirstBlock}
              onChange={(e) => setData({ ...data, completedInFirstBlock: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 w-4 h-4"
            />
            <span>I executed the very first independent study block exclusively on this topic.</span>
          </label>
          <button
            type="submit"
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded font-mono text-xs text-slate-950 font-bold"
          >
            Save Target
          </button>
        </div>
      </div>
    </form>
  );
};

export const Day6DistractionAmbushForm: React.FC = () => {
  const { activeDay, saveTimedQuiz } = useGame();
  const [data, setData] = useState<TimedQuizData>(activeDay.timedQuizData || {
    durationMinutes: 30,
    subject: '',
    score: '',
    totalQuestions: 20,
    mistakesAnalyzed: '',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTimedQuiz(data);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#080B11]/70 border border-[#1E2C4A] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1E2C4A]/60 pb-2">
        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-orange-400" />
          DAY 6: TIMED QUIZ & ERROR DISSECTION
        </h4>
        {savedNotice && <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Quiz Subject / Topic</label>
          <input
            type="text"
            value={data.subject}
            onChange={(e) => setData({ ...data, subject: e.target.value })}
            placeholder="e.g. DBMS Normalization"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Duration (Mins)</label>
          <input
            type="number"
            value={data.durationMinutes}
            onChange={(e) => setData({ ...data, durationMinutes: Number(e.target.value) })}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Score / Result (e.g. 16/20)</label>
          <input
            type="text"
            value={data.score}
            onChange={(e) => setData({ ...data, score: e.target.value })}
            placeholder="16/20"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono"
            required
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="text-[10px] font-mono text-orange-400 block mb-0.5">
          Mistake Analysis (Dissect reason for every lost mark):
        </label>
        <textarea
          rows={2}
          value={data.mistakesAnalyzed}
          onChange={(e) => setData({ ...data, mistakesAnalyzed: e.target.value })}
          placeholder="Q4: Calculation error in B+ tree order. Q9: Confused 2NF with 3NF transitive dependency..."
          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded font-mono text-xs text-slate-950 font-bold"
        >
          Save Quiz Analysis
        </button>
      </div>
    </form>
  );
};

export const Day7BossBattleForm: React.FC = () => {
  const { activeDay, saveBossBattleReview } = useGame();
  const [data, setData] = useState<BossBattleReviewData>(activeDay.bossBattleReview || {
    totalBlocksCompleted: activeDay.completedBlocksCount,
    totalVerifiedMinutes: activeDay.completedBlocksCount * 45,
    topicsStudied: '',
    sectionalTestResults: '',
    commonMistakes: '',
    mostFrequentDistraction: '',
    bestPerformingSession: '',
    oneImprovementNextRun: '',
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBossBattleReview(data);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#080B11]/70 border border-red-500/40 rounded-lg p-4 space-y-3 shadow-hud-red">
      <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
        <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-red-400 animate-pulse-subtle" />
          DAY 7: THE BOSS BATTLE — SECTIONAL TEST & WEEKLY OPERATIONAL REVIEW
        </h4>
        {savedNotice && <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Sectional Test Score & Details</label>
          <input
            type="text"
            value={data.sectionalTestResults}
            onChange={(e) => setData({ ...data, sectionalTestResults: e.target.value })}
            placeholder="e.g. Mock Test 3: 42/65 marks (Gate Level)"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Topics Studied This Week</label>
          <input
            type="text"
            value={data.topicsStudied}
            onChange={(e) => setData({ ...data, topicsStudied: e.target.value })}
            placeholder="OS, DBMS, Data Structures"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[10px] font-mono text-amber-400 block mb-0.5">Common Mistakes Discovered</label>
          <textarea
            rows={2}
            value={data.commonMistakes}
            onChange={(e) => setData({ ...data, commonMistakes: e.target.value })}
            placeholder="Rushing through question stems, formula recall lag..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-red-400 block mb-0.5">Most Frequent Distraction / Trap</label>
          <textarea
            rows={2}
            value={data.mostFrequentDistraction}
            onChange={(e) => setData({ ...data, mostFrequentDistraction: e.target.value })}
            placeholder="Impulse to check tech news or YouTube shorts after lunch..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[10px] font-mono text-cyan-400 block mb-0.5">Best-Performing Study Session</label>
          <input
            type="text"
            value={data.bestPerformingSession}
            onChange={(e) => setData({ ...data, bestPerformingSession: e.target.value })}
            placeholder="Morning Block 1: High focus on memory management"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-emerald-400 block mb-0.5">One Concrete Improvement for Next Run</label>
          <input
            type="text"
            value={data.oneImprovementNextRun}
            onChange={(e) => setData({ ...data, oneImprovementNextRun: e.target.value })}
            placeholder="Park phone before sitting down at desk without exception"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded font-mono text-xs text-white font-bold tracking-wider uppercase shadow-hud-red"
        >
          Submit Weekly Operational Review
        </button>
      </div>
    </form>
  );
};
