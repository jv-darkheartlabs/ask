# 2. Separate repo for ask subdomain

Date: 2026-08-07

## Status

Accepted

## Context

`darkheartlabs.technology` is bound to the `mystic-bytes` Jekyll repo via CNAME. GitHub Pages allows one custom domain per repository. The Ask product needs its own subdomain without coupling to the main site build.

## Decision

Host Ask in a dedicated `jv-darkheartlabs/ask` repository with CNAME `ask.darkheartlabs.technology` and static HTML (no Jekyll build).

## Consequences

- Positive: Independent deploys; client proposals don't touch main site CI.
- Positive: Manual client builds are copy-folder + config edit.
- Negative: Theme tokens duplicated in CSS rather than shared SCSS — acceptable for a small static app.
- Follow-up: Link from mystic-bytes services and contact form.

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
