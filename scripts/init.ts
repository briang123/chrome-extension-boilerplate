#!/usr/bin/env ts-node
import { prompt } from 'enquirer';
// @ts-expect-error: No type declarations for Select prompt
import Select from 'enquirer/lib/prompts/select.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
    // TODO: Implement file writing and scaffolding logic here
  }
}

main().catch((err) => {
  console.error('Error running CLI:', err);
  process.exit(1);
});
