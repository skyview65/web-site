import fs from 'node:fs';
import crypto from 'node:crypto';
const p = new URL('../index.html', import.meta.url).pathname;
let html = fs.readFileSync(p, 'utf8');

const hashes = [];
const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html))) {
  const a = m[1];
  if (/type\s*=\s*["']?(application\/json|application\/ld\+json)/i.test(a)) continue;
  if (/\ssrc\s*=/.test(a)) continue;
  const id = (a.match(/id\s*=\s*"([^"]+)"/) || [, '(no id)'])[1];
  const h = 'sha256-' + crypto.createHash('sha256').update(m[2], 'utf8').digest('base64');
  hashes.push(h);
  console.log(`  ${id.padEnd(24)} ${h}`);
}

const cspRe = /(<meta http-equiv="Content-Security-Policy" content="[^"]*?script-src 'self')([^;]*)(;)/;
const cm = html.match(cspRe);
if (!cm) throw new Error('CSP meta bulunamadi');
const before = cm[2].trim().split(/\s+/).filter(Boolean);
const after = hashes.map(h => `'${h}'`);
html = html.replace(cspRe, (_, a, __, c) => `${a} ${after.join(' ')}${c}`);
fs.writeFileSync(p, html);
console.log(`\nCSP script-src: ${before.length} eski hash -> ${after.length} yeni hash`);
