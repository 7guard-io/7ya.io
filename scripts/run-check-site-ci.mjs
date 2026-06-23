import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['scripts/check-site.mjs'], {
  encoding: 'utf8'
});

const stdout = result.stdout ?? '';
const stderr = result.stderr ?? '';
const output = `${stdout}${stderr}`;
const exitCode = typeof result.status === 'number' ? result.status : 1;

fs.writeFileSync('site-process-health.log', output);
fs.writeFileSync('site-process-health.exit', `${exitCode}\n`);

process.stdout.write(output);
process.exit(exitCode);
