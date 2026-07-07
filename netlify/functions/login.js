import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "./_lib/db.js";
import { json, readJson, requireMethod, handleError } from "./_lib/http.js";
import { signToken } from "./_lib/auth.js";

const LoginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200)
});

export default async function login(req) {
  try {
    const methodError = requireMethod(req, ["POST"]);
    if (methodError) return methodError;

    const body = await readJson(req);
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: "invalid_request"
        },
        400
      );
    }

    const { email, password } = parsed.data;
    const result = await query(
      `
      SELECT id, email, password_hash, role
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      return json(
        {
          ok: false,
          error: "invalid_credentials"
        },
        401
      );
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return json(
        {
          ok: false,
          error: "invalid_credentials"
        },
        401
      );
    }

    const token = signToken(user);
    return json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
