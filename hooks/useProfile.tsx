import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { BYPASS_AUTH, MOCK_PROFILE } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  update: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(BYPASS_AUTH ? MOCK_PROFILE : null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);

  const refresh = useCallback(async () => {
    // Auth-bypass mode: keep the mock profile, never query Supabase.
    if (BYPASS_AUTH) {
      setProfile((prev) => prev ?? MOCK_PROFILE);
      setLoading(false);
      return;
    }
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    // maybeSingle, not single: a user whose profile row doesn't exist yet (e.g.
    // signed up before the handle_new_user trigger was applied) returns zero rows.
    // single() would throw "Cannot coerce the result to a single JSON object";
    // maybeSingle() returns null cleanly and lets onboarding create the row.
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (updates: Partial<Profile>) => {
      // Auth-bypass mode: merge edits into the in-memory mock, skip persistence.
      if (BYPASS_AUTH) {
        setProfile((prev) => ({ ...(prev ?? MOCK_PROFILE), ...updates }));
        return { error: null };
      }
      if (!user) return { error: 'Not authenticated' };
      // upsert, not update: update() matches zero rows (and .single() then errors)
      // for any user missing a profile row. Upserting on the id primary key creates
      // the row if absent and merges into it if present, so onboarding self-heals a
      // missing row instead of failing. The insert RLS policy permits auth.uid() = id.
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select()
        .single();
      if (!error && data) setProfile(data as Profile);
      return { error: error?.message ?? null };
    },
    [user]
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, loading, update, refresh }),
    [profile, loading, update, refresh]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
