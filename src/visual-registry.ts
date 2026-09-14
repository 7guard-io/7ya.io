import {api} from '@appdeploy/client';
export type VisualOrigin='drive-seed'|'canonical-media'|'public-source'|'social-live';
export type VisualRecord={id:string;canonicalId:string;chapter:string;year:string;source:string;sourceUrl:string;imageUrl:string;label:string;origin:VisualOrigin;priority:number;verification:string};
type VisualPayload={release:string;count:number;items:VisualRecord[]};
let cache:Promise<VisualRecord[]>|null=null;
export function fetchVisualRegistry(force=false){if(!cache||force)cache=api.get('/api/visual-registry').then(({data})=>Array.isArray((data as VisualPayload)?.items)?(data as VisualPayload).items:[]).catch(()=>[]);return cache}
export function resolveVisualCandidates(records:VisualRecord[],query:{canonicalId?:string;chapter?:string;year?:string}){const exact=records.filter(item=>query.canonicalId&&item.canonicalId===query.canonicalId);const chapter=exact.length?exact:records.filter(item=>query.chapter&&item.chapter===query.chapter);return [...(chapter.length?chapter:[])].sort((a,b)=>{const ay=query.year&&a.year.startsWith(query.year)?-5:0;const by=query.year&&b.year.startsWith(query.year)?-5:0;return(a.priority+ay)-(b.priority+by)||a.id.localeCompare(b.id)})}export function resolveVisual(records:VisualRecord[],query:{canonicalId?:string;chapter?:string;year?:string}){return resolveVisualCandidates(records,query)[0]}
