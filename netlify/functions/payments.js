import { z } from "zod";
import { query } from "./_lib/db.js";
import { json, readJson, requireMethod, handleError } from "./_lib/http.js";
import { requireAuth } from "./_lib/auth.js";

const CreatePaymentSchema = z.object({
  paypalOrderId: z.string().min(1).max(255).optional(),
  amount: z.number().nonnegative(),
  currency: z.string().length(3).default("USD"),
  status: z
    .enum(["pending", "approved", "captured", "failed", "refunded"])
    .default("pending")
});

export default async function payments(req) {
  try {
    const methodError = requireMethod(req, ["GET", "POST"]);
    if (methodError) return methodError;

    const authUser = requireAuth(req);

    if (req.method === "GET") {
      const isAdmin = authUser.role === "admin";
      const result = await query(
        isAdmin
          ? `
            SELECT id, user_id, paypal_order_id, amount, currency, status, created_at
            FROM payments
            ORDER BY created_at DESC
            LIMIT 50
          `
          : `
            SELECT id, user_id, paypal_order_id, amount, currency, status, created_at
            FROM payments
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
          `,
        isAdmin ? [] : [Number(authUser.sub)]
      );

      return json({
        ok: true,
        payments: result.rows
      });
    }

    const body = await readJson(req);
    const parsed = CreatePaymentSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: "invalid_request"
        },
        400
      );
    }

    const payment = parsed.data;
    const result = await query(
      `
      INSERT INTO payments (
        user_id,
        paypal_order_id,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, UPPER($4), $5)
      RETURNING id, user_id, paypal_order_id, amount, currency, status, created_at
      `,
      [
        Number(authUser.sub),
        payment.paypalOrderId || null,
        payment.amount,
        payment.currency,
        payment.status
      ]
    );

    return json(
      {
        ok: true,
        payment: result.rows[0],
        note: "Payment record stored. This does not verify PayPal capture by itself."
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
