# Original website coverage

Source: https://www.aaapparels.com/ — captured 24 October 2026 through the
repository's public source-inventory workflow. The completed capture is
[run 40095683520](https://github.com/WaqasMir89/AAApparels/actions/runs/40095683520).

The crawler captured 23 HTML URLs representing **11 distinct content pages**.
The site exposes both `.php` and extensionless forms; `/`, `/index`, and
`/index.php` are the same homepage. These are consolidated in the presentation.

| Original page | Static presentation | Coverage |
| --- | --- | --- |
| `/`, `/index.php`, `/index` | `index.html` | Company introduction, manufacturing services, values, product discovery, FAQs |
| `/about.php`, `/about` | `about.html` | Company story, establishment year, garment range, manufacturing approach |
| `/designdevelopment.php`, `/designdevelopment` | `designdevelopment.html` | Tech packs, construction, fit, material selection, prints, trims |
| `/fabric.php`, `/fabric` | `fabric.html` | Partner-mill sourcing, external knitting, inspections, material requirements |
| `/dyeing.php`, `/dyeing` | `dyeing.html` | Partner dye houses, fabric/garment processes, reactive/pigment/piece dyeing |
| `/printingembroidery.php`, `/printingembroidery` | `printingembroidery.html` | All-over/placement printing, heat transfer, embroidery |
| `/productiondispatch.php`, `/productiondispatch` | `productiondispatch.html` | In-house cutting/stitching/finishing, modular lines, packing, freight coordination |
| `/kids.php`, `/kids` | `kids.html` | All 12 source product entries and original photographs |
| `/ladies.php`, `/ladies` | `ladies.html` | All 12 source product entries and original photographs |
| `/mens.php`, `/mens` | `mens.html` | All 12 source product entries and original photographs |
| `/contact.php`, `/contact` | `contact.html` | Address, email, office telephone, mobile/WhatsApp, static enquiry preparation |

Additional pages: `service.html` (service overview), `productcatalogue.html`
(collection overview), `catalogue-print.html` (new printable presentation of the
source range), and `404.html` (useful error page). Total: **15 static pages**.

## Source issues resolved in the presentation

- The original three catalogues each display the same 12 photographs. All three
  collections retain those photographs; the site does not imply 36 unique photos.
- The source T-shirt text combines `100% Cotton` and `35% Polyester`. This invalid
  composition is not repeated. The T-shirt entries ask buyers to confirm fabric
  composition and weight during sampling. The 70/30 hoodie and 65/35 fleece
  information is retained from the source.
- `service.php` and `productcatalogue.php` return 404 on the original site. Their
  navigation purpose is fulfilled by the new overview pages.
- `about.html`, `index-2.html`, `service-single.html`, and
  `service-global-consolidation.php` also return 404. Relevant links now lead to
  real company/service pages; unrelated logistics-template destinations are removed.
- `logo2.png`, `final.png`, and `final (2).png` return 404. The working original
  `assets/img/logo/logo.png` is retained byte-for-byte in the presentation.
- Terms and Privacy labels in the original footer link to placeholders rather
  than actual legal pages. No company legal policy has been invented.
- Social links point to A A Logistic Traders / `aaltpk`, rather than a verified
  AA Apparels account. These are omitted pending confirmation.
- Freight-forwarding boilerplate, references to a different manufacturer, and
  unverifiable sampling-fee promises are removed from the rewritten company copy.
- Unsupported promotional capacity/impact figures and certification badges are
  not introduced. Material-documentation requirements can be discussed with the
  company; the presentation does not assert independently verified certificates.

## Assets and provenance

The inventory captured 53 linked assets, including 40 raster images and three
small decorative SVGs. All 40 raster originals have local presentation assets;
`content/assets.json` records source URLs, original SHA-256 hashes, output paths,
dimensions, and derivative hashes. Photography is resized/compressed for web
delivery without generative replacement. The logo is unchanged. Original raw
captures remain in the ignored local research archive.

No downloadable PDF catalogue was linked from the captured public pages. The
printable catalogue is newly assembled from the original product range and is
labelled accordingly. It supports the browser's Print / Save as PDF feature.

Manrope and DM Serif Display are self-hosted from the Google Fonts repository,
with their SIL Open Font License files alongside them. Original company imagery
and brand marks retain their respective owners' rights.

Coverage is based on linked public pages and the captured HTML. It cannot
establish the existence or content of private, unlinked, or server-only pages.
