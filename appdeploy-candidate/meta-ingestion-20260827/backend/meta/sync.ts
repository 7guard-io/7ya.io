import type {SocialIngestRecord} from '../../shared/social-ingest.js';
import {discoverMetaCapabilities} from './capabilities.js';
import type {MetaCapabilityDiscovery,MetaCapabilityReport,MetaResolvedPage} from './capabilities.js';
import {loadMetaConfig,sanitizeMetaError} from './client.js';
import type {MetaConfig} from './client.js';
import {fetchFacebookPageBatch} from './facebook-adapter.js';
import {fetchInstagramMediaBatch} from './instagram-adapter.js';
import {buildMetaOAuthBridge} from './oauth-bridge.js';
import type {MetaOAuthSelection} from './oauth-bridge.js';
import {appendMetaMetricSnapshots,readMetaCheckpoint,recordMetaSyncRun,saveMetaCapabilityReport,upsertMetaRecords,writeMetaCheckpoint} from './store.js';

export type MetaProbeResult={report:MetaCapabilityReport;persisted:boolean;source:'facebook-oauth'|'dedicated-meta-secrets'|'none'};
export type MetaSyncResult={
  status:'credential-required'|'disabled'|'no-allowlisted-objects'|'dry-run'|'ready'|'partial';
  writePerformed:boolean;
  source:'facebook-oauth'|'dedicated-meta-secrets'|'none';
  facebookRecords:number;
  instagramRecords:number;
  inserted:number;
  updated:number;
  metricSnapshots:number;
  sample:Array<{id:string;platform:'Facebook'|'Instagram';url:string}>;
  errorClasses:string[];
};

type CursorUpdate={key:string;cursor:string|null};
type FetchOutcome={records:SocialIngestRecord[];cursors:CursorUpdate[];succeeded:boolean;errors:string[]};
type MetaRuntime={config:MetaConfig;discovery:MetaCapabilityDiscovery;source:'facebook-oauth'|'dedicated-meta-secrets'};

const credentialRequiredReport=():MetaCapabilityReport=>({
  checkedAt:new Date().toISOString(),apiVersion:'v24.0',pages:[],discoveredPageCount:0,allowedPageCount:0,linkedInstagramCount:0,allowedInstagramCount:0,state:'credential-required',grantedPermissions:[]
});

const clampPages=(value:number)=>Math.max(1,Math.min(10,Number.isFinite(value)?Math.floor(value):2));

async function resolveMetaRuntime(oauthSelection?:MetaOAuthSelection|null):Promise<MetaRuntime|null>{
  if(oauthSelection){
    const bridge=buildMetaOAuthBridge(oauthSelection);
    return{...bridge,source:'facebook-oauth'};
  }
  const config=await loadMetaConfig();
  if(!config)return null;
  return{config,discovery:await discoverMetaCapabilities(config),source:'dedicated-meta-secrets'};
}

export async function runMetaProbe(options:{persist:boolean;oauthSelection?:MetaOAuthSelection|null}):Promise<MetaProbeResult>{
  const runtime=await resolveMetaRuntime(options.oauthSelection);
  if(!runtime){
    const report=credentialRequiredReport();
    if(options.persist)await saveMetaCapabilityReport(report);
    return{report,persisted:options.persist,source:'none'};
  }
  if(options.persist)await saveMetaCapabilityReport(runtime.discovery.report);
  return{report:runtime.discovery.report,persisted:options.persist,source:runtime.source};
}

async function fetchFacebook(config:MetaConfig,pages:MetaResolvedPage[],maxPages:number):Promise<FetchOutcome>{
  const records:SocialIngestRecord[]=[];
  const cursors:CursorUpdate[]=[];
  const errors:string[]=[];
  let successCount=0;
  for(const page of pages){
    const key=`facebook:${page.pageId}:posts`;
    let cursor=await readMetaCheckpoint(key);
    try{
      for(let index=0;index<maxPages;index++){
        const batch=await fetchFacebookPageBatch({config,page,cursor});
        records.push(...batch.records);
        const next=batch.nextCursor;
        if(!next||next===cursor){cursor=next;break}
        cursor=next;
      }
      cursors.push({key,cursor});
      successCount++;
    }catch(error){
      errors.push(sanitizeMetaError(error).code);
    }
  }
  return{records,cursors,succeeded:pages.length>0&&successCount===pages.length,errors};
}

async function fetchInstagram(config:MetaConfig,pages:MetaResolvedPage[],maxPages:number,includeInsights:boolean):Promise<FetchOutcome>{
  const targets=pages.flatMap(page=>page.instagram?.allowed?[{page,instagram:page.instagram}]:[]);
  const records:SocialIngestRecord[]=[];
  const cursors:CursorUpdate[]=[];
  const errors:string[]=[];
  let successCount=0;
  for(const target of targets){
    const key=`instagram:${target.instagram.id}:media`;
    let cursor=await readMetaCheckpoint(key);
    try{
      for(let index=0;index<maxPages;index++){
        const batch=await fetchInstagramMediaBatch({config,page:target.page,instagram:target.instagram,cursor,includeInsights});
        records.push(...batch.records);
        const next=batch.nextCursor;
        if(!next||next===cursor){cursor=next;break}
        cursor=next;
      }
      cursors.push({key,cursor});
      successCount++;
    }catch(error){
      errors.push(sanitizeMetaError(error).code);
    }
  }
  return{records,cursors,succeeded:targets.length>0&&successCount===targets.length,errors};
}

export async function runMetaSync(options:{dryRun:boolean;maxPagesPerAccount:number;oauthSelection?:MetaOAuthSelection|null}):Promise<MetaSyncResult>{
  const runtime=await resolveMetaRuntime(options.oauthSelection);
  if(!runtime)return{status:'credential-required',writePerformed:false,source:'none',facebookRecords:0,instagramRecords:0,inserted:0,updated:0,metricSnapshots:0,sample:[],errorClasses:[]};
  const{config,discovery,source}=runtime;
  if(source==='dedicated-meta-secrets'&&!options.dryRun&&!config.enabled)return{status:'disabled',writePerformed:false,source,facebookRecords:0,instagramRecords:0,inserted:0,updated:0,metricSnapshots:0,sample:[],errorClasses:[]};
  const allowedPages=discovery.resolvedPages.filter(page=>page.allowed);
  if(!allowedPages.length)return{status:'no-allowlisted-objects',writePerformed:false,source,facebookRecords:0,instagramRecords:0,inserted:0,updated:0,metricSnapshots:0,sample:[],errorClasses:discovery.report.errorClass?[discovery.report.errorClass]:[]};
  const maxPages=clampPages(options.maxPagesPerAccount);
  const includeInsights=discovery.report.grantedPermissions.includes('instagram_manage_insights');
  const[facebook,instagram]=await Promise.all([
    fetchFacebook(config,allowedPages,maxPages),
    fetchInstagram(config,allowedPages,maxPages,includeInsights),
  ]);
  const records=[...facebook.records,...instagram.records];
  const errorClasses=[...new Set([...facebook.errors,...instagram.errors])];
  const sample=records.slice(0,10).map(record=>({id:record.id,platform:record.platform,url:record.canonicalUrl}));
  if(options.dryRun)return{status:'dry-run',writePerformed:false,source,facebookRecords:facebook.records.length,instagramRecords:instagram.records.length,inserted:0,updated:0,metricSnapshots:0,sample,errorClasses};
  await saveMetaCapabilityReport(discovery.report);
  const write=await upsertMetaRecords(records);
  const metricSnapshots=await appendMetaMetricSnapshots(records);
  for(const cursor of[...facebook.cursors,...instagram.cursors])await writeMetaCheckpoint(cursor.key,cursor.cursor);
  const completedAt=new Date().toISOString();
  const status:'ready'|'partial'=errorClasses.length?'partial':'ready';
  await recordMetaSyncRun({completedAt,status,facebookSucceeded:facebook.succeeded,instagramSucceeded:instagram.succeeded,recordsInserted:write.inserted,recordsUpdated:write.updated,...(errorClasses[0]?{errorClass:errorClasses[0]}:{})});
  return{status,writePerformed:true,source,facebookRecords:facebook.records.length,instagramRecords:instagram.records.length,inserted:write.inserted,updated:write.updated,metricSnapshots,sample,errorClasses};
}
