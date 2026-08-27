import {MetaCapabilityDiscovery} from './capabilities.js';
import {MetaConfig} from './client.js';

export type MetaOAuthSelection={
  pageId:string;
  pageName:string;
  pageAccessToken:string;
  scope:string;
  instagramBusinessAccountId?:string;
  apiVersion:string;
};

export type MetaOAuthBridge={config:MetaConfig;discovery:MetaCapabilityDiscovery};

export function buildMetaOAuthBridge(input:MetaOAuthSelection):MetaOAuthBridge{
  const pageId=input.pageId.trim();
  const pageName=input.pageName.trim();
  const pageAccessToken=input.pageAccessToken.trim();
  if(!pageId||!pageName||!pageAccessToken)throw new Error('selected Facebook Page OAuth state is incomplete');
  const instagramId=String(input.instagramBusinessAccountId||'').trim();
  const grantedPermissions=[...new Set(String(input.scope||'').split(/\s+/).map(value=>value.trim()).filter(Boolean))].sort();
  const config:MetaConfig={
    apiVersion:input.apiVersion.trim()||'v24.0',
    userAccessToken:pageAccessToken,
    allowedPageIds:new Set([pageId]),
    allowedInstagramIds:new Set(instagramId?[instagramId]:[]),
    enabled:true,
  };
  const instagram=instagramId?{id:instagramId,username:'',allowed:true}:undefined;
  const resolvedPage={pageId,pageName,tasks:[],pageAccessToken,allowed:true,...(instagram?{instagram}:{})};
  const report={
    checkedAt:new Date().toISOString(),
    apiVersion:config.apiVersion,
    pages:[{pageId,pageName,tasks:[],allowed:true,...(instagram?{instagram}:{})}],
    discoveredPageCount:1,
    allowedPageCount:1,
    linkedInstagramCount:instagram?1:0,
    allowedInstagramCount:instagram?1:0,
    state:'ready' as const,
    grantedPermissions,
  };
  return{config,discovery:{report,resolvedPages:[resolvedPage]}};
}
