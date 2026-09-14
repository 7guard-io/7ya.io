export type FacebookSourceHealthInput={
  ownerProfileConnected:boolean;
  userPostsPermission:boolean;
  pageConnected:boolean;
  checkpoint:string|null;
  records:Array<{publishedAt:string}>;
};

export function summarizeFacebookSourceHealth(input:FacebookSourceHealthInput){
  const dates=input.records.map(record=>String(record.publishedAt||'')).filter(Boolean).sort();
  return{
    mode:'owner-authorized-meta' as const,
    ownerProfileConnected:input.ownerProfileConnected===true,
    userPostsPermission:input.userPostsPermission===true,
    pageConnected:input.pageConnected===true,
    directPublicOwnerRecordsVisible:input.records.length,
    newestPublishedAt:dates.length?dates[dates.length-1]:null,
    oldestPublishedAt:dates[0]||null,
    backfill:input.checkpoint==='__COMPLETE__'?'complete' as const:input.checkpoint?'in-progress' as const:'not-started' as const,
    privacy:'EVERYONE-only' as const,
    tokensReturned:false as const,
    privateContentReturned:false as const,
  };
}
