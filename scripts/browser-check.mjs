import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { startServer } from './serve.mjs';

const directory = 'output/playwright';
await mkdir(directory, { recursive: true });
const server = await startServer({ port: 0 });
const origin = `http://127.0.0.1:${server.address().port}`;
const executablePath = process.argv.find((arg) => arg.startsWith('--browser='))?.slice('--browser='.length);
let browser;
const results = { pages: [], interactions: [], accessibility: [], screenshots: [], errors: [] };

try {
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', (error) => results.errors.push(error.message));
  page.on('console', (entry) => { if (entry.type() === 'error') results.errors.push(entry.text()); });
  const filenames = JSON.parse(await readFile('dist/pages.json', 'utf8'));
  const samplePages = ['index.html', 'about.html', 'service.html', 'dyeing.html', 'productcatalogue.html', 'mens.html', 'contact.html', 'catalogue-print.html'];

  for (const filename of filenames) {
    const response = await page.goto(`${origin}/${filename}`);
    assert.equal(response.status(), 200, filename);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('h1').waitFor();
    const diagnostics = await page.evaluate(async () => {
      await Promise.all([...document.images].filter((image) => image.hasAttribute('src')).map(async (image) => {
        image.loading = 'eager';
        try { await image.decode(); } catch { /* Report in broken below. */ }
      }));
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: [...document.images].filter((image) => image.hasAttribute('src') && !image.naturalWidth).map((image) => image.src),
      };
    });
    assert.equal(diagnostics.overflow, false, `Desktop overflow: ${filename}`);
    assert.deepEqual(diagnostics.broken, [], `Broken images: ${filename}`);
    if (samplePages.includes(filename)) {
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      results.accessibility.push({ page: filename, violations: audit.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })) });
      if (audit.violations.length) {
        await writeFile(`${directory}/accessibility-failure.json`, JSON.stringify(audit.violations, null, 2));
        await page.screenshot({ path: `${directory}/failure.png`, fullPage: true });
      }
      assert.equal(audit.violations.length, 0, `${filename}: ${JSON.stringify(results.accessibility.at(-1))}`);
      const file = `${directory}/${filename.replace('.html', '')}-desktop.png`;
      await page.screenshot({ path: file, fullPage: true });
      results.screenshots.push(file);
    }
    results.pages.push({ page: filename, viewport: '1440px', status: 'passed' });
    console.log(`Desktop passed: ${filename}`);
  }

  await page.goto(`${origin}/mens.html`);
  await page.getByRole('button', { name: 'Hoodies', exact: true }).click();
  assert.equal(await page.locator('[data-product]:visible').count(), 4);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('no-matching-product');
  assert.equal(await page.locator('[data-product]:visible').count(), 0);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  assert.equal(await page.locator('[data-product]:visible').count(), 12);
  const firstPhoto = page.locator('[data-zoom]').first();
  await firstPhoto.click();
  assert(await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  assert(!(await page.getByRole('dialog').isVisible()));
  assert(await firstPhoto.evaluate((element) => document.activeElement === element));
  results.interactions.push('Product filtering, search, empty state, reset, image enlargement, Escape and focus restoration');

  await page.goto(`${origin}/contact.html?product=${encodeURIComponent('Cotton T-shirt / 01')}`);
  assert.equal(await page.locator('#product').inputValue(), 'Cotton T-shirt / 01');
  await page.locator('#name').fill('Presentation Review');
  await page.locator('#email').fill('review@example.com');
  await page.locator('#company').fill('A & B');
  await page.locator('#message').fill('Test draft only. Quantity: 100 & sample review.');
  await page.getByRole('button', { name: 'Prepare email enquiry' }).click();
  const emailHref = await page.locator('[data-email-draft]').getAttribute('href');
  assert(emailHref.startsWith('mailto:info@aaapparels.com?'));
  assert(decodeURIComponent(emailHref).includes('Company: A & B'));
  assert((await page.locator('[data-form-status]').innerText()).includes('Nothing has been sent'));
  results.interactions.push('Enquiry prefill, validated draft composition, encoded mailto link; no message sent');

  await page.goto(`${origin}/index.html`);
  const faq = page.locator('.faq-list details').first();
  await faq.locator('summary').click();
  assert(await faq.getAttribute('open') !== null);
  results.interactions.push('Native FAQ disclosure');

  await page.setViewportSize({ width: 390, height: 844 });
  for (const filename of filenames) {
    await page.goto(`${origin}/${filename}`);
    await page.evaluate(() => document.fonts.ready);
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `Mobile overflow: ${filename}`);
    if (['index.html', 'mens.html', 'contact.html'].includes(filename)) {
      await page.evaluate(async () => {
        await Promise.all([...document.images].filter((image) => image.hasAttribute('src')).map(async (image) => { image.loading = 'eager'; await image.decode(); }));
      });
      const file = `${directory}/${filename.replace('.html', '')}-mobile.png`;
      await page.screenshot({ path: file, fullPage: true });
      results.screenshots.push(file);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.equal(audit.violations.length, 0, `Mobile accessibility: ${filename}: ${audit.violations.map((v) => v.id)}`);
      results.accessibility.push({ page: filename, viewport: '390px', violations: [] });
    }
    results.pages.push({ page: filename, viewport: '390px', status: 'passed' });
    console.log(`Mobile passed: ${filename}`);
  }
  await page.goto(`${origin}/index.html`);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Product catalogue', exact: true }).click();
  await page.waitForURL('**/productcatalogue.html');
  results.interactions.push('Mobile navigation open, Escape, focus return and page navigation');

  await page.setViewportSize({ width: 768, height: 1024 });
  for (const filename of ['index.html', 'mens.html', 'contact.html', 'dyeing.html']) {
    await page.goto(`${origin}/${filename}`);
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `Tablet overflow: ${filename}`);
    results.pages.push({ page: filename, viewport: '768px', status: 'passed' });
  }

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallbackPage = await noJS.newPage();
  await fallbackPage.goto(`${origin}/mens.html`);
  assert.equal(await fallbackPage.locator('[data-product]').count(), 12);
  assert(await fallbackPage.getByRole('navigation', { name: 'Main navigation' }).isVisible());
  await fallbackPage.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Our company' }).click();
  await fallbackPage.waitForURL('**/about.html');
  results.interactions.push('Mobile navigation and complete catalogue without JavaScript');
  await noJS.close();

  await page.goto(`${origin}/catalogue-print.html`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((image) => image.hasAttribute('src')).map(async (image) => { image.loading = 'eager'; await image.decode(); }));
  });
  await page.pdf({ path: `${directory}/catalogue-preview.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  results.interactions.push('Print-ready catalogue rendered as PDF');
  const missing = await context.request.get(`${origin}/missing-page`);
  assert.equal(missing.status(), 404);
  assert((await missing.text()).includes('Page not found'));
  assert.deepEqual(results.errors, [], 'Browser console or page errors');
  console.log(`Passed ${results.pages.length} viewport checks, ${results.accessibility.length} accessibility audits and ${results.interactions.length} interaction groups.`);
} catch (error) {
  results.failure = error.stack;
  throw error;
} finally {
  await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2));
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
