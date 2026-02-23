import dotenv from 'dotenv';

dotenv.config();

export function env(name: string, defaultValue?: string): string {
  const value = process.env[name];

  if (value !== undefined) return value;

  if (defaultValue !== undefined) return defaultValue;

  if (name === 'COGNITO_USER_POOL_ID' || name === 'COGNITO_CLIENT_ID') {
    return '';
  }

  throw new Error(`Missing: process.env['${name}'].`);
}
