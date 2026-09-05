import type { EvidenceAtom } from './atom.js';

export type ContradictionValue = { value: string; atoms: EvidenceAtom[] };
export type ContradictionGroup = {
  key: string;
  subject: string;
  predicate: string;
  values: ContradictionValue[];
  atoms: EvidenceAtom[];
};

function normalizePart(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase();
}

export function groupContradictions(atoms: EvidenceAtom[]): ContradictionGroup[] {
  const groups = new Map<string, { subject: string; predicate: string; values: Map<string, EvidenceAtom[]> }>();

  for (const atom of atoms) {
    for (const claim of atom.claims) {
      const parts = claim.split('|');
      if (parts.length !== 3) continue;
      const subject = normalizePart(parts[0]);
      const predicate = normalizePart(parts[1]);
      const value = normalizePart(parts[2]);
      if (!subject || !predicate || !value) continue;
      const key = `${subject}|${predicate}`;
      const group = groups.get(key) ?? { subject, predicate, values: new Map<string, EvidenceAtom[]>() };
      const list = group.values.get(value) ?? [];
      list.push(atom);
      group.values.set(value, list);
      groups.set(key, group);
    }
  }

  return [...groups.entries()]
    .filter(([, group]) => group.values.size > 1)
    .map(([key, group]) => {
      const values = [...group.values.entries()].map(([value, valueAtoms]) => ({ value, atoms: valueAtoms }));
      const unique = new Map<string, EvidenceAtom>();
      for (const value of values) for (const atom of value.atoms) unique.set(atom.atomId, atom);
      return { key, subject: group.subject, predicate: group.predicate, values, atoms: [...unique.values()] };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
}
