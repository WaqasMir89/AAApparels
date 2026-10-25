# AA Apparels — static website redesign

Prepared: 24 October 2026.

## Outcome

Create a polished, responsive, multi-page presentation website for AA Apparels,
using the content, original logo, product photographs, and catalogues published
at https://www.aaapparels.com/. Preserve every discoverable public content page.
Deliver the source in a public GitHub repository. This first version is a static
client presentation; operational business features follow only after a contract.

Implementation is authorized. No additional design approval is required.

## Evidence and current status

- The project directory initially contained no application source or assets.
- The original site is PHP-based; this presentation uses generated static HTML.
- Initial browsing attempts failed. A GitHub Actions inventory subsequently
  captured 23 HTML URLs representing 11 distinct pages, and 53 linked assets.
- GitHub access is verified through the CLI as `WaqasMir89`. The public repository
  https://github.com/WaqasMir89/AAApparels has been created on branch `main`.
- The page and asset inventory has been reviewed. `docs/PAGE_MAP.md` records all
  original pages, duplicate routes, broken source links and content corrections.
- All 40 raster source images have local assets. The original logo is unchanged.
  No PDF catalogue was linked from the source; a printable presentation catalogue
  has been assembled from the original product range.

## Requirements and acceptance

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| R1 | Preserve every public original content page | Reviewed source-to-new-URL map, including nested product pages and linked documents; no unaccounted pages |
| R2 | Preserve the original brand marks | Downloaded original files with source URLs and hashes; visual comparison |
| R3 | Include original products, pictures, and catalogues | Local assets, product-to-image mapping, working catalogue downloads, no substituted product photography |
| R4 | Deliver a professional visual makeover | Reviewed desktop/mobile screenshots; consistent typography, spacing, image treatment, navigation, and page hierarchy |
| R5 | Make the entire presentation navigable | Real static pages, usable menus, breadcrumbs where helpful, category navigation, working anchors and contact links |
| R6 | Keep presentation behavior truthful | No fake enquiry-success messages, invented customers, capacity figures, certifications, prices, or availability |
| R7 | Create a public GitHub repository | Verified owner, public visibility, pushed commit, reproducible build instructions |
| R8 | Support future implementation | Separate content, page templates, presentation styles, and small browser enhancements; document backend integration points |

## Visual direction

**Visual thesis:** a contemporary garment manufacturer presented with warm ivory,
deep charcoal, restrained copper accents, generous whitespace, and large original
product and production photography. Preserve original logo colors and proportions;
adapt the surrounding palette if the retrieved mark requires it.

**Content plan:** a photograph-led introduction; concise company positioning;
editorial product-category index; manufacturing/story detail grounded in source
content; catalogue access; a clear final contact action. Supporting pages receive
their own compositions rather than repeating the homepage hero.

**Interaction thesis:** a short, staggered hero entrance; subtle section reveals;
precise image/link hover transitions. Respect reduced-motion preferences. The
content and navigation must remain available without JavaScript.

Use no more than two font families. Favor open layouts and clear dividers over
generic rounded-card grids. No placeholder logos, synthetic factory photographs,
or guessed product specifications in the client presentation.

## Architecture

Use a small static generator that emits ordinary HTML pages and local assets.
Shared header/footer and page templates keep navigation consistent. Structured
content files own company facts, category/product entries, contact information,
and the legacy URL map. Browser JavaScript only adds progressive enhancement.

Prefer a dependency-light implementation. A runtime framework, PHP server,
database, authentication service, or headless CMS is unnecessary for this phase.
Revisit this when contracted workflows establish backend requirements.

Proposed directories:

```text
content/                 reviewed page and product data
src/templates/           shared layout and page templates
src/styles/              design tokens and responsive styles
src/scripts/             accessible navigation and optional filters
public/assets/images/    original logo and optimized original photographs
public/assets/fonts/     self-hosted fonts and licenses
scripts/                 source inventory, build, checks
docs/                    page map, provenance, verification, handoff
dist/                    generated static presentation, ignored in Git
```

`source-audit/` is a local research archive and is excluded from Git. Only
reviewed public content and intended presentation assets enter the public repo.
Original third-party brand assets retain their owners' rights; do not apply an
open-source license to them automatically.

## Delivery slices

### 1. Capture and reconcile original content — R1, R2, R3, R6

Run `python3 scripts/inventory_source.py` once network access works, or inspect a
user-provided local export. The importer follows same-origin HTML links, records
images/stylesheets/linked documents, saves public responses, hashes assets, and
reports errors. It performs GET requests only and never submits forms.

Review the result manually in a browser. Inspect navigation, footer links,
category/detail links, pagination, JavaScript-driven links, CSS background images,
and catalogues. The importer is a starting inventory, not proof of completeness.
Map all public pages in `docs/page-map.md` and all reused assets in a provenance
manifest. Fix failed downloads or explicitly record inaccessible source items.

**Exit:** the page map and required assets are available. If source access fails,
pause content-dependent implementation and obtain a local export or restored
access. Do not silently replace missing assets or categories.

### 2. Build the shared system and homepage — R2, R4, R5, R8

Implement the design tokens, responsive header/navigation, footer, semantic page
layout, and homepage using the captured brand assets. Keep image focal points
deliberate; export efficient derivatives while retaining original files.

**Checks:** representative desktop and mobile screenshots; keyboard navigation;
visible focus; reduced motion; no horizontal overflow; no JavaScript dependency
for primary links or page content.

### 3. Build every supporting page and catalogue — R1, R3, R5, R6

Use the reviewed page map to implement company, capability, product, contact, and
other original sections as discovered. Include all source product images with
accurate captions and useful alt text. Provide working original catalogue links
and a well-organized on-site product catalogue. If no downloadable original
catalogue exists, do not invent a download; create a clearly identified new
presentation catalogue from verified products if useful.

For enquiries, use verified email/telephone links or a form that explicitly
prepares an email draft. Never imply that a static form has sent a message.

**Checks:** source page parity, product/image matching, download validity, links,
empty filter results if filters are included, and form behavior if present.

### 4. Review the complete presentation — R1–R6

Build the complete output and check all internal links and referenced assets.
Review every page at desktop width, with representative pages at 390px and 768px.
Inspect menus, focus handling, forms, image enlargement, filters, and downloads
where present. Check headings, contrast, page titles, descriptions, favicon,
image dimensions, loading behavior, and browser errors.

**Exit:** no missing source pages, broken assets, dead controls, fabricated facts,
or unresolved visual defects. Record exact performed checks separately from
remaining real-device or stakeholder review.

### 5. Publish the public source repository — R7, R8

Verify GitHub identity and ensure the chosen repository name does not collide
with an existing project. Proposed name: `AAApparels` under the verified account.
Inspect staged files for secrets, private files, research archives, caches,
generated output, and unnecessary binaries before the first public push.

Add a concise README with local development/build commands, static scope, source
attribution, and future integration boundaries. Verify repository visibility,
remote URL, branch, and remote commit after pushing. A public preview via GitHub
Pages can accompany the source repository if available; keep it identified as a
proposal and avoid changing the original site's domain.

**Failure/recovery:** retry only after determining whether repository creation or
push succeeded. Revert a static release to the previous commit if needed. No
production data or original PHP installation is changed in this phase.

## Later phase, after contract

Specify real enquiries/CRM delivery, catalogue management, content administration,
authentication, analytics/consent, search, quote requests, multilingual content,
or integrations from agreed requirements. These are not implied by a static demo.

## Delivery state

The static presentation is implemented as 15 pages. Source collection, original
page equivalents, shared layouts, three catalogues, five service pages,
responsive navigation, image enlargement, filtering, email draft preparation and
print layout are complete. The public repository is created and GitHub Pages is
configured to publish static output through GitHub Actions.

`docs/VERIFICATION.md` records performed verification and its limits; the
publishing workflow retains per-commit CI and deployment results.

Production-domain replacement, backend features, physical-device review, and
confirmation of business claims remain outside this presentation milestone.
