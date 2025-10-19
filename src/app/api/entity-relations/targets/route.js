import { db } from "@/config/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const scheduleId = parseInt(req.nextUrl.searchParams.get("schedule_id"));
    const sourceEntityId = parseInt(
      req.nextUrl.searchParams.get("source_entity_id")
    );

    if (isNaN(scheduleId) || isNaN(sourceEntityId)) {
      return NextResponse.json(
        { error: "Invalid schedule_id or source_entity_id" },
        { status: 400 }
      );
    }

    // Ambil entitas selain source_entity_id dari jadwal ini
    const [entities] = await db.query(
      "SELECT id, type, name FROM entities WHERE schedule_id = ? AND id != ? ORDER BY id ASC",
      [scheduleId, sourceEntityId]
    );

    const result = [];

    for (const ent of entities) {
      const [data] = await db.query(
        "SELECT id, name, start_time, end_time FROM entity_data WHERE entity_id = ? ORDER BY id ASC",
        [ent.id]
      );

      result.push({
        target_entity_id: ent.id,
        target_entity_type: ent.type,
        target_entity_name: ent.name,
        target_entity_data: data,
      });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/entity-relations/targets error:", err);
    return NextResponse.json(
      { error: "Failed to fetch target entities" },
      { status: 500 }
    );
  }
}
