import { NextResponse } from "next/server";
import { db } from "@/config/database";

// GET: Ambil entitas berdasarkan id atau schedule_id
export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const scheduleId = req.nextUrl.searchParams.get("schedule_id");

    if (id) {
      const [rows] = await db.query("SELECT * FROM entities WHERE id = ?", [
        parseInt(id),
      ]);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]); // return 1 object (bukan array)
    }

    if (scheduleId) {
      const [rows] = await db.query(
        "SELECT * FROM entities WHERE schedule_id = ? ORDER BY id ASC",
        [parseInt(scheduleId)]
      );
      return NextResponse.json(rows);
    }

    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  } catch (err) {
    console.error("GET /entities error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Tambah entitas baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { schedule_id, name, type } = body;

    if (!schedule_id || !name || !type) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    // Check if type (except "Other") already exists for this schedule_id
    if (type !== "Other") {
      const [existing] = await db.query(
        "SELECT id FROM entities WHERE schedule_id = ? AND type = ?",
        [schedule_id, type]
      );
      if (existing.length > 0) {
        return NextResponse.json(
          {
            error: `An entity with type ${type} already exists for this schedule`,
          },
          { status: 400 }
        );
      }
    }

    await db.query(
      "INSERT INTO entities (schedule_id, name, type) VALUES (?, ?, ?)",
      [schedule_id, name, type]
    );

    return NextResponse.json({ message: "Entity created" });
  } catch (err) {
    console.error("POST /entities error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// PUT: Update entitas (name + type)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, type } = body;

    if (!id || !name || !type) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    // Get the current entity to check its schedule_id and original type
    const [currentEntity] = await db.query(
      "SELECT schedule_id, type FROM entities WHERE id = ?",
      [id]
    );
    if (currentEntity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }
    const { schedule_id, type: originalType } = currentEntity[0];

    // Check if the new type (except "Other") already exists for this schedule_id
    if (type !== "Other" && type !== originalType) {
      const [existing] = await db.query(
        "SELECT id FROM entities WHERE schedule_id = ? AND type = ? AND id != ?",
        [schedule_id, type, id]
      );
      if (existing.length > 0) {
        return NextResponse.json(
          {
            error: `An entity with type ${type} already exists for this schedule`,
          },
          { status: 400 }
        );
      }
    }

    await db.query("UPDATE entities SET name = ?, type = ? WHERE id = ?", [
      name,
      type,
      id,
    ]);

    return NextResponse.json({ message: "Entity updated" });
  } catch (err) {
    console.error("PUT /entities error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: Hapus entitas berdasarkan ID
export async function DELETE(req) {
  try {
    const id = parseInt(req.nextUrl.searchParams.get("id"));
    await db.query("DELETE FROM entities WHERE id = ?", [id]);
    return NextResponse.json({ message: "Entity deleted" });
  } catch (err) {
    console.error("DELETE /entities error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
