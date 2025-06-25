Create a complete Chrome Extension boilerplate using **React**, **TypeScript**, and **Fastify** with a built-in **Node CLI** for **dynamically customizable scaffolding** and **automated documentation**.

This boilerplate will be published as a **GitHub repository template** for easy reuse in new projects.

---

### 📌 Dynamic Scaffolding Requirement

> ⚠️ **Important:** No boilerplate or scaffolding should be hardcoded. All project structure, files, and configurations must be dynamically generated based on the user's CLI responses.

- The CLI (`scripts/init.ts`) must prompt the user for all configurable options.
- Based on responses, dynamically scaffold only the relevant:

  - Files & folders
  - Environment variables
  - Components, configuration, routes, and assets
  - Documentation under `docs/`

- Scaffolding logic should rely on modular templates or generators stored in a `scaffold-templates/` or similar directory.
- Update the manifest, `.env.example`, documentation, and other core files with dynamic values.
- Scaffolded files must include inline `// TODO`, `// CONFIGURE`, or `// REMOVE IF UNUSED` comments.
- Log all scaffolding actions in a file like `docs/scaffold-report.md`.

---

### 📆 Core Features:

#### 1. ⚙️ Bundler & Environment

- Vite for build and HMR
- Manifest V3 support
- Multiple entry points:
  - `popup.html`
  - `window.html`
  - `options.html`
  - `background.ts`

#### 2. 🪪 Interactive CLI Scaffold

- Users are prompted to select features:

  - UI Type (Popup / Window)
  - Tailwind CSS (Y/n)
  - i18n (Y/n)
  - Local vs Sync storage
  - Options panel (Y/n)
  - Authentication methods (Y/n + multi-select)
  - AI integrations (Y/n + model/provider + API key)
  - Pricing model (Subscription, Freemium, etc.)
  - Database integration (Postgres, Mongo, Firebase, etc.)
  - Hosting provider(s)
  - Chrome Web Store deployment setup

- Each selected feature scaffolds its corresponding logic, UI, `.env.example`, routes, and `docs/` entries.
- Unselected features must not scaffold anything.

#### 3. 🔐 AI & Auth Integration

- Prompt users to select AI provider (OpenAI, Claude, Gemini, etc.)
- Scaffold:
  - `src/lib/aiClient.ts`
  - `.env.example`
  - Fastify route for proxying if needed
  - Usage sample in UI
  - `docs/ai-integration.md`

#### 4. 💳 Monetization & Pricing

- Prompt for model and payment provider
- Scaffold integration files and pricing docs:
  - `docs/pricing-models.md`
  - `docs/payment-integration.md`

#### 5. 📅 Database

- Prompt for database choice
- Scaffold:
  - `infra/db/{provider}/`
  - `.env.example`
  - SDK, auth, sample query
  - GitHub secrets
  - `docs/database-{provider}.md`

#### 6. 🏠 Hosting

- Prompt for provider(s)
- Scaffold:
  - `infra/hosting/{provider}/`
  - CLI deploy script
  - `.env.example`
  - `docs/hosting-{provider}.md`
  - GitHub Actions deploy workflow (if applicable)

#### 7. 📑 Docs & Templates

Scaffold based on features:

- `docs/ai-changelogs.md`
- `docs/ai-troubleshooting.md`
- `prd.md`
- `docs/feature-summary.md`
- `docs/USAGE.md` — Instructions for repo reuse as GitHub template
- `README.md` — Overview + CLI usage + feature summary

#### 8. ♻️ Dev Tooling & Testing

- Vite + HMR
- Testing with Vitest or Jest
- Chrome API mocks
- Unit + integration test samples
- Commands:
  - `npm run init`
  - `npm run dev`
  - `npm run build`
  - `npm run zip`

#### 9. ♻️ Cleanup Guidance

- Unused scaffolded code should have:
  `// Optional setup for {provider}. Delete if not needed.`

---

### 🏁 Summary

> 📓 All features, setup, and integrations must be conditionally scaffolded based on the user's interactive CLI answers. The boilerplate must be zero-assumption by default.
