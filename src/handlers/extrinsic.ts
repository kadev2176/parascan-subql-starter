import { SubstrateExtrinsic } from "@subql/types";
import { Extrinsic } from "../types";
import { ensureBlock } from "./block";
import { ensureAccount } from "./account";

export async function ensureExtrinsic(
  extrinsic: SubstrateExtrinsic
): Promise<Extrinsic> {
  const block = await ensureBlock(
    extrinsic.block.block.header.number.toString()
  );
  const index = extrinsic.idx;
  const recordId = `${block.id}-${index}`;
  const hash = extrinsic.extrinsic.hash.toString();

  let entity = await Extrinsic.get(recordId);
  if (!entity) {
    entity = new Extrinsic(recordId);
    entity.blockId = block.id;
    entity.blockNumber = block.number;
    entity.index = index;
    entity.hash = hash;
    await entity.save();
  }
  return entity;
}

export async function createExtrinsic(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const entity = await ensureExtrinsic(extrinsic);
  const isSigned = extrinsic.extrinsic.isSigned;
  if (isSigned) {
    const signerAccount = extrinsic.extrinsic.signer.toString();
    const signer = await ensureAccount(signerAccount);
    entity.signerId = signer.id;
  }
  entity.isSigned = isSigned;
  entity.section = extrinsic.extrinsic.method.section;
  entity.method = extrinsic.extrinsic.method.method;
  entity.success = extrinsic.success;
  await entity.save();
}
