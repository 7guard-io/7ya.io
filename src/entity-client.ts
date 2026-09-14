import {api} from '@appdeploy/client';
export type EntityKind='person'|'place'|'institution';export type EntityTruth='VERIFIED'|'STRONGLY_INFERRED'|'REQUIRES_CONFIRMATION';
export type CanonicalEntity={id:string;kind:EntityKind;label:{he:string;en:string;ru:string};relation:{he:string;en:string;ru:string};truthStatus:EntityTruth;sources:Array<{id:string;label:string;url:string;kind:string}>;relatedEventIds:string[];tags:string[]};
const params=(values:Record<string,string|undefined>)=>{const query=new URLSearchParams();for(const [key,value] of Object.entries(values))if(value)query.set(key,value);return query.toString()};
export async function fetchEntities(values:{q?:string;kind?:EntityKind}={}){const response=await api.get('/api/entities?'+params(values));return response.data as {release:string;count:number;entities:CanonicalEntity[]}}
