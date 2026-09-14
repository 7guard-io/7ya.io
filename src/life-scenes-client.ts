import {api} from '@appdeploy/client';
import type {LifeScene,SceneCoverageSummary,SceneLens} from '../shared/life-scenes';
export type LifeScenesResponse={release:string;generatedAt:string;lens:SceneLens;count:number;total:number;coverage:SceneCoverageSummary;scenes:LifeScene[]};
export async function fetchLifeScenes(lens:SceneLens,limit=50):Promise<LifeScenesResponse>{const bounded=Math.max(1,Math.min(200,Math.floor(limit)||50));const response=await api.get('/api/life-scenes?lens='+encodeURIComponent(lens)+'&limit='+bounded);const data=response.data as Partial<LifeScenesResponse>|null;if(!data||typeof data.release!=='string'||!Array.isArray(data.scenes)||!data.coverage)throw new Error('life scenes unavailable');return data as LifeScenesResponse}
