import type { Visibility } from './atom.js';

export function assertPublicVisibility(requested: Visibility): 'public' {
  if (requested !== 'public') throw new Error('Public query contract allows only public visibility');
  return 'public';
}

export function canReadVisibility(scope: 'public' | 'internal', visibility: Visibility, authorizedPrivate = false): boolean {
  if (visibility === 'public') return true;
  return scope === 'internal' && authorizedPrivate;
}
