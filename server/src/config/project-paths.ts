import { resolve } from 'path';

// This file is compiled both from server/src and server/dist. Three parent
// levels consistently point to the repository root in both locations.
export const projectRoot = resolve(__dirname, '..', '..', '..');
export const envFilePaths = [
  resolve(projectRoot, '.env'),
  resolve(projectRoot, '.env.development'),
];
export const pgliteDataDir = resolve(projectRoot, 'pglite-data');
export const pgliteBackupsDir = resolve(projectRoot, 'pglite-backups');
export const migrationReportsDir = resolve(
  projectRoot,
  'reports',
  'migrations',
);
export const logsDir = resolve(projectRoot, 'logs');
export const debugResponsesDir = resolve(projectRoot, 'debug-responses');
export const webDistDir = resolve(projectRoot, 'web', 'dist');
