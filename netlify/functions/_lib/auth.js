import jwt from "jsonwebtoken";

const SESSION_COOKIE = "7ya_session";

function parseCookies(req) {
  const header = req.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

export function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      github_login: user.github_login || undefined,
      provider: user.auth_provider || "password"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "7ya-api"
    }
  );
}

export function sessionCookie(token) {
  const secure = process.env.COOKIE_SECURE !== "false";
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Max-Age=604800",
    "Path=/",
    "HttpOnly",
    secure ? "Secure" : null,
    "SameSite=Lax"
  ]
    .filter(Boolean)
    .join("; ");
}

export function requireAuth(req) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : parseCookies(req)[SESSION_COOKIE];

  if (!token) {
    const err = new Error("Missing bearer token or session cookie");
    err.status = 401;
    err.publicMessage = "unauthorized";
    throw err;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "7ya-api"
    });
  } catch {
    const err = new Error("Invalid bearer token or session cookie");
    err.status = 401;
    err.publicMessage = "unauthorized";
    throw err;
  }
}

export function requireAdmin(req) {
  const user = requireAuth(req);

  if (user.role !== "admin") {
    const err = new Error("Admin role required");
    err.status = 403;
    err.publicMessage = "forbidden";
    throw err;
  }

  return user;
}
