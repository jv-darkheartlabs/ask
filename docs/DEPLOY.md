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

## Spaceship DNS

Domains for Dark Heart Labs are at [Spaceship](https://www.spaceship.com/). For `darkheartlabs.technology`:

1. Sign in at spaceship.com → **Domain Manager** → select `darkheartlabs.technology`
2. Open **Advanced DNS** (or **DNS records**)
3. Add a record:

| Type | Host / Name | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| CNAME | ask | jv-darkheartlabs.github.io | Auto / 1 hour |

4. Remove any conflicting A or CNAME records on the `ask` host
5. Save — propagation is typically 5–60 minutes

GitHub Pages may also ask you to add a TXT record for domain verification on first setup; add it in the same Spaceship DNS panel if prompted.

**Important:** Once the custom domain is set in GitHub, `jv-darkheartlabs.github.io/ask/` redirects to `ask.darkheartlabs.technology`. Add the CNAME in Spaceship **before** or immediately after enabling the custom domain, or the site will appear down until DNS propagates.

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
