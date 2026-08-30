import type {ContentEdgeType,ContentGraph,ContentNode,ContentNodeKind,TruthStatus} from './types.js';

export type GraphQuery={kind?:ContentNodeKind;year?:number;topic?:string;platform?:string;truthStatus?:TruthStatus;q?:string;primaryOnly?:boolean};
const includesCI=(values:string[],needle:string)=>values.some(value=>value.toLowerCase()===needle.toLowerCase());

export function queryGraph(graph:ContentGraph,query:GraphQuery={}):ContentNode[]{
  const q=(query.q||'').trim().toLowerCase();
  return graph.nodes.filter(node=>{
    if(query.primaryOnly&&node.data.primary!==true)return false;
    if(query.kind&&node.kind!==query.kind)return false;
    if(query.year&&(!node.date||Number(node.date.slice(0,4))!==query.year))return false;
    if(query.topic&&!includesCI(node.topics,query.topic))return false;
    if(query.platform&&!includesCI(node.platforms,query.platform))return false;
    if(query.truthStatus&&node.truthStatus!==query.truthStatus)return false;
    if(q){
      const haystack=[node.id,node.kind,...Object.values(node.title),...node.topics,...node.platforms,JSON.stringify(node.data)].join(' ').toLowerCase();
      if(!haystack.includes(q))return false;
    }
    return true;
  });
}

export type RelatedOptions={edgeTypes?:ContentEdgeType[];direction?:'outgoing'|'incoming'|'both';kinds?:ContentNodeKind[]};
export function relatedNodes(graph:ContentGraph,nodeId:string,options:RelatedOptions={}):ContentNode[]{
  const direction=options.direction||'outgoing';
  const allowedEdges=options.edgeTypes?new Set(options.edgeTypes):null;
  const allowedKinds=options.kinds?new Set(options.kinds):null;
  const ids=new Set<string>();
  for(const edge of graph.edges){
    if(allowedEdges&&!allowedEdges.has(edge.type))continue;
    if((direction==='outgoing'||direction==='both')&&edge.from===nodeId)ids.add(edge.to);
    if((direction==='incoming'||direction==='both')&&edge.to===nodeId)ids.add(edge.from);
  }
  return graph.nodes.filter(node=>ids.has(node.id)&&(!allowedKinds||allowedKinds.has(node.kind)));
}
