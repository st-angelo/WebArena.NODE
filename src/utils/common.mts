import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename: string = fileURLToPath(import.meta.url);
export const __dirname: string = dirname(__filename);
export const __connectionString = process.env.DB_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
