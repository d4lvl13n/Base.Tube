"""Measures how different the image prompts in ../jobs.json are.
Run: uv run python3 check_diversity.py   (after: node scripts/thumbnail-images.mjs export)"""
import json, re, itertools, collections
from pathlib import Path
jobs = json.loads((Path(__file__).parent.parent / 'jobs.json').read_text())
STOP = {'a','the','and','of','in','on','with','to','is','at','an','for','no','by'}
toks = lambda s: set(re.findall(r'[a-z]+', s.lower())) - STOP
jac = lambda a, b: len(a & b) / len(a | b)
pages = collections.defaultdict(list)
for j in jobs: pages[j['page']].append(j)
print('page | avg similarity inside page | most similar pair')
for p, L in pages.items():
    T = [toks(j['prompt']) for j in L]
    sims = [(jac(T[a], T[b]), a, b) for a, b in itertools.combinations(range(len(L)), 2)]
    mx = max(sims)
    print(f"{p:40} avg={sum(s for s,_,_ in sims)/len(sims):.2f} max={mx[0]:.2f} {L[mx[1]]['file']} ~ {L[mx[2]]['file']}")
txt = collections.Counter(m for j in jobs for m in re.findall(r'"([A-Z0-9][^"]{0,30})"', j['prompt']))
print('\non-image texts:', sum(txt.values()), 'distinct:', len(txt), 'repeated:', [(t, n) for t, n in txt.most_common(10) if n > 1])
print('no-text images:', sum('no text' in j['prompt'].lower() for j in jobs))
kinds = collections.Counter()
for j in jobs:
    s = j['prompt'].lower()
    if re.search(r'close-up|closeup|macro', s): kinds['close-up'] += 1
    elif re.search(r'split|before.and.after|before-after|versus|vs\b', s): kinds['split/centre'] += 1
    elif re.search(r'centre|center|centred|centered', s): kinds['split/centre'] += 1
    elif re.search(r'wide|top-down|overhead|low-angle|low angle|over-the-shoulder|aerial|bird', s): kinds['wide/angle'] += 1
    elif re.search(r'third', s): kinds['classic third'] += 1
    else: kinds['other'] += 1
print('framing:', dict(kinds))
