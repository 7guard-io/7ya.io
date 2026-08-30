import type {LocalText,TruthStatus} from './types.js';

export type CanonicalSourceV2Like={id:string;label:string;url:string;kind:string;public:boolean;platform?:string;publishedAt?:string};
export type CanonicalMediaV2Like={kind:string;sourceUrl:string;authenticity:string;label:string;url?:string;captureDate?:string;publicationDate?:string};
export type CanonicalMetricV2Like={metricType:string;value:number|string;unit:string;snapshotDate:string;sourceUrl:string;platform?:string;verification:string};
export type CanonicalEventV2Like={
  id:string;storyOrder:number;canonicalDate:string;datePrecision:string;dateBasis:string;dateNote?:string;period?:{start:string;end?:string};subjectPeriod?:string;
  type:string;surfaces:string[];title:LocalText;summary:LocalText;visibility:string;verification:{state:string;note:string};sources:CanonicalSourceV2Like[];media:CanonicalMediaV2Like[];
  metrics?:CanonicalMetricV2Like[];impact:{state:string;signals:string[]};tags:string[];relatedEventIds?:string[];
};

export function mapVerificationState(state:string):TruthStatus{
  if(state==='verified')return'VERIFIED';
  if(state==='supported'||state==='inferred')return'STRONGLY_INFERRED';
  return'REQUIRES_CONFIRMATION';
}
