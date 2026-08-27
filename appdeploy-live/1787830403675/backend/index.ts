// FOCUSED RELEASE DELTA — not a complete backend/index.ts checkout.
// Authoritative runtime source: AppDeploy app 697a008fddc309b142, snapshot 1787830403675.
// Exact integration anchors read back from the applied snapshot on 2026-08-27.

import {runMetaProbe,runMetaSync} from './meta/sync';
import {readMetaHealth,readMetaProjectionRecords} from './meta/store';
import {sanitizeMetaError} from './meta/client';

const release='7ya-production-acceptance-20260827-meta-owner-ingest-v1';

type ProjectionMetric={label:string;value:string;unit:string;date:string;scope?:'source-local'};
function mergeProjectionMetrics(a:ProjectionMetric[],b:ProjectionMetric[]){
  const map=new Map<string,ProjectionMetric>();
  for(const metric of[...a,...b]){
    const key=[metric.label,metric.unit,metric.date,metric.scope||''].join('|');
    map.set(key,metric);
  }
  return[...map.values()].sort((x,y)=>x.date.localeCompare(y.date)||x.label.localeCompare(y.label));
}

// publicProjectionPayload reads persisted Meta rows only; no Graph fetch occurs on render.
async function metaProjectionReadback(){
  const metaResult=await Promise.allSettled([readMetaProjectionRecords(500)]);
  const meta=metaResult[0].status==='fulfilled'?metaResult[0].value:[];
  return meta.map(record=>({
    layer:'LIVE',
    sourceKind:'owner-authorized-api',
    sourceUrl:record.canonicalUrl,
    trust:'OWNER-AUTHORIZED-API',
    origins:['meta-owner-authorized'],
    metrics:record.metrics.map(metric=>({label:metric.name,value:String(metric.value),unit:metric.unit,date:metric.asOf,scope:'source-local' as const})),
  }));
}

export const metaSyncHourly=async()=>{
  try{
    const result=await runMetaSync({dryRun:false,maxPagesPerAccount:2});
    return{statusCode:200,body:JSON.stringify({status:result.status})};
  }catch(error){
    console.warn('Meta hourly sync failed',sanitizeMetaError(error));
    return{statusCode:200};
  }
};

// Exact protected route contract from the applied router:
// GET  /api/meta/admin/status — dryRun marker public-safe; otherwise requireAuth + admin allowlist.
// POST /api/meta/admin/probe — requireAuth + admin allowlist → runMetaProbe({persist:true}).
// POST /api/meta/admin/sync — requireAuth + admin allowlist → runMetaSync(), maxPagesPerAccount clamped 1..10.
// GET  /api/meta/admin/health — requireAuth + admin allowlist → readMetaHealth().
// GET  /api/public-projection — additive Promise.allSettled Meta read; Canon remains winner on URL collisions.
void runMetaProbe;void readMetaHealth;void mergeProjectionMetrics;void metaProjectionReadback;
