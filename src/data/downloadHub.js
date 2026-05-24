export const defaultResultPattern = 'The “I Don’t Know What to Say” Pattern';

// Place final PDF files in public/downloads using the exact file names listed above.
export const downloadFilePaths = {
  fieldGuides: {
    bodyReaction: '/downloads/day-0-field-guide-functional-bypass.pdf',
    conversationFreeze: '/downloads/day-0-field-guide-curiosity-drop.pdf',
    longTermAvoider: '/downloads/day-0-field-guide-hold-your-ground.pdf',
  },
  foundationGuide: '/downloads/reentera-foundation-guide.pdf',
  proofLog: '/downloads/the-proof-log.pdf',
};

const downloadAssignments = {
  'The Long-Term Avoider': {
    fieldGuideHref: downloadFilePaths.fieldGuides.longTermAvoider,
    missionName: 'The Hold Your Ground Rep',
    resultPattern: 'The Long-Term Avoider',
  },
  [defaultResultPattern]: {
    fieldGuideHref: downloadFilePaths.fieldGuides.conversationFreeze,
    missionName: 'The Curiosity Drop Rep',
    resultPattern: defaultResultPattern,
  },
  'The Body-Reaction Pattern': {
    fieldGuideHref: downloadFilePaths.fieldGuides.bodyReaction,
    missionName: 'The Functional Bypass Rep',
    resultPattern: 'The Body-Reaction Pattern',
  },
};

export function getDownloadAssignment(resultPattern) {
  return downloadAssignments[resultPattern] ?? downloadAssignments[defaultResultPattern];
}
