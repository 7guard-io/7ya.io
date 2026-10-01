# Public projection only: keep private native exports outside the checkout.
import json,re,zipfile,hashlib,pathlib,collections,sys
root=pathlib.Path(__file__).resolve().parents[1];source=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'sources'
master=json.loads((root/'knowledge/master-public-record-20260918.json').read_text());existing=master['records']; records=list(existing);by_url={r['url']:r for r in records if r.get('url')}
social=json.loads((root/'knowledge/social-corpus-20260918.json').read_text())
for r in social['moments']:
 u=r.get('url')
 if not u: continue
 if u in by_url:
  x=by_url[u]
  for k in ['image','summary','theme','owned']:
   if r.get(k) is not None:x[k]=r[k]
 else:
  x=dict(r);x['year']=str(r.get('date',''))[:4] if re.match(r'^\d{4}',str(r.get('date'))) else ''; x['source_class']='curated-public'; records.append(x);by_url[u]=x
# Recover publicly available YouTube content from the native channel inventory.
video_map={}
def videoid(u):
 m=re.search(r'(?:youtu\.be/|[?&]v=|/shorts/|/embed/)([\w-]{11})',u or '');return m[1] if m else None
for r in records:
 v=videoid(r.get('url'))
 if v:video_map[v]=r
for name in ['youtube-channel.json','youtube-shorts.json','youtube-streams.json']:
 p=source/name
 if not p.exists() or not p.stat().st_size:continue
 d=json.loads(p.read_text())
 for r in d.get('entries',[]):
  if not r.get('id') or not r.get('title'):continue
  v=r['id'];u='https://www.youtube.com/watch?v='+v
  x=video_map.get(v)
  if x is None:
   x={'id':'YT-'+v,'url':u,'platform':'YouTube','publisher':'Igor Vepretski','date':None,'year':'','owned':True,'source_class':'public-channel-inventory','verification':'PUBLIC_CHANNEL_2026-10-01','metrics':{},'archive_only':False};records.append(x);video_map[v]=x
  x.update(title=r['title'],image='https://i.ytimg.com/vi/'+v+'/hqdefault.jpg',video_id=v,duration_seconds=r.get('duration'))
  if isinstance(r.get('view_count'),int):x.setdefault('metrics',{})['views']=r['view_count'];x['metrics_as_of']='2026-10-01'
resolved=source/'youtube-resolved.json'
if resolved.exists():
 for r in json.loads(resolved.read_text()):
  if 'error' in r:continue
  v=r['video_id'];x=video_map.get(v)
  if x:x.update({k:r[k] for k in ['title','image','video_id','owned']});x['availability_checked_at']='2026-10-01'
  else:records.append(r);video_map[v]=r
# TikTok export: only records explicitly public at export time. No signed downloads,
# cover tokens, private content, raw comments or personal account details are published.
z=zipfile.ZipFile(source/'TikTok_Data_1780381458.zip');body=z.read('TikTok/פוסטים/פוסטים.txt').decode('utf8');tiktok=[]
for block in re.split(r'\n\s*\n',body):
 fields=dict(line.split(': ',1) for line in block.splitlines() if ': ' in line)
 if fields.get('מי יכול לצפות')!='Everyone':continue
 date=fields.get('תאריך','').replace(' UTC',''); sound=fields.get('סאונד',''); title=fields.get('כותרת','')
 if title in ['','N/A']:title='TikTok · '+date[:10]
 tiktok.append({'id':'TT-EXPORT-'+hashlib.sha256(date.encode()).hexdigest()[:16],'title':title,'platform':'TikTok','publisher':'Igor Vepretski','date':date[:10],'year':date[:4],'chronology':date[:10].replace('-',''),'sound':sound,'metrics':{'likes_reactions':int(fields.get('לייק(ים)','0'))},'metrics_as_of':'2026-06-02','url':None,'owned':True,'archive_only':True,'source_class':'owner-export','verification':'PUBLIC_AT_EXPORT','availability':'source-recovery','summary':'תיעוד מייצוא החשבון; כתובת הפרסום המקורית טרם שוחזרה.'})
records.extend(tiktok)
# Stable dedupe by native video ID / exact public URL / export timestamp.
unique={}
for r in records:
 key=('yt:'+videoid(r.get('url'))) if videoid(r.get('url')) else ('url:'+r['url'].rstrip('/')) if r.get('url') else 'id:'+r['id']
 if key not in unique:unique[key]=r
 else:
  target=unique[key]
  for k,v in r.items():
   if v is not None and (not target.get(k) or k in ['image','video_id','availability_checked_at']):target[k]=v
records=[r for r in unique.values() if r.get('url') or r.get('verification')=='PUBLIC_AT_EXPORT']
for r in records:
 evidence=' '.join(str(r.get(k,'')) for k in ['relationship','object_type','verification']).lower()
 if 'external' in evidence:r['owned']=False
 elif r.get('source_class')=='public-channel-inventory' or r.get('verification')=='PUBLIC_AT_EXPORT':r['owned']=True
 elif r.get('owned') is not True:r['owned']=False
counts={'records':len(records),'public_urls':sum(bool(x.get('url')) for x in records),'visual_records':sum(bool(x.get('image')) for x in records),'tiktok_export_public':len(tiktok),'youtube_channel_inventory':len({r['id'] for name in ['youtube-channel.json','youtube-shorts.json','youtube-streams.json'] for r in json.loads((source/name).read_text()).get('entries',[]) if r.get('id') and r.get('title')}),'platforms':dict(collections.Counter(x.get('platform','Other') for x in records))}
archive={'schema_version':1,'updated_at':'2026-10-01','counts':counts,'coverage':{'TikTok':'755 public-at-export records; direct post URLs are pending recovery. Export ends 2026-05-17.','YouTube':'Public native videos, Shorts and streams inventoried on 2026-10-01.','Instagram':'Partial public and owner-insight evidence; no complete native export.','Facebook':'Partial public records; no complete native export.','LinkedIn':'Partial indexed public posts.','X_Threads_Telegram':'Account surfaces and selected records, incomplete historical coverage.'},'records':records}
dates_file=source/'youtube-dates.json'
if dates_file.exists():
 dates=json.loads(dates_file.read_text())
 for r in records:
  date=dates.get(r.get('video_id'))
  if date:r.update(date=date,year=date[:4],chronology=date.replace('-',''),date_source='public-youtube-publishDate-2026-10-01')
for i,v in enumerate(['fxFAUrb1h0M','kS2CRiqRaXo','AE5hDzLM5XU','NX5NHRfDNUQ','2HGMUN2jDwQ','jRjZjpqAgEw','SOx8DUXFIEw','xyNS6o07uEo','vgIdB58f8QA','0O3tpLwJg4Y','D8E876SaWpI','rQbAXagOZBU']):
 for r in records:
  if r.get('video_id')==v:r['homepage_rank']=i+1
archive['provenance']={'native_channel':'https://www.youtube.com/channel/UCyxk2AupRjm7KQ5EeWrV1Fw','youtube_checked_at':'2026-10-01','tiktok_export_file':'TikTok_Data_1780381458.zip','tiktok_export_sha256':hashlib.sha256((source/'TikTok_Data_1780381458.zip').read_bytes()).hexdigest(),'tiktok_visibility_filter':'Everyone','raw_exports_published':False,'rebuild':'python scripts/import-public-life-archive.py /path/to/private-source-directory'}
(root/'knowledge/public-life-archive-20261001.json').write_text(json.dumps(archive,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps(counts,ensure_ascii=False))
