import { randomUUID } from 'node:crypto';
import { publicRequestLog } from './logging.js';

export type PublicApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type PublicApiResponse = {
  status: (code: number) => PublicApiResponse;
  json: (body: unknown) => void;
};

export type PublicApiContext = {
  requestId: string;
  route: string;
  startedAt: number;
  setStatus: (status: number) => void;
};

export function withRedactedRequestLogging(
  route: string,
  handler: (req: PublicApiRequest, res: PublicApiResponse, context: PublicApiContext) => Promise<void> | void,
): (req: PublicApiRequest, res: PublicApiResponse) => Promise<void> {
  return async (req, res) => {
    const startedAt = Date.now();
    const requestIdHeader = req.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] : requestIdHeader || randomUUID();
    let status = 200;
    let error: unknown;

    try {
      await handler(req, res, { requestId, route, startedAt, setStatus: (nextStatus) => { status = nextStatus; } });
    } catch (caught) {
      status = 500;
      error = caught;
      res.status(status).json({ ok: false, error: 'internal_error' });
    } finally {
      publicRequestLog({ requestId, route, method: req.method || 'UNKNOWN', status, durationMs: Date.now() - startedAt, error });
    }
  };
}
