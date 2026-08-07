# AI Productivity Hub

Here’s a short, token-efficient prompt you can paste into Lovable. It is specifically designed to avoid unnecessary features that could consume your limited 5 free tokens.

Lovable Prompt

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

Important constraints:

No database.

No user registration or login.

Users can access the platform immediately as guests.

Do not build authentication, user accounts, payment systems, or backend storage.

Keep the application lightweight and frontend-focused.

Main features:

Smart Email Generator

User enters recipient, subject/purpose and key information.

Generate a professional email.

Tone options: Formal, Friendly, Persuasive.

AI output must be editable.

Buttons: Generate, Edit, Copy and Regenerate.

AI Task Planner

User enters tasks, deadlines and estimated durations.

Choose Daily or Weekly schedule.

AI prioritises tasks based on urgency and importance.

Display the result as a clean schedule with priorities.

Generated schedule must be editable.

AI Research Assistant

User enters a topic or pastes an article.

Generate a clear summary.

Provide Key Insights and Recommendations.

Output must be editable.

Include Copy and Regenerate buttons.

UI/UX:

Modern professional SaaS dashboard.

Light purple and light grey colour palette.

White cards, rounded corners, subtle shadows and clean typography.

Responsive desktop, tablet and mobile design.

Left sidebar navigation with:

Dashboard

Smart Email

Task Planner

Research Assistant

Settings

Dashboard should show quick-access cards for the three AI tools.

AI interaction:

Use structured prompts for each AI feature.

If real AI/API integration is not available, use realistic demo-generated responses rather than requiring a database.

Keep all temporary data in the browser/session only.

Responsible AI:
Add a visible disclaimer:
“AI-generated content may contain inaccurate or incomplete information. Always review and verify AI outputs before using them professionally. Do not enter confidential or sensitive information.”

Make the final application feel polished, minimal, professional and easy to use, similar to a modern productivity SaaS platform.

Best approach with only 5 Lovable tokens: use this as the initial build prompt and avoid asking Lovable to repeatedly redesign the entire application. For later prompts, make only small targeted changes such as “Change the sidebar colour” or “Fix the mobile layout.”

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6701516b-4b54-4e96-8f9c-80f9beff66b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
