from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from research_sources import RESEARCH_SOURCES
import re, sys
root=Path(__file__).resolve().parent.parent
files=['index.html','story.html','device.html','journey.html','research.html','letters.html','contact.html']
class Parser(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.titles=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if t=='title':self.titles+=1
  for k in ('href','src'):
   if a.get(k):self.refs.append((t,k,a[k]))
parsed={f:Parser() for f in files}
for f,p in parsed.items():p.feed((root/f).read_text())
errors=[]
for f,p in parsed.items():
 if p.titles!=1:errors.append(f'{f}: title count {p.titles}')
 dup={x for x in p.ids if p.ids.count(x)>1}
 if dup:errors.append(f'{f}: duplicate ids {dup}')
 for tag,key,ref in p.refs:
  url=urlsplit(ref)
  if url.scheme or ref.startswith('//'):continue
  path=unquote(url.path)
  target=(root / (path or f)).resolve()
  if not target.is_relative_to(root): errors.append(f'{f}: unsafe path {ref}');continue
  if not target.exists():errors.append(f'{f}: missing {ref}');continue
  if url.fragment and target.suffix.lower()=='.html':
   rel=str(target.relative_to(root)); other=parsed.get(rel)
   if other and url.fragment not in other.ids:errors.append(f'{f}: missing anchor {ref}')
 print(f'{f}: {len(p.ids)} IDs, {len(p.refs)} local/external references')
for css in ['styles.css','site-enhancements.css','experience.css','research.css']:
 text=(root/css).read_text()
 for val in re.findall(r'url\([\'"]?([^\)\'\"]+)',text):
  if not (val.startswith('data:') or '://' in val or val.startswith('#')) and not (root/val).exists():errors.append(f'{css}: missing URL {val}')
print('CSS asset references checked')
research=parsed['research.html']
research_refs={ref for _,_,ref in research.refs}
if len(RESEARCH_SOURCES)!=6:errors.append(f'research.html: expected 6 sources, got {len(RESEARCH_SOURCES)}')
if len({item['number'] for item in RESEARCH_SOURCES})!=len(RESEARCH_SOURCES):errors.append('research.html: repeated source numbers')
for item in RESEARCH_SOURCES:
 if 'source-'+item['number'] not in research.ids:errors.append(f"research.html: missing source {item['number']}")
 for key in ('image','url'):
  if item[key] not in research_refs:errors.append(f"research.html: missing {key} for source {item['number']}")
 if item.get('original_url') and item['original_url'] not in research_refs:errors.append(f"research.html: missing original link for source {item['number']}")
print('Research source cards and links checked')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS: no duplicate IDs, broken local links, cross-page anchors, missing CSS assets or research references')
