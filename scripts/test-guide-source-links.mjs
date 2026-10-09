import test from 'node:test';
import assert from 'node:assert/strict';

let isolate=0;
async function answer(body) {
  // Each case is a separate runtime isolate; do not share the spending limiter.
  const {onRequestPost}=await import(`../functions/api/guide.js?source-case=${isolate++}`);
  const request=new Request('https://7ya.io/api/guide',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'source-test'},body:JSON.stringify(body)});
  const response=await onRequestPost({request,env:{AI:{run:async()=>({response:'A useful source-grounded reply.'})}}});
  assert.equal(response.status,200);
  return response.json();
}

test('Hebrew via does not classify an agency sales question as Igor history',async()=>{
  const data=await answer({message:'איך אפשר למכור דרך סוכנויות?',locale:'he'});
  assert.deepEqual(data.links,[]);
});
const prompts={he:'מה אני יכול ללמוד מהדרך שלך?',en:'What can I learn from your path?',ru:'Чему я могу научиться у твоего пути?',ar:'ماذا يمكنني أن أتعلم من مسارك؟'};
for(const [locale,message] of Object.entries(prompts)) test(`${locale} built-in journey prompt returns clickable biography`,async()=>{
  const data=await answer({message,locale});
  assert.ok(data.links.some(link=>link.href==='/igor-vepretski/'));
  if(locale!=='he') assert.ok(data.links.every(link=>!/[\u0590-\u05ff]/.test(link.label)));
});
for(const [question,href] of [['Tell me about Igor','/igor-vepretski/'],['Tell me about StartOn','/starton/']]) test(`short follow-up retains ${href} source context`,async()=>{
  const data=await answer({message:'Tell me more',locale:'en',messages:[{role:'user',content:question},{role:'assistant',content:'Here is the documented background.'},{role:'user',content:'Tell me more'}]});
  assert.ok(data.links.some(link=>link.href===href));
});
test('new sales topic replaces previous Igor context for subsequent follow-up',async()=>{
  const data=await answer({message:'Tell me more',locale:'en',messages:[{role:'user',content:'Tell me about Igor'},{role:'assistant',content:'His documented journey.'},{role:'user',content:'How do I sell a service to agencies?'},{role:'assistant',content:'Choose one agency.'}]});
  assert.deepEqual(data.links,[]);
});
test('contextual questions preserve sources through an ordinary middle turn',async()=>{
  const data=await answer({message:'Tell me more',locale:'en',messages:[{role:'user',content:'Tell me about Igor'},{role:'assistant',content:'His public journey.'},{role:'user',content:'What happened after he moved?'},{role:'assistant',content:'The next documented chapter.'}]});
  assert.ok(data.links.some(link=>link.href==='/igor-vepretski/'));
  assert.equal(data.state.source_topic,'identity');
});
test('source state survives bounded history and clears on a new topic',async()=>{
  const state={source_topic:'identity'};
  const data=await answer({message:'What happened next?',locale:'en',state,messages:[{role:'user',content:'Tell me more'}]});
  assert.ok(data.links.some(link=>link.href==='/igor-vepretski/'));
  const changed=await answer({message:'How do I sell to agencies?',locale:'en',state});
  assert.deepEqual(changed.links,[]);
  assert.equal(changed.state.source_topic,null);
});
for(const [locale,message] of Object.entries({en:'I want to help youth — where do I start?',he:'אני רוצה לעזור לנוער — מאיפה מתחילים?',ar:'أريد مساعدة الشباب — من أين أبدأ؟'})) test(`${locale} youth-help prompt provides StartOn sources`,async()=>{
  const data=await answer({message,locale,path:'/starton/'});
  assert.ok(data.links.some(link=>link.href==='/starton/'));
});
test('all other StartOn-page prompts retain route context',async()=>{
  for(const message of ['How can technology become a human tool?','Help me design one small executable experiment']) {
    const data=await answer({message,locale:'en',path:'/en/starton/'});
    assert.ok(data.links.some(link=>link.href==='/starton/'));
  }
});
test('sales question with a pronoun clears source state even on StartOn',async()=>{
  const data=await answer({message:'How can I sell it to agencies?',locale:'en',path:'/starton/',state:{source_topic:'starton'}});
  assert.deepEqual(data.links,[]);
});
test('Russian contextual turn keeps public biography sources',async()=>{
  const data=await answer({message:'Что было после его переезда?',locale:'ru',messages:[{role:'user',content:'Расскажи об Игоре'}]});
  assert.ok(data.links.some(link=>link.href==='/igor-vepretski/'));
});
