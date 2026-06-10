export type VisaType =
  | 'F1'
  | 'OPT'
  | 'STEM_OPT'
  | 'H1B'
  | 'GREEN_CARD'
  | 'B1_B2'
  | 'TN'
  | 'O1'
  | 'OTHER';

export type DocumentStatus = 'needed' | 'in_progress' | 'complete';
export type DocumentCategory =
  | 'identity'
  | 'financial'
  | 'employment'
  | 'education'
  | 'legal'
  | 'other';
export type DeadlineStatus = 'pending' | 'completed' | 'overdue';
export type DeadlinePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MessageRole = 'user' | 'assistant';

export interface Profile {
  id: string;
  name: string | null;
  country_of_origin: string | null;
  visa_type: VisaType | null;
  current_stage: string | null;
  primary_goal: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  // Local only (not in DB):
  isLoading?: boolean;
  isError?: boolean;
}

export interface Deadline {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: DeadlineStatus;
  priority: DeadlinePriority;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: DocumentStatus;
  category: DocumentCategory | null;
  created_at: string;
  updated_at: string;
}

// Message shape sent to the Anthropic API via the edge function.
export interface ChatMessageInput {
  role: MessageRole;
  content: string;
}
