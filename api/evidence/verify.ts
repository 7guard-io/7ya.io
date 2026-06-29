import { verifyMerkleProof, withRedactedRequestLogging, type MerkleProofStep, type PublicApiRequest, type PublicApiResponse } from '../../packages/evidence-oracle/src/index.js';

const MODEL = '7ya-evidence-oracle-v0.4-mvp';

type VerifyBody = {
  leafHash: string;
  proof: MerkleProofStep[];
  root: string;
};

function isVerifyBody(body: unknown): body is VerifyBody {
  if (!body || typeof body !== 'object') return false;
  const candidate = body as Record<string, unknown>;
  return typeof candidate.leafHash === 'string'
    && typeof candidate.root === 'string'
    && Array.isArray(candidate.proof)
    && candidate.proof.every((step) => {
      if (!step || typeof step !== 'object') return false;
      const proofStep = step as Record<string, unknown>;
      return (proofStep.position === 'left' || proofStep.position === 'right') && typeof proofStep.hash === 'string';
    });
}

async function verifyHandler(req: PublicApiRequest, res: PublicApiResponse, context: { setStatus: (status: number) => void }): Promise<void> {
  if (req.method !== 'POST') {
    context.setStatus(405);
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!isVerifyBody(req.body)) {
    context.setStatus(400);
    res.status(400).json({ ok: false, error: 'invalid_request' });
    return;
  }

  const ok = verifyMerkleProof(req.body.leafHash, req.body.proof, req.body.root);
  res.status(200).json({ ok, verifiedAt: new Date().toISOString(), verificationModel: MODEL });
}

export default withRedactedRequestLogging('/api/evidence/verify', verifyHandler);
