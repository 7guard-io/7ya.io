import type {CanonicalEventV2Like,CanonicalMediaV2Like,CanonicalMetricV2Like,CanonicalSourceV2Like} from './canonical-v2.js';
import {mapVerificationState} from './canonical-v2.js';
import type {ContentEdge,ContentEdgeType,ContentGraph,ContentNode,ContentNodeKind,LocalText,TruthStatus} from './types.js';

const blankTitle=(value:string):LocalText=>({he:value,en:value,ru:value});
const canonicalTypeToKind=(type:string):ContentNodeKind=>{
  switch(type){
    case'identity':return'Moment';
    case'service':return'Role';
    case'project':return'Project';
    case'post':return'Post';
    case'media':return'MediaMention';
    case'writing':return'Article';
    case'music':return'Product';
    case'research':return'Research';
    case'system':return'Product';
    default:return'Event';
  }
};
const mediaKindToNode=(kind:string):ContentNodeKind=>kind==='image'?'Image':kind==='video'?'Video':kind==='document'?'Article':'Source';
const unique=(values:Array<string|undefined>)=>[...new Set(values.filter((v):v is string=>Boolean(v&&v.trim())).map(v=>v.trim()))];
const normalizeUrl=(input:string)=>{
  const value=input.trim();
  if(!/^https?:\/\//i.test(value))return value;
  try{
    const url=new URL(value);
    url.hash='';
    for(const key of [...url.searchParams.keys()])if(/^utm_/i.test(key)||['fbclid','gclid','mc_cid','mc_eid'].includes(key.toLowerCase()))url.searchParams.delete(key);
    url.searchParams.sort();
    if(url.pathname.length>1)url.pathname=url.pathname.replace(/\/+$/,'');
    return url.toString();
  }catch{return value}
};
const hashText=(value:string)=>{
  let hash=14695981039346656037n;
  const prime=1099511628211n;
  const mask=(1n<<64n)-1n;
  for(let i=0;i<value.length;i++){hash^=BigInt(value.charCodeAt(i));hash=(hash*prime)&mask}
  return hash.toString(36);
};
const stableExternalId=(prefix:string,value:string)=>prefix+':'+hashText(normalizeUrl(value));
const edgeId=(type:ContentEdgeType,from:string,to:string)=>'edge:'+hashText([type,from,to].join('|'));

function eventNode(event:CanonicalEventV2Like):ContentNode{
  const publicSources=event.sources.filter(source=>source.public!==false);
  const platforms=unique([...publicSources.map(source=>source.platform),...(event.metrics||[]).map(metric=>metric.platform)]);
  const sourceUrls=unique(publicSources.map(source=>source.url));
  return{id:'event:'+event.id,kind:canonicalTypeToKind(event.type),title:event.title,date:event.canonicalDate,truthStatus:mapVerificationState(event.verification.state),topics:unique(event.tags),platforms,sourceUrls,publicationStatus:'published',data:{primary:true,canonicalId:event.id,canonicalType:event.type,storyOrder:event.storyOrder,datePrecision:event.datePrecision,dateBasis:event.dateBasis,dateNote:event.dateNote,period:event.period,subjectPeriod:event.subjectPeriod,surfaces:[...event.surfaces],summary:event.summary,verificationState:event.verification.state,verificationNote:event.verification.note,impactState:event.impact.state,impactSignals:[...event.impact.signals]}};
}
function sourceNode(source:CanonicalSourceV2Like,truthStatus:TruthStatus):ContentNode{
  return{id:stableExternalId('source',source.url),kind:'Source',title:blankTitle(source.label),date:source.publishedAt,truthStatus,topics:[],platforms:unique([source.platform]),sourceUrls:[source.url],publicationStatus:source.public?'published':'known-unpublished',data:{primary:false,sourceId:source.id,url:source.url,canonicalUrl:normalizeUrl(source.url),sourceKind:source.kind,public:source.public,platform:source.platform,publishedAt:source.publishedAt}};
}
function mediaNode(media:CanonicalMediaV2Like,truthStatus:TruthStatus):ContentNode{
  const locator=media.url||media.sourceUrl;
  return{id:stableExternalId('media',locator),kind:mediaKindToNode(media.kind),title:blankTitle(media.label),date:media.captureDate||media.publicationDate,truthStatus,topics:[],platforms:[],sourceUrls:unique([media.sourceUrl]),publicationStatus:'published',data:{primary:false,mediaKind:media.kind,url:media.url,sourceUrl:media.sourceUrl,authenticity:media.authenticity,captureDate:media.captureDate,publicationDate:media.publicationDate}};
}
function metricNode(metric:CanonicalMetricV2Like,eventId:string,index:number):ContentNode{
  const truthStatus:TruthStatus=metric.verification==='verified'?'VERIFIED':'REQUIRES_CONFIRMATION';
  const locator=[eventId,metric.metricType,metric.snapshotDate,metric.sourceUrl,metric.platform||'',String(index)].join('|');
  return{id:'metric:'+hashText(locator),kind:'Metric',title:blankTitle(metric.metricType),date:metric.snapshotDate,truthStatus,topics:[],platforms:unique([metric.platform]),sourceUrls:[metric.sourceUrl],publicationStatus:'published',data:{primary:false,metricType:metric.metricType,value:metric.value,unit:metric.unit,snapshotDate:metric.snapshotDate,sourceUrl:metric.sourceUrl,platform:metric.platform,verification:metric.verification}};
}
function makeEdge(type:ContentEdgeType,from:string,to:string,truthStatus:TruthStatus,sourceUrls:string[],data:Record<string,unknown>={}):ContentEdge{
  return{id:edgeId(type,from,to),type,from,to,truthStatus,sourceUrls:unique(sourceUrls),data};
}

export function projectCanonicalV2(events:CanonicalEventV2Like[]):ContentGraph{
  const publicEvents=events.filter(event=>event.visibility==='public');
  const publicEventIds=new Set(publicEvents.map(event=>event.id));
  const nodeMap=new Map<string,ContentNode>();
  const edgeMap=new Map<string,ContentEdge>();
  for(const event of publicEvents){
    const primary=eventNode(event);
    nodeMap.set(primary.id,primary);
    for(const source of event.sources.filter(item=>item.public!==false)){
      const node=sourceNode(source,primary.truthStatus);
      if(!nodeMap.has(node.id))nodeMap.set(node.id,node);
      const edge=makeEdge('SUPPORTED_BY',primary.id,node.id,primary.truthStatus,[source.url],{sourceKind:source.kind});
      edgeMap.set(edge.id,edge);
    }
    for(const media of event.media){
      const node=mediaNode(media,primary.truthStatus);
      if(!nodeMap.has(node.id))nodeMap.set(node.id,node);
      const edge=makeEdge('HAS_MEDIA',primary.id,node.id,primary.truthStatus,[media.sourceUrl],{authenticity:media.authenticity});
      edgeMap.set(edge.id,edge);
    }
    (event.metrics||[]).forEach((metric,index)=>{
      const node=metricNode(metric,event.id,index);
      nodeMap.set(node.id,node);
      const edge=makeEdge('HAS_METRIC',primary.id,node.id,node.truthStatus,[metric.sourceUrl],{platform:metric.platform});
      edgeMap.set(edge.id,edge);
    });
  }
  for(const event of publicEvents){
    const from='event:'+event.id;
    for(const target of event.relatedEventIds||[]){
      if(!publicEventIds.has(target))continue;
      const edge=makeEdge('RELATED_TO',from,'event:'+target,mapVerificationState(event.verification.state),unique(event.sources.filter(source=>source.public!==false).map(source=>source.url)),{explicitCanonicalRelation:true});
      edgeMap.set(edge.id,edge);
    }
  }
  const nodes=[...nodeMap.values()].sort((a,b)=>{
    const ap=Number(a.data.storyOrder??Number.MAX_SAFE_INTEGER),bp=Number(b.data.storyOrder??Number.MAX_SAFE_INTEGER);
    return ap-bp||a.id.localeCompare(b.id);
  });
  const edges=[...edgeMap.values()].sort((a,b)=>a.id.localeCompare(b.id));
  return{schemaVersion:3,sourceSchemaVersion:2,nodes,edges,stats:{primaryNodes:nodes.filter(node=>node.data.primary===true).length,nodes:nodes.length,edges:edges.length}};
}
