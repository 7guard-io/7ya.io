import { signToken, sessionCookie } from "./_lib/auth.js";
import {
  authorizeGitHubUser,
  clearGitHubAuthorizationCookie,
  consumeGitHubAuthorization,
  exchangeGitHubCode,
  fetchGitHubUser,
  linkGitHubUser
} from "./_lib/github-app.js";
import { handleError, requireMethod } from "./_lib/http.js";

function safeReturnTo(value) {
  if (!value) return null;
  try {
    const origin = process.env.FRONTEND_ORIGIN;
    if (value.startsWith("/") && !value.startsWith("//")) {
      return origin ? new URL(value, origin).toString() : value;
    }
    const url = new URL(value);
    if (origin && url.origin === new URL(origin).origin) return url.toString();
  } catch {
    return null;
  }
  return null;
}

export default async function githubAuthCallback(req) {
  try {
    const methodError = requireMethod(req, ["GET"]);
    if (methodError) return methodError;

    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    if (!code || !state) {
      const err = new Error("Missing GitHub OAuth code or state");
      err.status = 400;
      err.publicMessage = "github_oauth_callback_invalid";
      throw err;
    }

    const flow = consumeGitHubAuthorization(req, state);
    const token = await exchangeGitHubCode(req, code, flow.verifier);
    const githubUser = await fetchGitHubUser(token.access_token);
    const role = authorizeGitHubUser(githubUser);
    const user = await linkGitHubUser(githubUser, token, role);
    const session = signToken(user);

    const fallback = process.env.GITHUB_AUTH_SUCCESS_URL || process.env.FRONTEND_ORIGIN || "/";
    const location = safeReturnTo(flow.returnTo) || fallback;

    const headers = new Headers({
      location,
      "cache-control": "no-store"
    });
    headers.append("set-cookie", clearGitHubAuthorizationCookie());
    headers.append("set-cookie", sessionCookie(session));

    return new Response(null, { status: 302, headers });
  } catch (error) {
    return handleError(error);
  }
}
