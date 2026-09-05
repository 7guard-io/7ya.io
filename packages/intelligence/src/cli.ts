export type IngestCliArgs = {
  adapter: 'collector' | 'claims' | 'local';
  inputPath: string;
  subjectId: string;
  json: boolean;
};

export type QueryCliArgs = {
  query: string;
  subjectId: string;
  limit: number;
  json: boolean;
};

function parseFlags(argv: string[]): Record<string, string | boolean> {
  const output: Record<string, string | boolean> = {};
  for (let index = 0; index < argv.length; index++) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      output[key] = next;
      index++;
    } else {
      output[key] = true;
    }
  }
  return output;
}

export function parseIngestArgs(argv: string[]): IngestCliArgs {
  const flags = parseFlags(argv);
  const adapter = String(flags.adapter ?? '');
  if (!['collector', 'claims', 'local'].includes(adapter)) {
    throw new TypeError('adapter must be collector, claims, or local');
  }
  const inputPath = String(flags.input ?? '').trim();
  if (!inputPath) throw new TypeError('input is required');
  const subjectId = String(flags.subject ?? 'igor-vepretski').trim();
  if (!subjectId) throw new TypeError('subject is required');
  return {
    adapter: adapter as IngestCliArgs['adapter'],
    inputPath,
    subjectId,
    json: flags.json === true,
  };
}

export function parseQueryArgs(argv: string[]): QueryCliArgs {
  const flags = parseFlags(argv);
  const query = String(flags.q ?? '').trim();
  if (!query) throw new TypeError('q is required');
  const subjectId = String(flags.subject ?? '').trim();
  if (!subjectId) throw new TypeError('subject is required');
  const parsedLimit = Number(flags.limit ?? 25);
  if (!Number.isFinite(parsedLimit)) throw new TypeError('limit must be numeric');
  return {
    query,
    subjectId,
    limit: Math.max(1, Math.min(Math.trunc(parsedLimit), 50)),
    json: flags.json === true,
  };
}
