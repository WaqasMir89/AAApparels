# AA Apparels — website redesign

Static presentation redesign of [aaapparels.com](https://www.aaapparels.com/).

**Status:** source collection is in progress. The website has not yet been
implemented. Public repository: https://github.com/WaqasMir89/AAApparels.
See [BUILD_PLAN.md](BUILD_PLAN.md) for scope, design direction, delivery steps,
and acceptance conditions.

## Capture the original website

Requires Python 3.10+ and working access to the original website. No third-party
Python packages are required.

```sh
python3 scripts/inventory_source.py
```

The tool saves public pages and their linked assets to `source-audit/`, together
with a manifest of original URLs, local filenames, content types, and SHA-256
hashes. It follows same-origin links, ignores executable downloads, and does not
submit forms. Use `--help` for limits and options.

Review its errors and inspect the original navigation in a browser before
claiming page completeness. JavaScript-generated routes, CSS background images,
and unlinked files require manual review. The research archive is ignored by Git.

Original logo, photographs, and catalogues remain the property of their respective
owners. No open-source license is applied to those assets.
