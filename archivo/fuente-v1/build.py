#!/usr/bin/env python3
"""Arma las dos apps FLASHI: versión artifact (fragmento) y versión PWA instalable."""
import base64, json, os, shutil, time
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src'); FONTDIR = os.path.join(ROOT, 'fonts')
DIST = os.path.join(ROOT, 'dist-artifact')   # versiones para artifacts de Claude (no se publican en Pages)
PWA = os.path.dirname(ROOT)                  # la raíz del repo = lo que sirve GitHub Pages
VERSION = time.strftime('%Y%m%d%H%M%S')

def rd(p): return open(p, encoding='utf-8').read()
def font_css():
    out = []
    for fam, pkg, ws in [('Unbounded', 'unbounded', (500, 700, 800)), ('Manrope', 'manrope', (400, 500, 600, 700, 800))]:
        for w in ws:
            b = open(f'{FONTDIR}/{pkg}-latin-{w}-normal.woff2', 'rb').read()
            out.append("@font-face{font-family:%s;font-style:normal;font-weight:%d;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}" % (fam, w, base64.b64encode(b).decode()))
    return '\n'.join(out)

FONTS = font_css()
APPS = {
  'delivery': dict(title='FLASHI Delivery', short='FLASHI', display='fullscreen', css='delivery.css', js='delivery.js'),
  'eats': dict(title='FLASHI EATS', short='FLASHI EATS', display='standalone', css='eats.css', js='eats.js'),
}

def body(a):
    css = rd(f'{SRC}/core.css') + '\n' + rd(f'{SRC}/{a["css"]}')
    js = rd(f'{SRC}/core.js') + '\n' + rd(f'{SRC}/map.js') + '\n' + rd(f'{SRC}/{a["js"]}')
    return f'<style>\n{FONTS}\n</style>\n<style>\n{css}\n</style>\n<div id="device"></div>\n<script>\n{js}\n</script>\n'

os.makedirs(DIST, exist_ok=True)

FILES = ['./', './index.html']
for key, a in APPS.items():
    # 1) versión artifact: sin doctype/head (lo agrega la plataforma)
    open(f'{DIST}/flashi-{key}.html', 'w', encoding='utf-8').write(f'<title>{a["title"]}</title>\n' + body(a))
    # 2) versión PWA plana: todo en la raíz, nombres únicos por app
    head = f'''<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#060D09">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{a["short"]}">
<link rel="manifest" href="{key}.webmanifest">
<link rel="icon" href="{key}-192.png">
<link rel="apple-touch-icon" href="{key}-apple.png">
<title>{a["title"]}</title>
</head><body>
'''
    sw = "<script>if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});}</script>\n"
    open(f'{PWA}/{key}.html', 'w', encoding='utf-8').write(head + body(a) + sw + '</body></html>\n')
    man = dict(id=f'./{key}.html', name=a['title'], short_name=a['short'], start_url=f'./{key}.html', scope='./', display=a['display'],
               orientation='portrait', background_color='#060D09', theme_color='#060D09', lang='es',
               icons=[dict(src=f'{key}-192.png', sizes='192x192', type='image/png', purpose='any maskable'),
                      dict(src=f'{key}-512.png', sizes='512x512', type='image/png', purpose='any maskable')])
    open(f'{PWA}/{key}.webmanifest', 'w').write(json.dumps(man, ensure_ascii=False, indent=1))
    FILES += [f'./{key}.html', f'./{key}.webmanifest', f'./{key}-192.png', f'./{key}-512.png', f'./{key}-apple.png']

open(f'{PWA}/sw.js', 'w').write("""const C='flashi-%s';
const F=%s;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));});
""" % (VERSION, json.dumps(FILES)))
shutil.copy(f'{SRC}/landing.html', f'{PWA}/index.html')
shutil.copy(f'{SRC}/LEEME.txt', f'{PWA}/LEEME.txt')
print('ok', VERSION)
