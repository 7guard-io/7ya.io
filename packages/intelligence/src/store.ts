import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalize } from '../../evidence-oracle/src/canonicalize.js';
import type { EvidenceAtom } from './atom.js';

function assertAtomId(atomId: string): void {
  if (!/^[a-f0-9]{64}$/.test(atomId)) throw new TypeError('atomId must be a SHA-256 hex digest');
}

function assertAdapterId(adapterId: string): void {
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(adapterId)) throw new TypeError('adapterId is invalid');
}

export type AtomFilter = { subjectId?: string };

export interface AtomStore {
  put(atom: EvidenceAtom): Promise<'created' | 'unchanged'>;
  get(atomId: string): Promise<EvidenceAtom | null>;
  list(filter?: AtomFilter): AsyncIterable<EvidenceAtom>;
}

export class FileSystemAtomStore implements AtomStore {
  constructor(readonly root: string) {}

  private file(atomId: string): string {
    assertAtomId(atomId);
    return path.join(this.root, `${atomId}.json`);
  }

  async put(atom: EvidenceAtom): Promise<'created' | 'unchanged'> {
    await mkdir(this.root, { recursive: true });
    const file = this.file(atom.atomId);
    try {
      const existing = JSON.parse(await readFile(file, 'utf8')) as EvidenceAtom;
      if (canonicalize(existing) === canonicalize(atom)) return 'unchanged';
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporary, `${JSON.stringify(atom, null, 2)}\n`, 'utf8');
    await rename(temporary, file);
    return 'created';
  }

  async get(atomId: string): Promise<EvidenceAtom | null> {
    try {
      return JSON.parse(await readFile(this.file(atomId), 'utf8')) as EvidenceAtom;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  async *list(filter: AtomFilter = {}): AsyncIterable<EvidenceAtom> {
    let files: string[] = [];
    try {
      files = (await readdir(this.root)).filter(file => file.endsWith('.json')).sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }

    for (const file of files) {
      const atom = JSON.parse(await readFile(path.join(this.root, file), 'utf8')) as EvidenceAtom;
      if (!filter.subjectId || atom.subjectId === filter.subjectId) yield atom;
    }
  }
}

export class IngestManifestStore {
  constructor(readonly root: string) {}

  private file(adapterId: string): string {
    assertAdapterId(adapterId);
    return path.join(this.root, `${adapterId}.json`);
  }

  async read(adapterId: string): Promise<Record<string, string>> {
    try {
      return JSON.parse(await readFile(this.file(adapterId), 'utf8')) as Record<string, string>;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  }

  async get(adapterId: string, sourceId: string): Promise<string | undefined> {
    return (await this.read(adapterId))[sourceId];
  }

  async set(adapterId: string, sourceId: string, hash: string): Promise<void> {
    const next = { ...(await this.read(adapterId)), [sourceId]: hash };
    await mkdir(this.root, { recursive: true });
    const file = this.file(adapterId);
    const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    await rename(temporary, file);
  }
}
