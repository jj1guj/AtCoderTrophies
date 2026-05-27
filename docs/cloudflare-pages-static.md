# Cloudflare Pages static publishing

This repository can publish a fixed user's trophy SVG as a static asset.

## Overview

- GitHub Actions runs once a day and regenerates `site/atcoder/jj1guj.svg`.
- The workflow force-pushes the published `site` content to `ops/static-trophy-updates` only when the content changes.
- Cloudflare Pages serves the `site` directory as a static site.

## GitHub Actions

The workflow is defined in `.github/workflows/generate-static-trophy.yml`.

- Manual run: `workflow_dispatch`
- Scheduled run: daily at `00:00 UTC`
- Generated file: `site/atcoder/jj1guj.svg`
- Publish branch: `ops/static-trophy-updates`

If you need another account or output path, change `ATCODER_USERNAME` and `TROPHY_OUTPUT_PATH` in the workflow.

## Cloudflare Pages settings

Create a Pages project from this repository with the following settings.

- Production branch: `ops/static-trophy-updates`
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `site`

Cloudflare Pages will redeploy automatically when the workflow pushes an updated SVG.

## Published paths

- Landing page: `/`
- SVG: `/atcoder/jj1guj.svg`

For README embedding, use the deployed Pages URL plus `/atcoder/jj1guj.svg`.
