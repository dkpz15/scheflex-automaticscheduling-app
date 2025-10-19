import { NextResponse } from "next/server";
import { db } from "@/config/database";

// GET - list schedule untuk user tertentu
export async function GET(req) {
  try {
    const userId = parseInt(req.headers.get("x-user-id"));
    if (isNaN(userId)) return NextResponse.json([]);

    const [rows] = await db.query(
      "SELECT * FROM schedules WHERE user_id = ? ORDER BY id ASC",
      [userId]
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /schedules error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - buat schedule baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, name } = body;

    if (!user_id || !name) {
      return NextResponse.json(
        { error: "Missing user_id or name" },
        { status: 400 }
      );
    }

    await db.query("INSERT INTO schedules (user_id, name) VALUES (?, ?)", [
      parseInt(user_id),
      name,
    ]);

    return NextResponse.json({ message: "Created" });
  } catch (err) {
    console.error("POST /schedules error:", err);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

// PUT - update nama schedule
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name } = body;

    await db.query("UPDATE schedules SET name = ? WHERE id = ?", [name, id]);

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error("PUT /schedules error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE - hapus schedule
export async function DELETE(req) {
  try {
    const id = parseInt(req.nextUrl.searchParams.get("id"));
    await db.query("DELETE FROM schedules WHERE id = ?", [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /schedules error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
