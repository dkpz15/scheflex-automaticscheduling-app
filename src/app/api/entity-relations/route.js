// src/app/api/entity-relations/route.js
import { NextResponse } from "next/server";
import { db } from "@/config/database";

export async function GET(req) {
  try {
    const scheduleId = parseInt(req.nextUrl.searchParams.get("schedule_id"));
    const sourceEntityId = parseInt(
      req.nextUrl.searchParams.get("source_entity_id")
    );

    if (isNaN(scheduleId) || isNaN(sourceEntityId)) {
      return NextResponse.json([], { status: 200 });
    }

    const [rows] = await db.query(
      "SELECT * FROM entity_relations WHERE schedule_id = ? AND source_entity_id = ? ORDER BY id ASC",
      [scheduleId, sourceEntityId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /entity-relations error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// src/app/api/entity-relations/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      schedule_id,
      source_entity_id,
      source_data_id,
      target_entity_id,
      target_data_id,
    } = body;

    if (
      !schedule_id ||
      !source_entity_id ||
      !source_data_id ||
      !target_entity_id ||
      !target_data_id
    ) {
      return NextResponse.json(
        { error: "All relation fields must be filled in." },
        { status: 400 }
      );
    }

    // 1) Cek duplikasi exact (source -> target)
    const [existing] = await db.query(
      `
      SELECT r.*, sd.name AS source_name, sd.start_time AS source_start, sd.end_time AS source_end,
             td.name AS target_name, td.start_time AS target_start, td.end_time AS target_end
      FROM entity_relations r
      LEFT JOIN entity_data sd ON sd.id = r.source_data_id
      LEFT JOIN entity_data td ON td.id = r.target_data_id
      WHERE r.schedule_id = ? AND r.source_data_id = ? AND r.target_data_id = ? 
            AND r.source_entity_id = ? AND r.target_entity_id = ?
      `,
      [
        schedule_id,
        source_data_id,
        target_data_id,
        source_entity_id,
        target_entity_id,
      ]
    );

    if (existing.length > 0) {
      const e = existing[0];
      const sourceDisplay =
        e.source_name ??
        (e.source_start
          ? `${e.source_start} - ${e.source_end}`
          : `ID ${source_data_id}`);
      const targetDisplay =
        e.target_name ??
        (e.target_start
          ? `${e.target_start} - ${e.target_end}`
          : `ID ${target_data_id}`);

      return NextResponse.json(
        {
          error: `This relation already exists: ${sourceDisplay} → ${targetDisplay}.`,
        },
        { status: 400 }
      );
    }

    // 2) Cek relasi terbalik (target -> source)
    const [reversed] = await db.query(
      `
      SELECT r.*, sd.name AS source_name, sd.start_time AS source_start, sd.end_time AS source_end,
             td.name AS target_name, td.start_time AS target_start, td.end_time AS target_end
      FROM entity_relations r
      LEFT JOIN entity_data sd ON sd.id = r.source_data_id
      LEFT JOIN entity_data td ON td.id = r.target_data_id
      WHERE r.schedule_id = ? AND r.source_data_id = ? AND r.target_data_id = ?
            AND r.source_entity_id = ? AND r.target_entity_id = ?
      `,
      [
        schedule_id,
        target_data_id, // jadi source
        source_data_id, // jadi target
        target_entity_id,
        source_entity_id,
      ]
    );

    if (reversed.length > 0) {
      const r = reversed[0];
      const sourceDisplay =
        r.source_name ??
        (r.source_start
          ? `${r.source_start} - ${r.source_end}`
          : `ID ${target_data_id}`);
      const targetDisplay =
        r.target_name ??
        (r.target_start
          ? `${r.target_start} - ${r.target_end}`
          : `ID ${source_data_id}`);

      return NextResponse.json(
        {
          error: `This reverse relation already exists: ${sourceDisplay} → ${targetDisplay}.`,
        },
        { status: 400 }
      );
    }

    // 3) Insert relasi baru
    const [result] = await db.query(
      `
      INSERT INTO entity_relations
      (schedule_id, source_entity_id, source_data_id, target_entity_id, target_data_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        schedule_id,
        source_entity_id,
        source_data_id,
        target_entity_id,
        target_data_id,
      ]
    );

    return NextResponse.json({
      id: result.insertId,
      schedule_id,
      source_entity_id,
      source_data_id,
      target_entity_id,
      target_data_id,
    });
  } catch (err) {
    console.error("POST /entity-relations error:", err);
    return NextResponse.json(
      { error: "Failed to save relation" },
      { status: 500 }
    );
  }
}

// DELETE tetap sama
export async function DELETE(req) {
  try {
    const id = parseInt(req.nextUrl.searchParams.get("id"));
    await db.query("DELETE FROM entity_relations WHERE id = ?", [id]);
    return NextResponse.json({ message: "Relation deleted" });
  } catch (err) {
    console.error("DELETE /entity-relations error:", err);
    return NextResponse.json(
      { error: "Failed to delete relation" },
      { status: 500 }
    );
  }
}
