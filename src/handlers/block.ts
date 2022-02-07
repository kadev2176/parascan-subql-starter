import { SubstrateBlock } from "@subql/types";
import { Block } from "../types";

export async function ensureBlock(recordId: string): Promise<Block> {
  let entity = await Block.get(recordId);
  if (!entity) {
    entity = new Block(recordId);
    entity.number = BigInt(recordId);
    await entity.save();
  }
  return entity;
}

export async function createBlock(block: SubstrateBlock): Promise<void> {
  const entity = await ensureBlock(block.block.header.number.toString());
  entity.hash = block.block.hash.toString();
  entity.timestamp = block.timestamp;
  entity.parentHash = block.block.header.parentHash.toString();
  entity.specVersion = block.specVersion;
  entity.stateRoot = block.block.header.stateRoot.toString();
  entity.extrinsicsRoot = block.block.header.extrinsicsRoot.toString();
  await entity.save();
}
