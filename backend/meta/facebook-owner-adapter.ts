import {SocialIngestRecord,validateSocialIngestRecord} from '../../shared/social-ingest.js';
import {isPublicFacebookOwnerPost} from '../../shared/facebook-owner-direct.js';
import {MetaConfig,metaFetchJson} from './client.js';

export type MetaOwnerBatch={records:SocialIngestRecord[];nextCursor:string|null;fetchedAt:string};
export type MetaOwnerFetchContext={config:MetaConfig;cursor?:string|null;fetchedAt?:string};
type GraphBatch={data?:unknown[];paging?:{cursors?:{after?:string}}};

const objectOf=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const httpsValue=(value:unknown)=>{const text=String(value||'').trim();return /^https:\/\//i.test(text)?text:undefined};
const attachmentLooksVideo=(raw:Record<string,unknown>)=>{
  const attachments=objectOf(raw.attachments);
  const data=Array.isArray(attachments.data)?attachments.data:[];
  return data.some(value=>{
    const item=objectOf(value);
    return /video/i.test(String(item.media_type||''))||/video/i.test(String(item.type||''));
  });
};

export function normalizeFacebookOwnerPost(value:unknown,ctx:{apiVersion:string;fetchedAt:string}):SocialIngestRecord|null{
  const raw=objectOf(value);
  if(!isPublicFacebookOwnerPost(raw))return null;
  const id=String(raw.id||'').trim();
  const canonicalUrl=httpsValue(raw.permalink_url);
  const publishedAt=String(raw.created_time||'').trim();
  if(!id||!canonicalUrl||!publishedAt)return null;
  const thumbnailUrl=httpsValue(raw.full_picture);
  const accountObjectId=id.includes('_')?id.split('_')[0]:'facebook-owner-profile';
  return validateSocialIngestRecord({
    id:`meta:facebook-owner:${id}`,
    provider:'meta',
    platform:'Facebook',
    providerObjectId:id,
    accountObjectId,
    canonicalUrl,
    publishedAt,
    text:String(raw.message||'').slice(0,5000),
    mediaType:attachmentLooksVideo(raw)?'video':thumbnailUrl?'image':'post',
    ...(thumbnailUrl?{thumbnailUrl}:{}),
    provenance:{source:'owner-authorized-api',fetchedAt:ctx.fetchedAt,apiVersion:ctx.apiVersion},
    metrics:[],
  });
}

export async function fetchFacebookOwnerBatch(ctx:MetaOwnerFetchContext):Promise<MetaOwnerBatch>{
  const fetchedAt=ctx.fetchedAt||new Date().toISOString();
  const params:Record<string,string>={
    fields:'id,message,created_time,permalink_url,full_picture,privacy,attachments{media_type,type,url,media,target}',
    limit:'100',
  };
  if(ctx.cursor)params.after=ctx.cursor;
  const payload=await metaFetchJson<GraphBatch>(ctx.config,'me/posts',params);
  const records=(Array.isArray(payload.data)?payload.data:[]).flatMap(value=>{
    const record=normalizeFacebookOwnerPost(value,{apiVersion:ctx.config.apiVersion,fetchedAt});
    return record?[record]:[];
  });
  const nextCursor=String(payload.paging?.cursors?.after||'').trim()||null;
  return{records,nextCursor,fetchedAt};
}
