import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Document, DocumentStatus } from '@/lib/types';

type NewDocument = Pick<Document, 'name'> &
  Partial<Pick<Document, 'description' | 'category' | 'status'>>;

const NEXT_STATUS: Record<DocumentStatus, DocumentStatus> = {
  needed: 'in_progress',
  in_progress: 'complete',
  complete: 'needed',
};

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    setDocuments((data as Document[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (doc: NewDocument) => {
      if (!user) return { error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('documents')
        .insert({ ...doc, user_id: user.id })
        .select()
        .single();
      if (!error && data) setDocuments((prev) => [...prev, data as Document]);
      return { error: error?.message ?? null };
    },
    [user]
  );

  const update = useCallback(async (id: string, updates: Partial<Document>) => {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setDocuments((prev) => prev.map((d) => (d.id === id ? (data as Document) : d)));
    }
    return { error: error?.message ?? null };
  }, []);

  const cycleStatus = useCallback(
    async (doc: Document) => {
      const next = NEXT_STATUS[doc.status];
      // Optimistic update — cycling status should feel instant.
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: next } : d)));
      const { error } = await supabase.from('documents').update({ status: next }).eq('id', doc.id);
      if (error) {
        setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: doc.status } : d)));
      }
      return { error: error?.message ?? null };
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) setDocuments((prev) => prev.filter((d) => d.id !== id));
    return { error: error?.message ?? null };
  }, []);

  return { documents, loading, create, update, cycleStatus, remove, refresh };
}
