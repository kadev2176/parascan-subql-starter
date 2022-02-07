import {
  SubstrateExtrinsic,
  SubstrateEvent,
  SubstrateBlock,
} from "@subql/types";
import { createBlock, createEvent, createExtrinsic } from "../handlers";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  await createBlock(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  await createEvent(event);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  await createExtrinsic(extrinsic);
}
