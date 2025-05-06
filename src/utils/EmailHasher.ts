import { BarretenbergSync, Fr } from "@aztec/bb.js";

export async function getBarretenberg(): Promise<BarretenbergSync> {
  return await BarretenbergSync.new();
}

export async function hashEmail(email: string): Promise<bigint> {
  const bb = await getBarretenberg();
  const encoded = new TextEncoder().encode(email);
  const inputFr = Fr.fromBuffer(encoded);

  const hash = BigInt(bb.poseidon2Hash([inputFr]).toString());
  return hash;
}
