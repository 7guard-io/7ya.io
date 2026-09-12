import { error, json, requireAdminEmailAllowlist, requireAuth, type RouterRoutes } from '@appdeploy/sdk';
import { CORE_ROUTES, type CoreRouteKey } from './types';
import { getComposition, getCoreRecord, refreshCoreFromLegacy, updateComposition, upsertCoreRecord } from './store';
import { projectCoreRoute } from './projection';

const ADMIN_EMAILS = ['igor.vepretski@gmail.com'];
const isRoute = (value: string): value is CoreRouteKey => CORE_ROUTES.includes(value as CoreRouteKey);
const bodyObject = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

export const coreRoutes: RouterRoutes = {
    'GET /api/core/project/:route': [async ({ params, query }) => {
        if (!isRoute(params.route)) return error('unknown Core route', 404);
        try {
            return json(await projectCoreRoute(params.route, { q: query.q, limit: Number(query.limit) || undefined }));
        } catch (reason) {
            console.error('Core projection unavailable', reason);
            return error('Core projection unavailable', 503);
        }
    }],
    'GET /api/core/records': [async ({ query }) => {
        try {
            const projection = await projectCoreRoute('archive', { q: query.q, limit: Number(query.limit) || 84 });
            return json({ release: projection.release, source: projection.source, count: projection.count, coreCount: projection.coreCount, records: projection.records });
        } catch (reason) {
            console.error('Core records unavailable', reason);
            return error('Core records unavailable', 503);
        }
    }],
    'GET /api/core/records/:id': [async ({ params }) => {
        try {
            const record = await getCoreRecord(params.id);
            return record ? json({ source: '7ya-core', record }) : error('Core record not found', 404);
        } catch (reason) {
            console.error('Core record unavailable', reason);
            return error('Core record unavailable', 503);
        }
    }],
    'GET /api/core/composition': [async () => {
        try {
            return json({ source: '7ya-core', composition: await getComposition() });
        } catch (reason) {
            console.error('Core composition unavailable', reason);
            return error('Core composition unavailable', 503);
        }
    }],
    'POST /api/core/admin/record': [requireAuth(), requireAdminEmailAllowlist(ADMIN_EMAILS), async ctx => {
        try {
            const body = bodyObject(ctx.body);
            return json({ ok: true, source: '7ya-core', updatedBy: ctx.user!.email || ctx.user!.userId, ...(await upsertCoreRecord(body.record || ctx.body)) });
        } catch (reason) {
            return error(reason instanceof Error ? reason.message : 'Core record update failed', 400);
        }
    }],
    'POST /api/core/admin/composition': [requireAuth(), requireAdminEmailAllowlist(ADMIN_EMAILS), async ctx => {
        try {
            const body = bodyObject(ctx.body);
            const route = String(body.route || '');
            if (!isRoute(route)) return error('unknown Core route', 400);
            const composition = await updateComposition(route, body.patch, ctx.user!.email || ctx.user!.userId);
            return json({ ok: true, source: '7ya-core', composition });
        } catch (reason) {
            return error(reason instanceof Error ? reason.message : 'Core composition update failed', 400);
        }
    }],
    'POST /api/core/admin/refresh': [requireAuth(), requireAdminEmailAllowlist(ADMIN_EMAILS), async ctx => {
        try {
            return json({ ok: true, source: '7ya-core', updatedBy: ctx.user!.email || ctx.user!.userId, ...(await refreshCoreFromLegacy()) });
        } catch (reason) {
            console.error('Core refresh failed', reason);
            return error('Core refresh failed', 503);
        }
    }]
};
