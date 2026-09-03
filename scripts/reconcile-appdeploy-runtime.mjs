import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const BASE_SNAPSHOT='1787823326631';
const SOURCE_EXTENSIONS=['.tsx','.ts','.jsx','.js'];
const listFiles=root=>!fs.existsSync(root)?[]:fs.readdirSync(root,{withFileTypes:true}).flatMap(entry=>{const target=path.join(root,entry.name);return entry.isDirectory()?listFiles(target):[target]});
const relativeSourcePath=(root,file)=>path.relative(root,file).replaceAll(path.sep,'/');
const resolveImport=(fromFile,specifier,available)=>{if(!specifier.startsWith('.'))return null;const base=path.posix.normalize(path.posix.join(path.posix.dirname(fromFile),specifier));const candidates=SOURCE_EXTENSIONS.map(extension=>base+extension).concat(SOURCE_EXTENSIONS.map(extension=>path.posix.join(base,'index'+extension)));return candidates.find(candidate=>available.has(candidate))||candidates[0]};
const importsFor=(file,source,available)=>[...fs.readFileSync(source,'utf8').matchAll(/from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map(match=>resolveImport(file,match[1]||match[2],available)).filter(Boolean);

export function runtimeSourceReport(root){
 const baseDirectory=path.join(root,BASE_SNAPSHOT);
 const manifest=JSON.parse(fs.readFileSync(path.join(baseDirectory,'CUTOVER-MANIFEST.json'),'utf8'));
 const baseFiles=listFiles(path.join(baseDirectory,'src')).map(file=>relativeSourcePath(baseDirectory,file));
 const available=new Set(baseFiles),queue=['src/App.tsx'],seen=new Set(),missing=new Set();
 while(queue.length){const file=queue.shift();if(seen.has(file))continue;seen.add(file);const source=path.join(baseDirectory,file);if(!fs.existsSync(source)){missing.add(file);continue}for(const imported of importsFor(file,source,available)){if(available.has(imported))queue.push(imported);else missing.add(imported)}}
 return {baseSnapshot:BASE_SNAPSHOT,deltas:[BASE_SNAPSHOT],files:manifest.delta_files.filter(file=>file.startsWith('src/')).sort(),missingImports:[...missing].sort()};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const report=runtimeSourceReport('appdeploy-live');console.log(JSON.stringify(report,null,2));if(report.missingImports.length){console.error('RUNTIME_SOURCE: INCOMPLETE ('+report.missingImports.length+' unresolved imports)');process.exitCode=1}else console.log('RUNTIME_SOURCE: PASS')}