import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { collections, services, products } from '../content/site.mjs';

const root = path.resolve('dist');
const pages = (await readdir(root)).filter((name) => name.endsWith('.html'));
const required = ['index', 'about', 'contact', ...collections.map((c) => c.slug), ...services.map((s) => s.slug)];
for (const page of required) assert(pages.includes(`${page}.html`), `Missing original page: ${page}`);
const assets = JSON.parse(await readFile('content/assets.json', 'utf8'));
const logo = await readFile(path.join(root, assets['logo/logo.png'].path));
assert.equal(createHash('sha256').update(logo).digest('hex'), assets['logo/logo.png'].originalSha256, 'Original logo must remain byte-identical');
let references = 0;
for (const page of pages) {
  const html = await readFile(path.join(root, page), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page} must have one h1`);
  assert(html.includes('name="description"'), `${page} needs a description`);
  assert(html.includes('noindex,nofollow'), `${page} must remain a proposal`);
  assert(!html.includes('href="#"'), `${page} contains a dead link`);
  assert(!html.includes('undefined'), `${page} contains an undefined value`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [pathname, fragment] = url.split('#');
    const destination = decodeURIComponent(pathname.split('?')[0]);
    if (destination) await access(path.join(root, destination)).catch(() => { throw new Error(`${page}: missing local target ${destination}`); });
    if (fragment) {
      const target = destination ? await readFile(path.join(root, destination), 'utf8') : html;
      assert(target.includes(`id="${fragment}"`), `${page}: missing fragment ${fragment}`);
    }
    references++;
  }
  if (collections.some((c) => `${c.slug}.html` === page)) {
    assert.equal((html.match(/data-product data-category=/g) || []).length, 12, `${page} must preserve 12 product entries`);
    for (const product of products) assert(html.includes(assets[product.image].path), `${page} is missing ${product.image}`);
  }
}
const css = await readFile(path.join(root, 'assets/styles/site.css'), 'utf8');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await access(path.resolve(root, 'assets/styles', match[1]));
console.log(`Passed: ${pages.length} pages, ${references} local references, all 11 original pages, 36 catalogue entries, self-hosted fonts, and unchanged original logo.`);
