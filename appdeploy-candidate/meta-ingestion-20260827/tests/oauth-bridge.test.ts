import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMetaOAuthBridge} from '../backend/meta/oauth-bridge.ts';

test('selected Facebook Page becomes the only allowlisted Meta account without exposing its token in the report',()=>{
  const result=buildMetaOAuthBridge({
    pageId:'123',
    pageName:'7YA',
    pageAccessToken:'PAGE_SECRET_TOKEN',
    scope:'pages_show_list pages_read_engagement instagram_basic instagram_manage_insights',
    instagramBusinessAccountId:'456',
    apiVersion:'v24.0',
  });
  assert.equal(result.config.allowedPageIds.has('123'),true);
  assert.equal(result.config.allowedInstagramIds.has('456'),true);
  assert.equal(result.discovery.resolvedPages[0].pageAccessToken,'PAGE_SECRET_TOKEN');
  assert.deepEqual(result.discovery.report.grantedPermissions,['instagram_basic','instagram_manage_insights','pages_read_engagement','pages_show_list']);
  assert.equal(JSON.stringify(result.discovery.report).includes('PAGE_SECRET_TOKEN'),false);
  assert.equal(result.discovery.report.allowedPageCount,1);
  assert.equal(result.discovery.report.allowedInstagramCount,1);
});

test('selected Facebook Page without linked Instagram stays Facebook-only',()=>{
  const result=buildMetaOAuthBridge({pageId:'123',pageName:'7YA',pageAccessToken:'TOKEN',scope:'pages_read_engagement',apiVersion:'v24.0'});
  assert.equal(result.discovery.report.linkedInstagramCount,0);
  assert.equal(result.discovery.resolvedPages[0].instagram,undefined);
});
