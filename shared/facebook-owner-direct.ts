export function facebookOwnerOAuthScope(scopes:string[]):string{
  const seen=new Set<string>();
  const ordered:string[]=[];
  for(const raw of[...scopes,'user_posts']){
    const value=String(raw||'').trim();
    if(!value||seen.has(value))continue;
    seen.add(value);
    ordered.push(value);
  }
  return ordered.join(',');
}

export function isPublicFacebookOwnerPost(value:unknown):boolean{
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  const privacy=(value as Record<string,unknown>).privacy;
  if(!privacy||typeof privacy!=='object'||Array.isArray(privacy))return false;
  return String((privacy as Record<string,unknown>).value||'').toUpperCase()==='EVERYONE';
}
