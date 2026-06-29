import { sha256Hex } from './crypto.js';

export type MerkleProofStep = { position: 'left' | 'right'; hash: string };

function parentHash(left: string, right: string): string {
  return sha256Hex(`${left}${right}`);
}

export function buildMerkleLayers(leaves: string[]): string[][] {
  if (leaves.length === 0) return [];
  const layers: string[][] = [leaves.slice()];
  while (layers[layers.length - 1].length > 1) {
    const current = layers[layers.length - 1];
    const next: string[] = [];
    for (let index = 0; index < current.length; index += 2) {
      const left = current[index];
      const right = current[index + 1] ?? left;
      next.push(parentHash(left, right));
    }
    layers.push(next);
  }
  return layers;
}

export function buildMerkleRoot(leaves: string[]): string {
  const layers = buildMerkleLayers(leaves);
  return layers.length === 0 ? '' : layers[layers.length - 1][0];
}

export function getMerkleProof(leaves: string[], targetIndex: number): MerkleProofStep[] {
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= leaves.length) {
    throw new RangeError('targetIndex is outside the leaves array');
  }
  const layers = buildMerkleLayers(leaves);
  const proof: MerkleProofStep[] = [];
  let index = targetIndex;
  for (let level = 0; level < layers.length - 1; level += 1) {
    const layer = layers[level];
    const isLeft = index % 2 === 0;
    const siblingIndex = isLeft ? index + 1 : index - 1;
    const siblingHash = layer[siblingIndex] ?? layer[index];
    proof.push({ position: isLeft ? 'right' : 'left', hash: siblingHash });
    index = Math.floor(index / 2);
  }
  return proof;
}

export function verifyMerkleProof(leafHash: string, proof: MerkleProofStep[], root: string): boolean {
  let current = leafHash;
  for (const step of proof) {
    if (step.position === 'left') current = parentHash(step.hash, current);
    else if (step.position === 'right') current = parentHash(current, step.hash);
    else return false;
  }
  return current === root;
}
