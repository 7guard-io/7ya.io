import { query } from "./_lib/db.js";
import { json, requireMethod, handleError } from "./_lib/http.js";
import { requireAdmin } from "./_lib/auth.js";

export default async function adminStats(req) {
  try {
    const methodError = requireMethod(req, ["GET"]);
    if (methodError) return methodError;

    requireAdmin(req);

    const [users, posts, payments, capturedPayments] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM users"),
      query("SELECT COUNT(*)::int AS count FROM posts"),
      query("SELECT COUNT(*)::int AS count FROM payments"),
      query(`
        SELECT COALESCE(SUM(amount), 0)::numeric(10,2) AS total
        FROM payments
        WHERE status = 'captured'
      `)
    ]);

    return json({
      ok: true,
      stats: {
        users: users.rows[0].count,
        posts: posts.rows[0].count,
        payments: payments.rows[0].count,
        capturedRevenue: capturedPayments.rows[0].total
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
