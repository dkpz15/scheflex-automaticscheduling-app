import { db } from "@/config/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const scheduleId = parseInt(req.nextUrl.searchParams.get("scheduleId"));
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { error: "schedule_id tidak valid" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT 
        er.id,

        s_ent.name AS source_entity_name,
        s_ent.type AS source_entity_type,
        s_data.name AS source_data_name,
        s_data.start_time AS source_start_time,
        s_data.end_time AS source_end_time,

        t_ent.name AS target_entity_name,
        t_ent.type AS target_entity_type,
        t_data.name AS target_data_name,
        t_data.start_time AS target_start_time,
        t_data.end_time AS target_end_time

      FROM entity_relations er
      JOIN entities s_ent ON er.source_entity_id = s_ent.id
      JOIN entity_data s_data ON er.source_data_id = s_data.id
      JOIN entities t_ent ON er.target_entity_id = t_ent.id
      JOIN entity_data t_data ON er.target_data_id = t_data.id

      WHERE er.schedule_id = ?
      ORDER BY er.id ASC
      `,
      [scheduleId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/relation-list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
