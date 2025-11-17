export const CONDITIONS = {
  KNEE_PAIN: {
    code: 'KNEE_PAIN',
    name: 'Knee Pain',
    specialty: 'Orthopedics',
    subConditions: ['ACL Tear', 'Meniscus Injury', 'Arthritis', 'General Pain'],
  },
  CHEST_PAIN: {
    code: 'CHEST_PAIN',
    name: 'Chest Pain',
    specialty: 'Cardiology',
    subConditions: [
      'Angina',
      'Heart Attack Risk',
      'Costochondritis',
      'General',
    ],
  },
  BACK_PAIN: {
    code: 'BACK_PAIN',
    name: 'Back Pain',
    specialty: 'Orthopedics',
    subConditions: ['Herniated Disc', 'Sciatica', 'Muscle Strain', 'General'],
  },
  DIABETES_MGMT: {
    code: 'DIABETES_MGMT',
    name: 'Diabetes Management',
    specialty: 'Endocrinology',
    subConditions: ['Type 1', 'Type 2', 'Gestational', 'Pre-diabetes'],
  },
  SKIN_LESION: {
    code: 'SKIN_LESION',
    name: 'Skin Lesion',
    specialty: 'Dermatology',
    subConditions: ['Mole', 'Rash', 'Growth', 'Discoloration'],
  },
} as const;

export type ConditionCode = keyof typeof CONDITIONS;
