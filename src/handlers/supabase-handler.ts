import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { createServerClient } from "@supabase/ssr";
import { generateFormHTML, showErrorDialog } from "../utils/auth";
import { createClient } from '@supabase/supabase-js';


interface OAuthState {
  oauthReqInfo: AuthRequest;
  state: string;
}

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();


/**
 * GET /authorize
 * Renders a authentication form 
 */
app.get("/authorize", async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  const { clientId } = oauthReqInfo;
  if (!clientId) {
    return c.text("Invalid request", 400);
  }
  // Saves initial request info in a cookie
  const state = crypto.randomUUID();
  const oauthState = JSON.stringify({ oauthReqInfo, state });
  setCookie(c, "oauth_state", oauthState, {
    path: '/',
    maxAge: 1800,
    secure: true,
    httpOnly: false,
    sameSite: 'lax'
  });
  let formHTML = generateFormHTML(state);
  return c.html(formHTML);
});


/**
 * POST /authorize
 * Completes the OAuth handshake with the MCP client using password flow.
 */
app.post("/authorize", async (c) => {
  // Read and validate form data
  const formData = await c.req.formData();
  const state = formData.get("state")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!state || !email || !password) {
    return c.html(showErrorDialog("Invalid form submission"));
  }

  // Retrieve the OAuth request info from cookie
  const oauthState = getCookie(c, 'oauth_state');
  let oauthReqInfo;
  if (!oauthState) {
    return c.html(showErrorDialog("Invalid state"));
  }
  try {
    ({ oauthReqInfo } = JSON.parse(oauthState) as OAuthState);
  } catch {
    return c.html(showErrorDialog("Corrupted OAuth state cookie"), 400);
  }


  // Exchange credentials for an access token
  const projectId = c.env.SUPABASE_PROJECT_ID;
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    c.env.SUPABASE_CLIENT_ID
  );
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.session?.access_token || !data?.session?.refresh_token) {
    return c.html(showErrorDialog(error?.message ?? "Missing tokens"));
  }
  const { session } = data;
  const { access_token, refresh_token } = session;

  // Return token to the MCP client
  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    metadata: {
      label: email,
    },
    props: {
      accessToken: access_token,
      refreshToken: refresh_token,
      projectId: projectId,
      clientId: c.env.SUPABASE_CLIENT_ID,
    } as {
      accessToken: string;
      refreshToken: string;
      projectId: string;
      clientId: string;
    },
    request: oauthReqInfo,
    scope: oauthReqInfo.scope,
    userId: email,
  });
  return Response.redirect(redirectTo);
});


/**
 * GET /oauth/callback
 * Exchanges the auth code for access & refresh tokens
 */
app.get("/oauth/callback", async (c) => {
  // Retrieve code 
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code");
  if (!code) { return c.html(showErrorDialog("Missing code"), 400); }

  // Retrieve initial request info from cookie
  const oauthState = getCookie(c, 'oauth_state');
  let oauthReqInfo;
  if (!oauthState) {
    return c.html(showErrorDialog("Invalid state"), 400);
  }
  try {
    ({ oauthReqInfo } = JSON.parse(oauthState) as OAuthState);
  } catch {
    return c.html(showErrorDialog("Corrupted OAuth state cookie"), 400);
  }
  deleteCookie(c, "oauth_state");

  // Retrieve and decode code verifier
  let codeVerifierCookie = getCookie(c, `sb-${c.env.SUPABASE_PROJECT_ID}-auth-token-code-verifier`);
  if (!codeVerifierCookie) {
    return c.html(showErrorDialog("Missing PKCE code verifier"), 400);
  }
  codeVerifierCookie = codeVerifierCookie.replace('base64-', '');
  const code_verifier = atob(codeVerifierCookie ?? "").replace(/"/g, "");
  deleteCookie(c, `sb-${c.env.SUPABASE_PROJECT_ID}-auth-token-code-verifier`);

  // Exchange code for tokens
  let data: any;
  try {
    const res = await fetch(`https://${c.env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "apikey": c.env.SUPABASE_CLIENT_ID },
      body: JSON.stringify({
        auth_code: code,
        code_verifier,
      }),
    });
    data = await res.json();
  } catch (error) {
    return c.html(showErrorDialog("Invalid OAuth request " + error), 500);
  }

  // Return to the MCP client
  try {
    const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
      metadata: {
        label: data.user.email,
      },
      props: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        projectId: c.env.SUPABASE_PROJECT_ID,
        clientId: c.env.SUPABASE_CLIENT_ID,
      },
      request: oauthReqInfo,
      userId: data.user.id,
      scope: oauthReqInfo.scope,
    });
    return Response.redirect(redirectTo);
  } catch (error) {
    return c.html(showErrorDialog("Error returning to MCP client" + error), 500);
  }
});


/**
 * GET /oauth/:provider
 * Starts the authorization flow for the requested provider (github or google).
 */
app.get("/oauth/:provider", async (c) => {
  const provider = c.req.param("provider");
  if (!["github", "google"].includes(provider)) {
    return c.html(showErrorDialog("Unsupported provider"), 400);
  }
  const origin = new URL(c.req.url).origin;
  const callbackUrl = `${origin}/oauth/callback`;

  try {
    const supabase = createServerClient(
      `https://${c.env.SUPABASE_PROJECT_ID}.supabase.co`,
      c.env.SUPABASE_CLIENT_ID,
      {
        cookies: {
          getAll: () =>
            Object.entries(getCookie(c)).map(([name, value]) => ({ name, value })),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              setCookie(c, name, value, {
                ...options,
                sameSite:
                  options.sameSite === true
                    ? "strict"
                    : options.sameSite || "lax",
                priority: options.priority?.toUpperCase() as "Low" | "Medium" | "High" | undefined,
              });
            });
          },
        },
      });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'github' | 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      return c.html(showErrorDialog(error.message), 500);
    }
    if (!data.url) { return c.html(showErrorDialog("Missing redirect URL"), 500); }
    return c.redirect(data.url, 302);
  } catch (error) {
    return c.html(showErrorDialog("Invalid OAuth request"), 500);
  }
});


export { app as SupabaseHandler };
export default app;
