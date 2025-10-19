import { NextResponse } from "next/server";
import { db } from "@/config/database";

// GET: Validasi apakah semua tipe entitas wajib sudah ada dan memiliki data
export async function GET(req) {
  try {
    const scheduleId = parseInt(req.nextUrl.searchParams.get("schedule_id"));
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { valid: false, error: "Invalid schedule_id" },
        { status: 400 }
      );
    }

    const requiredTypes = ["Role", "Object", "Day", "Time", "Place"];
    const details = [];
    const missing = [];
    let allValid = true;

    for (const type of requiredTypes) {
      // Cek apakah entitas dengan tipe ini ada
      const [[entity]] = await db.query(
        "SELECT id FROM entities WHERE schedule_id = ? AND type = ? LIMIT 1",
        [scheduleId, type]
      );

      let entityStatus = false;
      let dataStatus = false;

      if (entity) {
        entityStatus = true;

        // Cek apakah ada data untuk entitas ini
        const [data] = await db.query(
          `SELECT COUNT(*) AS count FROM entity_data 
           WHERE entity_id = ? AND ${
             type === "Time"
               ? "(start_time IS NOT NULL AND end_time IS NOT NULL)"
               : "name IS NOT NULL AND name <> ''"
           }`,
          [entity.id]
        );

        if (data[0].count > 0) {
          dataStatus = true;
        } else {
          allValid = false;
          missing.push(`${type} Entity data does not exist.`);
        }
      } else {
        allValid = false;
        missing.push(`${type} Entity data does not exist`);
      }

      details.push({
        type,
        entity: entityStatus,
        data: dataStatus,
      });
    }

    return NextResponse.json({ valid: allValid, details, missing });
  } catch (err) {
    console.error("GET /schedules/validate error:", err);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
