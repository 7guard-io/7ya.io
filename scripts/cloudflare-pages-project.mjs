const API_ROOT = 'https://api.cloudflare.com/client/v4';

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || '7ya-io';
const sourceOwner = process.env.CLOUDFLARE_PAGES_SOURCE_OWNER || '7guard-io';
const sourceRepo = process.env.CLOUDFLARE_PAGES_SOURCE_REPO || '7ya.io';
const apply = process.argv.includes('--apply');
const deploy = process.argv.includes('--deploy');

if (!token) throw new Error('CLOUDFLARE_API_TOKEN is required');
if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID is required');

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    const details = payload ? JSON.stringify(payload) : `HTTP ${response.status}`;
    throw new Error(`Cloudflare API ${options.method || 'GET'} ${path} failed: ${details}`);
  }
  return payload?.result ?? payload;
}

const projectPath = `/accounts/${accountId}/pages/projects/${projectName}`;
let project = await request(projectPath);

if (project.name !== projectName) throw new Error(`Unexpected Pages project: ${project.name}`);
if (project.production_branch !== 'main') throw new Error(`Refusing project with production branch ${project.production_branch}`);
if (project.source?.type !== 'github') throw new Error(`Refusing non-GitHub Pages source: ${project.source?.type || 'missing'}`);

const source = project.source?.config || {};
if (source.owner && source.owner !== sourceOwner) throw new Error(`Unexpected GitHub owner: ${source.owner}`);
if (source.repo_name && source.repo_name !== sourceRepo) throw new Error(`Unexpected GitHub repository: ${source.repo_name}`);

const customDomains = (project.domains || []).filter(domain => !String(domain).endsWith('.pages.dev'));
const allowedCustomDomains = new Set(['7ya.io', 'www.7ya.io']);
const unexpectedDomains = customDomains.filter(domain => !allowedCustomDomains.has(String(domain).toLowerCase()));
if (unexpectedDomains.length) {
  throw new Error(`Refusing Pages deployment with unexpected custom domains attached: ${unexpectedDomains.join(', ')}`);
}

const desired = {
  build_command: 'npm run build:cloudflare',
  destination_dir: 'dist',
  build_caching: true,
};

console.log(JSON.stringify({
  mode: apply ? 'apply' : 'plan',
  project: projectName,
  production_branch: project.production_branch,
  source: { owner: source.owner, repo_name: source.repo_name },
  custom_domains: customDomains,
  current_build_config: project.build_config,
  desired_build_config: desired,
  dns_changed: false,
  custom_domain_changed: false,
}, null, 2));

if (apply) {
  project = await request(projectPath, {
    method: 'PATCH',
    body: JSON.stringify({ build_config: desired }),
  });
  for (const [key, value] of Object.entries(desired)) {
    if (project.build_config?.[key] !== value) {
      throw new Error(`Cloudflare Pages build_config verification failed for ${key}: expected ${value}, got ${project.build_config?.[key]}`);
    }
  }
  console.log('CLOUDFLARE_PAGES_CONFIG: PASS');
}

if (deploy) {
  if (!apply) throw new Error('--deploy requires --apply so the governed build configuration is verified first');
  const form = new FormData();
  form.append('branch', 'main');
  form.append('commit_dirty', 'false');
  if (process.env.GITHUB_SHA) form.append('commit_hash', process.env.GITHUB_SHA);
  form.append('commit_message', 'Governed full-site Cloudflare Pages deployment');

  const deployment = await request(`${projectPath}/deployments`, {
    method: 'POST',
    body: form,
  });

  if (!deployment?.id) throw new Error('Cloudflare did not return a deployment id');
  console.log(`CLOUDFLARE_PAGES_DEPLOYMENT_ID=${deployment.id}`);

  const deadline = Date.now() + 20 * 60 * 1000;
  let current = deployment;
  while (Date.now() < deadline) {
    current = await request(`${projectPath}/deployments/${deployment.id}`);
    const status = current.latest_stage?.status;
    const stage = current.latest_stage?.name;
    console.log(`CLOUDFLARE_PAGES_STAGE=${stage || 'unknown'} STATUS=${status || 'unknown'}`);
    if (status === 'success') {
      console.log(`CLOUDFLARE_PAGES_DEPLOYMENT_URL=${current.url}`);
      console.log('CLOUDFLARE_PAGES_DEPLOY: PASS');
      process.exit(0);
    }
    if (status === 'failure' || status === 'canceled') {
      throw new Error(`Cloudflare Pages deployment ended with status ${status} at stage ${stage}`);
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  throw new Error('Timed out waiting for Cloudflare Pages deployment');
}
