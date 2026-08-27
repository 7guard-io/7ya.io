import fs from 'node:fs';

const files={
  bridge:'appdeploy-candidate/meta-ingestion-20260827/backend/meta/oauth-bridge.ts',
  sync:'appdeploy-candidate/meta-ingestion-20260827/backend/meta/sync.ts',
  patch:'appdeploy-candidate/meta-oauth-bridge-20260827/APPDEPLOY-PATCH.md',
  tests:'appdeploy-candidate/meta-ingestion-20260827/tests/oauth-bridge.test.ts',
};

for(const [name,path] of Object.entries(files)){
  if(!fs.existsSync(path))throw new Error(`Meta OAuth bridge ${name} missing: ${path}`);
}

const bridge=fs.readFileSync(files.bridge,'utf8');
const sync=fs.readFileSync(files.sync,'utf8');
const patch=fs.readFileSync(files.patch,'utf8');
const tests=fs.readFileSync(files.tests,'utf8');
const combined=[bridge,sync,patch,tests].join('\n');

for(const required of[
  'buildMetaOAuthBridge',
  "source:'facebook-oauth'",
  'oauthSelection?:MetaOAuthSelection|null',
  'instagram_basic',
  'instagram_manage_insights',
  'selectedMetaOAuth',
  'dedicated-meta-secrets',
]){
  if(!combined.includes(required))throw new Error(`Meta OAuth bridge anchor missing: ${required}`);
}

for(const forbidden of[
  /console\.log\([^)]*token/i,
  /JSON\.stringify\([^)]*pageAccessToken/i,
  /access_token=\$\{/i,
  /PAGE_SECRET_TOKEN[^'"`\s]/,
]){
  if(forbidden.test(combined))throw new Error(`Meta OAuth bridge forbidden pattern: ${forbidden}`);
}

if(!bridge.includes('import type'))throw new Error('Meta OAuth bridge must keep type dependencies runtime-pure');
if(!tests.includes("includes('PAGE_SECRET_TOKEN'),false"))throw new Error('Meta OAuth bridge secret-isolation assertion missing');

console.log('Meta OAuth bridge integrity: PASS');
