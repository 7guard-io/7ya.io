import { z } from "zod";
import { query } from "./_lib/db.js";
import { json, readJson, requireMethod, handleError } from "./_lib/http.js";
import { requireAuth } from "./_lib/auth.js";

const CreatePostSchema = z.object({
  title: z.string().min(1).max(160),
  content: z.string().min(1).max(20000)
});

export default async function posts(req) {
  try {
    const methodError = requireMethod(req, ["GET", "POST"]);
    if (methodError) return methodError;

    if (req.method === "GET") {
      const result = await query(
        `
        SELECT id, user_id, title, content, created_at
        FROM posts
        ORDER BY created_at DESC
        LIMIT 20
        `
      );

      return json({
        ok: true,
        posts: result.rows
      });
    }

    const authUser = requireAuth(req);
    const body = await readJson(req);
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: "invalid_request"
        },
        400
      );
    }

    const result = await query(
      `
      INSERT INTO posts (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, title, content, created_at
      `,
      [Number(authUser.sub), parsed.data.title, parsed.data.content]
    );

    return json(
      {
        ok: true,
        post: result.rows[0]
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
