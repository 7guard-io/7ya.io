import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/album/AlbumHome.tsx', import.meta.url), 'utf8');
const facebook = readFileSync(new URL('../src/FacebookStoryStream.tsx', import.meta.url), 'utf8');
const posts = readFileSync(new URL('../src/album/PostsMemoryUniverse.tsx', import.meta.url), 'utf8');
const broadcast = readFileSync(new URL('../src/album/BroadcastStream.tsx', import.meta.url), 'utf8');
const lifeMediaStrip = readFileSync(new URL('../src/album/LifeMediaStrip.tsx', import.meta.url), 'utf8');
const lifeMediaIdBlock = lifeMediaStrip.match(/const lifeMediaIds = \[([\s\S]*?)\] as const;/)?.[1] || '';
const lifeMediaIdCount = (lifeMediaIdBlock.match(/'/g) || []).length / 2;

const checks = [
    ['homepage includes the approved visible life media strip', source.includes("import LifeMediaStrip from './LifeMediaStrip';") && source.includes('{!isDeepAlbum && <LifeMediaStrip />}')],
    ['stage-only live visual probe is wired for pixel verification', source.includes("hostname.endsWith('.appdeploy.ai')") && source.includes("/api/visual-acceptance?path=home")],
    ['life media strip contains at least sixteen canonical moments', lifeMediaIdCount >= 16],
    ['LifeThroughline remains the canonical homepage backbone', source.includes('<LifeThroughline />')],
    ['owner Facebook archive is deep-album only', source.includes('{isDeepAlbum && <OwnerFacebookArchive />}')],
    ['Facebook stream switches between compact home and rich deep mode', source.includes("<FacebookStoryStream mode={isDeepAlbum ? 'media' : 'home'} />")],
    ['full Life Atlas is explicitly gated to the deep album', source.includes('{isDeepAlbum && (') && source.includes('<RichLifeTimeline context=\'album\' />')],
    ['post memory universe stays full in deep album and portal-only on home', source.includes("isDeepAlbum ? <PostsMemoryUniverse /> : <PostsMemoryUniverse mode='portal' />")],
    ['broadcast stays full in deep album and portal-only on home', source.includes("isDeepAlbum ? <BroadcastStream /> : <BroadcastStream mode='portal' />")],
    ['Facebook home stream is capped at four visible cards', facebook.includes(".slice(0, mode === 'home' ? 4 : 18)")],
    ['Posts Memory portal is capped at four story families', posts.includes(".slice(0,4)")],
    ['Broadcast portal is capped at four anchor scenes', broadcast.includes(".slice(0,4)")],
];

const failed = checks.filter(([, passed]) => !passed);
if (failed.length) {
    console.error('7YA homepage composition guard failed:');
    for (const [label] of failed) console.error(`- ${label}`);
    process.exit(1);
}

console.log('7YA homepage composition guard passed.');
