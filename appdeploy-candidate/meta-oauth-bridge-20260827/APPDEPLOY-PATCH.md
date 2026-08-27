# AppDeploy Patch — Existing Facebook OAuth → Meta Ingestion

Target runtime: AppDeploy app `697a008fddc309b142`, based on snapshot `1787830403675`.

This patch is intentionally source-only until the standing production release gate is opened. It reuses the already encrypted `social_oauth_tokens` Facebook Page token and selected Page metadata. No token value is copied into GitHub, logs, URLs, or public responses.

## 1. Import the bridge type

Add beside the existing Meta imports:

```ts
import type {MetaOAuthSelection} from './meta/oauth-bridge';
```

## 2. Preserve the actual granted Facebook scope

Change the candidate-set type from:

```ts
type FacebookCandidateSet={ownerUserId:string;ownerEmail:string;pages:FacebookPageCandidate[];createdAt:number;expiresAt:number};
```

to:

```ts
type FacebookCandidateSet={ownerUserId:string;ownerEmail:string;pages:FacebookPageCandidate[];scope:string;createdAt:number;expiresAt:number};
```

Change `saveFacebookCandidates` to accept `scope:string` and persist only the normalized granted permission names:

```ts
async function saveFacebookCandidates(ownerUserId:string,ownerEmail:string,rows:Array<Record<string,unknown>>,scope:string){
  // existing page/token encryption logic unchanged
  // persisted candidate-set record adds: scope
}
```

`selectFacebookPage` must use `set.scope`, not a hardcoded scope string, when calling `saveSocialToken`.

## 3. Request the read scopes needed for linked Instagram Professional ingestion

Facebook OAuth start scope becomes:

```text
public_profile,pages_show_list,pages_read_engagement,business_management,instagram_basic,instagram_manage_insights
```

No publishing, messaging, comment-management, ads, or write scopes are added.

## 4. Store the real granted scope after callback

After `/me/permissions`, continue requiring `pages_show_list` and `pages_read_engagement`. Build:

```ts
const grantedScope=[...granted].filter(Boolean).sort().join(' ');
```

and call:

```ts
await saveFacebookCandidates(verified.userId,verified.email,pageRows,grantedScope);
```

This means Instagram ingestion activates only if Meta actually granted `instagram_basic`; Insights activate only if `instagram_manage_insights` is present.

## 5. Resolve the selected OAuth Page into Meta runtime state

Add:

```ts
async function selectedMetaOAuth():Promise<MetaOAuthSelection|null>{
  const stored=await storedToken('facebook');
  if(!stored)return null;
  const meta=facebookTokenMeta(stored.accountHint);
  if(!meta.pageId||!stored.token)return null;
  return{
    pageId:meta.pageId,
    pageName:meta.pageName||'Facebook Page',
    pageAccessToken:stored.token,
    scope:stored.scope,
    instagramBusinessAccountId:meta.instagramBusinessAccountId||undefined,
    apiVersion:META_GRAPH_VERSION,
  };
}
```

The returned object is request-scope/server-memory only. Never serialize it.

## 6. Route probe/sync/cron through the existing OAuth selection

Admin probe:

```ts
runMetaProbe({persist:true,oauthSelection:await selectedMetaOAuth()})
```

Admin status:

```ts
runMetaProbe({persist:false,oauthSelection:await selectedMetaOAuth()})
```

Admin sync:

```ts
runMetaSync({dryRun:raw.dryRun===true,maxPagesPerAccount:...,oauthSelection:await selectedMetaOAuth()})
```

Hourly cron:

```ts
runMetaSync({dryRun:false,maxPagesPerAccount:2,oauthSelection:await selectedMetaOAuth()})
```

If no selected Facebook OAuth token exists, the Meta subsystem falls back to the dedicated `META_*` secret path. If neither exists, state remains `credential-required` and public projection remains populated from existing sources.

## 7. Required validation before production apply

1. Type/build validation of the AppDeploy draft.
2. OAuth bridge unit tests pass.
3. `GET /api/meta/admin/status?dryRun=1` stays secret-free.
4. Authenticated probe reports `source: facebook-oauth` when a stored Page exists.
5. Authenticated dry-run reports `writePerformed:false`.
6. First bounded live sync writes content; immediate second sync does not duplicate content IDs.
7. `/api/public-projection` remains populated with Meta provider failure injected.
8. `meta-sync-hourly` returns success/HTTP 200 and failure count remains zero.
9. Runtime QA: 0 frontend / 0 backend / 0 network ordinary-route errors.
10. Only after the production release gate is explicitly opened: apply, verify, export, update `CURRENT.json`, and merge the release receipt.
