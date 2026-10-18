import { createGitHubAuthorization } from "./_lib/github-app.js";
import { handleError, requireMethod } from "./_lib/http.js";

export default async function githubAuthStart(req) {
  try {
    const methodError = requireMethod(req, ["GET"]);
    if (methodError) return methodError;

    const requestUrl = new URL(req.url);
    const returnTo = requestUrl.searchParams.get("return_to") || null;
    const auth = createGitHubAuthorization(req, returnTo);

    return new Response(null, {
      status: 302,
      headers: {
        location: auth.url,
        "cache-control": "no-store",
        "set-cookie": auth.cookie
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
