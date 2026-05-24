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

export const resultPatterns = {
  longTermAvoider: {
    id: 'longTermAvoider',
    name: 'The Long-Term Avoider',
    badge: 'High Avoidance',
    mission: 'The Hold Your Ground Rep',
    barrierKeys: ['socialAvoidance', 'fearOfBeingJudged'],
    explanation:
      'Your answers suggest that avoidance is doing most of the damage right now. You may still function in daily life, but you avoid eye contact, small talk, and extra interaction because being seen feels unsafe.',
  },
  conversationFreeze: {
    id: 'conversationFreeze',
    name: 'The “I Don’t Know What to Say” Pattern',
    badge: 'Conversation Freeze',
    mission: 'The Drop a Statement Rep',
    barrierKeys: ['basicSocialSkillsGap', 'lowSelfDiscipline'],
    explanation:
      'Your answers suggest that the main block is conversation freeze. You may avoid people because you feel like you missed the basic social script and don’t know what to say next.',
  },
  bodyReaction: {
    id: 'bodyReaction',
    name: 'The Body-Reaction Pattern',
    badge: 'Body Reaction',
    mission: 'The Awkward Is Allowed Rep',
    barrierKeys: ['freezingAroundWomen', 'physicalAnxietySymptoms'],
    explanation:
      'Your answers suggest that your body reacts before you can act. Your heart races, your face gets hot, or your mind goes blank, especially when the moment feels socially important.',
  },
};

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

export const getBarrierScores = (answers) =>
  barrierGroups.map((group) => ({
    ...group,
    score: averageAnswerValues(answers, group.questionIndexes),
  }));

export const getResultPattern = (barrierScores) => {
  const strongestScore = Math.max(...barrierScores.map(({ score }) => score));
  const strongestKeys = barrierScores
    .filter(({ score }) => score === strongestScore)
    .map(({ key }) => key);

  if (
    strongestKeys.some((key) => resultPatterns.bodyReaction.barrierKeys.includes(key))
  ) {
    return resultPatterns.bodyReaction;
  }

  if (
    strongestKeys.some((key) => resultPatterns.longTermAvoider.barrierKeys.includes(key))
  ) {
    return resultPatterns.longTermAvoider;
  }

  return resultPatterns.conversationFreeze;
};

export const shouldShowLostYearsBlock = (answers) =>
  [answers[12], answers[13]].some((answer) => Number(answer) >= 4);
