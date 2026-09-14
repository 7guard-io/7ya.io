import {SocialIngestRecord} from '../../shared/social-ingest.js';
import {MetaCapabilityDiscovery,MetaCapabilityReport,MetaResolvedPage,discoverMetaCapabilities} from './capabilities.js';
import {MetaConfig,loadMetaConfig,sanitizeMetaError} from './client.js';
import {fetchFacebookPageBatch} from './facebook-adapter.js';
import {fetchFacebookOwnerBatch} from './facebook-owner-adapter.js';
import {fetchInstagramMediaBatch} from './instagram-adapter.js';
import {appendMetaMetricSnapshots,readMetaCheckpoint,recordMetaSyncRun,saveMetaCapabilityReport,upsertMetaRecords,writeMetaCheckpoint} from './store.js';

export type MetaProbeResult={report:MetaCapabilityReport;persisted:boolean};
export type MetaSyncResult={status:'credential-required'|'disabled'|'no-allowlisted-objects'|'dry-run'|'ready'|'partial';writePerformed:boolean;facebookRecords:number;facebookOwnerRecords:number;facebookPageRecords:number;instagramRecords:number;inserted:number;updated:number;metricSnapshots:number;sample:Array<{id:string;platform:'Facebook'|'Instagram';url:string}>;errorClasses:string[]};
export type MetaSyncBootstrap={config:MetaConfig;discovery:MetaCapabilityDiscovery};
type CursorUpdate={key:string;cursor:string|null};
type FetchOutcome={records:SocialIngestRecord[];cursors:CursorUpdate[];succeeded:boolean;errors:string[]};

const OWNER_BACKFILL_DONE='__COMPLETE__';
const credentialRequiredReport=():MetaCapabilityReport=>({checkedAt:new Date().toISOString(),apiVersion:'v24.0',pages:[],discoveredPageCount:0,allowedPageCount:0,linkedInstagramCount:0,allowedInstagramCount:0,state:'credential-required',grantedPermissions:[]});
const clampPages=(value:number)=>Math.max(1,Math.min(10,Number.isFinite(value)?Math.floor(value):2));

export async function runMetaProbe(options:{persist:boolean},bootstrap:MetaSyncBootstrap|null=null):Promise<MetaProbeResult>{
  const config=bootstrap?.config||await loadMetaConfig();
  if(!config){const report=credentialRequiredReport();if(options.persist)await saveMetaCapabilityReport(report);return{report,persisted:options.persist}}
  const discovery=bootstrap?.discovery||await discoverMetaCapabilities(config);
  if(options.persist)await saveMetaCapabilityReport(discovery.report);
  return{report:discovery.report,persisted:options.persist};
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
    }catch(error){errors.push(sanitizeMetaError(error).code)}
  }
  return{records,cursors,succeeded:pages.length===0||successCount===pages.length,errors};
}

async function fetchFacebookOwner(config:MetaConfig,maxPages:number,enabled:boolean):Promise<FetchOutcome>{
  if(!enabled)return{records:[],cursors:[],succeeded:true,errors:[]};
  const records:SocialIngestRecord[]=[];
  const cursors:CursorUpdate[]=[];
  const errors:string[]=[];
  const key='facebook:owner:public-posts:backfill';
  try{
    const fresh=await fetchFacebookOwnerBatch({config});
    records.push(...fresh.records);
    let cursor=await readMetaCheckpoint(key);
    if(cursor!==OWNER_BACKFILL_DONE){
      let next=cursor||fresh.nextCursor;
      for(let index=0;index<maxPages&&next;index++){
        const batch=await fetchFacebookOwnerBatch({config,cursor:next});
        records.push(...batch.records);
        next=batch.nextCursor;
      }
      cursor=next||OWNER_BACKFILL_DONE;
      cursors.push({key,cursor});
    }
    return{records,cursors,succeeded:true,errors};
  }catch(error){
    errors.push(sanitizeMetaError(error).code);
    return{records,cursors,succeeded:false,errors};
  }
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
    }catch(error){errors.push(sanitizeMetaError(error).code)}
  }
  return{records,cursors,succeeded:targets.length===0||successCount===targets.length,errors};
}

export async function runMetaSync(options:{dryRun:boolean;maxPagesPerAccount:number},bootstrap:MetaSyncBootstrap|null=null):Promise<MetaSyncResult>{
  const empty={writePerformed:false,facebookRecords:0,facebookOwnerRecords:0,facebookPageRecords:0,instagramRecords:0,inserted:0,updated:0,metricSnapshots:0,sample:[] as Array<{id:string;platform:'Facebook'|'Instagram';url:string}>,errorClasses:[] as string[]};
  const config=bootstrap?.config||await loadMetaConfig();
  if(!config)return{status:'credential-required',...empty};
  if(!options.dryRun&&!config.enabled)return{status:'disabled',...empty};
  const discovery=bootstrap?.discovery||await discoverMetaCapabilities(config);
  const allowedPages=discovery.resolvedPages.filter(page=>page.allowed);
  const ownerEnabled=discovery.report.grantedPermissions.includes('user_posts');
  if(!allowedPages.length&&!ownerEnabled)return{status:'no-allowlisted-objects',...empty,errorClasses:discovery.report.errorClass?[discovery.report.errorClass]:[]};
  const maxPages=clampPages(options.maxPagesPerAccount);
  const includeInsights=discovery.report.grantedPermissions.includes('instagram_manage_insights');
  const[owner,facebook,instagram]=await Promise.all([
    fetchFacebookOwner(config,Math.min(10,maxPages*5),ownerEnabled),
    fetchFacebook(config,allowedPages,maxPages),
    fetchInstagram(config,allowedPages,maxPages,includeInsights),
  ]);
  const records=[...owner.records,...facebook.records,...instagram.records];
  const errorClasses=[...new Set([...owner.errors,...facebook.errors,...instagram.errors])];
  const sample=records.slice(0,10).map(record=>({id:record.id,platform:record.platform,url:record.canonicalUrl}));
  const facebookRecords=owner.records.length+facebook.records.length;
  if(options.dryRun)return{status:'dry-run',writePerformed:false,facebookRecords,facebookOwnerRecords:owner.records.length,facebookPageRecords:facebook.records.length,instagramRecords:instagram.records.length,inserted:0,updated:0,metricSnapshots:0,sample,errorClasses};
  await saveMetaCapabilityReport(discovery.report);
  const write=await upsertMetaRecords(records);
  const metricSnapshots=await appendMetaMetricSnapshots(records);
  for(const cursor of[...owner.cursors,...facebook.cursors,...instagram.cursors])await writeMetaCheckpoint(cursor.key,cursor.cursor);
  const completedAt=new Date().toISOString();
  const status:'ready'|'partial'=errorClasses.length?'partial':'ready';
  await recordMetaSyncRun({completedAt,status,facebookSucceeded:owner.succeeded&&facebook.succeeded,instagramSucceeded:instagram.succeeded,recordsInserted:write.inserted,recordsUpdated:write.updated,...(errorClasses[0]?{errorClass:errorClasses[0]}:{})});
  return{status,writePerformed:true,facebookRecords,facebookOwnerRecords:owner.records.length,facebookPageRecords:facebook.records.length,instagramRecords:instagram.records.length,inserted:write.inserted,updated:write.updated,metricSnapshots,sample,errorClasses};
}
