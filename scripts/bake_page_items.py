"""Bake each catalog page's documents into one file so a page loads with a single request.
Run after any catalog rebuild: python3 scripts/bake_page_items.py"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / 'src/data/catalog'
shards = {p.stem: json.loads(p.read_text()) for p in (root / 'documents').glob('*.json')}
out_root = root / 'page-items'
total = 0
for kind in ('legacy', 'resources', 'repositories'):
    out = out_root / kind
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('*.json'): old.unlink()
    for page in (root / 'pages' / kind).glob('*.json'):
        ids = json.loads(page.read_text()).get('documentIds', [])
        items = []
        for i in ids:
            rec = shards.get(i[:2], {}).get(i)
            if rec is None: raise SystemExit(f'Missing static document {i} in {page}')
            items.append(rec)
        (out / page.name).write_text(json.dumps(items, separators=(',', ':'), ensure_ascii=False))
        total += 1
print('baked', total, 'pages')
