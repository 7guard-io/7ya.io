import { requireAdmin } from "./_lib/auth.js";
import { githubUserRequest } from "./_lib/github-app.js";
import { handleError, json, requireMethod } from "./_lib/http.js";

export default async function githubInstallations(req) {
  try {
    const methodError = requireMethod(req, ["GET"]);
    if (methodError) return methodError;

    const user = requireAdmin(req);
    const result = await githubUserRequest(user.sub, "/user/installations?per_page=100");

    return json({
      ok: true,
      installations: (result.installations || []).map((installation) => ({
        id: installation.id,
        account: installation.account
          ? {
              login: installation.account.login,
              type: installation.account.type,
              avatar_url: installation.account.avatar_url
            }
          : null,
        repository_selection: installation.repository_selection,
        permissions: installation.permissions,
        suspended_at: installation.suspended_at || null
      }))
    });
  } catch (error) {
    return handleError(error);
  }
}
