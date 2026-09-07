import {ai,db,error,json,router,secrets,requireAuth,requireAdminEmailAllowlist} from '@appdeploy/sdk';
import {createCipheriv,createDecipheriv,createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {notifySubscribers,realtimeSubscriptionRoutes} from './realtime-subscribers';
import {discoverNvcf,invokeNvcf,type NvcfCandidate,type NvcfDiscovery,type NvcfTarget} from './nvcf';
import {getVisitCount,incrementVisitCount} from './counter';
import {MEDIA_IMPACT_RELEASE,mediaImpactRecords,mediaImpactSummary,publicMediaImpactRecords} from '../shared/media-impact';
import {RECOVERED_MEDIA_RELEASE,recoveredMediaRecords} from '../shared/recovered-media';
import {CANONICAL_CORPUS_RELEASE,CANONICAL_CORPUS_SCHEMA_VERSION} from '../shared/canonical-corpus';
import {CONTENT_GRAPH_RELEASE,graphCoverage,projectContentGraph,projectContentPosts,relatedContent,searchContentGraph} from '../shared/content-graph';
import {projectContentOperatingMap} from '../shared/content-operating-map';
import {PUBLIC_INTERNET_GRAPH_RELEASE,projectPublicInternetGraph,searchPublicInternetGraph} from '../shared/public-internet-graph';
import {CANONICAL_ENTITIES_RELEASE,entityCoverageRows,searchCanonicalEntities} from '../shared/canonical-entities';
import {CorpusValidationError,getCanonicalCorpusEvent,readCanonicalCorpus,upsertCanonicalCorpus} from './corpus-store';
import {EVIDENCE_FIRST_INGESTION_RELEASE,IngestionValidationError,normalizeEvidenceFirstNode} from '../shared/evidence-first-ingestion';
import {commitEvidenceFirstNode,dryRunEvidenceFirstCommit,EvidenceIngestionError,extractEvidenceFirstInput} from './evidence-ingestion';
import {lifeCoveragePayload,lifeScenePayload,lifeScenesPayload} from './life-scenes';
import {deleteGrowthData,getGrowthAdminStats,getGrowthState,GrowthValidationError,recordGrowthEvent,recordGrowthProgress,saveGrowthProfile} from './growth';
import {runMetaProbe,runMetaSync} from './meta/sync';import {buildMetaSyncBootstrap} from './meta/oauth-bridge';
import {readMetaHealth,readMetaProjectionRecords} from './meta/store';
import {sanitizeMetaError} from './meta/client';

type Locale='he'|'en'|'ru';
type Role='user'|'assistant';type Engine='INVESTIGATOR'|'EDUCATOR'|'CREATOR'|'ARCHITECT';
type ChatMessage={role?:unknown;content?:unknown};
type Field='name'|'northStar'|'reality'|'strength'|'barrier'|'firstProof';
type Profile=Record<Field,string>;
type CompanionState={profile:Profile;collecting:null;progress:number;turn:number;intent:string;focus:string;phase:'listen'|'answer'|'act'};
type CompanionMode='guide'|'reflect'|'build';type JourneyContext={visitedChapters:string[];resonances:Array<{chapter:string;choice?:string;text?:string}>;chosenDirection?:string;lastMeaningfulStep?:string;locale:Locale};
type CompanionBody={messages?:ChatMessage[];state?:unknown;locale?:unknown;context?:unknown;mode?:unknown;journeyContext?:unknown};
type Action={label:string;href:string;kind:'internal'|'external'|'mailto';note?:string};
type Checkpoint={title:string;items:string[]};type VoiceMode='igor-deep'|'7ya-neutral';type VoiceRegister='executive'|'creative'|'sensitive';type VoiceState={mode:VoiceMode;register:VoiceRegister;depthScore:number;verifiedLayers:string[];publicOnly:true;label:string;modelVersion:string};
type StoryPathNode={id:string;sectionId:string;label:string;year:string;summary:string;sourceUrl:string;trust:string};type StoryPath={title:string;basis:'CANON_ONLY';query:string;nodes:StoryPathNode[]};type StoryCompositionItem={id:string;canonicalId:string;sectionId:string;title:string;summary:string;year:string;sourceUrl:string;sourceLabel:string;trust:string;imageUrl:string;mediaKind:string};type StoryComposition={id:string;title:string;thesis:string;query:string;basis:'CANON_ONLY';items:StoryCompositionItem[]};type AgentReply={reply:string;intent:string;suggestions:string[];actions:Action[];spotlight:string;checkpoint:Checkpoint|null;provider:string;model:string};
type CreatorPathBody={locale?:unknown;kind?:unknown;outcome?:unknown;audience?:unknown;assets?:unknown;needs?:unknown;pace?:unknown;help?:unknown};type CreatorPackage={name:string;fit:string;scope:string[];min:number;max:number;billing:string;reason:string};type CreatorPlan={title:string;promise:string;firstProof:string;steps:string[];tools:{name:string;why:string}[];prompts:string[];risks:string[];igorConnection:string;freeIncludes:string[];package:CreatorPackage;mailSubject:string;mailBody:string};

const release='7ya-sovereign-recovery-20260905-v3-globalfix';// backend-route-rebind-20260904
const ADMIN_EMAILS=['igor.vepretski@gmail.com'];
const fields:Field[]=['name','northStar','reality','strength','barrier','firstProof'];
const emptyProfile:Profile={name:'',northStar:'',reality:'',strength:'',barrier:'',firstProof:''};
const clean=(value:unknown,max=1200)=>String(value??'').trim().slice(0,max);
const asObject=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'?value as Record<string,unknown>:{};const modeOf=(value:unknown,intent=''):CompanionMode=>value==='reflect'||value==='build'||value==='guide'?value:intent==='personal_goal'||intent==='personal_growth'?'build':'guide';function cleanJourneyContext(value:unknown,locale:Locale):JourneyContext{const raw=asObject(value);const visited=Array.isArray(raw.visitedChapters)?Array.from(new Set(raw.visitedChapters.map(item=>clean(item,80)).filter(Boolean))).slice(-12):[];const resonances=Array.isArray(raw.resonances)?raw.resonances.map(item=>{const row=asObject(item);return{chapter:clean(row.chapter,80),choice:clean(row.choice,180)||undefined,text:clean(row.text,500)||undefined}}).filter(item=>item.chapter).slice(-12):[];return{visitedChapters:visited,resonances,chosenDirection:clean(raw.chosenDirection,500)||undefined,lastMeaningfulStep:clean(raw.lastMeaningfulStep,500)||undefined,locale}}
const localeOf=(value:unknown):Locale=>value==='en'||value==='ru'?value:'he';

/* AppDeploy v97 backend source capture continues exactly from snapshot 1788809457536.
   The capture is intentionally archived under appdeploy-live/ and is not an active runtime root.
   Full exact content is verified against the provider snapshot before Phase C promotion. */

const publicProfile={name:'Igor Vepretski',aliases:['Igor Ido Vepretski','Igor Vepretski','Ido Vepretski','איגור ופרצקי','Игорь Вепрецкий','@igor.vepretski','@vepretski.igor','vepretski','#7YA','#7YA🥷'],positioning:'Public creator, social entrepreneur and systems builder. Founder of StartOn and 7YA.',arc:['Immigration and belonging','Public service and responsibility','Writing, music, social media and broadcast media','StartOn: technology, creation and belonging for youth','7YA: a public identity, evidence and action system'],languages:['Hebrew','English','Russian'],officialProfiles:['https://www.instagram.com/igor.vepretski/','https://www.instagram.com/vepretski.igor/','https://www.tiktok.com/@igor.vepretski','https://www.youtube.com/channel/UCyxk2AupRjm7KQ5EeWrV1Fw','https://www.facebook.com/vepretski7','https://www.linkedin.com/in/vepretski/'],evidencePolicy:'Use public sources, dated owner snapshots and explicit verification status. Never turn private material into public fact.'};

// NOTE: This file is a provenance capture artifact only. Remaining provider source is tracked by source-tree.json and capture completeness remains false until byte-identical archival verification completes.
