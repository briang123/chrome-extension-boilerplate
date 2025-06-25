import fs from 'fs';
import path from 'path';

export type ScaffoldOptions = {
  feature: string;
  variables: Record<string, string>;
  dryRun?: boolean;
  targetDir?: string;
  logFile?: string;
};

// Render a template string with {{variable}} placeholders
export function renderTemplate(content: string, variables: Record<string, string>): string {
  return content.replace(/{{(\w+)}}/g, (_, key) => variables[key] || '');
}

// Copy and render all files from a template directory
export function scaffoldFeature(options: ScaffoldOptions) {
  const {
    feature,
    variables,
    dryRun,
    targetDir = '.',
    logFile = 'docs/scaffold-report.md',
  } = options;
  const templateDir = path.join('scaffold-templates', feature);
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }
  const files = fs.readdirSync(templateDir);
  let log = `# Scaffold Report for feature: ${feature}\n`;
  for (const file of files) {
    const srcPath = path.join(templateDir, file);
    const destPath = path.join(targetDir, file);
    const content = fs.readFileSync(srcPath, 'utf8');
    const rendered = renderTemplate(content, variables);
    log += `- ${dryRun ? '[DRY RUN] Would create' : 'Created'}: ${destPath}\n`;
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, rendered, 'utf8');
    }
  }
  if (!dryRun) {
    fs.appendFileSync(logFile, log + '\n');
  } else {
    console.log(log);
  }
}

// TODO: Add support for nested directories, more advanced templating, and file conflict checks.
