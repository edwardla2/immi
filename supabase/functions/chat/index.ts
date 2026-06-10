import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

YOUR COMMUNICATION STYLE:
- Warm, calm, and reassuring — immigration is stressful and the stakes are high
- Specific and actionable, not vague or generic
- Use plain language, avoid unnecessary jargon
- Break down complex processes into clear steps
- Acknowledge emotional difficulty when appropriate
- Always honest about the limits of what you can help with

CURRENT USER CONTEXT:
${userContext}

Reference their specific situation when relevant. Ask clarifying questions when you need more information to give accurate guidance. If they describe a situation that genuinely needs a lawyer, say so clearly and warmly — that is helping them, not turning them away.`;

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

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

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
