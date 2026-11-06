// File: app/api/schedules/generate/route.js
import { NextResponse } from "next/server";
import { db } from "@/config/database";

/**
 * Fetch all entities, entity_data and relations for a schedule
 */
async function fetchAllEntitiesAndRelations(scheduleId) {
  const [entities] = await db.query(
    "SELECT * FROM entities WHERE schedule_id = ?",
    [scheduleId]
  );

  const [data] = await db.query(
    `SELECT d.*, e.type, e.id AS entity_id FROM entity_data d
     JOIN entities e ON d.entity_id = e.id
     WHERE e.schedule_id = ?`,
    [scheduleId]
  );

  const [relations] = await db.query(
    `SELECT * FROM entity_relations WHERE schedule_id = ?`,
    [scheduleId]
  );

  return { entities, data, relations };
}

/**
 * Helpers to group by type and create lookup maps
 */
function groupByType(data) {
  const groups = { Role: [], Object: [], Time: [], Day: [], Place: [] };
  const byId = {};
  for (const item of data) {
    const name =
      item.name ||
      (item.start_time ? `${item.start_time} - ${item.end_time}` : "");
    const node = { ...item, name };
    byId[item.id] = node;
    let groupKey = item.type;
    if (item.type === "Other") {
      groupKey = "Other_" + item.entity_id;
    }
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(node);
  }
  return { groups, byId };
}

/**
 * Build relation lists:
 * - relations: source_data_id => array of target_data_id (bidirectional)
 * - relationsByType: source_data_id => { TypeName: [targetDataItems...] } (bidirectional)
 */
function buildRelationLists(relations, byId) {
  const rels = {};
  const relationsByType = {};

  for (const rel of relations) {
    if (!byId[rel.source_data_id] || !byId[rel.target_data_id]) continue;
    const src = byId[rel.source_data_id];
    const tgt = byId[rel.target_data_id];

    // Add forward
    const srcId = src.id;
    const tgtId = tgt.id;
    rels[srcId] = rels[srcId] || [];
    if (!rels[srcId].some((it) => it.id === tgtId)) rels[srcId].push(tgt);

    let tgtKey = tgt.type;
    if (tgt.type === "Other") {
      tgtKey = "Other_" + tgt.entity_id;
    }
    relationsByType[srcId] = relationsByType[srcId] || {};
    relationsByType[srcId][tgtKey] = relationsByType[srcId][tgtKey] || [];
    if (!relationsByType[srcId][tgtKey].some((it) => it.id === tgtId))
      relationsByType[srcId][tgtKey].push(tgt);

    // Add reverse
    rels[tgtId] = rels[tgtId] || [];
    if (!rels[tgtId].some((it) => it.id === srcId)) rels[tgtId].push(src);

    let srcKey = src.type;
    if (src.type === "Other") {
      srcKey = "Other_" + src.entity_id;
    }
    relationsByType[tgtId] = relationsByType[tgtId] || {};
    relationsByType[tgtId][srcKey] = relationsByType[tgtId][srcKey] || [];
    if (!relationsByType[tgtId][srcKey].some((it) => it.id === srcId))
      relationsByType[tgtId][srcKey].push(src);
  }

  return { rels, relationsByType };
}

/**
 * Build tasks to schedule.
 */
function buildTasks(dataGroups, byId, relations, relationsByType, customKeys) {
  const tasks = [];
  const roles = dataGroups.Role || [];

  for (const role of roles) {
    const objRels = relationsByType[role.id]?.Object || [];

    if (objRels.length > 0) {
      for (const object of objRels) {
        const objectTimes = relationsByType[object.id]?.Time || [];
        const roleTimes = relationsByType[role.id]?.Time || [];

        const fixed = {
          Time:
            objectTimes.length > 0
              ? objectTimes
              : roleTimes.length > 0
              ? roleTimes
              : relationsByType[object.id]?.Time ||
                relationsByType[role.id]?.Time ||
                [],
          Day:
            relationsByType[object.id]?.Day ||
            relationsByType[role.id]?.Day ||
            [],
          Place:
            relationsByType[object.id]?.Place ||
            relationsByType[role.id]?.Place ||
            [],
        };

        for (const customKey of customKeys) {
          fixed[customKey] =
            relationsByType[object.id]?.[customKey] ||
            relationsByType[role.id]?.[customKey] ||
            [];
        }

        if (objectTimes.length > 0) {
          for (const t of objectTimes) {
            tasks.push({
              role,
              object,
              fixed: { ...fixed, Time: [t] },
            });
          }
        } else if (roleTimes.length > 0) {
          for (const t of roleTimes) {
            tasks.push({
              role,
              object,
              fixed: { ...fixed, Time: [t] },
            });
          }
        } else {
          tasks.push({
            role,
            object,
            fixed,
          });
        }
      }
    } else {
      const fixed = {
        Time: relationsByType[role.id]?.Time || [],
        Day: relationsByType[role.id]?.Day || [],
        Place: relationsByType[role.id]?.Place || [],
      };
      for (const customKey of customKeys) {
        fixed[customKey] = relationsByType[role.id]?.[customKey] || [];
      }
      tasks.push({
        role,
        object: null,
        fixed,
      });
    }
  }

  // Prioritize tasks with more relations (fixed constraints)
  tasks.sort((a, b) => {
    const scoreA = Object.values(a.fixed).reduce(
      (sum, list) => sum + list.length,
      0
    );
    const scoreB = Object.values(b.fixed).reduce(
      (sum, list) => sum + list.length,
      0
    );
    return scoreB - scoreA; // Descending order: more constraints first
  });

  return tasks;
}

/**
 * Utility random pick
 */
function randomPick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate initial population
 */
function generateInitialPopulation(tasks, groups, popSize = 40, customKeys) {
  const population = [];

  for (let p = 0; p < popSize; p++) {
    const indiv = [];

    for (const t of tasks) {
      const objectCandidates = t.object
        ? [t.object]
        : groups.Object.length
        ? groups.Object
        : [];
      const timeCandidates =
        t.fixed.Time && t.fixed.Time.length ? t.fixed.Time : groups.Time || [];
      const dayCandidates =
        t.fixed.Day && t.fixed.Day.length ? t.fixed.Day : groups.Day || [];
      const placeCandidates =
        t.fixed.Place && t.fixed.Place.length
          ? t.fixed.Place
          : groups.Place || [];

      const chosenObject = randomPick(objectCandidates) || null;
      const chosenTime = randomPick(timeCandidates) || null;
      const chosenDay = randomPick(dayCandidates) || null;
      const chosenPlace = randomPick(placeCandidates) || null;

      const chosenOthers = {};
      const candidatesOthers = {};
      const fixedOthers = {};
      for (const customKey of customKeys) {
        const otherCandidates =
          t.fixed[customKey] && t.fixed[customKey].length
            ? t.fixed[customKey]
            : groups[customKey] || [];
        chosenOthers[customKey] = randomPick(otherCandidates) || null;
        candidatesOthers[customKey] = otherCandidates;
        fixedOthers[customKey] = !!(
          t.fixed[customKey] && t.fixed[customKey].length === 1
        );
      }

      indiv.push({
        role: t.role,
        object: chosenObject,
        day: chosenDay,
        time: chosenTime,
        place: chosenPlace,
        others: chosenOthers,
        candidates: {
          objectList: objectCandidates,
          timeList: timeCandidates,
          dayList: dayCandidates,
          placeList: placeCandidates,
          othersList: candidatesOthers,
        },
        fixedOriginal: {
          objectFixed: !!t.object,
          timeFixed: !!(
            t.fixed.Time &&
            t.fixed.Time.length &&
            t.fixed.Time.length === 1
          ),
          dayFixed: !!(t.fixed.Day && t.fixed.Day.length === 1),
          placeFixed: !!(t.fixed.Place && t.fixed.Place.length === 1),
          othersFixed: fixedOthers,
        },
      });
    }

    population.push(indiv);
  }

  return population;
}

/**
 * Fitness, mutate, crossover, runGA (same as before)
 */
function fitness(indiv, customKeys) {
  const usedSlots = new Set();
  const pairSet = new Set();
  let score = 0;

  for (const item of indiv) {
    if (!item.day || !item.time || !item.place) {
      score -= 2;
      continue;
    }
    let allOthers = true;
    for (const customKey of customKeys) {
      if (!item.others[customKey]) {
        allOthers = false;
        break;
      }
    }
    if (!allOthers) {
      score -= 2;
      continue;
    }

    const slot = `${item.day.id}::${item.time.id}::${item.place.id}`;
    if (usedSlots.has(slot)) {
      score -= 100;
    } else {
      usedSlots.add(slot);
      score += 10;
    }

    const pair = `${item.role.id}::${item.object ? item.object.id : "null"}`;
    if (pairSet.has(pair)) {
      score -= 5;
    } else {
      pairSet.add(pair);
      score += 2;
    }

    if (item.day && item.time && item.place && item.object && allOthers)
      score += 1;
  }

  return score;
}

function mutate(indiv, customKeys) {
  const clone = JSON.parse(JSON.stringify(indiv));
  const idx = Math.floor(Math.random() * clone.length);
  const item = clone[idx];

  const options = [];
  if (
    item.candidates.objectList &&
    item.candidates.objectList.length > 1 &&
    !item.fixedOriginal.objectFixed
  )
    options.push("object");
  if (
    item.candidates.timeList &&
    item.candidates.timeList.length > 1 &&
    !item.fixedOriginal.timeFixed
  )
    options.push("time");
  if (
    item.candidates.dayList &&
    item.candidates.dayList.length > 1 &&
    !item.fixedOriginal.dayFixed
  )
    options.push("day");
  if (
    item.candidates.placeList &&
    item.candidates.placeList.length > 1 &&
    !item.fixedOriginal.placeFixed
  )
    options.push("place");
  for (const customKey of customKeys) {
    if (
      item.candidates.othersList[customKey] &&
      item.candidates.othersList[customKey].length > 1 &&
      !item.fixedOriginal.othersFixed[customKey]
    )
      options.push(customKey);
  }

  if (options.length === 0) {
    if (
      !item.fixedOriginal.objectFixed &&
      item.candidates.objectList &&
      item.candidates.objectList.length > 0
    ) {
      item.object = randomPick(item.candidates.objectList);
    }
    return clone;
  }

  const chosenField = randomPick(options);
  if (chosenField === "object")
    item.object = randomPick(item.candidates.objectList);
  if (chosenField === "time") item.time = randomPick(item.candidates.timeList);
  if (chosenField === "day") item.day = randomPick(item.candidates.dayList);
  if (chosenField === "place")
    item.place = randomPick(item.candidates.placeList);
  if (chosenField.startsWith("Other_"))
    item.others[chosenField] = randomPick(
      item.candidates.othersList[chosenField]
    );

  return clone;
}

function crossover(p1, p2) {
  const len = p1.length;
  const point = Math.floor(Math.random() * len);
  const c1 = [
    ...p1.slice(0, point).map((it) => JSON.parse(JSON.stringify(it))),
    ...p2.slice(point).map((it) => JSON.parse(JSON.stringify(it))),
  ];
  const c2 = [
    ...p2.slice(0, point).map((it) => JSON.parse(JSON.stringify(it))),
    ...p1.slice(point).map((it) => JSON.parse(JSON.stringify(it))),
  ];
  return [c1, c2];
}

function runGA(initialPop, generations = 120, customKeys) {
  let population = initialPop;
  for (let g = 0; g < generations; g++) {
    const scored = population.map((ind) => ({
      ind,
      score: fitness(ind, customKeys),
    }));
    scored.sort((a, b) => b.score - a.score);
    const elite = scored
      .slice(0, Math.max(2, Math.floor(scored.length * 0.25)))
      .map((s) => s.ind);
    const newPop = [...elite];

    while (newPop.length < population.length) {
      const parentA = randomPick(elite);
      const parentB = randomPick(elite);
      if (!parentA || !parentB) break;
      const [childA, childB] = crossover(parentA, parentB);
      if (Math.random() < 0.35) newPop.push(mutate(childA, customKeys));
      else newPop.push(childA);
      if (newPop.length < population.length) {
        if (Math.random() < 0.35) newPop.push(mutate(childB, customKeys));
        else newPop.push(childB);
      }
    }

    population = newPop;
  }

  const finalScored = population.map((ind) => ({
    ind,
    score: fitness(ind, customKeys),
  }));
  finalScored.sort((a, b) => b.score - a.score);
  return finalScored[0].ind;
}

/**
 * Greedy placement + failure detection
 */
function greedyPlaceOrDetectFailures(bestCandidate, customKeys) {
  const placedSlots = new Set();
  const finalSchedule = [];
  const failed = [];

  function recursivePlaceOthers(index, currentOthers, params) {
    if (index === customKeys.length) {
      const { obj, day, time, place } = params;
      const slot = `${day.id}::${time.id}::${place.id}`;
      if (!placedSlots.has(slot)) {
        placedSlots.add(slot);
        finalSchedule.push({
          role: params.item.role,
          object: obj || null,
          day,
          time,
          place,
          others: currentOthers,
        });
        return true;
      }
      return false;
    }

    const ck = customKeys[index];
    const otherList = params.othersList[ck];
    for (const other of otherList.length ? otherList : [null]) {
      if (!other) continue;
      if (
        recursivePlaceOthers(
          index + 1,
          { ...currentOthers, [ck]: other },
          params
        )
      ) {
        return true;
      }
    }
    return false;
  }

  for (const item of bestCandidate) {
    const objList = item.candidates.objectList.length
      ? item.candidates.objectList
      : [item.object].filter(Boolean);
    const timeList = item.candidates.timeList.length
      ? item.candidates.timeList
      : [item.time].filter(Boolean);
    const dayList = item.candidates.dayList.length
      ? item.candidates.dayList
      : [item.day].filter(Boolean);
    const placeList = item.candidates.placeList.length
      ? item.candidates.placeList
      : [item.place].filter(Boolean);

    const othersList = {};
    let otherCounts = [];
    for (const customKey of customKeys) {
      othersList[customKey] = item.candidates.othersList[customKey].length
        ? item.candidates.othersList[customKey]
        : [item.others[customKey]].filter(Boolean);
      otherCounts.push(othersList[customKey].length);
    }

    let placed = false;

    for (const obj of objList) {
      for (const day of dayList.length ? dayList : [null]) {
        for (const time of timeList.length ? timeList : [null]) {
          for (const place of placeList.length ? placeList : [null]) {
            if (!day || !time || !place) continue;
            placed = recursivePlaceOthers(
              0,
              {},
              { obj, day, time, place, item, othersList }
            );
            if (placed) break;
          }
          if (placed) break;
        }
        if (placed) break;
      }
      if (placed) break;
    }

    if (!placed) {
      const roleName = item.role?.name || "Unknown Role";
      const objectName =
        item.object?.name ||
        item.candidates.objectList[0]?.name ||
        "Unknown Object";
      failed.push({
        message: `${roleName} → ${objectName} cannot be scheduled: no available Day/Time/Place without collision. Please add more data.`,
        role: item.role,
        object: item.object,
        candidates: {
          dayCount: dayList.length,
          timeCount: timeList.length,
          placeCount: placeList.length,
          otherCounts: otherCounts.join(", "),
        },
      });
    }
  }

  return { finalSchedule, failed };
}

/**
 * Main GET handler
 */
export async function GET(req) {
  try {
    const scheduleId = parseInt(req.nextUrl.searchParams.get("schedule_id"));
    if (!scheduleId)
      return NextResponse.json(
        { error: "Missing schedule_id" },
        { status: 400 }
      );

    const { entities, data, relations } = await fetchAllEntitiesAndRelations(
      scheduleId
    );
    const { groups, byId } = groupByType(data);

    const customOthers = entities.filter((e) => e.type === "Other");
    const customKeys = customOthers.map((e) => "Other_" + e.id);

    // sanity: ensure lists exist
    groups.Role = groups.Role || [];
    groups.Object = groups.Object || [];
    groups.Time = groups.Time || [];
    groups.Day = groups.Day || [];
    groups.Place = groups.Place || [];
    for (const ck of customKeys) {
      groups[ck] = groups[ck] || [];
    }

    const { rels, relationsByType } = buildRelationLists(relations, byId);

    // build tasks using relations and expansion rules
    const tasks = buildTasks(
      groups,
      byId,
      relations,
      relationsByType,
      customKeys
    );

    // if no roles/tasks, nothing to schedule
    if (tasks.length === 0) {
      const columns = (entities || []).map((e) => ({
        id: e.id,
        type: e.type,
        name: e.name,
      }));
      return NextResponse.json({
        schedule: [],
        failed: [{ message: "No roles/tasks found to schedule." }],
        columns,
      });
    }

    // generate initial population and run GA
    const initialPop = generateInitialPopulation(tasks, groups, 80, customKeys);
    const best = runGA(initialPop, 180, customKeys);

    // attempt greedy placement and detect failures
    const { finalSchedule, failed } = greedyPlaceOrDetectFailures(
      best,
      customKeys
    );

    // map results to lightweight structure for frontend
    const out = finalSchedule.map((s) => ({
      role: { id: s.role.id, name: s.role.name },
      object: s.object ? { id: s.object.id, name: s.object.name } : null,
      day: s.day ? { id: s.day.id, name: s.day.name } : null,
      time: s.time
        ? {
            id: s.time.id,
            start_time: s.time.start_time.slice(0, 5),
            end_time: s.time.end_time.slice(0, 5),
          }
        : null,
      place: s.place ? { id: s.place.id, name: s.place.name } : null,
      others: customOthers.reduce((acc, e) => {
        const ck = "Other_" + e.id;
        acc["other_" + e.id] = s.others[ck]
          ? { id: s.others[ck].id, name: s.others[ck].name }
          : null;
        return acc;
      }, {}),
    }));

    const columns = (entities || []).map((e) => ({
      id: e.id,
      type: e.type,
      name: e.name,
    }));

    // return schedule, failures, and columns (entity display names)
    return NextResponse.json({ schedule: out, failed, columns });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json(
      { error: "Failed to generate schedule" },
      { status: 500 }
    );
  }
}
