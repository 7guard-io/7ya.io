#!/usr/bin/env node
import {
  FileSystemAtomStore,
  IntelligenceQueryService,
  LexicalRetriever,
  parseQueryArgs,
} from '../../dist/packages/intelligence/src/index.js';

const args = parseQueryArgs(process.argv.slice(2));
const store = new FileSystemAtomStore(process.env.SEVEN_YA_INTELLIGENCE_ATOMS_DIR || 'data/intelligence/atoms');
const service = new IntelligenceQueryService(new LexicalRetriever(store));
const pack = await service.query({
  query: args.query,
  subjectId: args.subjectId,
  limit: args.limit,
  scope: 'public',
  visibility: 'public',
});

if (args.json) {
  process.stdout.write(`${JSON.stringify(pack)}\n`);
} else {
  console.log(`7YA Intelligence query: ${pack.query}`);
  console.log(`Evidence atoms: ${pack.atoms.length}; contradictions: ${pack.contradictions.length}`);
  for (const atom of pack.atoms) {
    console.log(`- [${atom.verification.level}] ${atom.content} (${atom.source.canonicalUrl || atom.source.sourceId}) score=${atom.score.toFixed(2)}`);
  }
  for (const limitation of pack.limitations) console.log(`LIMITATION: ${limitation}`);
}
