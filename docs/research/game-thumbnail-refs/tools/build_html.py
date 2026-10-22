"""Builds ../review.html from ../refs.json: real gaming thumbnails with checkboxes to approve each style."""
import json, html
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
refs = json.loads((ROOT / 'refs.json').read_text())
NAMES = {'fortnite': 'Fortnite', 'gta-6': 'GTA 6 / GTA 5', 'minecraft': 'Minecraft', 'roblox': 'Roblox',
         'gorilla-tag': 'Gorilla Tag', 'call-of-duty': 'Call of Duty (Warzone, Black Ops 7, MW4)', 'zelda-ocarina-of-time': 'Zelda: Ocarina of Time'}

def fmt(n):
    return f'{n/1e6:.1f} M' if n >= 1e6 else f'{round(n/1e3)} k'

sections = []
for game, items in refs.items():
    cards = []
    for it in items:
        key = f"{game}:{it['video_id']}"
        cards.append(f'''
      <article class="card" data-key="{key}">
        <a href="{it['url']}" target="_blank" rel="noopener" class="img">
          <img src="{it.get('local') or it['thumbnail_hd']}" alt="" loading="lazy">
        </a>
        <div class="meta">
          <div class="ch">{html.escape(it['channel'])} <span>{fmt(it['subscribers'])} abonnés</span></div>
          <div class="t">{html.escape(it['title'])}</div>
          <div class="v">{fmt(it['views'])} vues · {html.escape(it.get('published') or '')}</div>
        </div>
        <div class="vote">
          <label class="yes"><input type="radio" name="{key}" value="oui"> On garde ce style</label>
          <label class="no"><input type="radio" name="{key}" value="non"> Non</label>
        </div>
        <textarea placeholder="Note (facultatif) : ce qui plaît ou pas…"></textarea>
      </article>''')
    sections.append(f'''
  <section id="{game}">
    <h2>{NAMES.get(game, game)} <small>{len(items)} thumbnails</small></h2>
    <div class="grid">{''.join(cards)}
    </div>
  </section>''')

page = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Styles de thumbnails gaming à valider</title>
<style>
  :root {{ color-scheme: dark; }}
  body {{ margin:0; font:15px/1.45 system-ui,-apple-system,sans-serif; background:#0d0d10; color:#eee; }}
  header {{ position:sticky; top:0; z-index:5; background:#0d0d10ee; backdrop-filter:blur(8px); border-bottom:1px solid #222; padding:14px 24px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; }}
  header h1 {{ font-size:18px; margin:0; }}
  header nav a {{ color:#ff8a3d; margin-right:12px; text-decoration:none; font-size:13px; }}
  .count {{ margin-left:auto; font-size:13px; color:#aaa; }}
  button {{ background:#ff7a1a; color:#000; border:0; border-radius:8px; padding:8px 14px; font-weight:700; cursor:pointer; }}
  main {{ padding:8px 24px 80px; max-width:1500px; margin:auto; }}
  .intro {{ color:#aaa; max-width:820px; }}
  h2 {{ margin:36px 0 14px; }} h2 small {{ color:#888; font-weight:400; font-size:14px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; }}
  .card {{ background:#16161b; border:2px solid #23232a; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }}
  .card.oui {{ border-color:#2ecc71; }} .card.non {{ border-color:#e74c3c; opacity:.55; }}
  .img {{ display:block; aspect-ratio:16/9; background:#000; }} .img img {{ width:100%; height:100%; object-fit:cover; display:block; }}
  .meta {{ padding:10px 12px 4px; }} .ch {{ font-weight:700; }} .ch span {{ color:#888; font-weight:400; font-size:13px; }}
  .t {{ font-size:13px; color:#ccc; margin-top:2px; }} .v {{ font-size:12px; color:#777; margin-top:2px; }}
  .vote {{ display:flex; gap:8px; padding:8px 12px; }}
  .vote label {{ flex:1; border:1px solid #333; border-radius:8px; padding:7px 8px; font-size:13px; cursor:pointer; text-align:center; }}
  .vote input {{ margin-right:4px; }}
  .card.oui .yes {{ background:#1d3b2a; border-color:#2ecc71; }} .card.non .no {{ background:#3b1d1d; border-color:#e74c3c; }}
  textarea {{ margin:0 12px 12px; background:#0f0f13; color:#ddd; border:1px solid #2a2a31; border-radius:8px; min-height:38px; padding:6px 8px; font:inherit; font-size:13px; resize:vertical; }}
  #out {{ width:100%; min-height:120px; margin-top:12px; display:none; }}
</style></head><body>
<header>
  <h1>Thumbnails gaming réelles : quels styles on garde ?</h1>
  <nav>{''.join(f'<a href="#{g}">{NAMES[g].split(" (")[0]}</a>' for g in refs)}</nav>
  <span class="count" id="count"></span>
  <button id="export">Copier mes choix</button>
</header>
<main>
  <p class="intro">35 vraies thumbnails, 5 par jeu, chacune d'un créateur différent, tous entre 20 000 et 2 millions d'abonnés (pas de géants).
  Vidéos publiées ce mois-ci, récupérées le 22 octobre 2026 via Monid / TikHub. Cliquez sur une image pour ouvrir la vidéo.
  Vos choix sont gardés dans ce navigateur ; « Copier mes choix » les met dans le presse-papiers pour me les coller.</p>
  {''.join(sections)}
  <textarea id="out" readonly></textarea>
</main>
<script>
const KEY='gaming-thumb-review-v1';
const state=JSON.parse(localStorage.getItem(KEY)||'{{}}');
const cards=[...document.querySelectorAll('.card')];
function paint(){{
  let oui=0,non=0;
  cards.forEach(c=>{{const s=state[c.dataset.key]||{{}}; c.classList.toggle('oui',s.v==='oui'); c.classList.toggle('non',s.v==='non'); if(s.v==='oui')oui++; if(s.v==='non')non++;}});
  document.getElementById('count').textContent=`${{oui}} gardées · ${{non}} refusées · ${{cards.length-oui-non}} à voir`;
}}
cards.forEach(c=>{{
  const k=c.dataset.key, s=state[k]||{{}};
  c.querySelectorAll('input').forEach(i=>{{ if(i.value===s.v) i.checked=true; i.addEventListener('change',()=>{{state[k]={{...state[k],v:i.value}}; localStorage.setItem(KEY,JSON.stringify(state)); paint();}}); }});
  const t=c.querySelector('textarea'); t.value=s.note||''; t.addEventListener('input',()=>{{state[k]={{...state[k],note:t.value}}; localStorage.setItem(KEY,JSON.stringify(state));}});
}});
document.getElementById('export').onclick=async()=>{{
  const rows=cards.map(c=>{{const s=state[c.dataset.key]||{{}}; return `${{c.dataset.key}} | ${{s.v||'?'}} | ${{c.querySelector('.ch').firstChild.textContent.trim()}} | ${{(s.note||'').replace(/\\n/g,' ')}}`;}});
  const txt=rows.join('\\n'); const out=document.getElementById('out'); out.style.display='block'; out.value=txt;
  try{{ await navigator.clipboard.writeText(txt); document.getElementById('export').textContent='Copié ✓'; }}catch(e){{ out.select(); }}
}};
paint();
</script>
</body></html>'''
(ROOT / 'review.html').write_text(page)
print('written', ROOT / 'review.html')
