import { VisaType } from '@/lib/types';

export interface VisaTypeOption {
  id: VisaType;
  label: string;
  shortLabel: string;
  description: string;
  emoji: string;
}

export const VISA_TYPES: VisaTypeOption[] = [
  {
    id: 'F1',
    label: 'F-1 Student Visa',
    shortLabel: 'F-1 Student',
    description: 'Currently enrolled in a US school',
    emoji: '🎓',
  },
  {
    id: 'OPT',
    label: 'OPT',
    shortLabel: 'OPT',
    description: 'Working after graduation (12 months)',
    emoji: '💼',
  },
  {
    id: 'STEM_OPT',
    label: 'STEM OPT Extension',
    shortLabel: 'STEM OPT',
    description: 'Extended work authorization (24 months)',
    emoji: '🔬',
  },
  {
    id: 'H1B',
    label: 'H-1B Work Visa',
    shortLabel: 'H-1B',
    description: 'Employer-sponsored specialty occupation',
    emoji: '🏢',
  },
  {
    id: 'GREEN_CARD',
    label: 'Green Card Process',
    shortLabel: 'Green Card',
    description: 'Applying for permanent residence',
    emoji: '🪪',
  },
  {
    id: 'B1_B2',
    label: 'B-1/B-2 Visitor',
    shortLabel: 'B-1/B-2',
    description: 'Tourist or business visitor',
    emoji: '✈️',
  },
  {
    id: 'TN',
    label: 'TN Visa',
    shortLabel: 'TN',
    description: 'Canadian or Mexican professional',
    emoji: '🍁',
  },
  {
    id: 'O1',
    label: 'O-1 Extraordinary Ability',
    shortLabel: 'O-1',
    description: 'Exceptional talent or achievement',
    emoji: '⭐',
  },
  {
    id: 'OTHER',
    label: 'Other / Not Sure',
    shortLabel: 'Other',
    description: 'Help me figure it out',
    emoji: '🧭',
  },
];

export const getVisaType = (id: VisaType | null | undefined): VisaTypeOption | undefined =>
  VISA_TYPES.find((v) => v.id === id);

export const getVisaShortLabel = (id: VisaType | null | undefined): string =>
  getVisaType(id)?.shortLabel ?? 'Not set';
