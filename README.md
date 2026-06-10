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
security, the signup trigger, and `updated_at` triggers.

### 4. Deploy the chat edge function

```bash
SUPABASE_ACCESS_TOKEN=your_token npx supabase functions deploy chat --project-ref your_project_ref
SUPABASE_ACCESS_TOKEN=your_token npx supabase secrets set ANTHROPIC_API_KEY=your_key --project-ref your_project_ref
```

### 5. Run the app

```bash
npm run ios      # or: npm run android
```

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
  schema.sql              Database schema + RLS
  functions/chat/         Anthropic-backed chat edge function
```

## Design System

Dark mode only. Deep navy (`#070B14`) backgrounds, liquid-glass surfaces, a warm trust-blue accent
(`#4F8EF7`), and Space Grotesk throughout. Tokens live in `constants/` (`colors.ts`,
`typography.ts`, `layout.ts`).

## Notes

- The Anthropic API is **never** called from the client — all chat traffic flows through the
  `chat` edge function which holds the key and persists messages.
- Account deletion performs best-effort cleanup of user data then signs out; fully removing the
  auth user requires a privileged service-role call (left as a backend follow-up).
