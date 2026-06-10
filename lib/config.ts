import { Session, User } from '@supabase/supabase-js';

import { Profile } from '@/lib/types';

/**
 * Local-testing auth bypass.
 *
 * When `true`, the app skips the real Supabase auth + onboarding flow and lands
 * directly in the main app with a mock user and profile. Every consumer guards
 * its mock behind this flag, so flipping it back to `false` restores the real
 * path with zero other changes. Never ship this as `true`.
 */
export const BYPASS_AUTH = false;

/** Fixed fake user id used everywhere the mock session is needed. */
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const MOCK_USER = {
  id: MOCK_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@immi.app',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { name: 'Test User' },
  created_at: new Date(0).toISOString(),
} as unknown as User;

export const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: MOCK_USER,
} as unknown as Session;

export const MOCK_PROFILE: Profile = {
  id: MOCK_USER_ID,
  name: 'Test User',
  country_of_origin: 'India',
  visa_type: 'F1',
  current_stage: 'OPT active',
  primary_goal: 'I have an upcoming deadline',
  onboarding_completed: true,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};
