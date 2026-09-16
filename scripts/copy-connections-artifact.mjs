import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();const dist=path.join(root,'dist');
async function copy(source,target){const src=path.join(root,source);const dst=path.join(dist,target);const stat=await fs.lstat(src);if(stat.isSymbolicLink())throw new Error(`Refusing symlink: ${source}`);await fs.mkdir(path.dirname(dst),{recursive:true});if(stat.isDirectory())await fs.cp(src,dst,{recursive:true,dereference:false});else await fs.copyFile(src,dst)}
await copy('connections','connections');await copy('data/connections.json','data/connections.json');console.log('CONNECTIONS_ARTIFACT_COPY: PASS');
