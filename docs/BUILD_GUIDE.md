# Build guide — client date proposals

Manual delivery workflow for Dark Heart Labs Ask service.

## Prerequisites

- Brief from client (via contact form or email)
- Write access to `jv-darkheartlabs/ask` repository

## Step 1 — Receive the brief

Collect:

| Field | Example |
|-------|---------|
| Recipient name | Morgan |
| Sender name | Jamie |
| Theme | `dhl` or `chaos` |
| Days | Friday, Saturday, Surprise me |
| Times | 7:00 PM, 8:00 PM |
| Food options | Gelatos, Gyros, Nachos, Tacos |
| Custom punchline | (optional) |
| Opening line | (optional override) |

## Step 2 — Create slug

Use an unguessable slug — not just the recipient's first name.

```
good: a7k2-morgan
bad:  morgan
```

## Step 3 — Copy template

```bash
cp -R _template/ p/a7k2-morgan/
```

## Step 4 — Edit config

Open `p/a7k2-morgan/config.js` and set all fields. Keep `noindex: true` for private client links.

## Step 5 — Deploy

```bash
git add p/a7k2-morgan/
git commit -m "feat: add proposal for Morgan (a7k2-morgan)"
git push origin main
```

GitHub Pages updates within ~1 minute.

## Step 6 — Verify

Open `https://ask.darkheartlabs.technology/p/a7k2-morgan/` and walk through all five steps:

1. Yes / No (No dodges)
2. Day selection
3. Time selection
4. Food vote (confetti)
5. Summary with punchline

Test on mobile width.

## Step 7 — Deliver

Send the client the private URL. Remind them:

- Link is unlisted but not password-protected — don't post publicly if they want surprise
- They send the link when ready

## Demo vs client pages

| Path | noindex | Theme toggle |
|------|---------|--------------|
| `/demo/` | false | visible |
| `/p/{slug}/` | true (default) | hidden unless you enable in HTML |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 after push | Wait 2–3 min; confirm folder has `index.html` |
| Styles missing | Check asset paths: `../../assets/` from `p/slug/` |
| Wrong theme | Set `theme: "dhl"` or `"chaos"` in config |

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
