"""Pick 4-5 real thumbnails per game from mid-sized creators (Monid/TikHub data in ../raw)."""
import json, re, subprocess, os
from pathlib import Path
RAW = Path(__file__).resolve().parent.parent / 'raw'
GAMES = {
  'fortnite': ['fortnite'], 'gta-6': ['gta-6', 'gta-5'], 'minecraft': ['minecraft'], 'roblox': ['roblox'],
  'gorilla-tag': ['gorilla-tag'], 'call-of-duty': ['cod-warzone', 'cod-bo', 'cod-mw4'], 'zelda-ocarina-of-time': ['zelda', 'zelda-2'],
}
OFFICIAL = re.compile(r'^fortnite|rockstar|^call of duty|nintendo|^roblox$|^minecraft$|^ign$|gamespot|playstation|xbox|gameranx|dexerto|fox 2|saturday night|gameclips|walkthrough', re.I)
SUB_MIN, SUB_MAX = 20_000, 2_000_000

def secs(l):
    try:
        s = 0
        for x in (l or '').split(':'): s = s * 60 + int(x)
        return s
    except ValueError:
        return 0

def parse_subs(t):
    m = re.match(r'([\d.]+)\s*([KM]?)', (t or '').replace(',', ''))
    if not m: return None
    return int(float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6}[m.group(2)])

def subs(cid):
    f = RAW / f'ch_{cid}.json'
    if not f.exists():
        subprocess.run(['monid', 'run', '-p', 'tikhub', '-e', '/api/v1/youtube/web_v2/get_channel_description',
                        '--query', json.dumps({'channel_id': cid, 'language_code': 'en', 'need_format': True}), '-w', '60', '-o', str(f)],
                       capture_output=True, env={**os.environ, 'NO_COLOR': '1'})
    try:
        txt = f.read_text()
        m = re.search(r'"subscriber_count":\s*"([^"]+)"', txt)
        return parse_subs(m.group(1)) if m else None
    except FileNotFoundError:
        return None

out = {}
for game, files in GAMES.items():
    # Interleave the searches (e.g. Warzone, Black Ops 7, MW4) so one source does not fill all 5 slots.
    per_file = []
    for fn in files:
        per_file.append([v for v in json.loads((RAW / f'{fn}.json').read_text())['videos']
                         if not OFFICIAL.search(v['author'] or '') and secs(v.get('video_length')) >= 120
                         and 3_000 <= (v['number_of_views'] or 0) <= 900_000])
    cands, seen = [], set()
    for row in zip(*[l + [None] * (30 - len(l)) for l in per_file]):
        for v in row:
            if v and v['channel_id'] not in seen:
                seen.add(v['channel_id']); cands.append(v)
    picked = []
    for v in cands:
        if len(picked) >= 5: break
        n = subs(v['channel_id'])
        if n and SUB_MIN <= n <= SUB_MAX:
            picked.append({'video_id': v['video_id'], 'title': v['title'], 'channel': v['author'], 'channel_id': v['channel_id'],
                           'subscribers': n, 'views': v['number_of_views'], 'published': v.get('published_time'),
                           'url': f"https://www.youtube.com/watch?v={v['video_id']}",
                           'thumbnail': f"https://i.ytimg.com/vi/{v['video_id']}/hqdefault.jpg",
                           'thumbnail_hd': f"https://i.ytimg.com/vi/{v['video_id']}/maxresdefault.jpg"})
    out[game] = picked
    print(game, len(picked), [(p['channel'], p['subscribers']) for p in picked])
(RAW.parent / 'refs.json').write_text(json.dumps(out, indent=2, ensure_ascii=False))
