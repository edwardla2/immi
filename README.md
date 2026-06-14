# Immi — AI Immigration Navigator

A mobile-first AI immigration navigator. Immi helps immigrants understand and navigate US
immigration processes (visas, green cards, OPT, H-1B, and more) through a conversational AI that
acts as a knowledgeable guide — **not a lawyer**. It sits between "google it yourself" and "pay
$5,000 for an immigration attorney."

> Immi provides general information about processes, forms, and timelines. It is not legal advice.
> For case-specific guidance, users are always pointed to a licensed immigration attorney.

## Tech Stack

- **Framework:** Expo SDK 56, React Native 0.85, TypeScript (strict)
- **Router:** Expo Router v6 (file-based, typed routes)
- **Backend:** Supabase (auth, Postgres, edge functions)
- **AI:** Anthropic Claude (`claude-sonnet-4-20250514`) via a Supabase edge function — the API key
  never touches the client
- **Animation:** React Native Reanimated 4
- **Fonts:** Space Grotesk
- **Icons:** `@expo/vector-icons` (Ionicons)

> The original spec targeted Expo SDK 51. This project ships on the current stable SDK (56) so it
> installs and runs on modern Node/React Native toolchains; the architecture, design system, and
> screens are otherwise as specified.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Supabase project values:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

The app runs without these (you'll see a warning), but auth and data won't work until they're set.

### 3. Set up the database

In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). This creates the
`profiles`, `conversations`, `messages`, `deadlines`, and `documents` tables with row-level
security, the signup trigger, `updated_at` triggers, and the `rate_limits` table + increment
function used for abuse protection (see below). On an **existing** project, you can apply just the
abuse-protection pieces by running [`supabase/rate_limits.sql`](supabase/rate_limits.sql) — it's
idempotent (`if not exists` / `or replace`).

### 4. Deploy the chat edge function

```bash
SUPABASE_ACCESS_TOKEN=your_token npx supabase functions deploy chat --project-ref your_project_ref
SUPABASE_ACCESS_TOKEN=your_token npx supabase secrets set ANTHROPIC_API_KEY=your_key --project-ref your_project_ref
```

### 5. Run the app

```bash
npm run ios      # or: npm run android
npx expo start --web   # web target (for browser validation)
```

## Deploying the Web App (Vercel)

The app ships a web target (react-native-web, metro bundler, single-page output). `vercel.json`
is already configured with the build command, output directory, and SPA rewrites.

**CLI flow:**

```bash
npm i -g vercel
vercel login
vercel          # first deploy — accept defaults, vercel.json drives the build
vercel --prod   # promote to production
```

**Dashboard flow:** import the GitHub repo at vercel.com/new — the settings are picked up from
`vercel.json` automatically.

**Environment variables (set in the Vercel project, all environments):**

| Variable | Value | Notes |
| --- | --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | your Supabase project URL | public by design |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key | public by design, protected by RLS |

`ANTHROPIC_API_KEY` must **never** be set in Vercel — it lives only as a Supabase edge-function
secret (`npx supabase secrets set ANTHROPIC_API_KEY=…`). `EXPO_PUBLIC_*` values are inlined into
the client bundle at build time, which is fine for the Supabase pair and catastrophic for anything
secret.

## Project Structure

```
app/                      Expo Router routes
  _layout.tsx             Root — fonts, auth + profile providers, splash
  index.tsx               Entry redirect (auth / onboarding / app)
  (auth)/                 sign-in, sign-up, forgot-password
  (onboarding)/           4-step onboarding + completion
  (app)/                  Tab group (chat list, timeline, documents, profile)
  conversation/[id].tsx   Full-screen chat (kept out of the tab group)
components/
  ui/                     GlassCard, buttons, inputs, TabBar, ModalSheet, …
  chat/  timeline/  documents/  onboarding/  profile/
hooks/                    useAuth, useProfile, useConversations, useMessages, …
lib/                      supabase client, types, api helper, utils
constants/                colors, typography, layout, visaTypes, stages, …
supabase/
  schema.sql              Database schema + RLS (includes rate_limits)
  rate_limits.sql         Abuse-protection table + RPC (apply to existing projects)
  functions/chat/         Anthropic-backed chat edge function (rate limiting, kill switch)
```

## Design System

Dark mode only. Deep navy (`#070B14`) backgrounds, liquid-glass surfaces, a warm trust-blue accent
(`#4F8EF7`), and Space Grotesk throughout. Tokens live in `constants/` (`colors.ts`,
`typography.ts`, `layout.ts`).

## Abuse Protection (chat endpoint)

Every chat message costs money via the Anthropic API, so the `chat` edge function is hardened
against abuse **server-side** — client-side limits are worthless because anyone can call the
function directly. All of this lives in `supabase/functions/chat/index.ts` and the `rate_limits`
table.

**Rate limits** (named constants at the top of the function, tune freely):

| Limit | Default | Why |
| --- | --- | --- |
| `USER_PER_HOUR` | 30 | a heavy real session (lots of follow-ups) stays under it |
| `USER_PER_DAY` | 80 | generous for genuine use; hard daily cap per account |
| `IP_PER_HOUR` | 60 | backstop against one IP scripting many accounts; set above the per-user hourly cap so shared NATs (dorms, offices) with several real users aren't falsely blocked |

Enforced **before any Anthropic call**: the function increments per-user and per-IP counters
(in the `rate_limits` table, via the atomic `increment_rate_limit` RPC) and returns a `429` with a
friendly message if any cap is exceeded. The client surfaces that message in the chat as a normal
error bubble — no crash. **Tuning cost:** a message costs roughly a few cents (large system prompt
in, up to 1024 tokens out, occasionally a tool round), so `USER_PER_DAY=80` bounds one account to a
few dollars/day worst case. Raise/lower the constants to match your risk tolerance.

The IP is **hashed** (SHA-256, salted by the optional `RATE_LIMIT_SALT` secret) before storage or
logging — raw IPs are never persisted.

**Per-call blast radius** (also constants in the function):

- `MAX_OUTPUT_TOKENS = 1024` — caps the cost of any single reply.
- `MAX_INPUT_CHARS = 4000` — inputs longer than this are rejected (`413`) before reaching Claude,
  so nobody can paste a 50 KB wall of text to inflate input tokens.
- `MAX_HISTORY_MESSAGES = 20` — only the last 20 turns are sent to the model, so a long
  conversation doesn't make every call progressively more expensive.

**Kill switch — instant, no redeploy.** The function checks a `CHAT_ENABLED` secret first. Set it
to `false` in the Supabase dashboard (Edge Functions → Secrets) to immediately stop **all** Anthropic
spend; set it back to `true` (or delete it) to re-enable. Use it the moment you see a runaway bill.

```bash
# disable all chat spend instantly:
npx supabase secrets set CHAT_ENABLED=false --project-ref <ref>
# re-enable:
npx supabase secrets set CHAT_ENABLED=true --project-ref <ref>
```

> The function reads the service-role key from the auto-injected `SUPABASE_SERVICE_ROLE_KEY` secret
> (Supabase provides it to every edge function by default) — you don't need to set that yourself.
> `RATE_LIMIT_SALT` and `CHAT_ENABLED` are optional; sensible defaults apply if unset.

**Logging / visibility.** Each request logs a JSON line (visible in the function logs) with the
hashed user + IP, token usage, tool rounds, and a `limited` flag; rate-limited requests log
`evt: "chat_rate_limited"`. If total daily volume crosses `DAILY_SANITY_THRESHOLD` (2000), the
function logs a loud `[immi][ALERT]` warning so a spike is visible.

**Signup abuse.** Supabase's built-in auth rate limiting (per-IP signup/OTP caps) is on by default —
verify and tune it under Authentication → Rate Limits in the dashboard. The per-IP chat cap above is
the real backstop: even mass-created accounts can't burn API calls if their IP is capped.

> **Launch decision — email confirmation.** It's currently **OFF** for easy testing. For public
> launch, consider turning it back **ON** (Authentication → Providers → Email → "Confirm email"). It
> significantly slows automated account creation. This is a deliberate toggle, not changed here.

### Applying / redeploying after these changes

1. Run [`supabase/rate_limits.sql`](supabase/rate_limits.sql) in the Supabase SQL editor (creates the
   table + `increment_rate_limit` RPC; idempotent).
2. Redeploy the function:
   `SUPABASE_ACCESS_TOKEN=… npx supabase functions deploy chat --project-ref <ref>`
3. (Optional) set `CHAT_ENABLED` / `RATE_LIMIT_SALT` secrets as above.

> **Final backstop — do this in the Anthropic console.** Set a hard monthly spending limit / budget
> alert. It's independent of all the code above: even if something slips through, the bill can't
> exceed what you set. Do it before posting Immi publicly.

## Notes

- The Anthropic API is **never** called from the client — all chat traffic flows through the
  `chat` edge function which holds the key and persists messages.
- Account deletion performs best-effort cleanup of user data then signs out; fully removing the
  auth user requires a privileged service-role call (left as a backend follow-up).
