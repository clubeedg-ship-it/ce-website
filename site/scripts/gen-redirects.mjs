// Generates the legacy-redirect block inside public/.htaccess from redirects.tsv.
// Usage (from site/):  node scripts/gen-redirects.mjs
import fs from 'node:fs';

const rows = fs.readFileSync('redirects.tsv', 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.split('\t'));
const esc = (s) => s.replace(/[.+*?^${}()|[\]\\]/g, '\\$&');
const out = [];
for (const [from, to, kind] of rows) {
  const target = to === '/' ? '/' : '/' + to;
  if (kind === 'exact') out.push(`  RewriteRule ^${esc(from)}$ ${target} [R=301,L]`);
  else if (kind === 'prefix') out.push(`  RewriteRule ^${esc(from)} ${target} [R=301,L]`);
  else throw new Error('bad kind: ' + kind);
}
// Longer prefixes must win: Media/<n>/ lines come before the Media/ catch-all in the TSV order already.
const file = 'public/.htaccess';
let ht = fs.readFileSync(file, 'utf8');
ht = ht.replace(/(  # BEGIN legacy redirects \(generated\)\n)[\s\S]*?(  # END legacy redirects)/, `$1${out.join('\n')}\n$2`);
fs.writeFileSync(file, ht);
console.log(`wrote ${out.length} redirect rules`);
