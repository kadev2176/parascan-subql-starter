import { SubstrateEvent } from "@subql/types";
import { Transfer } from "../types";
import { ensureAccount } from "./account";
import { addTransferToDay } from "./day";

export async function createTransfer(event: SubstrateEvent): Promise<void> {
  const [fromId, toId, balance] = event.event.data.toJSON() as [string, string, string];
  const from = await ensureAccount(fromId);
  const to = await ensureAccount(toId);
  const value = BigInt(balance);
  const entity = Transfer.create({
    id: `${event.block.block.header.number}-${event.idx}`,
    fromId: from.id,
    toId: to.id,
    value: value
  });
  await entity.save();
  await addTransferToDay(event.block.timestamp, value);
}
