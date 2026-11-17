#!/usr/bin/env python3
"""Rebuild the side drawer classes in src/data/navigation/menu.json from the class hub menus,
so the drawer always shows the same sections (Examinations, Holiday Packages, Notes...) as each class page."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
HUBS = ROOT / 'src/data/class-hubs'
MENU = ROOT / 'src/data/navigation/menu.json'
CLASS_FILES = {'Baby Class': 'baby', 'Middle Class': 'middle', 'Top Class': 'top',
  **{f'Primary {n}': f'p{i}' for i, n in enumerate(['One','Two','Three','Four','Five','Six','Seven'], 1)},
  **{f'Senior {n}': f's{i}' for i, n in enumerate(['One','Two','Three','Four','Five','Six'], 1)}}
SMALL = {'of', 'and', 'the'}
def title(s):
    return ' '.join(w.lower() if i and w.lower() in SMALL else w.capitalize() for i, w in enumerate(s.split()))
def branch(m):
    items = [{'label': i['label'], 'href': i['href']} for i in m.get('items', []) if i.get('href')]
    if items: return {'label': title(m['label']), 'href': '#', 'children': items}
    return {'label': title(m['label']), 'href': m.get('href') or '#'}
menu = json.loads(MENU.read_text())
for section in menu:
    for cls in section.get('children', []):
        f = HUBS / f"{CLASS_FILES.get(cls['label'], '')}.html.json"
        if CLASS_FILES.get(cls['label']) and f.exists():
            cls['children'] = [branch(m) for m in json.loads(f.read_text()).get('menus', [])]
MENU.write_text(json.dumps(menu, indent=2, ensure_ascii=False) + '\n')
print('side menu rebuilt from class hubs')
