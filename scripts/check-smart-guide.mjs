import fs from 'node:fs';

const files = {
  widget: fs.readFileSync('scripts/7ya-signal-key-20260715.js', 'utf8'),
  style: fs.readFileSync('styles/7ya-signal-key-20260715.css', 'utf8'),
  guide: fs.readFileSync('ops/vercel-canonical-proxy/api/guide.js', 'utf8'),
  pagesGuide: fs.readFileSync('functions/api/guide.js', 'utf8'),
  proxy: fs.readFileSync('ops/vercel-canonical-proxy/api/proxy.js', 'utf8'),
  build: fs.readFileSync('scripts/build-static-site.mjs', 'utf8'),
  contract: fs.readFileSync('scripts/site-contract.mjs', 'utf8'),
  serviceWorker: fs.readFileSync('sw.js', 'utf8'),
};

const failures = [];
const requireText = (key, text, message) => {
  if (!files[key].includes(text)) failures.push(message);
};
const forbidText = (key, text, message) => {
  if (files[key].includes(text)) failures.push(message);
};

requireText('guide', 'https://integrate.api.nvidia.com/v1/chat/completions', 'NVIDIA NIM endpoint missing');
requireText('guide', "AI_PROVIDER_ORDER || 'nvidia,openai'", 'NVIDIA-first provider order missing');
requireText('guide', 'NVIDIA_API_KEY', 'NVIDIA API key environment contract missing');
requireText('guide', 'deterministic-evidence-guide', 'local evidence fallback missing');
requireText('guide', 'Retry-After', 'rate-limit response contract missing');
requireText('guide', 'message.length > 1600', 'message size cap missing');
forbidText('guide', 'nvapi-', 'hard-coded NVIDIA credential detected');
forbidText('guide', 'sk-', 'hard-coded provider credential detected');
requireText('pagesGuide', "external_runtime_dependency: false", 'Cloudflare guide must declare its independent runtime contract');
forbidText('pagesGuide', 'appdeploy.ai', 'Cloudflare guide still depends on AppDeploy');
requireText('pagesGuide', 'fallbackCreator', 'Cloudflare guide bridge missing in-chat creator continuity fallback');
requireText('pagesGuide', 'secrets_exposed: false', 'Cloudflare guide bridge missing public secret boundary');
requireText('pagesGuide', 'You are not Igor Vepretski', 'non-impersonation provider instruction missing');
requireText('pagesGuide', 'Jewish wisdom or the Zohar', 'transparent Zohar/Jewish-wisdom principle missing');
requireText('pagesGuide', "model: '7ya-continuity'", 'first-party deterministic fallback missing');
forbidText('pagesGuide', 'nvapi-', 'hard-coded NVIDIA credential detected in Cloudflare bridge');
forbidText('pagesGuide', 'sk-', 'hard-coded provider credential detected in Cloudflare bridge');

requireText('widget', "setAttribute('aria-expanded'", 'launcher accessibility state missing');
requireText('widget', "event.key === 'Escape'", 'keyboard close behavior missing');
requireText('widget', 'textContent', 'safe text rendering missing');
requireText('widget', "fetch('/api/guide'", 'guide API integration missing');
forbidText('widget', 'appdeploy.ai', 'public widget still embeds an AppDeploy transport');
requireText('widget', 'SPEAK WITH IGOR', 'Speak with Igor English label missing');
requireText('widget', 'ПОГОВОРИТЬ С ИГОРЕМ', 'Speak with Igor Russian label missing');
requireText('widget', 'تحدّث مع إيغور', 'Speak with Igor Arabic label missing');
requireText('widget', "experience: 'speak-with-igor'", 'single Speak with Igor experience contract missing');
requireText('widget', 'Zohar/Jewish wisdom', 'transparent wisdom-source disclosure missing');
requireText('widget', 'not live Igor', 'AI/non-impersonation disclosure missing');
requireText('widget', "window.addEventListener('7ya:creator-seed'", 'content-to-conversation bridge missing');
forbidText('widget', "creatorMode: 'create'", 'legacy create mode resurfaced in public chat');
forbidText('widget', "creatorMode: 'momentum'", 'legacy fulfil mode resurfaced in public chat');
forbidText('widget', "creatorMode: 'impact'", 'legacy impact mode resurfaced in public chat');
forbidText('widget', 'localStorage', 'public guide must not persist prompts in localStorage');
forbidText('widget', 'innerHTML', 'public guide must not render model output through innerHTML');

requireText('style', '@media(max-width:620px)', 'mobile layout contract missing');
requireText('style', 'prefers-reduced-motion', 'reduced-motion contract missing');
requireText('build', 'enhancePublicHtml', 'artifact-wide guide injection missing');
requireText('build', 'v=20260920-speak2', 'chat runtime cache-bust missing from artifact build');
requireText('serviceWorker', '7ya-shell-20260920-speak2', 'stale chat service-worker cache invalidation missing');
requireText('proxy', 'enhanceHtml', 'edge-wide guide injection missing');
requireText('contract', "'7ya-signal-key-20260715.css'", 'guide stylesheet absent from site contract');
requireText('contract', "'7ya-signal-key-20260715.js'", 'guide script absent from site contract');

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`SMART_GUIDE_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log('SMART_GUIDE_CONTRACT: PASS');
