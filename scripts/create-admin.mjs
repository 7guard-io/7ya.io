import bcrypt from "bcryptjs";
import { query, getPool } from "../netlify/functions/_lib/db.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");
  process.exit(1);
}

if (password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
const result = await query(
  `
  INSERT INTO users (email, password_hash, role)
  VALUES ($1, $2, 'admin')
  ON CONFLICT ((LOWER(email)))
  DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'admin',
    updated_at = NOW()
  RETURNING id, email, role, created_at
  `,
  [email, passwordHash]
);

console.log("Admin user ready:", result.rows[0]);
await getPool().end();
