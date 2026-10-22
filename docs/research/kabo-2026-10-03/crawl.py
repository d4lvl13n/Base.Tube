import urllib.request, urllib.error, xml.etree.ElementTree as ET, json, csv, time, re, collections
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlparse
D=Path(__file__).parent
class Parser(HTMLParser):
 def __init__(self):
  super().__init__(); self.title=[];self.heads=[];self.links=[];self.meta={};self.canonical='';self.text=[];self.skip=0;self.active=None;self.buf=[];self.jld=[];self.js=False;self.jbuf=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ('script','style'):
   self.skip+=1
   if t=='script' and a.get('type')=='application/ld+json':self.js=True;self.jbuf=[]
  if t=='title' or t in ('h1','h2','h3'):self.active=t;self.buf=[]
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
 def handle_endtag(self,t):
  if self.active==t:
   v=' '.join(' '.join(self.buf).split())
   if t=='title':self.title.append(v)
   else:self.heads.append([t,v])
   self.active=None
  if t in ('script','style'):
   if self.js:
    try:self.jld.append(json.loads(''.join(self.jbuf)))
    except:pass
    self.js=False
   self.skip=max(0,self.skip-1)
 def handle_data(self,v):
  if self.js:self.jbuf.append(v)
  if self.active:self.buf.append(v)
  if not self.skip and v.strip():self.text.append(v.strip())
def fetch(u):
 start=time.time()
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'BaseTube-Research/1.0 (public sitemap audit)'})
  with urllib.request.urlopen(req,timeout=35) as r:body=r.read();status=r.status;final=r.url;headers=dict(r.headers)
  p=Parser();p.feed(body.decode('utf-8','replace'))
  types=[]
  def walk(x):
   if isinstance(x,dict):
    if '@type' in x:types.extend(x['@type'] if isinstance(x['@type'],list) else [x['@type']])
    for y in x.values():walk(y)
   elif isinstance(x,list):
    for y in x:walk(y)
  walk(p.jld)
  return {'url':u,'status':status,'final_url':final,'title':' '.join(p.title),'description':p.meta.get('description',''),'robots':p.meta.get('robots',''),'x_robots':headers.get('X-Robots-Tag',''),'canonical':p.canonical,'headings':p.heads,'schema_types':sorted(set(types)),'json_ld':p.jld,'text':'\n'.join(p.text),'links':sorted(set(urljoin(final,x) for x in p.links)),'bytes':len(body),'seconds':round(time.time()-start,2)}
 except urllib.error.HTTPError as e:return {'url':u,'status':e.code,'error':str(e)}
 except Exception as e:return {'url':u,'status':0,'error':str(e)}
if __name__=='__main__':
 urls=[x.text for x in ET.parse(D/'kabo-sitemap.xml').getroot().iter() if x.tag.endswith('loc')]
 out=[]
 with ThreadPoolExecutor(max_workers=6) as pool:
  jobs={pool.submit(fetch,u):u for u in urls}
  for f in as_completed(jobs):
   out.append(f.result())
   if len(out)%50==0:print('Fetched',len(out),'/',len(urls),flush=True)
 order={u:i for i,u in enumerate(urls)};out.sort(key=lambda x:order[x['url']]);(D/'kabo-crawl.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
 print('HTTP',dict(collections.Counter(x['status'] for x in out)),flush=True)
 for u in ['https://base.tube/sitemap.xml','https://base.tube/robots.txt','https://kabo.sh/robots.txt']:
  try:
   with urllib.request.urlopen(u,timeout=35) as r:(D/('base-sitemap.xml' if 'base.tube/sitemap' in u else 'base-robots.txt' if 'base.tube' in u else 'kabo-robots.txt')).write_bytes(r.read())
  except Exception as e:print(u,str(e),flush=True)
 if (D/'base-sitemap.xml').exists():
  bu=[x.text for x in ET.parse(D/'base-sitemap.xml').getroot().iter() if x.tag.endswith('loc')]
  with ThreadPoolExecutor(max_workers=4) as pool:base=list(pool.map(fetch,bu))
  (D/'base-crawl.json').write_text(json.dumps(base,ensure_ascii=False,indent=2)); print('Base',len(base),dict(collections.Counter(x['status'] for x in base)),flush=True)
