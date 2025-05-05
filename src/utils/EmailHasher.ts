import { BarretenbergSync, Fr } from "@aztec/bb.js";

export async function getBarretenberg(): Promise<BarretenbergSync> {
  return await BarretenbergSync.new();
}

export async function hashEmailPedersen(email: string): Promise<bigint> {
  const bb = await getBarretenberg();
  const encoded = new TextEncoder().encode(email);
  const inputFr = Fr.fromBuffer(encoded);

  const hash = BigInt(bb.pedersenHash([inputFr], 0).toString());
  return hash;
}
