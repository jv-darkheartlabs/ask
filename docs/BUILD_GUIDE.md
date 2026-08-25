# Build guide — client date proposals

Manual delivery workflow for Dark Heart Labs Ask service.

**Hard rule:** this GitHub repo is **public**. Do not commit real recipient/sender names, emails, Wise links, or punchlines with identifying detail under `p/`. CI rejects tracked client folders.

## Prerequisites

- Brief from client (via contact form or email)
- Write access to a **private** deploy target (recommended: `jv-darkheartlabs/ask-clients`)

## Step 1 — Receive the brief

Collect:

| Field | Example |
|-------|---------|
| Recipient name | Morgan |
| Sender name | Jamie |
| Theme | DHL (Signal Protocol) |
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

## Step 3 — Copy template (private tree)

Work in a **private** clone or sibling repo that mirrors this layout (`assets/`, `_template/`, `p/`):

```bash
# One-time: private sibling (example)
# gh repo create jv-darkheartlabs/ask-clients --private --clone
# copy assets + _template from ask, enable Pages there

cp -R _template/ p/a7k2-morgan/
```

Local-only under this public repo is fine for drafting (`p/` is gitignored), but **do not** `git add` those folders here.

## Step 4 — Edit config

Open `p/a7k2-morgan/config.js` and set names, options, and punchline. Keep `noindex: true`. Do not put a personal inbox in config. Wire send via the shared Worker (`formEndpoint` — see [MAIL.md](MAIL.md)).

For the public **demo/** folder only: keep PII out of git. Set repository secret `ASK_DEMO_WISE_URL` for Pages deploy, or use `demo/config.local.js` (gitignored).

## Step 5 — Deploy (private)

Push the client folder to the **private** Pages host — not `jv-darkheartlabs/ask`:

```bash
# in ask-clients (private)
git add p/a7k2-morgan/
git commit -m "feat: add unlisted proposal a7k2-morgan"
git push origin main
```

Point that repo’s Pages site at a hostname you control (e.g. a private Pages URL, or a dedicated subdomain). Do **not** treat the public `ask` Pages deploy as the place for paid client PII.

## Step 6 — Verify

Open the deployed unlisted URL and walk through all five steps:

1. Yes / No (No dodges)
2. Day selection
3. Time selection
4. Food vote (confetti)
5. Summary with punchline

Test on mobile width. Confirm send → Resend inbox.

## Step 7 — Deliver

Send the client the unlisted URL. Remind them:

- Link is unlisted but **not** password-protected — don’t post publicly if surprise matters
- They send the link when ready
- Unlisted ≠ private; anyone with the URL can open it

## Demo vs client pages

| Path | Repo | noindex |
|------|------|---------|
| `/demo/` | Public `ask` | true on demo HTML |
| `/p/{slug}/` | **Private** deploy only | true (default) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Accidentally staged `p/…` on public ask | `git reset`; confirm `.gitignore`; CI will fail if it lands in a PR |
| 404 after push | Wait 2–3 min; confirm folder has `index.html` on the **private** Pages host |
| Styles missing | Check asset paths: `../../assets/` from `p/slug/` |

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
