import { RESULT_CONFIG, RESULT_KEYS } from './resultFlow.js';

export const defaultResultKey = RESULT_KEYS.bodyReaction;

// Place final PDF files in public/downloads using the exact file names listed above.
export const downloadFilePaths = {
  fieldGuides: {
    [RESULT_KEYS.bodyReaction]: RESULT_CONFIG[RESULT_KEYS.bodyReaction].fieldGuidePdf,
    [RESULT_KEYS.skillGapFreeze]: RESULT_CONFIG[RESULT_KEYS.skillGapFreeze].fieldGuidePdf,
    [RESULT_KEYS.longTermAvoider]: RESULT_CONFIG[RESULT_KEYS.longTermAvoider].fieldGuidePdf,
  },
  foundationGuide: '/downloads/reentera-foundation-guide.pdf',
  proofLog: '/downloads/the-proof-log.pdf',
};

const downloadAssignments = Object.fromEntries(
  Object.entries(RESULT_CONFIG).map(([resultKey, config]) => [
    resultKey,
    {
      fieldGuideHref: config.fieldGuidePdf,
      missionName: config.missionName,
      resultKey,
      resultPattern: config.displayTitle,
    },
  ]),
);

export function getDownloadAssignment(resultKey) {
  return downloadAssignments[resultKey] ?? downloadAssignments[defaultResultKey];
}
