import {
  withRedactedRequestLogging,
  type PublicApiRequest,
  type PublicApiResponse,
} from '../../packages/evidence-oracle/src/index.js';
import {
  FileSystemAtomStore,
  IntelligenceQueryService,
  LexicalRetriever,
  validatePublicQueryBody,
} from '../../packages/intelligence/src/index.js';

async function intelligenceQueryHandler(
  req: PublicApiRequest,
  res: PublicApiResponse,
  context: { setStatus: (status: number) => void },
): Promise<void> {
  if (req.method !== 'POST') {
    context.setStatus(405);
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  try {
    const body = validatePublicQueryBody(req.body);
    const store = new FileSystemAtomStore(
      process.env.SEVEN_YA_INTELLIGENCE_ATOMS_DIR || 'data/intelligence/atoms',
    );
    const service = new IntelligenceQueryService(new LexicalRetriever(store));
    const pack = await service.query({
      query: body.query,
      subjectId: body.subjectId,
      limit: body.limit,
      scope: 'public',
      visibility: 'public',
    });
    res.status(200).json(pack);
  } catch (error) {
    context.setStatus(400);
    res.status(400).json({
      ok: false,
      error: 'invalid_request',
      message: error instanceof Error ? error.message : 'invalid request',
    });
  }
}

export default withRedactedRequestLogging('/api/intelligence/query', intelligenceQueryHandler);
