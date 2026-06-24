/* =============================================================================
   Supabase Admin Client
   Uses the SERVICE ROLE key — grants full DB access, bypassing RLS.
   ⚠️  NEVER expose this key to the browser / frontend.
   Only used server-side in this Node.js process.
   ============================================================================= */
'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const CONFIGURED = Boolean(
  SUPABASE_URL && !SUPABASE_URL.includes('YOUR_PROJECT') &&
  SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_SERVICE_ROLE_KEY.includes('YOUR_')
);

if (!CONFIGURED) {
  console.warn('');
  console.warn('  ⚠️  SUPABASE NOT CONFIGURED — Running in stub mode.');
  console.warn('  ⚠️  Copy backend/.env.example to backend/.env and add your credentials.');
  console.warn('  ⚠️  API routes will return 503 until credentials are added.');
  console.warn('');
}

// Stub that returns 503 when Supabase is not configured
function makeStub() {
  const handler = () => Promise.resolve({ data: null, error: new Error('Supabase not configured. Add credentials to backend/.env') });
  return new Proxy({}, { get: () => handler });
}

let supabaseAdmin, supabasePublic;

if (CONFIGURED) {
  const { createClient } = require('@supabase/supabase-js');

  /**
   * supabaseAdmin — Service role client.
   * Bypasses RLS — server-side only.
   */
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  /**
   * supabasePublic — Anon key client.
   * Used to verify user JWTs.
   */
  supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
} else {
  supabaseAdmin  = makeStub();
  supabasePublic = makeStub();
}

module.exports = { supabaseAdmin, supabasePublic, SUPABASE_CONFIGURED: CONFIGURED };
