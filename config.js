import 'dotenv/config';

export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const APP_URL = process.env.APP_URL;
export default {
  RESEND_API_KEY,
  ADMIN_EMAIL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  APP_URL,
};
