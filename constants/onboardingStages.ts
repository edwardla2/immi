import { VisaType } from '@/lib/types';

export interface StageOption {
  id: string;
  label: string;
}

// Stage options per visa type. "OTHER" uses a free-text field, so its list is empty.
export const ONBOARDING_STAGES: Record<VisaType, StageOption[]> = {
  F1: [
    { id: 'just_arrived', label: 'Just arrived' },
    { id: 'mid_program', label: 'Mid-program' },
    { id: 'applying_opt', label: 'Applying for OPT' },
    { id: 'opt_active', label: 'OPT active' },
    { id: 'applying_stem_opt', label: 'Applying for STEM OPT' },
  ],
  OPT: [
    { id: 'just_approved', label: 'Just got my EAD card' },
    { id: 'job_searching', label: 'Searching for a job' },
    { id: 'employed', label: 'Employed and working' },
    { id: 'approaching_end', label: 'Approaching the end of OPT' },
    { id: 'planning_stem', label: 'Planning STEM extension' },
  ],
  STEM_OPT: [
    { id: 'preparing_application', label: 'Preparing my application' },
    { id: 'pending', label: 'Application pending' },
    { id: 'active', label: 'STEM OPT active' },
    { id: 'reporting', label: 'Handling reporting requirements' },
    { id: 'approaching_end', label: 'Approaching the end' },
  ],
  H1B: [
    { id: 'employer_filing', label: 'My employer is filing for me' },
    { id: 'lottery_wait', label: 'Waiting for lottery results' },
    { id: 'petition_approved', label: 'Petition approved, waiting for visa' },
    { id: 'have_h1b', label: 'Already have H-1B' },
    { id: 'extension_transfer', label: 'Extending or transferring' },
  ],
  GREEN_CARD: [
    { id: 'just_started', label: 'Just started thinking about it' },
    { id: 'priority_date', label: 'Priority date established' },
    { id: 'visa_bulletin', label: 'Waiting for visa bulletin' },
    { id: 'i485_filed', label: 'I-485 filed' },
    { id: 'interview_scheduled', label: 'Interview scheduled' },
    { id: 'received', label: 'Got my green card' },
  ],
  B1_B2: [
    { id: 'planning_trip', label: 'Planning my trip' },
    { id: 'visa_pending', label: 'Visa application pending' },
    { id: 'in_us', label: 'Currently in the US' },
    { id: 'extending', label: 'Looking to extend my stay' },
    { id: 'changing_status', label: 'Exploring a change of status' },
  ],
  TN: [
    { id: 'preparing', label: 'Preparing my application' },
    { id: 'applying_border', label: 'Applying at the border / port of entry' },
    { id: 'active', label: 'TN status active' },
    { id: 'renewing', label: 'Renewing my status' },
    { id: 'exploring_other', label: 'Exploring other options' },
  ],
  O1: [
    { id: 'building_case', label: 'Building my evidence / case' },
    { id: 'employer_filing', label: 'Employer or agent is filing' },
    { id: 'petition_pending', label: 'Petition pending' },
    { id: 'active', label: 'O-1 status active' },
    { id: 'extending', label: 'Extending my status' },
  ],
  OTHER: [],
};

export const getStages = (visaType: VisaType | null | undefined): StageOption[] =>
  visaType ? ONBOARDING_STAGES[visaType] ?? [] : [];
