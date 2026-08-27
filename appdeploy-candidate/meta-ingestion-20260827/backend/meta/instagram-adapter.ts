import {SocialIngestMetric,SocialIngestRecord,dedupeSocialMetrics,validateSocialIngestRecord} from '../../shared/social-ingest.js';
import {MetaResolvedPage} from './capabilities.js';
import {MetaConfig,metaFetchJson} from './client.js';
import {MetaBatch,MetaNormalizeContext} from './facebook-adapter.js';

export const META_MEDIA_INSIGHT_METRICS=['reach','views','total_interactions','saved','shares'] as const;
export type MetaInstagramIdentity={id:string;username:string;allowed:boolean};
export type MetaInstagramFetchContext={
  config:MetaConfig;
  page:MetaResolvedPage;
  instagram:MetaInstagramIdentity;
  cursor?:string|null;
  fetchedAt?:string;
  includeInsights:boolean;
};

type GraphBatch={data?:unknown[];paging?:{cursors?:{after?:string}}};
const objectOf=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const httpsValue=(value:unknown)=>{const text=String(value||'').trim();return /^https:\/\//i.test(text)?text:undefined};
const metric=(name:string,value:unknown,asOf:string):SocialIngestMetric|undefined=>{
  const numeric=Number(value);
  return Number.isFinite(numeric)&&numeric>=0?{name,value:numeric,unit:'count',asOf,scope:'source-local'}:undefined;
};

const mediaTypeOf=(raw:Record<string,unknown>):SocialIngestRecord['mediaType']|null=>{
  const mediaType=String(raw.media_type||'').toUpperCase();
  const product=String(raw.media_product_type||'').toUpperCase();
  if(mediaType==='VIDEO'||product.includes('REEL'))return'video';
  if(mediaType==='CAROUSEL_ALBUM')return'carousel';
  if(mediaType==='IMAGE')return'image';
  return null;
};

export function normalizeInstagramMedia(value:unknown,ctx:MetaNormalizeContext):SocialIngestRecord|null{
  const raw=objectOf(value);
  const id=String(raw.id||'').trim();
  const canonicalUrl=httpsValue(raw.permalink);
  const publishedAt=String(raw.timestamp||'').trim();
  const mediaType=mediaTypeOf(raw);
  if(!id||!canonicalUrl||!publishedAt||!mediaType)return null;
  const mediaUrl=httpsValue(raw.media_url);
  const thumbnailUrl=httpsValue(raw.thumbnail_url)||(mediaType==='image'?mediaUrl:undefined);
  const baseMetrics=[metric('likes',raw.like_count,ctx.fetchedAt),metric('comments',raw.comments_count,ctx.fetchedAt)].filter((item):item is SocialIngestMetric=>Boolean(item));
  return validateSocialIngestRecord({
    id:`meta:instagram:${id}`,
    provider:'meta',
    platform:'Instagram',
    providerObjectId:id,
    accountObjectId:ctx.accountObjectId,
    canonicalUrl,
    publishedAt,
    text:String(raw.caption||'').slice(0,5000),
    mediaType,
    ...(mediaUrl?{mediaUrl}:{}),
    ...(thumbnailUrl?{thumbnailUrl}:{}),
    provenance:{source:'owner-authorized-api',fetchedAt:ctx.fetchedAt,apiVersion:ctx.apiVersion},
    metrics:baseMetrics,
  });
}

const insightValue=(payload:unknown)=>{
  const root=objectOf(payload);
  const first=Array.isArray(root.data)?objectOf(root.data[0]):{};
  const direct=Number(first.value);
  if(Number.isFinite(direct)&&direct>=0)return direct;
  const values=Array.isArray(first.values)?first.values:[];
  const nested=Number(objectOf(values[0]).value);
  return Number.isFinite(nested)&&nested>=0?nested:undefined;
};

export async function fetchInstagramInsights(mediaId:string,ctx:MetaInstagramFetchContext):Promise<SocialIngestMetric[]>{
  if(!ctx.includeInsights)return[];
  if(!ctx.instagram.allowed||!ctx.config.allowedInstagramIds.has(ctx.instagram.id))return[];
  const fetchedAt=ctx.fetchedAt||new Date().toISOString();
  const settled=await Promise.allSettled(META_MEDIA_INSIGHT_METRICS.map(async name=>{
    const payload=await metaFetchJson<unknown>(ctx.config,`${mediaId}/insights`,{metric:name},ctx.page.pageAccessToken);
    const value=insightValue(payload);
    return value===undefined?undefined:{name,value,unit:'count',asOf:fetchedAt,scope:'source-local'} as SocialIngestMetric;
  }));
  return settled.flatMap(result=>result.status==='fulfilled'&&result.value?[result.value]:[]);
}

export async function fetchInstagramMediaBatch(ctx:MetaInstagramFetchContext):Promise<MetaBatch>{
  if(!ctx.page.allowed||!ctx.instagram.allowed||!ctx.config.allowedPageIds.has(ctx.page.pageId)||!ctx.config.allowedInstagramIds.has(ctx.instagram.id))throw new Error('Instagram account is not allowlisted');
  const fetchedAt=ctx.fetchedAt||new Date().toISOString();
  const params:Record<string,string>={
    fields:'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count',
    limit:'50',
  };
  if(ctx.cursor)params.after=ctx.cursor;
  const payload=await metaFetchJson<GraphBatch>(ctx.config,`${ctx.instagram.id}/media`,params,ctx.page.pageAccessToken);
  const records=(Array.isArray(payload.data)?payload.data:[]).flatMap(value=>{
    const record=normalizeInstagramMedia(value,{apiVersion:ctx.config.apiVersion,accountObjectId:ctx.instagram.id,fetchedAt});
    return record?[record]:[];
  });
  if(ctx.includeInsights){
    const newest=[...records].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,8);
    const enrichment=await Promise.all(newest.map(async record=>({id:record.id,metrics:await fetchInstagramInsights(record.providerObjectId,{...ctx,fetchedAt})})));
    const byId=new Map(enrichment.map(item=>[item.id,item.metrics] as const));
    for(let index=0;index<records.length;index++){
      const extra=byId.get(records[index].id);
      if(extra?.length)records[index]={...records[index],metrics:dedupeSocialMetrics([...records[index].metrics,...extra])};
    }
  }
  const nextCursor=String(payload.paging?.cursors?.after||'').trim()||null;
  return{records,nextCursor,fetchedAt};
}
