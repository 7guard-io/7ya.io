import type {ContentGraph} from './types.js';

export type GraphIntegrityCode=
  |'DUPLICATE_NODE_ID'
  |'DUPLICATE_EDGE_ID'
  |'ORPHAN_EDGE'
  |'PRIMARY_WITHOUT_SOURCE'
  |'METRIC_WITHOUT_PROVENANCE'
  |'FORBIDDEN_AGGREGATE_METRIC';
export type GraphIntegrityIssue={code:GraphIntegrityCode;message:string;nodeId?:string;edgeId?:string;path?:string};
export type GraphIntegrityReport={valid:boolean;issues:GraphIntegrityIssue[]};

const forbiddenMetricKey=(key:string)=>{
  const normalized=key.replace(/[^a-z0-9]/gi,'').toLowerCase();
  return normalized==='aggregatereach'||normalized==='totalreach'||normalized==='crossplatformreach';
};
function scanForbidden(value:unknown,path:string,nodeId:string,issues:GraphIntegrityIssue[]){
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value)){value.forEach((item,index)=>scanForbidden(item,path+'['+index+']',nodeId,issues));return}
  for(const [key,item] of Object.entries(value as Record<string,unknown>)){
    const next=path?path+'.'+key:key;
    if(forbiddenMetricKey(key))issues.push({code:'FORBIDDEN_AGGREGATE_METRIC',message:'Cross-platform aggregate reach is forbidden in the canonical graph.',nodeId,path:next});
    scanForbidden(item,next,nodeId,issues);
  }
}

export function validateGraph(graph:ContentGraph):GraphIntegrityReport{
  const issues:GraphIntegrityIssue[]=[];
  const nodeCounts=new Map<string,number>();
  const edgeCounts=new Map<string,number>();
  for(const node of graph.nodes)nodeCounts.set(node.id,(nodeCounts.get(node.id)||0)+1);
  for(const edge of graph.edges)edgeCounts.set(edge.id,(edgeCounts.get(edge.id)||0)+1);
  for(const [id,count] of nodeCounts)if(count>1)issues.push({code:'DUPLICATE_NODE_ID',message:'Node id appears '+count+' times.',nodeId:id});
  for(const [id,count] of edgeCounts)if(count>1)issues.push({code:'DUPLICATE_EDGE_ID',message:'Edge id appears '+count+' times.',edgeId:id});
  const nodeIds=new Set(nodeCounts.keys());
  for(const edge of graph.edges)if(!nodeIds.has(edge.from)||!nodeIds.has(edge.to))issues.push({code:'ORPHAN_EDGE',message:'Edge references a node that does not exist.',edgeId:edge.id});
  for(const node of graph.nodes){
    if(node.data.primary===true&&node.sourceUrls.length===0)issues.push({code:'PRIMARY_WITHOUT_SOURCE',message:'Primary public content must retain at least one source URL.',nodeId:node.id});
    if(node.kind==='Metric'){
      const snapshot=typeof node.data.snapshotDate==='string'&&node.data.snapshotDate.length>0;
      const source=typeof node.data.sourceUrl==='string'&&node.data.sourceUrl.length>0&&node.sourceUrls.length>0;
      if(!snapshot||!source)issues.push({code:'METRIC_WITHOUT_PROVENANCE',message:'Metric nodes require snapshot date and source URL.',nodeId:node.id});
    }
    scanForbidden(node.data,'data',node.id,issues);
  }
  return{valid:issues.length===0,issues};
}
