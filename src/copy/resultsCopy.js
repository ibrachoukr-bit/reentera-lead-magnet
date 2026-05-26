export const resultsCopy = {
  barrierGroups: [
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
  ],
  resultConfig: {
    skill_gap_freeze: {
      displayTitle: 'The “I Don’t Know What to Say” Pattern',
      badge: 'Conversation Freeze',
      fieldMissionTitle: 'Day 0 — The "Curiosity Drop" Rep',
      missionName: 'The Curiosity Drop Rep',
      explanation:
        'Your answers suggest that the main block is conversation freeze. You may avoid people because you feel like you missed the basic social script and don’t know what to say next.',
    },
    long_term_avoider: {
      displayTitle: 'The Long-Term Avoider',
      badge: 'High Avoidance',
      fieldMissionTitle: 'Day 0 — The "Hold Your Ground" Rep',
      missionName: 'The Hold Your Ground Rep',
      explanation:
        'Your answers suggest that avoidance is doing most of the damage right now. You may still function in daily life, but you avoid eye contact, small talk, and extra interaction because being seen feels unsafe.',
    },
    body_reaction: {
      displayTitle: 'The Body-Reaction Pattern',
      badge: 'Body Reaction',
      fieldMissionTitle: 'Day 0 — The "Functional Bypass" Rep',
      missionName: 'The Functional Bypass Rep',
      explanation:
        'Your answers suggest that your body reacts before you can act. Your heart races, your face gets hot, or your mind goes blank, especially when the moment feels socially important.',
    },
  },
  insightCards: [
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
  ],
  hopeCurvePoints: [
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
  ],
  paceOptions: [
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
  ],
  resultProfile: {
    eyebrow: 'Your Day 0 Result',
    title: 'Your Social Re-Entry Profile',
    subtitle: 'Here’s what is blocking your first step back into social life.',
    startingPatternLabel: 'Your Starting Pattern',
    radarTitle: 'Your Current Barriers',
    radarBadge: 'Higher = stronger',
    radarAriaLabel: 'Radar chart showing the six current barrier scores',
    noteLead: 'You are not broken. You are under-trained.',
    noteSupport: 'The goal today is not confidence. The goal is one completed rep.',
    cta: 'See what this means →',
    lostYears: {
      title: 'A note on the lost years',
      paragraphs: [
        'Looking back and feeling like you missed normal dating, friendships, and social memories hurts. That weight is real.',
        'But those years are not proof that you are broken. For a long time, avoidance may have been the only tool your nervous system had. It protected you short-term, but it also kept you from getting the reps you needed.',
        'The regret you feel now is not proof that it is too late. It may be proof that you are finally ready to train.',
      ],
    },
  },
  reframe: {
    eyebrow: 'The Reframe',
    title: 'This is trainable.',
    subtitle: 'Your next 8 weeks do not have to look like your last 8 years.',
    paragraphs: [
      'Right now, your brain and body may treat simple social moments like danger. That is why you freeze, overthink, avoid, or disappear after awkwardness.',
      'The goal is not to become smooth overnight. The goal is to retrain your response through small, repeatable reps.',
    ],
    reassurancePills: ['No harsh exposure', 'No fake confidence', 'No pressure to perform'],
    note: 'Day 0 is not the whole system. It is the first proof that you can move.',
    cta: 'Show me my Day 0 path →',
  },
  microCommitment: {
    eyebrow: 'Choose your starting pace',
    title: 'How small do you want to start?',
    subtitle: 'Pick the amount of daily practice that feels realistic today. Small is allowed.',
    note:
      'Your Day 0 mission will stay small either way. The goal is not intensity. The goal is completion.',
  },
  resultHeader: {
    brand: 'ReEntera',
    resultStepAriaLabel: 'Result step',
    returnToFinalQuestion: 'Return to the final assessment question',
    previousResultScreen: 'Go to previous result screen',
    downloadPageAriaLabel: 'Download page',
    downloadBackAriaLabel: 'Go back to field mission',
    downloadCountLabel: 'GEAR',
    screen4AriaLabel: 'Screen 4 step',
    screen4BackToPace: 'Go back to starting pace selection',
    screen4BackToPreflight: 'Go back to pre-flight checklist',
    screen4CountPrefix: 'STEP',
    screen4CountConnector: 'of',
  },
};
