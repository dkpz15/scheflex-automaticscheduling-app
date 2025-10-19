import { db } from "@/config/database";
import bcrypt from "bcryptjs";

export async function signInAdmin(username, password) {
  const [rows] = await db.query(
    "SELECT * FROM admin WHERE BINARY username = ?",
    [username]
  );
  if (!rows.length) {
    throw new Error("Invalid admin credentials");
  }

  // Verifikasi case-sensitive untuk username
  if (rows[0].username !== username) {
    throw new Error("Invalid admin credentials");
  }

  const isMatch = await bcrypt.compare(password, rows[0].password);
  if (!isMatch) {
    throw new Error("Invalid admin credentials");
  }

  return rows[0];
}

export async function registerUser(data) {
  const hashed = await bcrypt.hash(data.password, 10);
  await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [data.username, data.email, hashed]
  );
}

export async function signInUser(username, password) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE BINARY username = ?",
    [username]
  );
  if (!rows.length) {
    throw new Error("Invalid user credentials");
  }

  // Verifikasi case-sensitive untuk username
  if (rows[0].username !== username) {
    throw new Error("Invalid user credentials");
  }

  const isMatch = await bcrypt.compare(password, rows[0].password);
  if (!isMatch) {
    throw new Error("Invalid user credentials");
  }

  return rows[0];
}
