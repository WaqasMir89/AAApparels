import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { company, services, collections, products, faqs } from '../content/site.mjs';

const assets = JSON.parse(await readFile(new URL('../content/assets.json', import.meta.url), 'utf8'));
const output = new URL('../dist/', import.meta.url);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const asset = (key) => {
  if (!assets[key]) throw new Error(`Missing original asset: ${key}`);
  return assets[key].path;
};
const img = (key, alt, className = '', eager = false, printable = false) => {
  const entry = assets[key];
  const printImage = printable && entry.printPath;
  return `<img src="${esc(printImage || asset(key))}" alt="${esc(alt)}" class="${esc(className)}" width="${printImage ? entry.printWidth : entry.width}" height="${printImage ? entry.printHeight : entry.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
};
const button = (href, label, type = '') => `<a class="button ${type}" href="${esc(href)}">${esc(label)}${arrow}</a>`;
const textLink = (href, label) => `<a class="text-link" href="${esc(href)}">${esc(label)}${arrow}</a>`;
const eyebrow = (text) => `<p class="eyebrow">${esc(text)}</p>`;
const titleLines = (title) => esc(title).replaceAll('\n', '<br>');
const active = (current, name) => current === name ? ' aria-current="page"' : '';
const logo = (className = 'brand') => `<a class="${className}" href="index.html" aria-label="Amna Ashraf Apparels — home">${img('logo/logo.png', 'Amna Ashraf Apparels', '', true)}</a>`;

function header(current) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap header-inner">
    ${logo()}
    <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation" data-navigation>
      <a href="index.html"${active(current, 'home')}>Home</a>
      <a href="about.html"${active(current, 'about')}>Our company</a>
      <a href="service.html"${active(current, 'services')}>Our expertise</a>
      <a href="productcatalogue.html"${active(current, 'catalogue')}>Product catalogue</a>
      <a href="contact.html"${active(current, 'contact')}>Contact</a>
    </nav>
    <a class="button header-contact" href="contact.html">Let’s talk${arrow}</a>
    <button class="menu-toggle" type="button" data-menu-toggle aria-controls="primary-navigation" aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
    <div class="footer-main"><div>${logo('footer-logo')}<p class="footer-description">Knitted apparel. Considered craftsmanship.<br>Made in Karachi, for brands around the world.</p></div>
      <div><p class="footer-title">Discover</p><div class="footer-links"><a href="about.html">Our company</a><a href="service.html">Our expertise</a><a href="productcatalogue.html">Product catalogue</a>${collections.map((c) => `<a href="${c.slug}.html">${esc(c.title)}</a>`).join('')}</div></div>
      <div><p class="footer-title">Our expertise</p><div class="footer-links">${services.map((s) => `<a href="${s.slug}.html">${esc(s.title)}</a>`).join('')}</div></div>
      <div><p class="footer-title">Start a conversation</p><div class="footer-links"><a href="mailto:${company.email}">${company.email}</a><a href="tel:${company.phoneLink}">${company.phone}</a><a href="${company.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp ${arrow}</a><a href="contact.html">${esc(company.address)}</a></div></div>
    </div><div class="footer-bottom"><span>© 2026 Amna Ashraf Apparels. Website concept.</span><span>Karachi, Pakistan <span aria-hidden="true">&nbsp; / &nbsp;</span> Established 1988</span></div>
  </div></footer>`;
}

const contactBand = () => `<div class="wrap"><section class="contact-band"><div>${eyebrow('Your next collection starts here')}<h2 class="heading">Let’s make something<br>worth wearing.</h2></div>${button('contact.html', 'Start a conversation')}</section></div>`;
const breadcrumbs = (title, parent) => `<ol class="breadcrumbs" aria-label="Breadcrumb"><li><a href="index.html">Home</a></li>${parent ? `<li><a href="${parent.href}">${esc(parent.title)}</a></li>` : ''}<li aria-current="page">${esc(title)}</li></ol>`;
const intro = (title, overline, description = '', parent, crumbTitle = title) => `<section class="page-intro wrap">${breadcrumbs(crumbTitle, parent)}${eyebrow(overline)}<h1 class="display">${titleLines(title)}</h1>${description ? `<p class="lead">${esc(description)}</p>` : ''}</section>`;

function layout(title, description, current, body, options = {}) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Amna Ashraf Apparels</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#222922"><meta property="og:title" content="${esc(title)} | Amna Ashraf Apparels"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:image" content="https://waqasmir89.github.io/AAApparels/${asset('service/Banner 5.jpg')}"><link rel="icon" type="image/png" href="${asset('icon/favicon.png')}"><link rel="stylesheet" href="assets/styles/site.css"><script src="assets/scripts/site.js" defer></script></head>
<body${options.print ? ' class="print-page"' : ''}>${header(current)}<main id="main">${body}</main>${options.noContact ? '' : contactBand()}${footer()}</body></html>`;
}

function collectionCard(collection, index) {
  return `<a class="collection reveal" href="${collection.slug}.html"><div class="collection-visual">${img(collection.image, `${collection.title} — original AA Apparels product photograph`)}<span class="collection-index">0${index + 1} / COLLECTION</span></div><div class="collection-caption"><div><h3>${esc(collection.title)}</h3><p>${esc(collection.eyebrow)}</p></div><span class="round-arrow" aria-hidden="true">↗</span></div></a>`;
}

const serviceRows = () => `<div class="service-rows">${services.map((s, index) => `<a href="${s.slug}.html" class="service-row"><span class="service-number">0${index + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.short)}</p></div>${arrow}</a>`).join('')}</div>`;
const faqList = () => `<div class="faq-list">${faqs.map(([q, a], index) => `<details><summary><span class="faq-index">0${index + 1}</span>${esc(q)}<span class="faq-plus" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div>`;

function home() {
  return layout('Thoughtfully made knitwear', 'Discover Amna Ashraf Apparels, a Karachi-based knitted garment manufacturer. Explore our services and original product collections.', 'home', `
  <section class="hero">${img('service/Banner 5.jpg', 'Garment production photograph from the AA Apparels website', 'hero-image', true)}<div class="wrap hero-content">${eyebrow('Made in Pakistan. Worn around the world.')}<h1 class="display">Amna Ashraf<br><em>Apparels.</em></h1><p>Thoughtfully made knitwear.<br>A manufacturing partner for your next collection.</p><div class="hero-actions">${button('productcatalogue.html', 'Explore our collections', 'light')}${textLink('about.html', 'Our story')}</div></div><div class="hero-bottom"><div class="wrap"><div class="hero-bottom-inner"><span>Independent spirit. International outlook.</span><span>Established 1988 · Karachi, Pakistan</span><a href="#introduction">Discover more <span aria-hidden="true">↓</span></a></div></div></div></section>
  <section id="introduction" class="wrap section intro reveal">${eyebrow('The company behind the craft')}<div><h2 class="heading">More than garments.<br>Long-standing partnerships.</h2><p class="lead">Family-owned since 1988, we bring fabric, fit and finishing together to make knitted apparel for brands across the world.</p>${textLink('about.html', 'Get to know us')}</div></section>
  <section class="product-section section"><div class="wrap"><div class="section-top reveal"><div>${eyebrow('The product edit')}<h2 class="heading">Made for everyday life.</h2></div><p>Explore our original collections.<br>Three audiences. The same attention to detail.</p></div><div class="collection-grid">${collections.map(collectionCard).join('')}</div><div class="section-foot">${textLink('productcatalogue.html', 'View the complete catalogue')}</div></div></section>
  <section class="wrap section"><div class="section-top reveal"><div>${eyebrow('From first sketch to final stitch')}<h2 class="heading">A connected approach<br>to making.</h2></div><p>Development, sourcing, colour, decoration and production. Expertise at every step.</p></div><div class="expertise-layout"><figure class="expertise-photo reveal">${img('about/about2.jpeg', 'Close-up of a sewing machine working with fabric')}<figcaption class="image-caption"><span>Precision in every detail</span><span>01 — 05</span></figcaption></figure>${serviceRows()}</div></section>
  <section class="feature-band section"><div class="wrap reveal">${eyebrow('A considered way of working')}<h2 class="heading">Care in the making.<br>Confidence in the partnership.</h2><div class="feature-columns"><div><h3>Quality, throughout.</h3><p>Attention to materials, construction and finishing, from the first sample to the final garment.</p></div><div><h3>Thoughtful sourcing.</h3><p>Fabrics selected with your product requirements and material priorities in mind.</p></div><div><h3>Working together.</h3><p>A collaborative approach that keeps your design intent at the heart of production.</p></div></div></div></section>
  <section class="wrap section faq-layout"><div class="reveal">${eyebrow('A good place to start')}<h2 class="heading">Your questions,<br>considered.</h2>${textLink('contact.html', 'Talk to our team')}</div>${faqList()}</section>`);
}

function about() {
  return layout('Our company', 'The story of Amna Ashraf Apparels, a family-owned knitted garment manufacturer established in Karachi in 1988.', 'about', `
  ${intro('A shared commitment\nto making well.', 'Our company / since 1988', 'Rooted in Karachi. Connected to the world. A family business built around the craft of garment making.', null, 'Our company')}
  <div class="wrap"><figure class="about-banner">${img('service/Banner 5.jpg', 'Garment production floor, as pictured on the original AA Apparels website', 'full-image', true)}<figcaption class="image-caption"><span>Amna Ashraf Apparels</span><span>Karachi, Pakistan</span></figcaption></figure></div>
  <section class="wrap section intro reveal">${eyebrow('Our story')}<div><h2 class="heading">Built on experience.<br>Always looking forward.</h2><p class="lead">Established in 1988, Amna Ashraf Apparels is a family-owned manufacturer and exporter of knitted garments based in Karachi, Pakistan.</p><div class="prose about-prose"><p>Our range spans T-shirts, polos, hoodies, babywear, uniforms, loungewear and custom knitted apparel. Across collections, we focus on the details that matter: comfortable fabrics, considered construction and a consistent finish.</p><p>From fabric sourcing through final shipment, our team coordinates the process around each customer’s requirements. Specialist mill and dye-house partnerships complement our in-house cutting, stitching and finishing operations.</p><p>We see manufacturing as a long-term partnership, built through clear communication, skilled work and attention to your brand’s needs.</p></div></div></section>
  <section class="product-section section"><div class="wrap story"><figure class="story-image reveal">${img('about/Abouti.png', 'Garment design workspace from the original company website')}<figcaption class="image-caption"><span>Ideas, materials, possibilities.</span></figcaption></figure><div class="story-copy reveal">${eyebrow('Your brand, thoughtfully made')}<h2 class="heading">A small detail.<br>A lasting difference.</h2><p>We help connect your creative brief with the materials, techniques and practical decisions that bring a garment together.</p><ul class="simple-list"><li><span>01</span>Product development guided by your brief</li><li><span>02</span>Coordinated sourcing and manufacturing</li><li><span>03</span>Finishing and packing for your market</li></ul>${textLink('service.html', 'Explore our expertise')}</div></div></section>`);
}

function servicesPage() {
  return layout('Our expertise', 'Explore garment development, fabric sourcing, dyeing, printing, embroidery, production and dispatch with AA Apparels.', 'services', `
  ${intro('From an idea.\nTo your next collection.', 'Our expertise', 'Five connected services. One considered approach to garment manufacturing.', null, 'Our expertise')}
  <section class="wrap service-overview">${services.map((s, index) => `<article class="service-feature reveal"><div class="service-feature-image">${img(s.thumbnail, `${s.title} imagery from the original website`)}</div><div class="service-feature-copy">${eyebrow(`0${index + 1} / Our expertise`)}<h2 class="heading">${esc(s.title)}</h2><p>${esc(s.intro)}</p>${textLink(`${s.slug}.html`, `Explore ${s.title.toLowerCase()}`)}</div></article>`).join('')}</section>`);
}

function servicePage(service) {
  return layout(service.title, service.intro, 'services', `
  ${intro(service.heading, service.title, service.intro, { href: 'service.html', title: 'Our expertise' }, service.title)}
  <section class="wrap service-detail"><figure class="service-detail-image">${img(service.image, `${service.title} photograph from the original AA Apparels website`, '', true)}</figure><div class="service-detail-copy"><div class="prose">${service.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div><ul class="simple-list">${service.points.map((p, i) => `<li><span>0${i + 1}</span>${esc(p)}</li>`).join('')}</ul>${button(`contact.html?product=${encodeURIComponent(service.title)}`, 'Discuss your requirements')}</div></section>
  <section class="wrap section"><div class="section-top"><div>${eyebrow('Continue exploring')}<h2 class="subheading">Expertise that works together.</h2></div></div><div class="related-services">${services.filter((s) => s.slug !== service.slug).map((s) => `<a href="${s.slug}.html"><span>${esc(s.title)}</span>${arrow}</a>`).join('')}</div></section>`);
}

function cataloguePage() {
  return layout('Product catalogue', 'Explore the original AA Apparels collections: men’s wear, ladies’ wear, and kids and teen apparel.', 'catalogue', `
  ${intro('Everyday pieces.\nEndless possibilities.', 'The product catalogue', 'Explore the original range of T-shirts, hoodies and crewnecks, then talk to us about the collection you have in mind.', null, 'Product catalogue')}
  <section class="wrap catalogue-collections"><div class="collection-grid">${collections.map(collectionCard).join('')}</div></section>
  <section class="wrap section"><div class="catalogue-note"><div>${eyebrow('Take a closer look')}<h2 class="subheading">The range, all in one place.</h2><p>A print-friendly overview of our T-shirts, hoodies and sweatshirts.</p></div>${button('catalogue-print.html', 'Open the printable catalogue', 'outline')}</div></section>`);
}

function productCard(product, collection, printable = false) {
  const label = `${collection ? collection.title + ' — ' : ''}${product.name} / ${product.reference}`;
  return `<article class="product-item" data-product data-category="${product.type}" data-search="${esc(`${product.name} ${product.category} ${product.reference} ${product.detail}`)}"><a class="product-photo" href="${asset(product.image)}" data-zoom data-caption="${esc(label)}" aria-label="Enlarge ${esc(label)}">${img(product.image, label, '', false, printable)}<span class="zoom-icon" aria-hidden="true">+</span></a><div class="product-meta"><div><h2>${esc(product.name)} <span class="muted">/ ${product.reference}</span></h2><p>${esc(product.detail)}</p></div>${printable ? '' : `<a href="contact.html?product=${encodeURIComponent(label)}" aria-label="Enquire about ${esc(label)}">↗</a>`}</div></article>`;
}

const lightbox = () => `<dialog class="lightbox" data-lightbox aria-labelledby="lightbox-title"><div class="lightbox-top"><p class="lightbox-title" id="lightbox-title" data-lightbox-title>Product photograph</p><button type="button" class="lightbox-close" data-lightbox-close aria-label="Close product photograph">×</button></div><img alt="" width="900" height="1000"></dialog>`;

function collectionPage(collection) {
  return layout(collection.title, collection.description, 'catalogue', `
  ${intro(collection.title, 'The product catalogue', collection.description, { href: 'productcatalogue.html', title: 'Collections' })}
  <section class="wrap catalogue-products" aria-label="${esc(collection.title)} products"><div class="catalogue-toolbar" data-enhanced-only hidden><div class="filter-list" role="group" aria-label="Filter by product type">${[['all', 'All products'], ['tshirts', 'T-shirts'], ['hoodies', 'Hoodies'], ['sweatshirts', 'Sweatshirts']].map(([value, label]) => `<button class="filter-button" type="button" data-filter="${value}" aria-pressed="${value === 'all'}">${label}</button>`).join('')}</div><label class="search-label"><span class="sr-only">Search products</span><input class="search-input" type="search" placeholder="Search the collection…" data-product-search></label></div><p class="product-count" data-product-count aria-live="polite">12 products</p><div class="product-grid" data-product-grid>${products.map((p) => productCard(p, collection)).join('')}</div><div class="empty-state" data-product-empty hidden><p>No products match your search.</p><button class="button outline" type="button" data-reset-filters>Clear filters ${arrow}</button></div><p class="catalogue-footnote">Explore the collection, then confirm sizing, fabric specifications and finishes with our team.</p></section>
  <section class="wrap section"><div class="section-top"><div>${eyebrow('More to explore')}<h2 class="subheading">Discover the other collections.</h2></div>${textLink('catalogue-print.html', 'Print the complete range')}</div><div class="related-services">${collections.filter((c) => c.slug !== collection.slug).map((c) => `<a href="${c.slug}.html"><span>${esc(c.title)}</span>${arrow}</a>`).join('')}</div></section>${lightbox()}`);
}

function contactPage() {
  return layout('Let’s talk', 'Contact Amna Ashraf Apparels in Karachi to discuss your apparel collection, product development and garment manufacturing requirements.', 'contact', `
  ${intro('Good things begin\nwith a conversation.', 'Contact us', 'A new collection, a specific service or an idea you would like to explore. We would love to hear about it.', null, 'Contact')}
  <section class="wrap section contact-grid"><div><div class="contact-detail"><h2>Email us</h2><a class="contact-email" href="mailto:${company.email}">${company.email}</a></div><div class="contact-detail"><h2>Call the office</h2><a href="tel:${company.phoneLink}">${company.phone}</a></div><div class="contact-detail"><h2>Mobile & WhatsApp</h2><a href="tel:${company.mobileLink}">${company.mobile}</a><p>${textLink(company.whatsapp, 'Continue on WhatsApp')}</p></div><div class="contact-detail"><h2>Find us in Karachi</h2><p>${esc(company.address)}</p>${textLink('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(company.address), 'View on Google Maps')}</div></div>
  <form class="contact-form" data-enquiry-form data-email="${company.email}" action="mailto:${company.email}" method="post" enctype="text/plain"><h2 class="subheading">Tell us what you have in mind.</h2><p class="form-note">Prepare your enquiry below, then open the draft in your email app to review and send.</p><div class="field-grid"><div class="field"><label for="name">Your name *</label><input id="name" name="name" autocomplete="name" required maxlength="100" placeholder="Full name"></div><div class="field"><label for="email">Email address *</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="180" placeholder="you@company.com"></div></div><div class="field-grid"><div class="field"><label for="company">Company / brand</label><input id="company" name="company" autocomplete="organization" maxlength="180" placeholder="Your company"></div><div class="field"><label for="product">Product or service</label><input id="product" name="product" maxlength="180" placeholder="e.g. T-shirts or garment development"></div></div><div class="field"><label for="message">Your brief *</label><textarea id="message" name="message" required maxlength="2500" placeholder="Tell us about your collection, quantities or production requirements…"></textarea></div><button class="button" type="submit">Prepare email enquiry ${arrow}</button><p class="form-status" data-form-status role="status"></p><a class="text-link" data-email-draft hidden>Open email draft ${arrow}</a><noscript><p class="form-note">You can also email your brief directly to <a href="mailto:${company.email}">${company.email}</a>.</p></noscript></form></section>`, { noContact: true });
}

function printCatalogue() {
  return layout('Printable product catalogue', 'A printable overview of the original AA Apparels T-shirt, hoodie and sweatshirt product range.', 'catalogue', `
  <section class="wrap page-intro">${breadcrumbs('Printable catalogue', { href: 'productcatalogue.html', title: 'Product catalogue' })}<div class="print-brand">${img('logo/logo.png', company.name)}</div>${eyebrow('The product catalogue')}<h1 class="heading">The original collection.</h1><p class="lead">T-shirts, hoodies and crewnecks.<br>Men’s wear · Ladies’ wear · Kids & teen</p><button type="button" class="button print-control" data-print data-enhanced-only hidden>Print / save as PDF ${arrow}</button><p class="print-contact">${company.email} · ${company.phone}<br>${esc(company.address)}</p></section><section class="wrap print-products">${['tshirts', 'hoodies', 'sweatshirts'].map((type) => `<div class="print-group"><h2 class="subheading">${products.find((p) => p.type === type).category}</h2><div class="product-grid">${products.filter((p) => p.type === type).map((p) => productCard(p, null, true)).join('')}</div></div>`).join('')}<p class="catalogue-footnote">Product photographs and range from aaapparels.com. This presentation catalogue arranges the original range for reference. Confirm all specifications with the team before production.</p></section>${lightbox()}`, { noContact: true, print: true });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../public/', import.meta.url), output, { recursive: true });
await mkdir(new URL('assets/styles/', output), { recursive: true });
await mkdir(new URL('assets/scripts/', output), { recursive: true });
await cp(new URL('../src/styles/site.css', import.meta.url), new URL('assets/styles/site.css', output));
await cp(new URL('../src/scripts/site.js', import.meta.url), new URL('assets/scripts/site.js', output));
const pages = {
  'index.html': home(),
  'about.html': about(),
  'service.html': servicesPage(),
  'productcatalogue.html': cataloguePage(),
  'contact.html': contactPage(),
  'catalogue-print.html': printCatalogue(),
  ...Object.fromEntries(services.map((s) => [`${s.slug}.html`, servicePage(s)])),
  ...Object.fromEntries(collections.map((c) => [`${c.slug}.html`, collectionPage(c)])),
  '404.html': layout('Page not found', 'Return to the AA Apparels homepage or explore the product catalogue.', '', `<section class="wrap not-found">${eyebrow('404 / Page not found')}<h1 class="heading">Let’s get you back<br>to the collection.</h1><p>This page could not be found.</p>${button('index.html', 'Return to the homepage')}</section>`, { noContact: true }),
};
for (const [filename, html] of Object.entries(pages)) await writeFile(new URL(filename, output), html);
await writeFile(new URL('.nojekyll', output), '');
await writeFile(new URL('robots.txt', output), 'User-agent: *\nDisallow: /\n');
await writeFile(new URL('pages.json', output), JSON.stringify(Object.keys(pages), null, 2));
console.log(`Built ${Object.keys(pages).length} static pages with ${Object.keys(assets).length} original image assets.`);
