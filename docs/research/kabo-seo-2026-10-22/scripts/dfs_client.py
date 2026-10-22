"""Thin wrapper around the blog-factory DataForSEO client (creds stay in ~/.blog-factory.env, never printed).
Logs the cost of every call to raw/costs.jsonl."""
import json, sys, time
from pathlib import Path
sys.path.insert(0, str(Path.home() / 'blog-factory/research/motion-invest-check'))
from dfs import post as _post  # noqa: E402

RAW = Path(__file__).resolve().parent.parent / 'raw'
RAW.mkdir(exist_ok=True)

def call(path, payload, save_as):
    res = _post(path, payload)
    (RAW / f'{save_as}.json').write_text(json.dumps(res, indent=1))
    with open(RAW / 'costs.jsonl', 'a') as f:
        f.write(json.dumps({'t': time.time(), 'path': path, 'save_as': save_as, 'cost': res.get('cost')}) + '\n')
    for t in res.get('tasks', []):
        if t.get('status_code') != 20000:
            print('TASK ERROR', save_as, t.get('status_code'), t.get('status_message'))
    return res
