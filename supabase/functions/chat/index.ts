import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { retrieveKnowledge } from './knowledge.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOLS = [
  {
    name: 'add_deadline',
    description:
      "Add an important immigration deadline to the user's timeline. Use when the conversation surfaces a date the user must act by (filing window open/close, EAD expiry, reporting deadline, etc.). Only add deadlines you are confident about based on retrieved knowledge.",
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short title, e.g. "OPT filing window closes"' },
        description: {
          type: 'string',
          description: 'One sentence explaining what to do and why it matters',
        },
        due_date: { type: 'string', description: 'ISO date YYYY-MM-DD' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
      },
      required: ['title', 'priority'],
    },
  },
  {
    name: 'add_documents',
    description:
      "Add required documents to the user's checklist. Use when the conversation establishes which documents the user needs for their specific filing.",
    input_schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              category: {
                type: 'string',
                enum: ['identity', 'financial', 'employment', 'education', 'legal', 'other'],
              },
            },
            required: ['name', 'category'],
          },
        },
      },
      required: ['documents'],
    },
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate the caller using their JWT.
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Pull profile context so Immi can tailor responses.
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, visa_type, current_stage, primary_goal, country_of_origin')
      .eq('id', user.id)
      .single();

    const { messages, conversationId } = await req.json();

    const userContext = profile
      ? `
Name: ${profile.name || 'Not provided'}
Country of Origin: ${profile.country_of_origin || 'Not provided'}
Visa Type: ${profile.visa_type || 'Not provided'}
Current Stage: ${profile.current_stage || 'Not provided'}
Primary Goal: ${profile.primary_goal || 'Not provided'}
      `.trim()
      : 'No profile information available.';

    // Retrieve curated knowledge matching the latest user message.
    const latestUserMessage = messages[messages.length - 1];
    const latestText =
      typeof latestUserMessage?.content === 'string' ? latestUserMessage.content : '';
    const retrieved = retrieveKnowledge(latestText, profile?.visa_type);
    const knowledgeBlock =
      retrieved.length > 0
        ? retrieved
            .map(
              (c) =>
                `[${c.topic}] (source: ${c.source}, last verified ${c.lastVerified})\n${c.content}`
            )
            .join('\n\n')
        : 'No specific knowledge-base entry matched. Answer carefully from general principles, do NOT state specific fees/dates/windows from memory, and point the user to uscis.gov to confirm specifics.';

    const systemPrompt = `You are Immi, a knowledgeable and empathetic US immigration navigator. You help people understand and navigate US immigration processes.

CRITICAL BOUNDARIES:
- You are NOT a lawyer and do NOT provide legal advice
- Always recommend consulting a licensed immigration attorney for complex decisions, appeals, RFEs, or anything with serious legal consequences
- You provide information about processes, forms, requirements, and timelines — not legal strategy or case-specific legal opinions
- When uncertain, say so clearly and recommend professional consultation

YOUR EXPERTISE INCLUDES:
- USCIS forms: I-20, I-94, I-130, I-485, I-765, I-131, I-140, I-539, DS-160, and others
- Visa categories: F-1, OPT (12-month), STEM OPT (24-month extension), H-1B (cap and cap-exempt), H-4, L-1, O-1, TN, EB-1/EB-2/EB-3 green cards, family-based green cards, B-1/B-2, and others
- Processing times, premium processing, and how to check USCIS case status
- Common documentation requirements for major filings
- Cap-gap provisions, grace periods, and authorized periods of stay
- What to expect at USCIS interviews and biometrics appointments
- How to respond to RFEs (Request for Evidence) — at a high level; specific RFE responses need an attorney
- Common mistakes and how to avoid them
- SEVP, DSO, and international student compliance basics

YOUR VOICE:
- Talk like a sharp, experienced immigration advisor who respects the person's time — calm, direct, human
- NEVER open with filler like "Great question!", "I'd be happy to help", or "Let me explain"
- Lead with the answer, then the context. Don't bury the point under preamble
- Warm but efficient. This person is stressed; clarity is kindness
- Short paragraphs. Plain sentences. No corporate hedging

FORMATTING RULES (critical — this is what makes you not sound like a chatbot):
- Write in prose, like a person texting a knowledgeable friend
- NO markdown bold (**), NO headers, NO horizontal rules (---), NO emoji
- Use a short bulleted list ONLY when listing 3+ genuinely parallel items (e.g. documents needed). Otherwise prose
- Don't number every option unless the person is choosing between sequential steps
- Keep most answers under 150 words unless the person asks for a full walkthrough
- One clarifying question at a time, not a barrage

ACCURACY RULES (non-negotiable):
- When you state a fee, deadline, processing time, or filing window, only state what's in the RETRIEVED KNOWLEDGE below. If it's not there, say you want to confirm the current figure rather than guessing, and point them to uscis.gov
- Immigration rules change often. Never state a specific number from memory as if it's current
- If the retrieved knowledge conflicts with what the user says, surface the conflict; don't paper over it

YOUR TOOLS:
You can add deadlines and documents to the user's account using your tools. When you do, mention it naturally in your reply ("I've added your OPT filing window to your timeline") — don't make a big announcement. Only add things the user's situation clearly calls for. Don't spam the timeline with speculative dates.

CURRENT USER CONTEXT:
${userContext}

RETRIEVED KNOWLEDGE (use this as your source of truth for any specific fees, dates, windows, or requirements — prefer it over your own memory; if a [VERIFY] tag is present, you may state the figure but add that they should confirm it on the official source, and never strip the caveat):

${knowledgeBlock}

Reference their specific situation when relevant. Ask clarifying questions when you need more information to give accurate guidance. If they describe a situation that genuinely needs a lawyer, say so clearly and warmly — that is helping them, not turning them away.`;

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    const MODEL = 'claude-sonnet-4-6';

    // Agentic loop: let the model call add_deadline / add_documents, execute the
    // inserts under the user's RLS-scoped client, feed results back, repeat.
    const convo = [...messages];
    let response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: convo,
      tools: TOOLS,
    });

    let addedDeadlines = 0;
    let addedDocuments = 0;
    let rounds = 0;

    while (response.stop_reason === 'tool_use' && rounds < 3) {
      rounds++;
      const toolResults = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;
        let resultText = '';
        let isError = false;

        try {
          if (block.name === 'add_deadline') {
            const input = block.input as {
              title: string;
              description?: string;
              due_date?: string;
              priority: string;
            };
            const { error } = await supabase.from('deadlines').insert({
              user_id: user.id,
              title: input.title,
              description: input.description ?? null,
              due_date: input.due_date ?? null,
              priority: input.priority ?? 'medium',
            });
            if (error) throw new Error(error.message);
            addedDeadlines++;
            resultText = `Deadline "${input.title}" added to the user's timeline.`;
          } else if (block.name === 'add_documents') {
            const input = block.input as {
              documents: { name: string; description?: string; category: string }[];
            };
            const rows = (input.documents ?? []).map((d) => ({
              user_id: user.id,
              name: d.name,
              description: d.description ?? null,
              category: d.category ?? 'other',
              status: 'needed',
            }));
            if (rows.length === 0) throw new Error('No documents provided');
            const { error } = await supabase.from('documents').insert(rows);
            if (error) throw new Error(error.message);
            addedDocuments += rows.length;
            resultText = `${rows.length} document(s) added to the user's checklist.`;
          } else {
            isError = true;
            resultText = `Unknown tool: ${block.name}`;
          }
        } catch (err) {
          // A failed insert must never crash the chat — report it back to the
          // model so it can tell the user gracefully.
          isError = true;
          resultText = `Failed to save: ${err.message}. Let the user know to add this manually in the app.`;
          console.error('Tool execution failed:', block.name, err);
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: resultText,
          is_error: isError,
        });
      }

      convo.push({ role: 'assistant', content: response.content });
      convo.push({ role: 'user', content: toolResults });

      response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: convo,
        tools: TOOLS,
      });
    }

    const assistantMessage = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    // Persist the latest user turn and the assistant reply.
    if (conversationId) {
      const userMessage = messages[messages.length - 1];
      await supabase.from('messages').insert([
        { conversation_id: conversationId, role: 'user', content: userMessage.content },
        { conversation_id: conversationId, role: 'assistant', content: assistantMessage },
      ]);

      // Title the conversation from the first user message.
      if (messages.length === 1) {
        const title =
          userMessage.content.length > 50
            ? userMessage.content.substring(0, 50) + '...'
            : userMessage.content;
        await supabase.from('conversations').update({ title }).eq('id', conversationId);
      }
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        added: { deadlines: addedDeadlines, documents: addedDocuments },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
