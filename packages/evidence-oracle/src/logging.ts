const REDACTED = '[REDACTED]';

export function redact(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/sk-[A-Za-z0-9_-]{8,}/g, REDACTED)
      .replace(/\b(?:api[_-]?key|apikey|token|secret)\s*[:=]\s*[^\s,;]+/gi, (m) => `${m.split(/[:=]/)[0]}=${REDACTED}`)
      .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, `Bearer ${REDACTED}`)
      .replace(/(Authorization\s*[:=]\s*)([^\s,;]+)/gi, `$1${REDACTED}`);
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (/authorization|api[-_]?key|token|secret/i.test(key)) out[key] = REDACTED;
      else out[key] = redact(item);
    }
    return out;
  }
  return value;
}

export function safeLog(message: string, context: Record<string, unknown> = {}): void {
  console.log(message, JSON.stringify(redact(context)));
}

export function publicRequestLog(fields: { requestId: string; route: string; method: string; status: number; durationMs: number; error?: unknown }): void {
  safeLog('http_request', {
    requestId: fields.requestId,
    route: fields.route,
    method: fields.method,
    status: fields.status,
    durationMs: fields.durationMs,
    error: fields.error instanceof Error ? fields.error.message : fields.error,
  });
}
