import { useCallback, useEffect, useState } from 'react';

import { sendChatMessage } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { ChatMessageInput, Message } from '@/lib/types';
import { localId } from '@/lib/utils';

const LOADING_ID = 'loading-indicator';

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) setLoadError(error.message);
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  const deliver = useCallback(
    async (history: Message[], content: string) => {
      if (!conversationId) return;

      const apiMessages: ChatMessageInput[] = [
        ...history.filter((m) => !m.isError && !m.isLoading).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content },
      ];

      try {
        const reply = await sendChatMessage(apiMessages, conversationId);
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== LOADING_ID),
          {
            id: localId(),
            conversation_id: conversationId,
            role: 'assistant',
            content: reply,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        const messageText =
          err instanceof Error ? err.message : 'Something went wrong. Tap to retry.';
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== LOADING_ID),
          {
            id: localId(),
            conversation_id: conversationId,
            role: 'assistant',
            content: messageText,
            created_at: new Date().toISOString(),
            isError: true,
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [conversationId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!conversationId || !trimmed || sending) return;
      setSending(true);

      const userMessage: Message = {
        id: localId(),
        conversation_id: conversationId,
        role: 'user',
        content: trimmed,
        created_at: new Date().toISOString(),
      };
      const loadingMessage: Message = {
        id: LOADING_ID,
        conversation_id: conversationId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
        isLoading: true,
      };

      const history = messages;
      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      await deliver(history, trimmed);
    },
    [conversationId, sending, messages, deliver]
  );

  const retry = useCallback(async () => {
    // Re-send the last user message, dropping any trailing error bubble.
    const lastUser = [...messages].reverse().find((m) => m.role === 'user' && !m.isError);
    if (!lastUser || sending) return;
    setSending(true);

    const cleaned = messages.filter((m) => !m.isError);
    const idx = cleaned.findIndex((m) => m.id === lastUser.id);
    const history = cleaned.slice(0, idx);

    const loadingMessage: Message = {
      id: LOADING_ID,
      conversation_id: conversationId ?? '',
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      isLoading: true,
    };
    setMessages([...cleaned, loadingMessage]);
    await deliver(history, lastUser.content);
  }, [messages, sending, conversationId, deliver]);

  return { messages, loading, sending, loadError, sendMessage, retry, refresh: load };
}
