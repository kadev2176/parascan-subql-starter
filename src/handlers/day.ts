import { Day } from "../types";

export async function ensureDay(timestamp: Date): Promise<Day> {
  const recordId = timestamp.toISOString().slice(0, 10);
  let entity = await Day.get(recordId);
  if (!entity) {
    entity = Day.create({
      id: recordId,
      year: timestamp.getFullYear(),
      month: timestamp.getMonth(),
      date: timestamp.getDate(),
      extrinsics: 0,
      events: 0,
      transferCount: 0,
      transferAmount: BigInt(0)
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

export async function addTransferToDay(timestamp: Date, value: bigint): Promise<void> {
  const day = await ensureDay(timestamp);
  day.transferCount += 1;
  day.transferAmount += value;
  await day.save();
}
