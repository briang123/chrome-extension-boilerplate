#!/usr/bin/env ts-node
import enquirer from 'enquirer';
// @ts-expect-error: No type declarations for Select prompt
import Select from 'enquirer/lib/prompts/select.js';
// @ts-expect-error: No type declarations for MultiSelect prompt
import MultiSelect from 'enquirer/lib/prompts/multiselect.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

// Define CLI options for flag-based mode
type CliOptions = {
  uiType?: 'popup' | 'window' | 'sidewindow';
  tailwind?: boolean;
  i18n?: boolean;
  dryRun?: boolean;
  interactive?: boolean;
  optionsPage?: boolean;
  authMethods?: string[];
  aiProviders?: string[];
  database?: string;
  pricingModel?: string;
  hostingProviders?: string[];
  storageType?: string;
  accessibility?: boolean;
  includeWebsite?: boolean;
  includePricing?: boolean;
  includeTestimonials?: boolean;
  includeAuth?: boolean;
  extensionDescription?: string;
  extensionName?: string;
};

const argv = yargs(hideBin(process.argv))
  .option('uiType', {
    type: 'string',
    choices: ['popup', 'window', 'sidewindow'],
    describe: 'UI type (popup, window, or sidewindow)',
  })
  .option('tailwind', {
    type: 'boolean',
    describe: 'Include Tailwind CSS',
  })
  .option('i18n', {
    type: 'boolean',
    describe: 'Include i18n (react-i18next)',
  })
  .option('dry-run', {
    type: 'boolean',
    describe: 'Preview changes without writing files',
    default: false,
  })
  .option('interactive', {
    type: 'boolean',
    describe: 'Force interactive mode',
    default: false,
  })
  .help().argv as CliOptions;

async function main() {
  let config: CliOptions = {};

  // If any required options are missing or interactive is forced, prompt interactively
  const needsPrompt =
    argv.interactive ||
    !argv.uiType ||
    !argv.extensionDescription ||
    !argv.extensionName ||
    argv.tailwind === undefined ||
    argv.i18n === undefined ||
    argv.optionsPage === undefined ||
    argv.authMethods === undefined ||
    argv.aiProviders === undefined ||
    argv.database === undefined ||
    argv.pricingModel === undefined ||
    argv.hostingProviders === undefined ||
    argv.storageType === undefined ||
    argv.accessibility === undefined ||
    argv.includeWebsite === undefined ||
    argv.includePricing === undefined ||
    argv.includeTestimonials === undefined ||
    argv.includeAuth === undefined;

  if (needsPrompt) {
    // Collect extension description first
    console.log('\nTell us about your Chrome Extension:');
    console.log('(This description will be used to generate appropriate content for your extension, website, and Chrome Web Store listing.)');
    const { extensionDescription } = await enquirer.prompt({
      type: 'input',
      name: 'extensionDescription',
      message: 'What does your Chrome extension do? (Brief description of its main purpose and features)',
      required: true,
    });
    
    const { extensionName } = await enquirer.prompt({
      type: 'input',
      name: 'extensionName',
      message: 'What is the name of your Chrome extension?',
      required: true,
    });
    
    // Use Select for UI type with clear explanations
    const uiTypePrompt = new Select({
      name: 'uiType',
      message:
        'How would you like users to interact with your Chrome extension? (Choose the main way users will use your extension)',
      choices: [
        {
          name: 'popup',
          message:
            'Popup (opens when clicking extension icon) - Most common choice for simple extensions',
          hint: 'A small window that appears when users click your extension icon in the toolbar. Great for quick actions or info.',
        },
        {
          name: 'window',
          message: 'Window (opens in a new browser tab) - Better for complex interfaces',
          hint: 'A full browser window/tab that opens when users click your extension icon. Good for dashboards or large UIs.',
        },
        {
          name: 'sidewindow',
          message:
            'Side Window (detached pop-out, ChatGPT-style) - Opens in a dedicated side window, not injected into the page',
          hint: 'A separate pop-out window, launched from the extension icon, for a focused experience. Useful for chat or tools.',
        },
      ],
      initial: argv.uiType || 'popup',
    });
    const uiType = await uiTypePrompt.run();

    // Use MultiSelect and Select for advanced prompts
    const tailwind = await enquirer.prompt({
      type: 'confirm',
      name: 'tailwind',
      message:
        'Would you like to use Tailwind CSS for styling? (Provides pre-built design components for faster development and a modern look)',
      initial: argv.tailwind !== undefined ? argv.tailwind : true,
    });
    const i18n = await enquirer.prompt({
      type: 'confirm',
      name: 'i18n',
      message:
        'Do you want to support multiple languages? (Allows your extension to be used in different languages like English, Spanish, etc.)',
      initial: argv.i18n !== undefined ? argv.i18n : true,
    });
    const optionsPage = await enquirer.prompt({
      type: 'confirm',
      name: 'optionsPage',
      message:
        "Would you like to include an Options page for user settings? (Lets users customize extension behavior in Chrome's settings menu.)",
      initial: true,
    });
    console.log('\nWhich authentication methods should your extension support?');
    console.log(
      '(Choose all that apply. This allows users to sign in with their preferred provider. For example, Google for convenience, GitHub for developers, or Email for traditional login.)',
    );
    const authMethodsPrompt = new MultiSelect({
      name: 'authMethods',
      message: 'Select authentication methods:',
      choices: [
        { name: 'google', message: 'Google (Sign in with Google account)' },
        { name: 'github', message: 'GitHub (Sign in with GitHub account)' },
        { name: 'email', message: 'Email/Password (Traditional login)' },
        { name: 'none', message: 'None (No authentication required)' },
      ],
      initial: ['none'],
      max: 3,
    });
    const authMethods = await authMethodsPrompt.run();
    console.log('\nWhich AI providers would you like to integrate?');
    console.log(
      '(This enables features like chat, summarization, or code generation. Choose one if you want AI-powered features in your extension.)',
    );
    const aiProvidersPrompt = new MultiSelect({
      name: 'aiProviders',
      message: 'Select AI integrations:',
      choices: [
        { name: 'openai', message: 'OpenAI (ChatGPT, GPT-4, etc.)' },
        { name: 'claude', message: 'Claude (Anthropic AI)' },
        { name: 'gemini', message: 'Gemini (Google AI)' },
        { name: 'none', message: 'None (No AI features)' },
      ],
      initial: ['none'],
      max: 3,
    });
    const aiProviders = await aiProvidersPrompt.run();
    console.log('\nHow will you monetize your extension?');
    console.log(
      '(Choose a model if you want to charge users or offer premium features. Subscription is best for ongoing services, Freemium for free+paid, One-time for a single purchase.)',
    );
    const pricingModelPrompt = new Select({
      name: 'pricingModel',
      message: 'Select a pricing model:',
      choices: [
        { name: 'none', message: 'None (Free extension)' },
        { name: 'subscription', message: 'Subscription (Recurring payments)' },
        { name: 'freemium', message: 'Freemium (Free + paid upgrades)' },
        { name: 'onetime', message: 'One-time Purchase (Single payment)' },
      ],
      initial: 'none',
    });
    const pricingModel = await pricingModelPrompt.run();
    console.log('\nWhich database should your extension use for storing data?');
    console.log(
      '(Pick one if you need to store user data in the cloud. For example, use Firebase for easy setup, or Postgres/MongoDB for more control.)',
    );

    // Check if database is required based on other selections
    const requiresDatabase =
      authMethods.includes('google') ||
      authMethods.includes('github') ||
      authMethods.includes('email') ||
      pricingModel !== 'none';

    if (requiresDatabase) {
      console.log(
        '\n⚠️  Database required: You selected authentication or pricing features that need a database.',
      );
      console.log(
        "   We'll automatically select a database for you (Firebase recommended for easy setup).",
      );
    }

    const databasePrompt = new Select({
      name: 'database',
      message: 'Select a database integration:',
      choices: [
        { name: 'none', message: 'None (No cloud database)' },
        { name: 'postgres', message: 'Postgres (Relational database)' },
        { name: 'mongo', message: 'MongoDB (NoSQL database)' },
        { name: 'firebase', message: 'Firebase (Google cloud database)' },
      ],
      initial: requiresDatabase ? 'firebase' : 'none',
    });
    const database = await databasePrompt.run();

    // Validate that database is selected when required
    if (requiresDatabase && database === 'none') {
      console.log(
        '\n❌ Error: You selected features that require a database (authentication or pricing).',
      );
      console.log('   Please select a database option above.');
      process.exit(1);
    }
    console.log('\nWhere will you host your backend or API?');
    console.log(
      '(Select all that apply. This is for cloud functions, databases, etc. Vercel/Netlify are easy for static or serverless, Firebase for Google cloud.)',
    );
    const hostingProvidersPrompt = new MultiSelect({
      name: 'hostingProviders',
      message: 'Select hosting provider(s):',
      choices: [
        { name: 'vercel', message: 'Vercel (Great for serverless and static sites)' },
        { name: 'netlify', message: 'Netlify (Easy static hosting)' },
        { name: 'firebase', message: 'Firebase (Google cloud hosting)' },
        { name: 'none', message: 'None (No backend hosting)' },
      ],
      initial: ['none'],
      max: 3,
    });
    const hostingProviders = await hostingProvidersPrompt.run();
    console.log('\nHow should user data be stored?');
    console.log(
      '(Sync shares data across devices; Local keeps it on one device. Sync is best for users who use Chrome on multiple devices.)',
    );
    const storageTypePrompt = new Select({
      name: 'storageType',
      message: 'Select Chrome storage type:',
      choices: [
        { name: 'sync', message: 'Sync (syncs across devices)' },
        { name: 'local', message: 'Local (only on this device)' },
      ],
      initial: 'sync',
    });
    const storageType = await storageTypePrompt.run();
    const accessibility = await enquirer.prompt({
      type: 'confirm',
      name: 'accessibility',
      message:
        'Would you like to include accessibility features? (Helps users with disabilities and improves usability for everyone. Highly recommended for inclusivity.)',
      initial: true,
    });

    console.log(
      '\nWould you like to include a standalone website to promote your Chrome Extension?',
    );
    console.log(
      '(A dedicated website helps with SEO, brand visibility, trust building, and provides support/documentation.)',
    );
    const { includeWebsite } = await enquirer.prompt({
      type: 'confirm',
      name: 'includeWebsite',
      message: 'Include a standalone website?',
      initial: false,
    });

    let websiteFeatures: { includePricing?: boolean; includeTestimonials?: boolean; includeAuth?: boolean } = {};
    if (includeWebsite) {
      console.log('\nWhat features should your website include?');
      console.log('(These will be built into your one-page website with privacy policy, terms, and support pages.)');
      
      const { includePricing } = await enquirer.prompt({
        type: 'confirm',
        name: 'includePricing',
        message: `Include pricing information on the website? ${pricingModel !== 'none' ? '(Recommended since you selected a pricing model)' : ''}`,
        initial: pricingModel !== 'none',
      });
      
      const { includeTestimonials } = await enquirer.prompt({
        type: 'confirm',
        name: 'includeTestimonials',
        message: 'Include testimonials section on the website? (Great for building trust and social proof)',
        initial: true,
      });
      
      const { includeAuth } = await enquirer.prompt({
        type: 'confirm',
        name: 'includeAuth',
        message: `Include authentication features on the website? ${authMethods.includes('google') || authMethods.includes('github') || authMethods.includes('email') ? '(Recommended since you selected authentication)' : ''}`,
        initial: authMethods.includes('google') || authMethods.includes('github') || authMethods.includes('email'),
      });
      
      websiteFeatures = { 
        includePricing, 
        includeTestimonials, 
        includeAuth 
      };
    } else {
      // Initialize with false values when website is not included
      websiteFeatures = {
        includePricing: false,
        includeTestimonials: false,
        includeAuth: false
      };
    }

    config = {
      ...argv,
      ...tailwind,
      ...i18n,
      ...optionsPage,
      authMethods,
      aiProviders,
      database,
      pricingModel,
      hostingProviders,
      storageType,
      ...accessibility,
      uiType,
      includeWebsite,
      ...websiteFeatures,
      extensionDescription,
      extensionName,
    };
  } else {
    config = { ...argv };
  }

  // Output config and dry-run info
  if (config.dryRun) {
    console.log('\n[DRY RUN] The following configuration would be used:');
    console.log(JSON.stringify(config, null, 2));
    console.log('\nNo files were written.');
  } else {
    console.log('\n[CONFIG] The following configuration will be used:');
    console.log(JSON.stringify(config, null, 2));
  }

  // Generate and save AI prompt
  const aiPrompt = generateAIPrompt(config);
  saveAIPrompt(aiPrompt, config.dryRun);

  // TODO: Call AI agent to generate scaffolding files based on user choices
  // The AI agent should generate all files dynamically with appropriate imports and dependencies
}

// Generate comprehensive AI prompt based on user configuration
function generateAIPrompt(config: CliOptions & any): string {
  const features = [];
  if (config.uiType === 'sidewindow') {
    features.push(
      '- Side Window (detached pop-out, ChatGPT-style): Opens in a dedicated side window, not injected into the page.',
    );
    features.push(
      '  - Use a background script to call chrome.windows.create({ url: "window.html", type: "popup", width: 400, height: 800 })',
    );
    features.push('  - The main extension action should only be a launcher, not the full UI.');
    features.push('  - Do NOT inject a UI overlay into the current page.');
  } else if (config.uiType) {
    features.push(`- UI Type: ${config.uiType}`);
  }
  if (config.tailwind) features.push('- Tailwind CSS: Yes');
  if (config.i18n) features.push('- i18n (react-i18next): Yes');
  if (config.optionsPage) features.push('- Options Page: Yes');
  if (config.authMethods && config.authMethods.length && !config.authMethods.includes('none'))
    features.push(`- Authentication: ${config.authMethods.join(', ')}`);
  if (config.aiProviders && config.aiProviders.length && !config.aiProviders.includes('none'))
    features.push(`- AI Integrations: ${config.aiProviders.join(', ')}`);
  if (config.database && config.database !== 'none')
    features.push(`- Database: ${config.database}`);
  if (config.pricingModel && config.pricingModel !== 'none')
    features.push(`- Pricing Model: ${config.pricingModel}`);
  if (
    config.hostingProviders &&
    config.hostingProviders.length &&
    !config.hostingProviders.includes('none')
  )
    features.push(`- Hosting: ${config.hostingProviders.join(', ')}`);
  if (config.storageType) features.push(`- Chrome Storage: ${config.storageType}`);
  if (config.accessibility) features.push('- Accessibility Features: Yes');
  if (config.includeWebsite) {
    features.push('- Standalone Website: Yes');
    if (config.includePricing) features.push('  - Website includes pricing information');
    if (config.includeTestimonials) features.push('  - Website includes testimonials section');
    if (config.includeAuth) features.push('  - Website includes authentication features');
  }

  // Generate authentication-specific requirements
  let authRequirements = '';
  if (config.authMethods && config.authMethods.length && !config.authMethods.includes('none')) {
    authRequirements = `

## Authentication Requirements

### User Account Management
- **Account Creation**: Complete signup flow with email verification
- **Login System**: Secure login with remember me functionality
- **Password Management**: Change password and reset password flows
- **Account Settings**: Profile management and account preferences

### Security Measures
- **Password Requirements**: Minimum 8 characters, require uppercase, lowercase, number, and special character
- **Rate Limiting**: Implement rate limiting on login attempts (max 5 attempts per 15 minutes)
- **Session Management**: Secure JWT tokens with refresh token rotation
- **CSRF Protection**: Implement CSRF tokens for all form submissions
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Use parameterized queries or ORM
- **XSS Prevention**: Sanitize all user inputs and outputs
- **HTTPS Only**: All API calls must use HTTPS
- **Secure Headers**: Implement security headers (HSTS, CSP, etc.)

### Validation & Error Handling
- **Real-time Validation**: Client-side validation with immediate feedback
- **Server-side Validation**: Comprehensive validation on all endpoints
- **Error Messages**: User-friendly error messages without exposing system details
- **Loading States**: Proper loading indicators during authentication operations
- **Success Feedback**: Clear success messages and redirects

### Authentication Methods
${
  config.authMethods.includes('email')
    ? `
**Email/Password Authentication:**
- Email verification required for new accounts
- Password reset via email with secure tokens
- Account lockout after failed attempts
- Email change verification process`
    : ''
}
${
  config.authMethods.includes('google')
    ? `
**Google OAuth:**
- Google Sign-In integration
- Handle Google account linking/unlinking
- Sync Google profile data (name, email, avatar)
- Handle Google account deletion scenarios`
    : ''
}
${
  config.authMethods.includes('github')
    ? `
**GitHub OAuth:**
- GitHub Sign-In integration
- Handle GitHub account linking/unlinking
- Sync GitHub profile data (username, email, avatar)
- Handle GitHub account deletion scenarios`
    : ''
}

### Database Schema Requirements
- **Users Table**: id, email, password_hash, name, avatar_url, created_at, updated_at, email_verified, last_login
- **Sessions Table**: id, user_id, token, refresh_token, expires_at, created_at
- **Password_Resets Table**: id, user_id, token, expires_at, created_at
- **Email_Verifications Table**: id, user_id, token, expires_at, created_at

### API Endpoints Required
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/logout - User logout
- POST /auth/refresh - Refresh access token
- POST /auth/verify-email - Email verification
- POST /auth/reset-password - Request password reset
- POST /auth/reset-password/confirm - Confirm password reset
- PUT /auth/change-password - Change password
- PUT /auth/profile - Update profile
- GET /auth/profile - Get user profile
- DELETE /auth/account - Delete account
${
  config.authMethods.includes('google')
    ? `
- GET /auth/google - Google OAuth initiation
- GET /auth/google/callback - Google OAuth callback`
    : ''
}
${
  config.authMethods.includes('github')
    ? `
- GET /auth/github - GitHub OAuth initiation
- GET /auth/github/callback - GitHub OAuth callback`
    : ''
}

### Frontend Components Required
- **AuthProvider**: React context for authentication state
- **LoginForm**: Login form with validation
- **RegisterForm**: Registration form with validation
- **PasswordResetForm**: Password reset request form
- **PasswordChangeForm**: Password change form
- **ProfileForm**: User profile management form
- **AuthGuard**: Route protection component
- **LoadingSpinner**: Loading state component
- **ErrorMessage**: Error display component

### Security Best Practices
- Store sensitive data in Chrome's secure storage
- Implement proper CORS policies
- Use environment variables for all secrets
- Log authentication events for security monitoring
- Implement account recovery options
- Regular security audits and updates
- GDPR compliance for user data handling`;
  }

  // Generate website-specific requirements
  let websiteRequirements = '';
  if (config.includeWebsite) {
    websiteRequirements = `

## Standalone Website Requirements

### Website Structure
- **One-page landing site** with multiple sections
- **Privacy Policy page** (required for Chrome Web Store)
- **Terms of Service page**
- **Support/Contact page**
- **Responsive design** for all devices

### Landing Page Sections
- **Hero Section**: Value proposition + CTA to install extension
- **Features Section**: Benefits, screenshots, GIFs
${config.includeTestimonials ? '- **Testimonials Section**: User quotes and reviews' : ''}
- **Install Instructions**: Demo video or step-by-step guide
- **FAQ Section**: Common questions and answers
- **Footer**: Links to privacy, support, GitHub, etc.

### Website Features
${config.includePricing ? `
**Pricing Section:**
- Display pricing tiers and features
- Integration with selected pricing model (${config.pricingModel})
- Clear value proposition for each tier
- Call-to-action buttons for each plan` : ''}
${config.includeAuth ? `
**Authentication Integration:**
- User account management on website
- Login/register functionality
- Profile management
- Integration with extension authentication` : ''}

### Technical Requirements
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Fast Loading**: Optimized images, minified CSS/JS
- **Analytics Ready**: Google Analytics or similar
- **Contact Form**: Support request form
- **Social Media**: Open Graph tags for sharing

### File Structure
- `website/index.html` - Landing page
- `website/privacy.html` - Privacy policy
- `website/terms.html` - Terms of service
- `website/support.html` - Support page
- `website/assets/` - Images, CSS, JS
- `website/css/` - Stylesheets
- `website/js/` - JavaScript files`;
  }

  // Generate Chrome Web Store documentation
  const chromeStoreDocs = `

## Chrome Web Store Listing Requirements

### Required Information for Store Listing
The following information must be configured in the Chrome Developer Dashboard when submitting your extension:

**Basic Information:**
- **Extension Name**: The name that appears in the store
- **Short Description**: Brief description (max 132 characters)
- **Long Description**: Detailed description of features and benefits
- **Category**: Choose appropriate category (Productivity, Developer Tools, etc.)
- **Tags**: Keywords for discoverability

**Visual Assets:**
- **Icons**: 128x128 PNG icon (required)
- **Screenshots**: PNG or JPG, 640x400 or higher (at least 1 required)
- **Promotional Video**: Optional, via YouTube URL
- **Promotional Images**: Additional promotional graphics

**Content:**
- **Languages Supported**: List all supported languages
- **Pricing**: Free or paid (configured based on pricing model)
- **Permissions**: List of required permissions with explanations

**Legal & Support:**
- **Privacy Policy URL**: Required (points to your website)
- **Support Website URL**: Optional but recommended
- **Terms of Service URL**: Optional but recommended

### Store Listing URL
Your extension will be available at:
\`https://chromewebstore.google.com/detail/your-extension-id\`

### Submission Process
1. Create developer account at Chrome Web Store Developer Dashboard
2. Upload extension package (ZIP file)
3. Fill in all required listing information
4. Submit for review (typically 1-3 business days)
5. Address any review feedback
6. Publish to store

### Best Practices
- Write compelling descriptions that highlight value
- Use high-quality screenshots and videos
- Respond to user reviews and feedback
- Keep listing information up to date
- Monitor analytics and user feedback`;

  return `# Chrome Extension Project Specification

## Project Overview
Create a complete Chrome Extension using React, TypeScript (strict mode), and Vite with the following specifications:

## Extension Details
**Extension Name:** ${config.extensionName || 'Your Chrome Extension'}
**Description:** ${config.extensionDescription || 'A Chrome extension that enhances your browsing experience'}

## Selected Features
${features.join('\n')}${authRequirements}${websiteRequirements}${chromeStoreDocs}

## Required Files and Structure

### Core Configuration
- \`manifest.json\` (Manifest V3)
- \`package.json\` with all necessary dependencies
- \`tsconfig.json\` (TypeScript strict mode)
- \`vite.config.ts\` (Vite configuration for Chrome Extension)
- \`.env.example\` (environment variables template)
- \`.gitignore\` (appropriate exclusions)

### Source Code Structure
- \`src/popup/Popup.tsx\` (React popup component)
- \`src/popup/popup.html\` (popup HTML entry)
- \`src/background/background.ts\` (service worker)
- \`src/content/content.ts\` (content script)
- \`src/utils/\` (utility functions)${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- \`src/auth/\` (authentication components and utilities)
- \`src/components/auth/\` (authentication UI components)
- \`src/hooks/useAuth.ts\` (authentication hook)
- \`src/contexts/AuthContext.tsx\` (authentication context)`
      : ''
  }

### Styling
${config.tailwind ? '- Tailwind CSS configuration and imports (see design-system.md)' : '- Basic CSS styling (See design-system.md'}

### Internationalization
${config.i18n ? '- react-i18next setup with sample translations' : '- No i18n required'}

### Development Tools
- ESLint configuration
- Prettier configuration
- Testing setup (Vitest)
- Build scripts (\`npm run dev\`, \`npm run build\`, \`npm run zip\`)

## Extension Modes

- Popup UI (in \`src/popup/\`) with example state persisted via \`chrome.storage.sync\`
- Detached Window UI (in \`src/window/\`) launched from popup, with message passing
- Optional Options page with settings persisted to chosen storage

## Dev Tooling

- Vite-powered HMR
- Scripts: \`clean\`, \`dev\`, \`build\`, \`zip\`
- Module path aliases like \`@components\`, \`@utils\`, \`@popup\`
- Auto-copy static assets to \`dist/\`

## Permissions & Security

- Scaffold only necessary permissions in \`manifest.json\`
- Dynamic permission utilities
- Baseline Content Security Policy configured${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- Authentication-related permissions (identity, storage)
- Secure storage for authentication tokens
- Background script for token refresh management`
      : ''
  }

## Testing

- Vitest or Jest setup
- Mock Chrome APIs for UI testing
- Unit and integration test examples for UI, background, auth flows, messaging${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- Authentication flow testing (login, register, password reset)
- Security testing (rate limiting, validation, token management)
- Mock authentication providers for testing`
      : ''
  }

## Documentation Requirements

Include these files:

- \`docs/ai-changelogs.md\`  
  Log of AI-generated feature changes, grouped by date and issue/feature.

- \`docs/ai-troubleshooting.md\`  
  Troubleshooting history (grouped by issue type + date). Additive only, newest at top.

- \`docs/prd.md\`  
  Product requirements doc. AI will mark items ✅ when completed, and update notes.

- \`docs/design-system.md\`  
  A modern, themeable design system tailored for **Chrome Extensions**, including:
  - Color tokens with light/dark mode (toggle capability)
  - Suggested emotion-based palettes
  - CSS variables for typography, spacing, radius, shadows, etc
  - Button, modal, card, form style
  - Create base components that can be inherited or extended
  - CSS folder structure (\`/styles/\`)
  - Popup/window layout support
  - Prompts you can use with an AI to scaffold design components

- \`docs/recipes.md\`
  Cookbook of common extension patterns, such as:
  - Messaging between popup and background
  - Dynamic content script injection
  - Debugging extension UI locally
  - Handling permissions dynamically
  - How to reset or inspect \`chrome.storage\`${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
  - Authentication flow implementation
  - Token management and refresh strategies
  - Secure storage practices
  - OAuth integration patterns`
      : ''
  }

- \`docs/chrome-store-listing.md\`
  Complete guide for Chrome Web Store submission, including:
  - Required information and assets
  - Submission process and best practices
  - Store listing optimization tips
  - Review process guidelines

## Accessibility & UX
- Keyboard navigable components
- Focus traps in modals
- Custom alert/notification system with ARIA support
- Optional theme toggler (light/dark/high-contrast)${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- Accessible authentication forms with proper labels and error announcements
- Screen reader friendly error messages
- Keyboard navigation for all authentication flows`
      : ''
  }

## README.md Requirements
- Project intro
- CLI usage
- Dev/build instructions
- Chrome loading instructions
- File structure explanation${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- Authentication setup instructions
- Environment variable configuration
- Database setup guide
- Security considerations`
      : ''
  }

## Bonus Features
- Zip uploader CLI command
- AI-aware design guidelines for future extensions${
    config.authMethods && config.authMethods.includes('email')
      ? `
- Email templates for verification and password reset
- Account activity logging
- Two-factor authentication support`
      : ''
  }

## Requirements
- All files must include inline \`// TODO\`, \`// CONFIGURE\`, or \`// REMOVE IF UNUSED\` comments
- Use React 18+ with TypeScript strict mode
- Follow Chrome Extension Manifest V3 best practices
- Include proper error handling and accessibility features
- Add comprehensive documentation in \`docs/\` directory${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
- Implement all security measures listed in authentication requirements
- Use secure coding practices for all authentication-related code
- Include comprehensive error handling for all authentication flows
- Implement proper logging for security monitoring`
      : ''
  }

## Instructions for AI Agent
1. Create all files according to the specification above
2. Ensure all dependencies are properly listed in \`package.json\`
3. Include appropriate TypeScript types and interfaces
4. Add sample usage and configuration comments
5. Create a working Chrome Extension that can be loaded in developer mode
6. Include all documentation files with proper structure and content
7. Implement accessibility features and UX best practices
8. Add bonus features where appropriate${
    config.authMethods && config.authMethods.length && !config.authMethods.includes('none')
      ? `
9. Implement comprehensive authentication system with all security measures
10. Create secure API endpoints and database schema
11. Implement proper token management and session handling
12. Add comprehensive testing for all authentication flows`
      : ''
  }

${config.includeWebsite ? `
13. Create standalone website with all required pages
14. Implement responsive design and SEO optimization
15. Include contact forms and support functionality
16. Optimize for performance and user experience` : ''}

Please generate all the necessary files for this Chrome Extension project.`;
}

// Save AI prompt to file and provide instructions
function saveAIPrompt(promptContent: string, dryRun: boolean = false) {
  const promptFile = 'docs/ai-project-prompt.md';

  if (dryRun) {
    console.log('\n[DRY RUN] Would create AI prompt file:');
    console.log(promptContent);
    return;
  }

  // Ensure docs directory exists
  fs.mkdirSync('docs', { recursive: true });

  // Save the prompt to file
  fs.writeFileSync(promptFile, promptContent, 'utf8');

  console.log('\n✅ AI Project Prompt Generated!');
  console.log(`📄 Saved to: ${promptFile}`);
  console.log('\n📋 Next Steps:');
  console.log('1. Review the generated prompt in the file above');
  console.log('2. Copy the prompt content');
  console.log('3. Paste it to your AI agent (Cursor AI, Replit AI, etc.)');
  console.log('4. The AI agent will create all your project files');
  console.log(
    '\n💡 Tip: You can edit the prompt file to customize your requirements before using it.',
  );
}

main().catch((err) => {
  console.error('Error running CLI:', err);
  process.exit(1);
});
