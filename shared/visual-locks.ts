export type CanonicalVisualLock = {
    canonicalId: string;
    imageUrl: string;
    sourceUrl: string;
    lockedAt: string;
    basis: 'owner-directed-source-lock';
    note: string;
};

export const CANONICAL_VISUAL_LOCKS: Record<string, CanonicalVisualLock> = {
    'fatherhood-viral-2023-02-20': {
        canonicalId: 'fatherhood-viral-2023-02-20',
        imageUrl: 'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg',
        sourceUrl: 'https://www.hidabroot.org/article/1179015',
        lockedAt: '2026-09-10',
        basis: 'owner-directed-source-lock',
        note: 'Use the published source photo for the fatherhood story. Never substitute a text screenshot, generic preview, or resolver-selected image.',
    },
};

export function canonicalVisualLock(canonicalId: string) {
    return CANONICAL_VISUAL_LOCKS[canonicalId] ?? null;
}
