import {MetaConfig,MetaProviderError,metaFetchJson} from './client.js';

export type MetaPageCapability={
  pageId:string;
  pageName:string;
  tasks:string[];
  allowed:boolean;
  instagram?:{id:string;username:string;allowed:boolean};
};

export type MetaCapabilityReport={
  checkedAt:string;
  apiVersion:string;
  pages:MetaPageCapability[];
  discoveredPageCount:number;
  allowedPageCount:number;
  linkedInstagramCount:number;
  allowedInstagramCount:number;
  state:'ready'|'credential-required'|'missing-scope'|'unavailable';
  grantedPermissions:string[];
  errorClass?:string;
};

export type MetaResolvedPage={
  pageId:string;
  pageName:string;
  tasks:string[];
  pageAccessToken:string;
  allowed:boolean;
  instagram?:{id:string;username:string;allowed:boolean};
};

export type MetaCapabilityDiscovery={report:MetaCapabilityReport;resolvedPages:MetaResolvedPage[]};

type AccountsResponse={data?:unknown[]};
type PermissionsResponse={data?:unknown[]};
const asObject=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const stringArray=(value:unknown)=>Array.isArray(value)?value.map(item=>String(item||'').trim()).filter(Boolean):[];

export function resolveAllowedCapabilities(report:MetaCapabilityReport,config:MetaConfig):MetaCapabilityReport{
  const pages=report.pages.map(page=>({
    ...page,
    allowed:config.allowedPageIds.has(page.pageId),
    ...(page.instagram?{instagram:{...page.instagram,allowed:config.allowedInstagramIds.has(page.instagram.id)}}:{}),
  }));
  return{
    ...report,
    pages,
    allowedPageCount:pages.filter(page=>page.allowed).length,
    allowedInstagramCount:pages.filter(page=>page.instagram?.allowed).length,
  };
}

export async function discoverMetaCapabilities(config:MetaConfig):Promise<MetaCapabilityDiscovery>{
  const checkedAt=new Date().toISOString();
  try{
    const[accountsResult,permissionsResult]=await Promise.allSettled([
      metaFetchJson<AccountsResponse>(config,'me/accounts',{
        fields:'id,name,tasks,access_token,instagram_business_account{id,username}',
        limit:'100',
      }),
      metaFetchJson<PermissionsResponse>(config,'me/permissions',{limit:'100'}),
    ]);
    if(accountsResult.status==='rejected')throw accountsResult.reason;
    const payload=accountsResult.value;
    if(!Array.isArray(payload.data))throw new MetaProviderError('SCHEMA_CHANGED','me/accounts data is missing');
    const grantedPermissions=permissionsResult.status==='fulfilled'&&Array.isArray(permissionsResult.value.data)
      ?permissionsResult.value.data.flatMap(value=>{
        const raw=asObject(value);
        return raw.status==='granted'&&String(raw.permission||'').trim()?[String(raw.permission).trim()]:[];
      }).sort()
      :[];
    const resolvedPages:MetaResolvedPage[]=payload.data.flatMap(value=>{
      const raw=asObject(value);
      const pageId=String(raw.id||'').trim();
      const pageName=String(raw.name||'').trim();
      const pageAccessToken=String(raw.access_token||'').trim();
      if(!pageId||!pageName||!pageAccessToken)return[];
      const igRaw=asObject(raw.instagram_business_account);
      const igId=String(igRaw.id||'').trim();
      const username=String(igRaw.username||'').trim();
      const instagram=igId?{id:igId,username,allowed:config.allowedInstagramIds.has(igId)}:undefined;
      return[{pageId,pageName,tasks:stringArray(raw.tasks),pageAccessToken,allowed:config.allowedPageIds.has(pageId),...(instagram?{instagram}:{})}];
    });
    const pages:MetaPageCapability[]=resolvedPages.map(({pageAccessToken:_,...page})=>page);
    const report:MetaCapabilityReport={
      checkedAt,
      apiVersion:config.apiVersion,
      pages,
      discoveredPageCount:pages.length,
      allowedPageCount:pages.filter(page=>page.allowed).length,
      linkedInstagramCount:pages.filter(page=>Boolean(page.instagram)).length,
      allowedInstagramCount:pages.filter(page=>page.instagram?.allowed).length,
      state:'ready',
      grantedPermissions,
    };
    return{report,resolvedPages};
  }catch(error){
    if(error instanceof MetaProviderError&&error.code==='MISSING_SCOPE')return{report:{checkedAt,apiVersion:config.apiVersion,pages:[],discoveredPageCount:0,allowedPageCount:0,linkedInstagramCount:0,allowedInstagramCount:0,state:'missing-scope',grantedPermissions:[],errorClass:error.code},resolvedPages:[]};
    if(error instanceof MetaProviderError)return{report:{checkedAt,apiVersion:config.apiVersion,pages:[],discoveredPageCount:0,allowedPageCount:0,linkedInstagramCount:0,allowedInstagramCount:0,state:'unavailable',grantedPermissions:[],errorClass:error.code},resolvedPages:[]};
    return{report:{checkedAt,apiVersion:config.apiVersion,pages:[],discoveredPageCount:0,allowedPageCount:0,linkedInstagramCount:0,allowedInstagramCount:0,state:'unavailable',grantedPermissions:[],errorClass:'META_UNKNOWN'},resolvedPages:[]};
  }
}
