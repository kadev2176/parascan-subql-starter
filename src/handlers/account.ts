import { Account } from "../types";

export async function ensureAccount(recordId: string): Promise<Account> {
  recordId = recordId.toLowerCase();
  let entity = await Account.get(recordId);
  if (!entity) {
    entity = new Account(recordId);
    await entity.save();
  }
  return entity;
}
