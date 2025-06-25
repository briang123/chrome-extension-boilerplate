#!/usr/bin/env ts-node
import { prompt } from 'enquirer';
// @ts-expect-error: No type declarations for Select prompt
import Select from 'enquirer/lib/prompts/select.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

// Define CLI options for flag-based mode
type CliOptions = {
  uiType?: 'popup' | 'window';
  tailwind?: boolean;
  i18n?: boolean;
  dryRun?: boolean;
  interactive?: boolean;
};

const argv = yargs(hideBin(process.argv))
  .option('uiType', {
    type: 'string',
    choices: ['popup', 'window'],
    describe: 'UI type (popup or window)',
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
    argv.interactive || !argv.uiType || argv.tailwind === undefined || argv.i18n === undefined;

  if (needsPrompt) {
    // Use Select for UI type
    const uiTypePrompt = new Select({
      name: 'uiType',
      message: 'Choose UI type:',
      choices: ['popup', 'window'],
      initial: argv.uiType || 'popup',
    });
    const uiType = await uiTypePrompt.run();
    const responses = await prompt<{
      tailwind: boolean;
      i18n: boolean;
    }>([
      {
        type: 'confirm',
        name: 'tailwind',
        message: 'Include Tailwind CSS?',
        initial: argv.tailwind !== undefined ? argv.tailwind : true,
      },
      {
        type: 'confirm',
        name: 'i18n',
        message: 'Include i18n (react-i18next)?',
        initial: argv.i18n !== undefined ? argv.i18n : true,
      },
    ]);
    config = { ...argv, ...responses, uiType };
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
function generateAIPrompt(config: CliOptions): string {
  const features = [];
  if (config.uiType) features.push(`- UI Type: ${config.uiType}`);
  if (config.tailwind) features.push('- Tailwind CSS: Yes');
  if (config.i18n) features.push('- i18n (react-i18next): Yes');

  return `# Chrome Extension Project Specification

## Project Overview
Create a complete Chrome Extension using React, TypeScript (strict mode), and Vite with the following specifications:

## Selected Features
${features.join('\n')}

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
- \`src/utils/\` (utility functions)

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
- Baseline Content Security Policy configured

## Testing

- Vitest or Jest setup
- Mock Chrome APIs for UI testing
- Unit and integration test examples for UI, background, auth flows, messaging

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
  - How to reset or inspect \`chrome.storage\`

## Accessibility & UX
- Keyboard navigable components
- Focus traps in modals
- Custom alert/notification system with ARIA support
- Optional theme toggler (light/dark/high-contrast)

## README.md Requirements
- Project intro
- CLI usage
- Dev/build instructions
- Chrome loading instructions
- File structure explanation

## Bonus Features
- Zip uploader CLI command
- AI-aware design guidelines for future extensions

## Requirements
- All files must include inline \`// TODO\`, \`// CONFIGURE\`, or \`// REMOVE IF UNUSED\` comments
- Use React 18+ with TypeScript strict mode
- Follow Chrome Extension Manifest V3 best practices
- Include proper error handling and accessibility features
- Add comprehensive documentation in \`docs/\` directory

## Instructions for AI Agent
1. Create all files according to the specification above
2. Ensure all dependencies are properly listed in \`package.json\`
3. Include appropriate TypeScript types and interfaces
4. Add sample usage and configuration comments
5. Create a working Chrome Extension that can be loaded in developer mode
6. Include all documentation files with proper structure and content
7. Implement accessibility features and UX best practices
8. Add bonus features where appropriate

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
