import { SubstrateEvent } from "@subql/types";
import { Transfer } from "../types";
import { ensureAccount } from "./account";
import { ensureBlock } from "./block";
import { addTransferToDay } from "./day";

export async function createTransfer(event: SubstrateEvent): Promise<void> {
  const [fromId, toId, balance] = event.event.data.toJSON() as [string, string, string];
  const from = await ensureAccount(fromId);
  const to = await ensureAccount(toId);
  const value = BigInt(balance);
  const block = await ensureBlock(event.block.block.header.number.toString())
  const entity = Transfer.create({
    id: `${block.id}-${event.idx}`,
    fromId: from.id,
    toId: to.id,
    value: value,
    blockId: block.id,
    blockNumber: block.number,
    eventIndex: event.idx,
    extrinsicIndex: event.extrinsic?.idx
  });
  await entity.save();
  await addTransferToDay(event.block.timestamp, value);
}
