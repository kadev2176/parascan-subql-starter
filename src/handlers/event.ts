import { SubstrateEvent } from "@subql/types";
import { Event } from "../types";
import { ensureBlock } from "./block";
import { addEventToDay } from "./day";
import { ensureExtrinsic } from "./extrinsic";

export async function ensureEvent(event: SubstrateEvent): Promise<Event> {
  const block = await ensureBlock(event.block.block.header.number.toString());
  const idx = event.idx;
  const recordId = `${block.id}-${idx}`;
  let entity = await Event.get(recordId);
  if (!entity) {
    entity = Event.create({
      id: recordId,
      blockId: block.id,
      blockNumber: block.number,
      index: idx,
    });
    await entity.save();
  }
  return entity;
}

export async function createEvent(event: SubstrateEvent): Promise<void> {
  const entity = await ensureEvent(event);
  entity.section = event.event.section;
  entity.method = event.event.method;
  if (event.extrinsic) {
    const extrinsic = await ensureExtrinsic(event.extrinsic);
    entity.extrinsicId = extrinsic.id;
  }
  await entity.save();
  await addEventToDay(event.block.timestamp);
}
