/**
 * Runtime API / app environment configuration.
 */

const DEFAULT_CONFIG = {
  API_BASE_URL: 'http://api.est118.test:8000',
  API_BASE_PATH: '/api',
  TIMEOUT: 10000,
  APP_ENV: 'development',
  APP_NAME: 'EST_118',
} as const;

export function getApiConfig() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_CONFIG.API_BASE_URL;
  const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH || DEFAULT_CONFIG.API_BASE_PATH;
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || DEFAULT_CONFIG.APP_ENV;
  const appName = process.env.NEXT_PUBLIC_APP_NAME || DEFAULT_CONFIG.APP_NAME;
  const timeout = parseInt(
    process.env.NEXT_PUBLIC_API_TIMEOUT || DEFAULT_CONFIG.TIMEOUT.toString(),
    10
  );

  return {
    API_BASE_URL: apiBaseUrl.replace(/\/$/, ''),
    API_BASE_PATH: apiBasePath,
    /** @deprecated Prefer buildApiUrl() with explicit /api paths */
    API_FULL_URL: `${apiBaseUrl.replace(/\/$/, '')}${apiBasePath}`,
    TIMEOUT: timeout,
    APP_ENV: appEnv,
    APP_NAME: appName,
    IS_DEVELOPMENT: appEnv === 'development',
    IS_PRODUCTION: appEnv === 'production',
  };
}

export const API_CONFIG = getApiConfig();
