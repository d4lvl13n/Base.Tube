import json,csv,re,collections,xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse
D=Path(__file__).parent
A=json.loads((D/'kabo-crawl.json').read_text());B=json.loads((D/'base-crawl.json').read_text())
# SVG <title> is not the HTML document title. Repair the initial parser's concatenation.
for arr in [A,B]:
 for x in arr:
  x['title']=re.split(r'(?<=· Kabo) |(?<=\| Base.Tube) ',x.get('title',''),maxsplit=1)[0]
(D/'kabo-crawl.json').write_text(json.dumps(A,ensure_ascii=False,indent=2));(D/'base-crawl.json').write_text(json.dumps(B,ensure_ascii=False,indent=2))
entries={n.find('{*}loc').text:n.findtext('{*}lastmod','') for n in ET.parse(D/'kabo-sitemap.xml').getroot()}
def family(x):
 s=urlparse(x['url']).path.strip('/').split('/')
 if s[0]=='creators':return 'Classement' if 'top' in s else 'Profil createur' if len(s)==3 else 'Hub createurs'
 if s[0]=='tools':return 'Outil' if len(s)>1 and s[1] not in ['youtube','instagram','tiktok'] else 'Hub outils'
 if s[0]=='guides':return 'Guide' if len(s)>1 else 'Hub guides'
 if s[0]=='trending':return 'Tendances' if len(s)>1 and s[1] not in ('youtube','instagram') else 'Hub tendances'
 return 'Institutionnel'
exact={'youtube-thumbnail-preview':'/tools/youtube-thumbnail-preview','youtube-thumbnail-resizer':'/tools/youtube-thumbnail-resizer','youtube-channel-audit':'/youtube-channel-audit'}
p1tools={'youtube-title-generator','youtube-transcript-generator','similar-youtube-channels','youtube-video-ideas-generator'}
p2tools={'youtube-video-analyzer','youtube-0-views','youtube-description-generator','youtube-tag-generator','youtube-hashtag-generator','youtube-script-generator','youtube-channel-id-finder','youtube-thumbnail-downloader','youtube-keyword-generator','youtube-content-generator','social-media-content-calendar-template','youtube-engagement-rate-calculator'}
p1guides={'why-did-my-youtube-views-drop','what-viral-videos-have-in-common','can-ai-analyze-videos','youtube-script-template','turn-one-video-into-a-content-series','how-long-should-a-video-hook-be','which-videos-gained-the-most-followers'}
p2guides={'youtube-reused-content-policy','can-faceless-youtube-channels-be-monetized','youtube-banner-size-safe-area','youtube-handle-vs-channel-id','social-media-content-calendar-example-week','how-to-use-sound-as-a-video-hook','intentional-imperfection-in-content','how-much-to-charge-for-a-brand-deal','what-to-say-when-a-brand-asks-your-rate','how-to-tell-if-a-brand-collaboration-is-legit','plan-a-month-of-content-with-claude-and-notion','how-much-does-ai-video-editing-cost','ai-video-editing-prompts','what-counts-toward-4000-watch-hours-on-youtube','how-to-check-if-a-youtube-channel-is-monetized'}
partial={'youtube-channel-flagged-as-ai-content':'/blog/ai-generated-content-sparks-platform-ban-wave-what','youtube-views-vs-engaged-views':'/blog/how-many-views-to-earn-100k-youtube-2026'}
rows=[]
for x in A:
 f=family(x);s=urlparse(x['url']).path.strip('/').split('/');slug=s[-1];plat=s[1] if len(s)>1 and s[1] in ('youtube','instagram','tiktok','all') else 'transversal'
 if f=='Outil':
  plat='youtube' if slug.startswith(('youtube','similar-youtube','best-time-to-post-youtube')) else 'instagram' if 'instagram' in slug else 'tiktok' if 'tiktok' in slug else 'transversal'
  status='Equivalent public existant' if slug in exact else 'Pas d equivalent dans le sitemap Base.tube'
  target=exact.get(slug,'/tools/'+slug);priority='Existant' if slug in exact else 'P1' if slug in p1tools else 'P2' if slug in p2tools else 'P3'
  source='Navigateur local' if slug in exact and 'audit' not in slug else 'TikHub/Monid + analyse ou logique metier; verifier par outil'
 elif f=='Guide':
  status='Recouvrement partiel; pas de guide equivalent' if slug in partial else 'Pas de guide equivalent dans les 12 articles du sitemap'
  target=partial.get(slug,'/blog/'+slug);priority='P1' if slug in p1guides else 'P2' if slug in p2guides or slug in partial else 'P3';source='Sources primaires + exemples originaux; donnees seulement si utiles'
 elif f=='Profil createur':
  status='Famille absente';target=('/creators/youtube/'+slug) if plat=='youtube' else 'Extension future multi-plateforme';priority='P1 pilote YouTube' if plat=='youtube' else 'P3';source='Identite + videos + snapshots; analyse packaging originale'
 elif f=='Classement':
  status='Famille absente';target='/creators/'+('/'.join(s[1:])) if plat=='youtube' else 'Extension future';priority='P2 selection de niches' if plat=='youtube' else 'P3';source='Reutilisation du corpus; pays declares ou taxonomie documentee'
 elif f=='Tendances':
  status='Famille absente';target='/'+('/'.join(s));priority='P1' if slug=='youtube-outlier-videos' else 'P2' if 'youtube' in slug else 'P3';source='Corpus videos + snapshots comparables; fenetres explicites'
 elif f.startswith('Hub'):
  status='Hub existant' if f in ('Hub outils','Hub guides') else 'Famille absente';target='/tools' if f=='Hub outils' else '/blog' if f=='Hub guides' else '/'+('/'.join(s));priority='P2';source='Agregation et maillage interne'
 else:
  status='Hors comparaison contenu SEO';target='';priority='Hors scope';source='Produit et pages institutionnelles'
 rows.append({'url':x['url'],'famille':f,'plateforme':plat,'slug':slug,'title':x['title'],'h1':next((v for t,v in x['headings'] if t=='h1'),''),'description':x.get('description',''),'http_status':x['status'],'canonical':x.get('canonical',''),'robots':x.get('robots',''),'lastmod_sitemap':entries[x['url']],'schema_types':', '.join(x['schema_types']),'etat_base_tube':status,'equivalent_ou_route_proposee':target,'priorite_proposee':priority,'donnees_necessaires':source,'scope':'Lecture HTML et comparaison de sitemap; fonction outil non testee'})
with (D/'inventaire-kabo-500.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
for name,fam in [('outils-69.csv','Outil'),('guides-38.csv','Guide')]:
 with (D/name).open('w',newline='',encoding='utf-8-sig') as f:w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(x for x in rows if x['famille']==fam)
with (D/'inventaire-base-27.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.DictWriter(f,fieldnames=['url','title','h1','description','http_status','canonical','robots']);w.writeheader();w.writerows({'url':x['url'],'title':x['title'],'h1':next((v for t,v in x['headings'] if t=='h1'),''),'description':x.get('description',''),'http_status':x['status'],'canonical':x.get('canonical',''),'robots':x.get('robots','')} for x in B)
(D/'inventory.json').write_text(json.dumps(rows,ensure_ascii=False))
print(dict(collections.Counter(x['famille'] for x in rows)));print('Tools equivalent',sum(x['famille']=='Outil' and x['priorite_proposee']=='Existant' for x in rows))
