import { BYPASS_AUTH } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { ChatMessageInput } from '@/lib/types';

export interface ChatAdded {
  deadlines: number;
  documents: number;
}

export interface ChatResponse {
  message: string;
  added?: ChatAdded;
}

export interface ChatResult {
  message: string;
  added: ChatAdded;
}

/**
 * Calls the `chat` Supabase edge function. The edge function holds the Anthropic
 * API key and persists both the user and assistant messages to the database —
 * the client never talks to Anthropic directly.
 */
export async function sendChatMessage(
  messages: ChatMessageInput[],
  conversationId: string
): Promise<ChatResult> {
  // Auth-bypass mode: the Supabase client has no real session, so the edge
  // function's auth check would reject the call with an opaque 401. Fail
  // upfront with a message that says exactly how to get chat working.
  if (BYPASS_AUTH) {
    const message =
      'DEV MODE: chat needs real auth. Set BYPASS_AUTH to false in lib/config.ts and sign in.';
    console.error('[Immi chat]', message);
    throw new Error(message);
  }

  const { data, error } = await supabase.functions.invoke<ChatResponse>('chat', {
    body: { messages, conversationId },
  });

  if (error) {
    // FunctionsHttpError carries the raw Response in `context` — pull the
    // function's JSON error body so the chat bubble shows the real cause
    // instead of a generic "non-2xx status code".
    let detail = error.message;
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const body = (await ctx.json()) as { error?: string };
        if (body?.error) detail = body.error;
      } catch {
        // body wasn't JSON; keep the generic message
      }
    }
    console.error('[Immi chat] edge function call failed:', detail, error);
    throw new Error(detail || 'Failed to reach Immi. Please try again.');
  }

  if (!data?.message) {
    console.error('[Immi chat] edge function returned no message payload:', data);
    throw new Error('Immi did not return a response. Please try again.');
  }

  return {
    message: data.message,
    added: data.added ?? { deadlines: 0, documents: 0 },
  };
}
