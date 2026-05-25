export const barrierGroups = [
  {
    key: 'basicSocialSkillsGap',
    label: 'Basic Social Skills Gap',
    shortLabel: 'Skills',
    questionIndexes: [0, 1],
  },
  {
    key: 'fearOfBeingJudged',
    label: 'Fear of Being Judged',
    shortLabel: 'Judged',
    questionIndexes: [2, 3],
  },
  {
    key: 'socialAvoidance',
    label: 'Social Avoidance',
    shortLabel: 'Avoidance',
    questionIndexes: [4, 5],
  },
  {
    key: 'freezingAroundWomen',
    label: 'Freezing Around Women',
    shortLabel: 'Freeze',
    questionIndexes: [6, 7],
  },
  {
    key: 'physicalAnxietySymptoms',
    label: 'Physical Anxiety Symptoms',
    shortLabel: 'Body',
    questionIndexes: [8, 9],
  },
  {
    key: 'lowSelfDiscipline',
    label: 'Low Self-Discipline',
    shortLabel: 'Follow-through',
    questionIndexes: [10, 11],
  },
];

export const RESULT_KEYS = {
  skillGapFreeze: 'skill_gap_freeze',
  longTermAvoider: 'long_term_avoider',
  bodyReaction: 'body_reaction',
};

export const LOST_YEARS_FLAG_KEY = 'lost_years_flag';

export const RESULT_CONFIG = {
  [RESULT_KEYS.skillGapFreeze]: {
    displayTitle: 'The “I Don’t Know What to Say” Pattern',
    badge: 'Conversation Freeze',
    fieldMissionTitle: 'Day 0 — The "Curiosity Drop" Rep',
    missionName: 'The Curiosity Drop Rep',
    fieldGuidePdf: '/downloads/day-0-field-guide-curiosity-drop.pdf',
    explanation:
      'Your answers suggest that the main block is conversation freeze. You may avoid people because you feel like you missed the basic social script and don’t know what to say next.',
  },
  [RESULT_KEYS.longTermAvoider]: {
    displayTitle: 'The Long-Term Avoider',
    badge: 'High Avoidance',
    fieldMissionTitle: 'Day 0 — The "Hold Your Ground" Rep',
    missionName: 'The Hold Your Ground Rep',
    fieldGuidePdf: '/downloads/day-0-field-guide-hold-your-ground.pdf',
    explanation:
      'Your answers suggest that avoidance is doing most of the damage right now. You may still function in daily life, but you avoid eye contact, small talk, and extra interaction because being seen feels unsafe.',
  },
  [RESULT_KEYS.bodyReaction]: {
    displayTitle: 'The Body-Reaction Pattern',
    badge: 'Body Reaction',
    fieldMissionTitle: 'Day 0 — The "Functional Bypass" Rep',
    missionName: 'The Functional Bypass Rep',
    fieldGuidePdf: '/downloads/day-0-field-guide-functional-bypass.pdf',
    explanation:
      'Your answers suggest that your body reacts before you can act. Your heart races, your face gets hot, or your mind goes blank, especially when the moment feels socially important.',
  },
};

export const resultPatterns = Object.fromEntries(
  Object.entries(RESULT_CONFIG).map(([id, config]) => [
    id,
    {
      id,
      name: config.displayTitle,
      displayTitle: config.displayTitle,
      badge: config.badge,
      mission: config.missionName,
      explanation: config.explanation,
    },
  ]),
);

export const insightCards = [
  {
    title: 'Current Pattern',
    text: 'You pull back before the moment has a chance to become normal.',
  },
  {
    title: 'Biggest Block',
    text: 'Your body or mind treats simple social contact like a high-stakes test.',
  },
  {
    title: 'Best First Move',
    text: 'Start with one small, low-pressure rep today.',
  },
  {
    title: 'Biggest Risk',
    text: 'Letting one awkward moment turn into another week of avoidance.',
  },
];

export const hopeCurvePoints = [
  {
    label: 'Today',
    subtext: 'Avoiding / Freezing / Overthinking',
  },
  {
    label: 'Day 0',
    subtext: 'One safe rep',
  },
  {
    label: 'Week 1',
    subtext: 'Less hesitation',
  },
  {
    label: 'Week 8',
    subtext: 'More normal social access',
  },
];

export const paceOptions = [
  {
    id: '60-seconds',
    title: '60 seconds / day',
    subtitle: 'Smallest possible start',
    description: 'For days when even leaving avoidance feels hard.',
  },
  {
    id: '3-minutes',
    title: '3 minutes / day',
    badge: 'Recommended',
    subtitle: 'Steady re-entry',
    description: 'Enough to complete a real rep without making it feel overwhelming.',
  },
  {
    id: '5-minutes',
    title: '5 minutes / day',
    subtitle: 'Faster practice',
    description: 'For days when you feel ready to stretch a little more.',
  },
];

const averageAnswerValues = (answers, questionIndexes) => {
  const values = questionIndexes.map((index) => Number(answers[index]) || 0);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const answerValue = (answers, index) => Number(answers[index]) || 0;

export const getBarrierScores = (answers) =>
  barrierGroups.map((group) => ({
    ...group,
    score: averageAnswerValues(answers, group.questionIndexes),
  }));

export const getMainResultScores = (answers) => ({
  [RESULT_KEYS.skillGapFreeze]: (answerValue(answers, 0) + answerValue(answers, 1)) * 2,
  [RESULT_KEYS.longTermAvoider]:
    answerValue(answers, 2) +
    answerValue(answers, 3) +
    answerValue(answers, 4) +
    answerValue(answers, 5),
  [RESULT_KEYS.bodyReaction]:
    answerValue(answers, 6) +
    answerValue(answers, 7) +
    answerValue(answers, 8) +
    answerValue(answers, 9),
});

export const resultTieBreakPriority = [
  RESULT_KEYS.bodyReaction,
  RESULT_KEYS.longTermAvoider,
  RESULT_KEYS.skillGapFreeze,
];

export const getResultKey = (answers) => {
  const scores = getMainResultScores(answers);
  const highestScore = Math.max(...Object.values(scores));

  return resultTieBreakPriority.find((key) => scores[key] === highestScore);
};

export const getResultPattern = (answers) => {
  const resultKey = getResultKey(answers) ?? RESULT_KEYS.bodyReaction;
  return resultPatterns[resultKey];
};

export const getLostYearsFlag = (answers) =>
  [answers[12], answers[13]].some((answer) => Number(answer) >= 4);

export const shouldShowLostYearsBlock = getLostYearsFlag;
