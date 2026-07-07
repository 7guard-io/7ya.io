import jwt from "jsonwebtoken";

export function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "7ya-api"
    }
  );
}

export function requireAuth(req) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) {
    const err = new Error("Missing bearer token");
    err.status = 401;
    err.publicMessage = "unauthorized";
    throw err;
  }

  const token = header.slice("Bearer ".length);
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "7ya-api"
    });
  } catch {
    const err = new Error("Invalid bearer token");
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
