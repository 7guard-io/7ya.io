import { api } from '@appdeploy/client';
import type { CoreProjectionResponse, CoreRouteKey } from './core-types';

export async function getCoreProjection(route: CoreRouteKey, query = '') {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    const suffix = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/api/core/project/${route}${suffix}`);
    return response.data as CoreProjectionResponse;
}
