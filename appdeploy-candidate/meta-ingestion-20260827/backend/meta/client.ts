import {secrets} from '@appdeploy/sdk';

export type MetaErrorCode='AUTH_EXPIRED'|'MISSING_SCOPE'|'RATE_LIMITED'|'PROVIDER_TEMPORARY'|'OBJECT_REMOVED'|'SCHEMA_CHANGED';

export type MetaConfig={
  apiVersion:string;
  userAccessToken:string;
  appId?:string;
  appSecret?:string;
  allowedPageIds:Set<string>;
  allowedInstagramIds:Set<string>;
  enabled:boolean;
};

export class MetaProviderError extends Error{
  constructor(public code:MetaErrorCode,message:string,public status?:number){super(message);this.name='MetaProviderError'}
}

const csvSet=(value:string|undefined)=>new Set(String(value||'').split(',').map(item=>item.trim()).filter(Boolean));
const safeRead=async(names:Set<string>,name:string)=>names.has(name)?secrets.readSecret(name):undefined;

export async function loadMetaConfig():Promise<MetaConfig|null>{
  const names=new Set(await secrets.listSecretNames());
  if(!names.has('META_USER_ACCESS_TOKEN'))return null;
  const userAccessToken=await secrets.readSecret('META_USER_ACCESS_TOKEN');
  if(!userAccessToken.trim())return null;
  const[apiVersion,appId,appSecret,pageIds,instagramIds,enabled]=await Promise.all([
    safeRead(names,'META_GRAPH_API_VERSION'),
    safeRead(names,'META_APP_ID'),
    safeRead(names,'META_APP_SECRET'),
    safeRead(names,'META_ALLOWED_PAGE_IDS'),
    safeRead(names,'META_ALLOWED_INSTAGRAM_IDS'),
    safeRead(names,'META_INGEST_ENABLED'),
  ]);
  return{
    apiVersion:(apiVersion||'v24.0').trim()||'v24.0',
    userAccessToken,
    ...(appId?.trim()?{appId:appId.trim()}:{}),
    ...(appSecret?.trim()?{appSecret:appSecret.trim()}:{}),
    allowedPageIds:csvSet(pageIds),
    allowedInstagramIds:csvSet(instagramIds),
    enabled:String(enabled||'').trim().toLowerCase()==='true',
  };
}

const graphErrorOf=(value:unknown)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))return{} as Record<string,unknown>;
  const root=value as Record<string,unknown>;
  const graphError=root.error;
  return graphError&&typeof graphError==='object'&&!Array.isArray(graphError)?graphError as Record<string,unknown>:{} as Record<string,unknown>;
};

const classifyMetaError=(status:number,body:unknown):MetaErrorCode=>{
  const graph=graphErrorOf(body);
  const code=Number(graph.code);
  const subcode=Number(graph.error_subcode);
  if(status===401||subcode===463||subcode===467||code===190)return'AUTH_EXPIRED';
  if(status===429||[4,17,32,613].includes(code))return'RATE_LIMITED';
  if([10,200,2500].includes(code))return'MISSING_SCOPE';
  if(status===404)return'OBJECT_REMOVED';
  if(status>=500)return'PROVIDER_TEMPORARY';
  return'SCHEMA_CHANGED';
};

const providerMessage:Record<MetaErrorCode,string>={
  AUTH_EXPIRED:'Meta authorization is unavailable',
  MISSING_SCOPE:'Meta permission is missing',
  RATE_LIMITED:'Meta rate limit reached',
  PROVIDER_TEMPORARY:'Meta provider is temporarily unavailable',
  OBJECT_REMOVED:'Meta object is unavailable',
  SCHEMA_CHANGED:'Meta response schema is unsupported',
};

export function sanitizeMetaError(error:unknown):{code:string;message:string}{
  if(error instanceof MetaProviderError)return{code:error.code,message:providerMessage[error.code]};
  return{code:'META_UNKNOWN',message:'Meta provider request failed'};
}

export async function metaFetchJson<T>(config:MetaConfig,path:string,params:Record<string,string>={},tokenOverride?:string):Promise<T>{
  if(Object.prototype.hasOwnProperty.call(params,'access_token'))throw new MetaProviderError('SCHEMA_CHANGED','access_token query parameters are forbidden');
  const url=new URL(`https://graph.facebook.com/${config.apiVersion}/${path.replace(/^\//,'')}`);
  for(const[key,value]of Object.entries(params))url.searchParams.set(key,value);
  let response:Response;
  try{
    response=await fetch(url,{headers:{accept:'application/json',Authorization:`Bearer ${tokenOverride||config.userAccessToken}`},cache:'no-store',signal:AbortSignal.timeout(10_000)});
  }catch{
    throw new MetaProviderError('PROVIDER_TEMPORARY','Meta request failed before response');
  }
  let body:unknown={};
  try{body=await response.json()}catch{body={}}
  if(!response.ok){
    const code=classifyMetaError(response.status,body);
    throw new MetaProviderError(code,'Meta Graph request failed',response.status);
  }
  return body as T;
}
