import type {ContentGraph,ContentNode,LocalText,TruthStatus} from './types.js';
import {relatedNodes} from './query.js';

export type SourceProjection={id:string;label:LocalText;url:string;platform?:string;publishedAt?:string;sourceKind?:string};
export type MetricProjection={id:string;metricType:string;value:number|string;unit:string;snapshotDate:string;sourceUrl:string;platform?:string;verification:string;truthStatus:TruthStatus};
export type MediaProjection={id:string;kind:string;label:LocalText;url?:string;sourceUrl:string;authenticity?:string;date?:string};
export type PostProjection={id:string;title:LocalText;date?:string;truthStatus:TruthStatus;topics:string[];platforms:string[];summary?:unknown;sources:SourceProjection[];media:MediaProjection[];metrics:MetricProjection[]};

export function projectPosts(graph:ContentGraph):PostProjection[]{
  return graph.nodes.filter(node=>node.kind==='Post'&&node.data.primary===true).map(node=>{
    const sources=relatedNodes(graph,node.id,{edgeTypes:['SUPPORTED_BY'],kinds:['Source']}).map(source=>({id:source.id,label:source.title,url:String(source.data.url||source.sourceUrls[0]||''),platform:typeof source.data.platform==='string'?source.data.platform:undefined,publishedAt:typeof source.data.publishedAt==='string'?source.data.publishedAt:undefined,sourceKind:typeof source.data.sourceKind==='string'?source.data.sourceKind:undefined}));
    const media=relatedNodes(graph,node.id,{edgeTypes:['HAS_MEDIA']}).map(item=>({id:item.id,kind:item.kind,label:item.title,url:typeof item.data.url==='string'?item.data.url:undefined,sourceUrl:String(item.data.sourceUrl||item.sourceUrls[0]||''),authenticity:typeof item.data.authenticity==='string'?item.data.authenticity:undefined,date:item.date}));
    const metrics=relatedNodes(graph,node.id,{edgeTypes:['HAS_METRIC'],kinds:['Metric']}).map(item=>({id:item.id,metricType:String(item.data.metricType||''),value:item.data.value as number|string,unit:String(item.data.unit||''),snapshotDate:String(item.data.snapshotDate||item.date||''),sourceUrl:String(item.data.sourceUrl||item.sourceUrls[0]||''),platform:typeof item.data.platform==='string'?item.data.platform:undefined,verification:String(item.data.verification||''),truthStatus:item.truthStatus}));
    return{id:node.id,title:node.title,date:node.date,truthStatus:node.truthStatus,topics:[...node.topics],platforms:[...node.platforms],summary:node.data.summary,sources,media,metrics};
  }).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.id.localeCompare(b.id));
}

export type CoverageDomain='Biography'|'Timeline'|'Photos'|'Videos'|'Social'|'Media'|'Projects'|'Research'|'Ideas'|'Influence'|'Audience'|'Network'|'Press'|'Music'|'Current activity'|string;
export type CoverageRow={domain:CoverageDomain;known:number;published:number;missing:boolean;weak:number;unverified:number;nextIngestionSource:null};
const primary=(node:ContentNode)=>node.data.primary===true;
function matchesDomain(node:ContentNode,domain:string):boolean{
  const value=domain.toLowerCase();
  if(value==='biography')return primary(node)&&['Moment','Role','Event','Achievement'].includes(node.kind);
  if(value==='timeline')return primary(node);
  if(value==='photos')return node.kind==='Image';
  if(value==='videos')return node.kind==='Video';
  if(value==='social')return primary(node)&&node.kind==='Post';
  if(value==='media')return primary(node)&&['MediaMention','Interview','Article'].includes(node.kind);
  if(value==='projects')return primary(node)&&node.kind==='Project';
  if(value==='research')return primary(node)&&node.kind==='Research';
  if(value==='ideas')return primary(node)&&node.kind==='Idea';
  if(value==='influence')return primary(node)&&Array.isArray(node.data.impactSignals)&&(node.data.impactSignals as unknown[]).length>0;
  if(value==='audience')return node.kind==='AudienceReaction';
  if(value==='network')return node.kind==='Person'||node.kind==='Organization';
  if(value==='press')return (node.kind==='Source'&&node.data.sourceKind==='press')||(primary(node)&&node.kind==='MediaMention');
  if(value==='music')return primary(node)&&node.kind==='Product'&&node.data.canonicalType==='music';
  if(value==='current activity')return primary(node)&&node.kind==='Product'&&node.data.canonicalType==='system';
  return false;
}

export function projectCoverage(graph:ContentGraph,domains:CoverageDomain[]):CoverageRow[]{
  return domains.map(domain=>{
    const matches=graph.nodes.filter(node=>matchesDomain(node,domain));
    return{domain,known:matches.length,published:matches.filter(node=>node.publicationStatus==='published').length,missing:matches.length===0,weak:matches.filter(node=>node.truthStatus==='STRONGLY_INFERRED').length,unverified:matches.filter(node=>node.truthStatus==='REQUIRES_CONFIRMATION').length,nextIngestionSource:null};
  });
}
