# Chrome Extension Boilerplate Prompt

> **Note:** This boilerplate is designed for Chrome Extensions using **React**. All references and features assume React as the framework.

---

Create a complete Chrome Extension boilerplate using **React**, **TypeScript** (with strict mode), and **Fastify** with a built-in **Node CLI** for **dynamically customizable scaffolding** and **automated documentation**.

This boilerplate will be published as a **GitHub repository template** for easy reuse in new projects.

---

### 📌 Dynamic Scaffolding Requirement

> ⚠️ **Important:** No boilerplate or scaffolding should be hardcoded. All project structure, files, and configurations must be dynamically generated based on the user's CLI responses.

- The CLI (`scripts/init.ts`) must prompt the user for all configurable options.
- The CLI should support both interactive (prompt-based) and non-interactive (flags/config file) modes for automation and CI/CD use cases.
- The CLI should validate user input and provide helpful error messages or suggestions.
- The CLI should support a "dry run" mode to preview what will be scaffolded before making changes.
- The CLI should be idempotent (re-running it should not break the project or duplicate files).
- Based on responses, dynamically scaffold only the relevant:
  - Files & folders
  - Environment variables
  - Components, configuration, routes, and assets
  - Documentation under `docs/`
  - `.gitignore` with appropriate exclusions for the selected features
- Use AI agent to generate all scaffolding files dynamically based on user choices.
- Update the manifest, `.env.example`, documentation, and other core files with dynamic values.
- Scaffolded files must include inline `// TODO`, `// CONFIGURE`, or `// REMOVE IF UNUSED` comments.
- Log all scaffolding actions in a file like `docs/scaffold-report.md`.
- The CLI should provide guidance for upgrading the boilerplate in existing projects (e.g., via migration scripts or changelogs).

### 🔄 Incremental Feature Addition

- The CLI must support adding new features or integrations to an existing project at any time, not just during initial setup.
- When re-run, the CLI should:
  - Detect which features are already present.
  - Prompt the user for additional features to add (or remove).
  - Scaffold only the new/changed files, configurations, and documentation as needed.
  - Avoid overwriting user-modified files unless explicitly confirmed.
- The project should maintain a config or metadata file (e.g., `scaffold.json`) to track enabled features and integrations.

---

### 📆 Core Features:

#### 1. ⚙️ Bundler & Environment

- Vite for build and HMR
- Manifest V3 support
- TypeScript strict mode enabled by default
- Accessibility linting and code linting (ESLint, Prettier)
- Multiple entry points:
  - `popup.html`
  - `window.html`
  - `options.html`
  - `background.ts`

#### 2. 🪪 Interactive CLI Scaffold

- Users are prompted to select features:
  - UI Type (Popup / Window)
  - Tailwind CSS (Y/n)
  - i18n (Y/n, default: `react-i18next`)
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
- All user input should be validated, and the CLI should provide clear error messages or suggestions.

#### 3. 🔐 AI & Auth Integration

- Prompt users to select AI provider (OpenAI, Claude, Gemini, etc.)
- Scaffold:
  - `src/lib/aiClient.ts`
  - `.env.example`
  - Fastify route for proxying if needed
  - Usage sample in UI
  - `docs/ai-integration.md`
- **Security:** Never expose secrets in the client. Follow best security practices for API keys and authentication.

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

#### 7. 📑 Documentation

Scaffold based on features:

- `docs/ai-changelogs.md`
- `docs/ai-troubleshooting.md`
- `docs/prd.md`
- `docs/feature-summary.md`
- `docs/USAGE.md` — Instructions for repo reuse as GitHub template
- `README.md` — Overview + CLI usage + feature summary
- All documentation should be updated dynamically based on selected features.

#### 8. ♻️ Dev Tooling & Testing

- Vite + HMR
- Testing with Vitest or Jest
- Chrome API mocks
- Unit + integration test samples
- Accessibility testing
- Commands:
  - `npm run init`
  - `npm run dev`
  - `npm run build`
  - `npm run zip`
- Linting with ESLint and Prettier

#### 9. ♻️ Cleanup Guidance

- Unused scaffolded code should have:
  `// Optional setup for {provider}. Delete if not needed.`

---

### 🏁 Summary

> 📓 All features, setup, and integrations must be conditionally scaffolded based on the user's interactive CLI answers. The boilerplate must be zero-assumption by default.

---

### 📦 Sample Output

Consider including a sample directory structure and a sample CLI session in the documentation to illustrate the output and user experience.

---
