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

- The project directory initially contains no application source or assets.
- The existing website is PHP-based according to the brief; its source has not
  been supplied.
- Attempts to retrieve the homepage, HTTP/HTTPS and www/non-www variants, and
  common discovery endpoints through the available web tools failed.
- Terminal access cannot resolve the original domain in the restricted environment.
- GitHub access is verified through the CLI as `WaqasMir89`. The public repository
  https://github.com/WaqasMir89/AAApparels has been created on branch `main`.
- A manual GitHub Actions source-capture workflow provides another retrieval
  environment. The captured content must still be inspected before implementation.
- The exact page count, page names, product categories, catalogue files, original
  logo, and image inventory remain unverified. Do not invent these or mark page
  parity complete from a guessed menu.

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
public/assets/original/  approved original marks, images, documents
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

## Open gates

1. Original website or a local export must become readable.
2. Original logos, catalogue files, and product photographs must be captured.
3. Browser execution must be available for visual verification.
4. The final website commit and public repository state must be verified after delivery.

The redesign itself is not yet implemented or ready for client presentation.
