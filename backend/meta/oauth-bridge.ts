import type {MetaCapabilityReport,MetaResolvedPage} from './capabilities.js';
import type {MetaSyncBootstrap} from './sync.js';

type StoredMetaOAuth={token:string;scope:string;accountHint:string};
const objectOf=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const scopeList=(value:string)=>[...new Set(String(value||'').split(/[\s,]+/).map(item=>item.trim()).filter(Boolean))].sort();

export function buildMetaSyncBootstrap(pageStored:StoredMetaOAuth|null,apiVersion='v24.0',ownerStored:StoredMetaOAuth|null=null):MetaSyncBootstrap|null{
  const pageToken=String(pageStored?.token||'').trim();
  const ownerToken=String(ownerStored?.token||'').trim();
  if(!pageToken&&!ownerToken)return null;
  let hint:Record<string,unknown>={};
  if(pageStored?.accountHint){
    try{hint=objectOf(JSON.parse(String(pageStored.accountHint||'{}')))}catch{hint={}}
  }
  const pageId=String(hint.pageId||'').trim();
  const pageName=String(hint.pageName||'Facebook Page').trim()||'Facebook Page';
  const instagramId=String(hint.instagramBusinessAccountId||'').trim();
  const grantedPermissions=scopeList(ownerStored?.scope||pageStored?.scope||'');
  const instagram=instagramId?{id:instagramId,username:'',allowed:true}:undefined;
  const resolvedPages:MetaResolvedPage[]=pageId&&pageToken?[{pageId,pageName,tasks:[],pageAccessToken:pageToken,allowed:true,...(instagram?{instagram}:{})}]:[];
  const pages=resolvedPages.map(({pageAccessToken:_,...page})=>page);
  const report:MetaCapabilityReport={
    checkedAt:new Date().toISOString(),
    apiVersion,
    pages,
    discoveredPageCount:pages.length,
    allowedPageCount:pages.length,
    linkedInstagramCount:instagramId?1:0,
    allowedInstagramCount:instagramId?1:0,
    state:'ready',
    grantedPermissions,
  };
  return{
    config:{
      apiVersion,
      userAccessToken:ownerToken||pageToken,
      allowedPageIds:new Set(pageId?[pageId]:[]),
      allowedInstagramIds:new Set(instagramId?[instagramId]:[]),
      enabled:true,
    },
    discovery:{report,resolvedPages},
  };
}
