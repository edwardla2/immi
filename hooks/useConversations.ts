import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { BYPASS_AUTH } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/lib/types';
import { localId } from '@/lib/utils';

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Auth-bypass mode: the mock user has no DB rows, so keep the in-memory list.
    if (BYPASS_AUTH) {
      setLoading(false);
      return;
    }
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (err) setError(err.message);
    setConversations((data as Conversation[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (): Promise<{ data: Conversation | null; error: string | null }> => {
    // Auth-bypass mode: synthesize a local conversation so chat works in-memory
    // without writing to the database.
    if (BYPASS_AUTH) {
      const now = new Date().toISOString();
      const mock: Conversation = {
        id: localId(),
        user_id: user?.id ?? 'mock-user',
        title: 'New Conversation',
        created_at: now,
        updated_at: now,
      };
      setConversations((prev) => [mock, ...prev]);
      return { data: mock, error: null };
    }
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error: err } = await supabase
      .from('conversations')
      .insert({ user_id: user.id })
      .select()
      .single();
    if (err) {
      console.error('[Immi chat] failed to create conversation:', err);
    } else if (data) {
      setConversations((prev) => [data as Conversation, ...prev]);
    }
    return { data: (data as Conversation) ?? null, error: err?.message ?? null };
  }, [user]);

  const deleteConversation = useCallback(async (id: string) => {
    // Auth-bypass mode: drop it from the in-memory list only.
    if (BYPASS_AUTH) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      return { error: null };
    }
    const { error: err } = await supabase.from('conversations').delete().eq('id', id);
    if (!err) setConversations((prev) => prev.filter((c) => c.id !== id));
    return { error: err?.message ?? null };
  }, []);

  return { conversations, loading, error, create, deleteConversation, refresh };
}
