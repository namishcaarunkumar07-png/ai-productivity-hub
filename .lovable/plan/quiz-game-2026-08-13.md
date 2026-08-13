# QUIZ GAME

Replace the current productivity-assistant app with a single-page, client-side quiz game. Blue/red theme, one centred card, forward-only flow, 10 questions: Q1 picks your country, Q2–Q10 are AI-generated about that country.

## User journey

```text
WELCOME  →  START QUIZ  →  Q1 country select  →  (questions load)
        →  Q2..Q10 with NEXT QUESTION / FINISH QUIZ
        →  RESULTS: score + message + PLAY AGAIN
```

## Screens

**Welcome** — "QUIZ GAME" in the primary colour, subtitle "Test your knowledge and see how much you know about your country!", "Are you ready for this quiz?", big START QUIZ button.

**Quiz card** — centred, rounded, soft shadow. Contains: QUIZ GAME title, "Question N of 10", the question, large answer buttons (single select, clearly highlighted, no correct answer revealed), NEXT QUESTION button (FINISH QUIZ on Q10), animated progress bar plus "N0% completed".

**Question 1** — searchable country picker covering all world countries. Cannot continue until a country is chosen.

**Loading** — after the country is confirmed, the card shows a short friendly "Building your questions…" state while the 9 questions are generated.

**Results** — "QUIZ COMPLETE!", thank-you line, "Your Score: 8/10", a tiered message (10 Outstanding / 8–9 Great job / 6–7 Good effort / 4–5 Keep learning / 0–3 Better luck next time), the closing "We'll see you next time again!" line, and PLAY AGAIN which resets everything back to the welcome screen.

## Rules enforced

- No back button, no re-answering, forward-only.
- NEXT QUESTION disabled until an answer is selected; keyboard activation on the disabled state shows a friendly inline "Please select an answer to continue."
- No account, no login, no database — all state is React state in the browser.
- Fully responsive: card fits mobile with no horizontal scroll, tap-sized answer buttons.
- Accessible: radio-group semantics for answers, visible focus rings, live-region announcements for question changes and score.
- Subtle transitions only: card entrance, question fade/slide, answer press, progress bar width, score reveal.

## Question generation

One AI call per playthrough after the country is selected, returning 9 varied multiple-choice questions (capital, currency, flag, geography, landmarks, symbols, history, culture, languages, fun facts) with 4 options each and one correct answer. Randomised so repeat plays differ. If generation fails, the card shows an error with a "Try again" action instead of a broken quiz.

## Technical notes

- Routes: `src/routes/index.tsx` becomes the quiz (own head metadata/title). Delete `email.tsx`, `planner.tsx`, `research.tsx`, `settings.tsx`, `src/components/app-sidebar.tsx`, `src/components/disclaimer.tsx`, `src/components/page-header.tsx`, `src/lib/settings.ts`. `__root.tsx` drops the sidebar shell and becomes a plain centred layout with `<Toaster />`.
- New `src/lib/quiz.functions.ts`: `generateCountryQuiz` server function (zod-validated country input) reusing the existing `ai.server` prompt + JSON-parse helpers via the Lovable AI gateway; validates each question has exactly 4 options and a valid correct index, keeps 9. `src/lib/ai.functions.ts` and the old prompt paths for email/planner/research are removed.
- New components under `src/components/quiz/`: `welcome-screen`, `quiz-card`, `country-question`, `answer-options`, `progress-bar`, `result-screen`; quiz state in a `useQuiz` hook (country, questions, index, selected answer, score, status).
- New `src/lib/countries.ts`: static ISO country list for the picker (shadcn Command/Popover combobox).
- `src/styles.css`: retheme tokens to a blue primary with red accent (light and dark), keeping semantic tokens only — no hardcoded colour classes in components.
