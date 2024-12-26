import { Barretenberg, Fr } from "@aztec/bb.js";

// Convert Uint8Array to hexadecimal string
export function toHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Hash a single node using Barretenberg's pedersenHash
export async function hashNode(data: string, bb: Barretenberg): Promise<Uint8Array> {
  const encoded = new TextEncoder().encode(data);
  const hash = await bb.pedersenHash([new Fr(BigInt("0x" + toHexString(encoded)))], 0);
  return hash.toBuffer();
}

// Build the Merkle Tree
export async function buildMerkleTree(
  leaves: string[]
): Promise<{ root: Uint8Array; levels: Uint8Array[][] }> {
  const bb = await Barretenberg.new({});
  let currentLevel = await Promise.all(leaves.map((leaf) => hashNode(leaf, bb)));
  const levels: Uint8Array[][] = [currentLevel];

  while (currentLevel.length > 1) {
    const nextLevel: Uint8Array[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || left;
      const parentHash = await bb.pedersenHash(
        [new Fr(BigInt("0x" + toHexString(left))), new Fr(BigInt("0x" + toHexString(right)))],
        0
      );
      nextLevel.push(parentHash.toBuffer());
    }
    currentLevel = nextLevel;
    levels.push(currentLevel);
  }

  return { root: currentLevel[0], levels };
}
