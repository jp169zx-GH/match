// auth-guard.js — shared Supabase Auth logic for 高端養老客群人格匹配系統 (match app)
// Reuses the same Supabase project as the SLCC 總管理後台系統, so both apps can
// later read/write the same database.

const SUPABASE_URL = 'https://txvyplfaaisrzbwpoqcd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZgDcY0b1NGjf1iEArms2Dw_GMDlIOU5';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Call this on any page that should be protected (e.g. index.html).
// Resolves with the session if logged in; otherwise redirects to login.html
// and resolves with null.
async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.replace('login.html');
    return null;
  }
  return session;
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.replace('login.html');
}

// If the session expires or is signed out from another tab, bounce back to login,
// but only when we're not already on the login page.
supabaseClient.auth.onAuthStateChange((event, session) => {
  const onLoginPage = window.location.pathname.endsWith('login.html');
  if (!onLoginPage && (event === 'SIGNED_OUT' || !session)) {
    window.location.replace('login.html');
  }
});
