import { resultsCopy } from '../copy/resultsCopy.js';

export const barrierGroups = resultsCopy.barrierGroups;

export const RESULT_KEYS = {
  skillGapFreeze: 'skill_gap_freeze',
  longTermAvoider: 'long_term_avoider',
  bodyReaction: 'body_reaction',
};

export const LOST_YEARS_FLAG_KEY = 'lost_years_flag';

const RESULT_PDF_PATHS = {
  [RESULT_KEYS.skillGapFreeze]: '/downloads/day-0-field-guide-curiosity-drop.pdf',
  [RESULT_KEYS.longTermAvoider]: '/downloads/day-0-field-guide-hold-your-ground.pdf',
  [RESULT_KEYS.bodyReaction]: '/downloads/day-0-field-guide-functional-bypass.pdf',
};

export const RESULT_CONFIG = Object.fromEntries(
  Object.entries(resultsCopy.resultConfig).map(([key, config]) => [
    key,
    {
      ...config,
      fieldGuidePdf: RESULT_PDF_PATHS[key],
    },
  ]),
);

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

export const insightCards = resultsCopy.insightCards;
export const hopeCurvePoints = resultsCopy.hopeCurvePoints;
export const paceOptions = resultsCopy.paceOptions;

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
