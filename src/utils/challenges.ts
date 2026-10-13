import { ChallengeDefinition, DifficultyTier, SideQuest } from '../types';

export const CHALLENGE_DEFINITIONS: Record<number, ChallengeDefinition> = {
  1: {
    id: 1,
    name: 'COLD START',
    subtitle: 'Initiation Protocol',
    difficulty: 'RECRUIT',
    quote: 'Your mission is not to finish everything. Your mission is to begin.',
    xpReward: 100,
    description: 'Break initial study inertia. Start the first block without waiting for motivation or checking entertainment apps first.',
    primaryObjective: 'Complete 2 verified 45-minute study blocks. Start the first block within 15 minutes of your target.',
    requiredBlocks: 2,
    specialRequirements: [
      'Enter an exact task description before starting each block.',
      'Begin Block 1 without checking social feeds or entertainment.',
      'Submit the evening debrief report.',
    ],
    passConditions: [
      'At least 2 verified study blocks completed (90 total focus minutes).',
      'No deliberate short-video feeds opened.',
      'Daily report submitted honestly.',
    ],
    failureConditions: [
      'Deliberate short-video scrolling (YouTube Shorts, Reels).',
      'Zero verified blocks completed.',
      'Abandoning the study commitment.',
    ],
    bonusObjective: 'Begin within 5 minutes of study target.',
    bonusXp: 20,
  },
  2: {
    id: 2,
    name: 'THE SILENT TABLE',
    subtitle: 'Dopamine Detachment Protocol',
    difficulty: 'OPERATIVE',
    quote: 'Food is fuel. A meal is not an invitation to scroll.',
    xpReward: 100,
    description: 'Sever the automatic reflex of pairing meals with passive video feeds. Protect your cognitive bandwidth during recovery.',
    primaryObjective: 'Complete 3 verified study blocks. Eat all meals screen-free with 0 video feeds.',
    requiredBlocks: 3,
    specialRequirements: [
      'Breakfast complete with no screens or video feeds.',
      'Lunch complete with no screens or video feeds.',
      'Dinner complete with no screens or video feeds.',
      'Clear dining area immediately after eating and return to planned routine.',
    ],
    passConditions: [
      'At least 3 verified study blocks completed.',
      'All registered meals marked completed screen-free (or noted if skipped due to schedule).',
      'Daily report submitted honestly.',
    ],
    failureConditions: [
      'Consuming YouTube Shorts, Reels, or video streaming while eating.',
      'Fewer than 3 verified blocks completed.',
    ],
    bonusObjective: 'Take a 10-minute mindful walk after lunch instead of checking phone.',
    bonusXp: 20,
  },
  3: {
    id: 3,
    name: 'PHANTOM PHONE',
    subtitle: 'Physical Air-Gap Protocol',
    difficulty: 'VANGUARD',
    quote: 'Your phone does not need your attention every time you remember it exists.',
    xpReward: 100,
    description: 'Eliminate friction from peripheral vision and phantom vibrations. Physically park the mobile device away from your study zone.',
    primaryObjective: 'Complete 3 verified study blocks with phone physically parked outside study area.',
    requiredBlocks: 3,
    specialRequirements: [
      'Physically deposit phone in another room or inside a drawer.',
      'Record designated parking location in the app.',
      'Check phone only during scheduled phone-check windows.',
      'Exception: Phone allowed nearby only during authorized Class Mode.',
    ],
    passConditions: [
      'At least 3 verified study blocks completed.',
      'Phone parking checklist confirmed with verified location.',
      'Phone check windows respected during independent study.',
    ],
    failureConditions: [
      'Phone kept on the desk during independent study blocks.',
      'Unscheduled impulsive phone checking during focus blocks.',
    ],
    bonusObjective: 'Leave phone on silent / Do Not Disturb mode for the entire study day.',
    bonusXp: 20,
  },
  4: {
    id: 4,
    name: 'MEMORY RAID',
    subtitle: 'Active Retrieval Protocol',
    difficulty: 'SPECIALIST',
    quote: 'Understanding is useful. Remembering and applying it without help is the real test.',
    xpReward: 100,
    description: 'Passive re-reading creates an illusion of competence. Attack your memory with closed-book recall and test questions.',
    primaryObjective: 'Complete 4 study blocks, 1 closed-book recall exercise, and at least 15 practice questions.',
    requiredBlocks: 4,
    specialRequirements: [
      'Perform 1 closed-book recall exercise (record what was remembered and what was forgotten).',
      'Attempt at least 15 relevant practice questions with honest accuracy logs.',
      'Review gaps in knowledge identified during recall.',
    ],
    passConditions: [
      'At least 4 verified study blocks completed.',
      'Closed-book recall exercise submitted with subject, topic, and gap analysis.',
      'At least 15 practice questions logged with accuracy score.',
    ],
    failureConditions: [
      'Skipping the closed-book recall exercise.',
      'Fewer than 15 practice questions attempted.',
      'Fewer than 4 study blocks completed.',
    ],
    bonusObjective: 'Attempt 25+ practice questions instead of 15.',
    bonusXp: 25,
  },
  5: {
    id: 5,
    name: 'HARDEST FIRST',
    subtitle: 'Frontal Assault Protocol',
    difficulty: 'ELITE',
    quote: 'Do the difficult thing before your brain negotiates its way out of it.',
    xpReward: 100,
    description: 'Procrastination feeds on avoidance. Identify the single most intimidating topic and execute Block 1 directly on it.',
    primaryObjective: 'Complete 4 study blocks, with the very first independent block dedicated to your most avoided topic.',
    requiredBlocks: 4,
    specialRequirements: [
      'Identify and log your most dreaded academic topic prior to starting study.',
      'Execute Block 1 exclusively on this topic (must be genuine study, not mere desk tidying).',
      'Record specific breakthrough points or problems solved.',
    ],
    passConditions: [
      'At least 4 verified study blocks completed.',
      'First independent block logged with the designated hard topic.',
      'Hard topic notes and progress documented.',
    ],
    failureConditions: [
      'Starting with easy comfort tasks or tidying instead of the hard topic.',
      'Fewer than 4 study blocks completed.',
    ],
    bonusObjective: 'Solve at least 5 difficult previous-year problems in the hard topic.',
    bonusXp: 25,
  },
  6: {
    id: 6,
    name: 'DISTRACTION AMBUSH',
    subtitle: 'Cognitive Defense Protocol',
    difficulty: 'COMMANDER',
    quote: 'Today, distractions attack before you gain momentum. Do not give them the first move.',
    xpReward: 100,
    description: 'Guard your early momentum. Complete your first 3 blocks completely untouched by social feeds, take a timed quiz, and dissect mistakes.',
    primaryObjective: 'Complete 4 study blocks, finish blocks 1-3 before any entertainment, and execute 1 timed quiz with full error analysis.',
    requiredBlocks: 4,
    specialRequirements: [
      'Zero entertainment or short video exposure before completing Blocks 1, 2, and 3.',
      'Execute 1 timed exam-simulation quiz.',
      'Dissect and document every question answered incorrectly or left unattempted.',
    ],
    passConditions: [
      'At least 4 verified study blocks completed.',
      'Timed quiz logged with duration, score, and error analysis.',
      'Blocks 1-3 completed prior to any leisure screen time.',
    ],
    failureConditions: [
      'Giving into distraction or feeds before finishing Block 3.',
      'Skipping quiz mistake analysis.',
      'Fewer than 4 blocks completed.',
    ],
    bonusObjective: 'Re-solve all missed quiz questions from scratch.',
    bonusXp: 25,
  },
  7: {
    id: 7,
    name: 'THE BOSS BATTLE',
    subtitle: 'Campaign Climax Protocol',
    difficulty: 'APEX',
    quote: 'You do not need a perfect score. You need honest effort, completed work, and a clear understanding of your mistakes.',
    xpReward: 150,
    description: 'The pinnacle of the 7-day tactical cycle. Execute 5 study blocks, conquer a full timed sectional test, analyze every failure, and complete the Weekly Operational Review.',
    primaryObjective: 'Complete 5 study blocks, 1 sectional test with error post-mortem, and submit the complete Weekly Review.',
    requiredBlocks: 5,
    specialRequirements: [
      'Complete 5 verified focus blocks (can include sectional test and analysis).',
      'Take a full timed sectional exam simulation.',
      'Conduct complete mistake post-mortem.',
      'Submit the comprehensive Weekly Operational Review.',
    ],
    passConditions: [
      'At least 5 verified study blocks completed.',
      'Sectional test completed and recorded.',
      'Full weekly operational debriefing submitted with all required review fields.',
    ],
    failureConditions: [
      'Fewer than 5 verified blocks completed.',
      'Skipping the sectional test or weekly review submission.',
      'Giving into short-video feeds.',
    ],
    bonusObjective: 'Document 3 actionable rules to implement in the next 7-day run.',
    bonusXp: 30,
  },
};

// 12 Predefined Mystery Side Quests
export const MYSTERY_SIDE_QUESTS: Omit<SideQuest, 'completed'>[] = [
  {
    id: 'sq-1',
    title: 'Precision Focus',
    description: 'Solve 10 questions without opening unrelated websites or browser tabs.',
    xpReward: 25,
  },
  {
    id: 'sq-2',
    title: 'Blind Recall Check',
    description: 'Revise one complex formula or concept completely from memory before looking at your notes.',
    xpReward: 25,
  },
  {
    id: 'sq-3',
    title: 'Rapid Deployment',
    description: 'Begin your next scheduled study block within five minutes of the target start time.',
    xpReward: 25,
  },
  {
    id: 'sq-4',
    title: 'Error Post-Mortem',
    description: 'Review and re-solve five specific mistakes made in a previous mock or test.',
    xpReward: 25,
  },
  {
    id: 'sq-5',
    title: 'Total Perimeter Lock',
    description: 'Keep your phone parked outside the study room for an entire uninterrupted 45-minute block.',
    xpReward: 25,
  },
  {
    id: 'sq-6',
    title: 'Single-Tab Discipline',
    description: 'Complete one study session using only one reference document without switching tabs once.',
    xpReward: 25,
  },
  {
    id: 'sq-7',
    title: 'Tactical Recon Log',
    description: 'Write down exactly three core takeaways or principles you learned today in concise bullet points.',
    xpReward: 25,
  },
  {
    id: 'sq-8',
    title: 'Feynman Broadcast',
    description: 'Explain a difficult concept aloud in your own simple words without looking at any textbook.',
    xpReward: 25,
  },
  {
    id: 'sq-9',
    title: 'Revision Vanguard',
    description: 'Complete a focused 10-minute speed revision session before consuming any evening entertainment.',
    xpReward: 25,
  },
  {
    id: 'sq-10',
    title: 'Nightfall Briefing',
    description: 'Write down tomorrow\'s exact first study topic and open the textbook page before going to sleep.',
    xpReward: 25,
  },
  {
    id: 'sq-11',
    title: 'Flaw Elimination',
    description: 'Identify one habitual mistake you make repeatedly in problem-solving and formulate a fix.',
    xpReward: 25,
  },
  {
    id: 'sq-12',
    title: 'Apex Problem Review',
    description: 'Dissect the single hardest question you encountered today and write down the key trick needed.',
    xpReward: 25,
  },
];

// Deterministic or pseudorandom side quest picker for a given date
export function getSideQuestForDay(dateStr: string, campaignDay: number): SideQuest {
  // Use day index to pick a quest deterministically so it doesn't shuffle unexpectedly on page refresh
  const index = (campaignDay - 1 + dateStr.length) % MYSTERY_SIDE_QUESTS.length;
  const quest = MYSTERY_SIDE_QUESTS[index];
  return {
    ...quest,
    completed: false,
  };
}

export function getDifficultyColor(tier: DifficultyTier): { text: string; bg: string; border: string } {
  switch (tier) {
    case 'RECRUIT':
      return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    case 'OPERATIVE':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    case 'VANGUARD':
      return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    case 'SPECIALIST':
      return { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' };
    case 'ELITE':
      return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    case 'COMMANDER':
      return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    case 'APEX':
      return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  }
}
