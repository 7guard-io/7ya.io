import test from 'node:test';
import assert from 'node:assert/strict';
import {runtimeSourceReport} from '../scripts/reconcile-appdeploy-runtime.mjs';

test('reports the authoritative base snapshot and unresolved runtime imports',()=>{
 const report=runtimeSourceReport('appdeploy-live');
 assert.equal(report.baseSnapshot,'1787823326631');
 assert.ok(report.missingImports.includes('src/BlogPage.tsx'));
});