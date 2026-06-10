import { supabase } from '@/lib/supabase';
import { ChatMessageInput } from '@/lib/types';

export interface ChatResponse {
  message: string;
}

/**
 * Calls the `chat` Supabase edge function. The edge function holds the Anthropic
 * API key and persists both the user and assistant messages to the database —
 * the client never talks to Anthropic directly.
 */
export async function sendChatMessage(
  messages: ChatMessageInput[],
  conversationId: string
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<ChatResponse>('chat', {
    body: { messages, conversationId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to reach Immi. Please try again.');
  }

  if (!data?.message) {
    throw new Error('Immi did not return a response. Please try again.');
  }

  return data.message;
}
