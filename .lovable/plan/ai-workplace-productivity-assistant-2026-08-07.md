# AI Workplace Productivity Assistant

A lightweight, frontend-focused SaaS dashboard with three AI tools. No database, no login, no payments — guests use it immediately, and all data stays in the browser session.

## Pages

- **Dashboard** (`/`) — welcome header plus three quick-access cards linking to each tool, and the responsible-AI disclaimer.
- **Smart Email** (`/email`) — inputs for recipient, subject/purpose, key points; tone selector (Formal / Friendly / Persuasive); Generate, Copy, Regenerate. Output lands in an editable textarea.
- **Task Planner** (`/planner`) — add tasks with deadline and estimated duration; Daily or Weekly toggle; generated schedule shown as an ordered list with priority badges (High/Medium/Low), fully editable inline.
- **Research Assistant** (`/research`) — topic or pasted article input; output with Summary, Key Insights, Recommendations; editable, with Copy and Regenerate.
- **Settings** (`/settings`) — default tone, default schedule view, light/dark toggle. Stored in browser only.

## Layout & design

- Persistent left sidebar (collapsible, mobile-friendly sheet) with the five nav items and active-route highlighting.
- Light purple + light grey palette, white cards, rounded corners, subtle shadows, clean sans-serif typography. All colors as semantic design tokens.
- Responsive across desktop, tablet, mobile.
- Disclaimer shown on the dashboard and as a small footer note on each tool page: "AI-generated content may contain inaccurate or incomplete information. Always review and verify AI outputs before using them professionally. Do not enter confidential or sensitive information."

## AI

Real AI generation via Lovable AI (already available, no keys or accounts needed). Each tool sends a structured prompt server-side and streams/returns text; the Task Planner returns structured tasks with priorities. Loading states and clear error messages (rate limit / quota) on each tool. No AI request or response is stored anywhere.

## Technical notes

- TanStack Start routes: `index.tsx`, `email.tsx`, `planner.tsx`, `research.tsx`, `settings.tsx`; shared sidebar shell in `__root.tsx`.
- Three server functions in `src/lib/ai.functions.ts` (email, planner, research) calling the Lovable AI gateway; prompts and model config stay server-side.
- Per-route `head()` metadata (title, description, og tags).
- Session-only state via React state + `sessionStorage`/`localStorage` for settings. No tables, no auth, no backend storage.
