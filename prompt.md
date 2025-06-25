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
- After collecting user input, generate a comprehensive prompt for AI agents (like Cursor AI, Replit AI, etc.) to create all scaffolding files dynamically based on user choices.
- Save the generated prompt to `docs/ai-project-prompt.md` with clear instructions on how to use it with AI agents.
- The CLI should open the generated file for user review and provide step-by-step guidance on proceeding with AI agent scaffolding.
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

The CLI provides clear, user-friendly explanations for each feature and why users might want it:

**UI Type Selection:**

- **Popup** (opens when clicking extension icon) - Most common choice for simple extensions
- **Window** (opens in a new browser tab) - Better for complex interfaces
- **Side Window** (detached pop-out, ChatGPT-style) - Opens in a dedicated side window, not injected into the page

**Core Features:**

- **Tailwind CSS** - Provides pre-built design components for faster development and a modern look
- **i18n** - Allows your extension to be used in different languages like English, Spanish, etc.
- **Options Page** - Lets users customize extension behavior in Chrome's settings menu

**Authentication Methods** (multi-select):

- **Google** - Sign in with Google account (convenient for most users)
- **GitHub** - Sign in with GitHub account (great for developer tools)
- **Email/Password** - Traditional login system
- **None** - No authentication required

**AI Integrations** (multi-select):

- **OpenAI** - ChatGPT, GPT-4, etc.
- **Claude** - Anthropic AI
- **Gemini** - Google AI
- **None** - No AI features

**Database Integration:**

- **Firebase** - Google cloud database (recommended for easy setup)
- **Postgres** - Relational database
- **MongoDB** - NoSQL database
- **None** - No cloud database

**Pricing Model:**

- **Subscription** - Recurring payments (best for ongoing services)
- **Freemium** - Free + paid upgrades
- **One-time Purchase** - Single payment
- **None** - Free extension

**Hosting Provider(s)** (multi-select):

- **Vercel** - Great for serverless and static sites
- **Netlify** - Easy static hosting
- **Firebase** - Google cloud hosting
- **None** - No backend hosting

**Chrome Storage Type:**

- **Sync** - Syncs data across devices (best for users on multiple devices)
- **Local** - Only on this device

**Accessibility Features** - Helps users with disabilities and improves usability for everyone (highly recommended for inclusivity)

**Smart Validation:**

- Database is automatically required when authentication or pricing features are selected
- Clear warnings and error messages guide users to valid configurations
- Firebase is suggested as default database for easy setup

#### 3. 🔐 Comprehensive Authentication System

When authentication is enabled, the system includes:

**User Account Management:**

- Complete signup flow with email verification
- Secure login with remember me functionality
- Password change and reset password flows
- Account settings and profile management

**Security Measures:**

- Password requirements: Minimum 8 characters, uppercase, lowercase, number, and special character
- Rate limiting: Max 5 login attempts per 15 minutes
- Session management: Secure JWT tokens with refresh token rotation
- CSRF protection, input validation, SQL injection prevention
- XSS prevention, HTTPS only, secure headers (HSTS, CSP, etc.)

**Validation & Error Handling:**

- Real-time client-side validation with immediate feedback
- Comprehensive server-side validation on all endpoints
- User-friendly error messages without exposing system details
- Loading states and clear success feedback

**Authentication Methods:**

- **Email/Password**: Email verification, password reset via email, account lockout after failed attempts
- **Google OAuth**: Sign-in integration, profile syncing, account linking/unlinking
- **GitHub OAuth**: Sign-in integration, profile syncing, account linking/unlinking

**Database Schema & API Endpoints:**

- Complete database tables: Users, Sessions, Password_Resets, Email_Verifications
- Full REST API endpoints for all authentication operations
- OAuth callback endpoints for Google and GitHub

**Frontend Components:**

- Authentication context, forms, guards, and utilities
- Proper error handling and loading states
- Accessible forms with screen reader support

**Security Best Practices:**

- Store sensitive data in Chrome's secure storage
- Implement proper CORS policies
- Use environment variables for all secrets
- Log authentication events for security monitoring
- GDPR compliance for user data handling

#### 4. 💳 Monetization & Pricing

- Prompt for model and payment provider
- Scaffold integration files and pricing docs:
  - `docs/pricing-models.md`
  - `docs/payment-integration.md`
- **Note:** Pricing models automatically require a database for user management and payment tracking

#### 5. 📅 Database

- Prompt for database choice
- **Smart Requirements:** Database is automatically required when authentication or pricing features are selected
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
- Authentication flow testing (when auth is enabled)
- Security testing (rate limiting, validation, token management)
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

> 🔒 **Security First:** When authentication is enabled, implement enterprise-level security measures including proper validation, rate limiting, secure token management, and comprehensive error handling.

> 🎯 **User Experience:** Provide clear, helpful explanations for each feature choice to guide users toward the best configuration for their needs.

---

### 📦 Sample Output

Consider including a sample directory structure and a sample CLI session in the documentation to illustrate the output and user experience.

---
