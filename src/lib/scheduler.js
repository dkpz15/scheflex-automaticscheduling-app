import db from "@/config/database";

// Cek apakah entitas Role, Object, Day, Time, Place sudah ada dan punya data
export async function validateSchedule(scheduleId) {
  const types = ["Role", "Object", "Day", "Time", "Place"];

  for (const type of types) {
    const [entities] = await db.query(
      `SELECT id FROM entity WHERE schedule_id = ? AND type = ? LIMIT 1`,
      [scheduleId, type]
    );

    if (entities.length === 0) {
      return { success: false, message: `Entitas tipe ${type} belum dibuat.` };
    }

    const entityId = entities[0].id;

    const [data] = await db.query(
      `SELECT COUNT(*) as count FROM entity_data WHERE entity_id = ?`,
      [entityId]
    );

    if (data[0].count === 0) {
      return {
        success: false,
        message: `Data untuk entitas ${type} masih kosong.`,
      };
    }
  }

  return { success: true };
}

// Fungsi generate berdasarkan relasi antar entitas
export async function generateFlexibleSchedule(scheduleId) {
  // Ambil semua entitas untuk jadwal ini
  const [entities] = await db.query(
    `SELECT * FROM entity WHERE schedule_id = ?`,
    [scheduleId]
  );

  const entityMap = {};
  for (const ent of entities) {
    entityMap[ent.type] = ent;
  }

  // Ambil semua data per tipe
  const allData = {};
  for (const type in entityMap) {
    const [rows] = await db.query(
      `SELECT * FROM entity_data WHERE entity_id = ?`,
      [entityMap[type].id]
    );
    allData[type] = rows;
  }

  // Ambil semua relasi
  const [relations] = await db.query(
    `SELECT * FROM entity_relation WHERE schedule_id = ?`,
    [scheduleId]
  );

  // Kelompokkan relasi per data Role
  const grouped = {}; // role_data_id => { object, day, time, place }

  for (const rel of relations) {
    const sourceEntity = entities.find((e) => e.id === rel.source_entity_id);
    const targetEntity = entities.find((e) => e.id === rel.target_entity_id);

    if (!sourceEntity || !targetEntity) continue;
    if (sourceEntity.type !== "Role") continue;

    const roleId = rel.source_data_id;
    const key = targetEntity.type.toLowerCase(); // 'object', 'day', 'time', 'place'

    if (!grouped[roleId]) {
      grouped[roleId] = {
        id: roleId,
        object: new Set(),
        day: new Set(),
        time: new Set(),
        place: new Set(),
      };
    }

    if (grouped[roleId][key]) {
      grouped[roleId][key].add(rel.target_data_id);
    }
  }

  // Generate hasil penjadwalan (1 slot per role)
  const result = [];

  for (const roleDataId in grouped) {
    const { object, day, time, place } = grouped[roleDataId];

    const assignedObject = [...object][0];
    const assignedDay = [...day][0];
    const assignedTime = [...time][0];
    const assignedPlace = [...place][0];

    if (assignedObject && assignedDay && assignedTime && assignedPlace) {
      result.push({
        role_data_id: parseInt(roleDataId),
        object_data_id: assignedObject,
        day_data_id: assignedDay,
        time_data_id: assignedTime,
        place_data_id: assignedPlace,
      });
    }
  }

  return result;
}
