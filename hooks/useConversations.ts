import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/lib/types';

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
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
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error: err } = await supabase
      .from('conversations')
      .insert({ user_id: user.id })
      .select()
      .single();
    if (!err && data) {
      setConversations((prev) => [data as Conversation, ...prev]);
    }
    return { data: (data as Conversation) ?? null, error: err?.message ?? null };
  }, [user]);

  const deleteConversation = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('conversations').delete().eq('id', id);
    if (!err) setConversations((prev) => prev.filter((c) => c.id !== id));
    return { error: err?.message ?? null };
  }, []);

  return { conversations, loading, error, create, deleteConversation, refresh };
}
