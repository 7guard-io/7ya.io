import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mapVerificationState,
  projectCanonicalV2,
  projectPosts,
  projectCoverage,
  queryGraph,
  relatedNodes,
} from '../../../dist/packages/content-graph/src/index.js';

const L=(he,en,ru)=>({he,en,ru});
const source=(id,url,platform)=>({id,label:id,url,kind:'press',public:true,platform});
const events=[
  {id:'fatherhood-viral-2023',storyOrder:10,canonicalDate:'2023-02-20',datePrecision:'exact-day',dateBasis:'publication',type:'post',surfaces:['life','media','influence','archive'],title:L('אבא מושלם','Perfect father','Идеальный отец'),summary:L('סיפור','Story','История'),visibility:'public',verification:{state:'verified',note:'source linked'},sources:[source('fb-repost','https://facebook.example/post','Facebook')],media:[{kind:'image',sourceUrl:'https://publisher.example/story',authenticity:'publisher-source',label:'Publisher image',url:'https://img.example/father.jpg'}],metrics:[{metricType:'reactions',value:'4.1K',unit:'reactions',snapshotDate:'2026-06-08',sourceUrl:'https://facebook.example/post',platform:'Facebook',verification:'verified'}],impact:{state:'verified-signals',signals:['External amplification']},tags:['FATHERHOOD','VIRAL'],relatedEventIds:['starton-return-2022']},
  {id:'starton-return-2022',storyOrder:5,canonicalDate:'2022-05-13',datePrecision:'exact-day',dateBasis:'publication',type:'project',surfaces:['life','starton','media','archive'],title:L('StartOn','StartOn','StartOn'),summary:L('חזרה לשכונה','Return','Возвращение'),visibility:'public',verification:{state:'supported',note:'press + broadcast'},sources:[source('mynet','https://publisher.example/starton')],media:[],impact:{state:'verified-signals',signals:['Press coverage']},tags:['STARTON','YOUTH']},
  {id:'research-2026',storyOrder:20,canonicalDate:'2026-01-01',datePrecision:'year',dateBasis:'document',type:'research',surfaces:['research','archive'],title:L('מחקר','Research','Исследование'),summary:L('מסמך','Document','Документ'),visibility:'public',verification:{state:'owner-reported',note:'document exists; status bounded'},sources:[source('drive','https://drive.example/doc')],media:[],impact:{state:'not-scored',signals:[]},tags:['RESEARCH']},
  {id:'private-event',storyOrder:99,canonicalDate:'2026-01-02',datePrecision:'exact-day',dateBasis:'document',type:'post',surfaces:['archive'],title:L('פרטי','Private','Частное'),summary:L('לא ציבורי','Not public','Не публично'),visibility:'private',verification:{state:'verified',note:'private'},sources:[{id:'private',label:'private',url:'gdrive://private',kind:'owner-export',public:false}],media:[],impact:{state:'not-scored',signals:[]},tags:['PRIVATE']}
];

test('maps Canon v2 verification conservatively',()=>{
  assert.equal(mapVerificationState('verified'),'VERIFIED');
  assert.equal(mapVerificationState('supported'),'STRONGLY_INFERRED');
  assert.equal(mapVerificationState('inferred'),'STRONGLY_INFERRED');
  for(const state of ['owner-reported','unresolved','contradicted','quarantined'])assert.equal(mapVerificationState(state),'REQUIRES_CONFIRMATION');
});

test('projects only public canonical events and does not infer people from prose',()=>{
  const graph=projectCanonicalV2(events);
  assert.equal(graph.nodes.some(n=>n.id==='event:private-event'),false);
  assert.equal(graph.nodes.filter(n=>n.kind==='Post').length,1);
  assert.equal(graph.nodes.filter(n=>n.kind==='Project').length,1);
  assert.equal(graph.nodes.filter(n=>n.kind==='Research').length,1);
  assert.equal(graph.nodes.filter(n=>n.kind==='Metric').length,1);
  assert.equal(graph.nodes.filter(n=>n.kind==='Image').length,1);
  assert.equal(graph.nodes.some(n=>n.kind==='Person'),false);
  assert.equal(graph.edges.find(e=>e.type==='RELATED_TO'&&e.from==='event:fatherhood-viral-2023')?.to,'event:starton-return-2022');
});

test('deduplicates sources by canonical URL and creates stable ids',()=>{
  const duplicate={...events[0],id:'fatherhood-mirror',storyOrder:11,sources:[source('other-id','https://facebook.example/post','Facebook')],relatedEventIds:[]};
  const graph=projectCanonicalV2([...events,duplicate]);
  const sourceNodes=graph.nodes.filter(n=>n.kind==='Source'&&n.data.url==='https://facebook.example/post');
  assert.equal(sourceNodes.length,1);
  assert.match(sourceNodes[0].id,/^source:/);
});

test('queries primary content by type, year, topic, platform and truth status',()=>{
  const graph=projectCanonicalV2(events);
  assert.deepEqual(queryGraph(graph,{kind:'Post'}).map(n=>n.id),['event:fatherhood-viral-2023']);
  assert.deepEqual(queryGraph(graph,{year:2022,primaryOnly:true}).map(n=>n.id),['event:starton-return-2022']);
  assert.deepEqual(queryGraph(graph,{topic:'YOUTH',primaryOnly:true}).map(n=>n.id),['event:starton-return-2022']);
  assert.equal(queryGraph(graph,{platform:'Facebook',primaryOnly:true}).some(n=>n.id==='event:fatherhood-viral-2023'),true);
  assert.deepEqual(queryGraph(graph,{truthStatus:'REQUIRES_CONFIRMATION',primaryOnly:true}).map(n=>n.id),['event:research-2026']);
});

test('posts projection keeps metrics source-local and never emits aggregate reach',()=>{
  const posts=projectPosts(projectCanonicalV2(events));
  assert.equal(posts.length,1);
  assert.equal(posts[0].id,'event:fatherhood-viral-2023');
  assert.equal(posts[0].metrics.length,1);
  assert.equal(posts[0].metrics[0].platform,'Facebook');
  assert.equal(posts[0].metrics[0].sourceUrl,'https://facebook.example/post');
  assert.equal('aggregateReach' in posts[0],false);
});

test('relatedNodes traverses explicit edges only',()=>{
  const graph=projectCanonicalV2(events);
  assert.deepEqual(relatedNodes(graph,'event:fatherhood-viral-2023',{edgeTypes:['RELATED_TO']}).map(n=>n.id),['event:starton-return-2022']);
});

test('coverage distinguishes known, published, weak, unverified and missing domains',()=>{
  const coverage=projectCoverage(projectCanonicalV2(events),['Biography','Social','Research','Music']);
  const byDomain=Object.fromEntries(coverage.map(row=>[row.domain,row]));
  assert.equal(byDomain.Social.known,1);
  assert.equal(byDomain.Social.published,1);
  assert.equal(byDomain.Research.unverified,1);
  assert.equal(byDomain.Music.missing,true);
});
