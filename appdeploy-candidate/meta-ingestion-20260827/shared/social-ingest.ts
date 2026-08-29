export type SocialIngestMetric={
  name:string;
  value:number;
  unit:string;
  asOf:string;
  scope:'source-local';
};

export type SocialIngestRecord={
  id:string;
  provider:'meta';
  platform:'Facebook'|'Instagram';
  providerObjectId:string;
  accountObjectId:string;
  canonicalUrl:string;
  publishedAt:string;
  text?:string;
  mediaType:'video'|'image'|'carousel'|'post';
  mediaUrl?:string;
  thumbnailUrl?:string;
  provenance:{source:'owner-authorized-api';fetchedAt:string;apiVersion:string};
  metrics:SocialIngestMetric[];
};

export type SocialIngestProjectionMetric={
  label:string;
  value:string;
  unit:string;
  date:string;
  scope:'source-local';
};

const HTTPS=/^https:\/\//i;
const ISO_DATE=/^\d{4}-\d{2}-\d{2}T/;
const MEDIA_TYPES=new Set<SocialIngestRecord['mediaType']>(['video','image','carousel','post']);

const objectOf=(value:unknown):Record<string,unknown>=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('record must be an object');
  return value as Record<string,unknown>;
};

const requiredString=(value:unknown,name:string)=>{
  const text=String(value??'').trim();
  if(!text)throw new Error(`${name} is required`);
  return text;
};

const optionalHttps=(value:unknown,name:string)=>{
  const text=String(value??'').trim();
  if(!text)return undefined;
  if(!HTTPS.test(text))throw new Error(`${name} must be HTTPS`);
  return text;
};

const validateMetric=(value:unknown):SocialIngestMetric=>{
  const raw=objectOf(value);
  const name=requiredString(raw.name,'metric name');
  const unit=requiredString(raw.unit,'metric unit');
  const asOf=requiredString(raw.asOf,'metric asOf');
  const numeric=Number(raw.value);
  if(!Number.isFinite(numeric)||numeric<0)throw new Error('metric value must be a finite non-negative number');
  if(!ISO_DATE.test(asOf))throw new Error('metric asOf must be an ISO timestamp');
  if(raw.scope!=='source-local')throw new Error('metric scope must be source-local');
  return{name,value:numeric,unit,asOf,scope:'source-local'};
};

export function dedupeSocialMetrics(metrics:SocialIngestMetric[]):SocialIngestMetric[]{
  const map=new Map<string,SocialIngestMetric>();
  for(const metric of metrics){
    const valid=validateMetric(metric);
    map.set([valid.name,valid.unit,valid.asOf].join('|'),valid);
  }
  return[...map.values()];
}

export function socialRecordKey(record:Pick<SocialIngestRecord,'provider'|'providerObjectId'>):string{
  if(record.provider!=='meta')throw new Error('provider must be meta');
  return`meta:${requiredString(record.providerObjectId,'providerObjectId')}`;
}

export function validateSocialIngestRecord(value:unknown):SocialIngestRecord{
  const raw=objectOf(value);
  if(raw.provider!=='meta')throw new Error('provider must be meta');
  if(raw.platform!=='Facebook'&&raw.platform!=='Instagram')throw new Error('platform must be Facebook or Instagram');
  const providerObjectId=requiredString(raw.providerObjectId,'providerObjectId');
  const accountObjectId=requiredString(raw.accountObjectId,'accountObjectId');
  const canonicalUrl=requiredString(raw.canonicalUrl,'canonicalUrl');
  if(!HTTPS.test(canonicalUrl))throw new Error('canonicalUrl must be HTTPS');
  const publishedAt=requiredString(raw.publishedAt,'publishedAt');
  if(!ISO_DATE.test(publishedAt))throw new Error('publishedAt must be an ISO timestamp');
  const id=requiredString(raw.id,'id');
  const mediaType=raw.mediaType as SocialIngestRecord['mediaType'];
  if(!MEDIA_TYPES.has(mediaType))throw new Error('mediaType is invalid');
  const provenanceRaw=objectOf(raw.provenance);
  if(provenanceRaw.source!=='owner-authorized-api')throw new Error('provenance source is invalid');
  const fetchedAt=requiredString(provenanceRaw.fetchedAt,'provenance fetchedAt');
  if(!ISO_DATE.test(fetchedAt))throw new Error('provenance fetchedAt must be an ISO timestamp');
  const apiVersion=requiredString(provenanceRaw.apiVersion,'provenance apiVersion');
  const textValue=String(raw.text??'').trim();
  const metrics=dedupeSocialMetrics(Array.isArray(raw.metrics)?raw.metrics.map(validateMetric):[]);
  const mediaUrl=optionalHttps(raw.mediaUrl,'mediaUrl');
  const thumbnailUrl=optionalHttps(raw.thumbnailUrl,'thumbnailUrl');
  return{
    id,
    provider:'meta',
    platform:raw.platform,
    providerObjectId,
    accountObjectId,
    canonicalUrl,
    publishedAt,
    ...(textValue?{text:textValue.slice(0,5000)}:{}),
    mediaType,
    ...(mediaUrl?{mediaUrl}:{}),
    ...(thumbnailUrl?{thumbnailUrl}:{}),
    provenance:{source:'owner-authorized-api',fetchedAt,apiVersion},
    metrics,
  };
}
