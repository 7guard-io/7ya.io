import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = JSON.parse(fs.readFileSync('public/release.json', 'utf8'));
assert.equal(release.source_alignment_state, 'FAIL');
assert.match(release.appdeploy_version, /^\d+$/);
assert.equal(release.source_alignment_target, 'GIT_RECONSTRUCTABLE');
assert.match(release.source_alignment_checked_at, /^2026-09-04T/);

const overlay = fs.readFileSync('public/scripts/source-alignment-control.js', 'utf8');
assert.match(overlay, /source_alignment_state/);
assert.match(overlay, /SOURCE ALIGNMENT/);
assert.match(overlay, /FAIL · DRIFT/);

console.log('PASS source alignment control contract');
