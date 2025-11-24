export const CONDITIONS = {
  KNEE_PAIN: 'Knee Pain',
  CHEST_PAIN: 'Chest Pain',
  BACK_PAIN: 'Back Pain',
  HEADACHE: 'Headache',
  DIABETES_MGMT: 'Diabetes Management',
} as const;

export type ConditionCode = keyof typeof CONDITIONS;
