import 'dotenv/config';

/**
 * Environment access shared by both suites. Values are read from the process
 * environment or from a local `.env` file. Secrets must never be logged.
 */
function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value.replace(/\/+$/, '') : undefined;
}

export function required(name: 'API_URL' | 'BASE_URL'): string {
  const value = optional(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set. See .env.example.`);
  }
  return value;
}

export const env = {
  /** Origin of the deployed API, for example https://<app>.azurewebsites.net */
  apiUrl: optional('API_URL'),
  /** Origin of the deployed Web application */
  baseUrl: optional('BASE_URL'),
  /** Upper bound for the warm-up of a sleeping App Service F1 instance */
  warmUpTimeoutMs: Number(process.env.WARM_UP_TIMEOUT_MS ?? 60_000),
};
