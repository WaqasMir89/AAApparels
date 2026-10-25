# Presentation verification

Local verification completed on **25 October 2026**, using Linux Chromium and
Playwright. Browser output is retained locally in `output/playwright/`; the
publishing workflow saves the same review artifacts for each CI run.

| Check | Result | Evidence and scope |
| --- | --- | --- |
| Static generation | Passed | `npm run build`: 15 HTML pages and 40 original raster image assets |
| Original page coverage | Passed | All 11 distinct original pages have static equivalents; see `PAGE_MAP.md` |
| Local references | Passed | `npm run check`: 636 internal page, image, script, stylesheet and fragment references |
| Original logo | Passed | Published logo SHA-256 equals the captured original logo SHA-256 |
| Product catalogues | Passed | All 12 source product photographs appear in each of the three corresponding catalogues; 36 entries total |
| Desktop layouts | Passed | All 15 pages at 1440px; headings, loaded images, fonts, overflow and browser errors checked |
| Mobile layouts | Passed | All 15 pages at 390px; overflow checked; representative full-page screenshots reviewed |
| Tablet layouts | Passed | Homepage, catalogue, contact and service template at 768px |
| Automated accessibility | Passed | 11 axe audits across representative templates and desktop/mobile sizes; zero reported violations under selected WCAG A/AA tags |
| Product interactions | Passed | Filtering, search, empty results, reset, image enlargement, Escape and focus restoration |
| Mobile navigation | Passed | Open/close, Escape, page navigation and content access without JavaScript |
| Enquiry preparation | Passed | Product prefill, validation and encoded email draft; no email sent |
| FAQ | Passed | Native expandable disclosure |
| Error page | Passed | Missing local route returns HTTP 404 with the error-page content |
| Print catalogue | Passed | Two A4 pages, approximately 1.7 MB; both PDF pages rendered and visually inspected |
| Visual review | Passed | Homepage, product, service, company, contact and print compositions reviewed; print skip-link issue corrected |

The final browser command completed **34 viewport checks**, **11 accessibility
audits**, and **6 interaction groups** with no recorded page or console errors.

## Reproduce

```sh
npm ci
npm run build
npm run check
npx playwright install chromium
npm test
```

An existing Chromium installation can be selected with:

```sh
npm test -- --browser=/absolute/path/to/chrome
```

`output/playwright/results.json` contains the page-level results. Screenshots and
the PDF review copy are generated beside it. GitHub Actions runs this verification
before publishing the static `dist/` directory to GitHub Pages.

## Practical limits

- Viewport emulation does not establish physical-device behavior. Real-device and
  full assistive-technology review remain useful before a production launch.
- The website is a static proposal. No backend enquiry delivery, authentication,
  payments, inventory or content-management workflow is present or claimed.
- Business descriptions and product details derive from the original public
  website. Capacity, certification, pricing and current commercial terms are not
  independently verified by these software checks.
- Source coverage concerns linked public pages captured on 24 October. Private,
  unlinked and server-only pages were unavailable for comparison.
- Live publication is recorded by the
  [GitHub Pages publishing workflow](https://github.com/WaqasMir89/AAApparels/actions/workflows/publish.yml).
