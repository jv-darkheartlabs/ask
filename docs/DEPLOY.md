# Deploy — ask.darkheartlabs.technology

## GitHub repository

1. Create public repo `jv-darkheartlabs/ask` (or use existing)
2. Push `main` branch
3. Settings → Pages → Source: **GitHub Actions** (workflow in `.github/workflows/pages.yml`)
4. Settings → Pages → Custom domain: `ask.darkheartlabs.technology`
5. Wait for DNS check → enable **Enforce HTTPS**

## CNAME file

Root [`CNAME`](../CNAME) must contain:

```
ask.darkheartlabs.technology
```

## GoDaddy DNS

In Advanced DNS for `darkheartlabs.technology`:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | ask | jv-darkheartlabs.github.io | 1 hour (default) |

Remove conflicting A or CNAME records on the `ask` host if present.

Propagation: typically 5–60 minutes.

## Verify

```bash
dig ask.darkheartlabs.technology CNAME +short
# Expected: jv-darkheartlabs.github.io.

curl -I https://ask.darkheartlabs.technology/
# Expected: HTTP/2 200
```

## Local preview

```bash
cd ask
python3 -m http.server 8080
# http://localhost:8080/demo/
```

Note: GitHub Pages serves trailing slashes; local server may require `/demo/index.html` explicitly.

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
