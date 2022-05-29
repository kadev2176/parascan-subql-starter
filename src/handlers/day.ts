import { Day } from "../types";

export async function ensureDay(timestamp: Date): Promise<Day> {
  const recordId = timestamp.toISOString().slice(0, 10);
  let entity = await Day.get(recordId);
  if (!entity) {
    entity = Day.create({
      id: recordId,
      extrinsics: 0,
      events: 0
    });
    await entity.save();
  }
  return entity;
}

export async function addExtrinsicToDay(timestamp: Date): Promise<void> {
  const day = await ensureDay(timestamp);
  day.extrinsics += 1;
  await day.save();
}

export async function addEventToDay(timestamp: Date): Promise<void> {
  const day = await ensureDay(timestamp);
  day.events += 1;
  await day.save();
}
