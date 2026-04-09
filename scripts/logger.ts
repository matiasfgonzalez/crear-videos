/**
 * Simple colorized logger for the CLI.
 * Uses ANSI escape codes — works on Windows Terminal, PowerShell, and bash.
 */

const reset = '\x1b[0m';
const colors = {
  info: '\x1b[36m',    // cyan
  success: '\x1b[32m', // green
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  dim: '\x1b[2m',      // dim
  bold: '\x1b[1m',     // bold
};

function timestamp(): string {
  return new Date().toLocaleTimeString('es-AR', { hour12: false });
}

export const log = {
  info(msg: string): void {
    console.log(`${colors.dim}[${timestamp()}]${reset} ${colors.info}ℹ${reset}  ${msg}`);
  },
  success(msg: string): void {
    console.log(`${colors.dim}[${timestamp()}]${reset} ${colors.success}✔${reset}  ${msg}`);
  },
  warn(msg: string): void {
    console.warn(`${colors.dim}[${timestamp()}]${reset} ${colors.warn}⚠${reset}  ${msg}`);
  },
  error(msg: string): void {
    console.error(`${colors.dim}[${timestamp()}]${reset} ${colors.error}✖${reset}  ${msg}`);
  },
  bold(msg: string): void {
    console.log(`\n${colors.bold}${msg}${reset}`);
  },
  divider(): void {
    console.log(`${colors.dim}${'─'.repeat(60)}${reset}`);
  },
};
