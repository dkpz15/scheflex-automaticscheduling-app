import { NextResponse } from "next/server";
import { db } from "@/config/database";

// GET: Ambil data entitas berdasarkan entity_id
export async function GET(req) {
  try {
    const entityId = parseInt(req.nextUrl.searchParams.get("entity_id"));
    if (isNaN(entityId)) return NextResponse.json([], { status: 200 });

    const [rows] = await db.query(
      "SELECT id, entity_id, name, start_time, end_time FROM entity_data WHERE entity_id = ? ORDER BY id ASC",
      [entityId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /entity-data error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Tambah data entitas (nama biasa atau time range)
export async function POST(req) {
  try {
    const body = await req.json();
    const { entity_id, name, start_time, end_time } = body;

    if (!entity_id || (!name && (!start_time || !end_time))) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [[entity]] = await db.query(
      "SELECT type FROM entities WHERE id = ?",
      [entity_id]
    );

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    if (entity.type === "Time") {
      await db.query(
        "INSERT INTO entity_data (entity_id, start_time, end_time) VALUES (?, ?, ?)",
        [entity_id, start_time, end_time]
      );
    } else {
      await db.query(
        "INSERT INTO entity_data (entity_id, name) VALUES (?, ?)",
        [entity_id, name]
      );
    }

    return NextResponse.json({ message: "Entity data created" });
  } catch (err) {
    console.error("POST /entity-data error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// PUT: Update nama atau time range
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, start_time, end_time } = body;

    const [[row]] = await db.query(
      "SELECT e.type FROM entity_data d JOIN entities e ON d.entity_id = e.id WHERE d.id = ?",
      [id]
    );

    if (!row) {
      return NextResponse.json(
        { error: "Entity data not found" },
        { status: 404 }
      );
    }

    if (row.type === "Time") {
      await db.query(
        "UPDATE entity_data SET start_time = ?, end_time = ? WHERE id = ?",
        [start_time, end_time, id]
      );
    } else {
      await db.query("UPDATE entity_data SET name = ? WHERE id = ?", [
        name,
        id,
      ]);
    }

    return NextResponse.json({ message: "Entity data updated" });
  } catch (err) {
    console.error("PUT /entity-data error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: Hapus data entitas berdasarkan ID
export async function DELETE(req) {
  try {
    const id = parseInt(req.nextUrl.searchParams.get("id"));
    await db.query("DELETE FROM entity_data WHERE id = ?", [id]);
    return NextResponse.json({ message: "Entity data deleted" });
  } catch (err) {
    console.error("DELETE /entity-data error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
