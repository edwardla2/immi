import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Deadline } from '@/lib/types';

type NewDeadline = Pick<Deadline, 'title'> &
  Partial<Pick<Deadline, 'description' | 'due_date' | 'priority' | 'status'>>;

/** Marks any pending deadline whose due date has passed as overdue (display-time). */
function withOverdue(deadlines: Deadline[]): Deadline[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadlines.map((d) => {
    if (d.status === 'pending' && d.due_date) {
      const due = new Date(d.due_date);
      due.setHours(0, 0, 0, 0);
      if (due.getTime() < today.getTime()) return { ...d, status: 'overdue' };
    }
    return d;
  });
}

export function useDeadlines() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setDeadlines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('deadlines')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true, nullsFirst: false });
    setDeadlines(withOverdue((data as Deadline[]) ?? []));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (deadline: NewDeadline) => {
      if (!user) return { error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('deadlines')
        .insert({ ...deadline, user_id: user.id })
        .select()
        .single();
      if (!error && data) {
        setDeadlines((prev) => withOverdue([...prev, data as Deadline]));
      }
      return { error: error?.message ?? null };
    },
    [user]
  );

  const update = useCallback(async (id: string, updates: Partial<Deadline>) => {
    const { data, error } = await supabase
      .from('deadlines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setDeadlines((prev) => withOverdue(prev.map((d) => (d.id === id ? (data as Deadline) : d))));
    }
    return { error: error?.message ?? null };
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('deadlines').delete().eq('id', id);
    if (!error) setDeadlines((prev) => prev.filter((d) => d.id !== id));
    return { error: error?.message ?? null };
  }, []);

  return { deadlines, loading, create, update, remove, refresh };
}
