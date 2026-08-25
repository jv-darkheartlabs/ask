# Mail delivery — Ask

`mailto:` is disabled. Domain MX is **iCloud**. Visitor Gmail/iCloud mailto was delayed or junked for days.

## Required: Resend + dhl-mail-intake (free)

You already have Resend. Static Pages cannot hold the API key — use the Worker in `~/Projects/dhl-mail-intake`.

1. Deploy Worker (see that repo README): `npx wrangler secret put RESEND_API_KEY` then `npx wrangler deploy`
2. Set in `demo/config.js`:

```js
formProvider: "resend",
formEndpoint: "https://dhl-mail-intake.<account>.workers.dev",
```

3. Same URL in mystic-bytes `_config.yml` → `form_endpoint`
4. Walk `/demo/` and send a test. Expect **Request sent** and mail the same day.

Test From without domain DNS: `onboarding@resend.dev` (Worker default). Production From: verify domain in Resend, keep iCloud MX, set `FROM_EMAIL` to `forms@darkheartlabs.technology`.

## Do not

- Put `RESEND_API_KEY` in public JS
- Fall back to mailto
- Commit client names or emails in `p/{slug}/` on this public repo
- Call client URLs "private" — they are unlisted and noindexed, not authenticated

## Alternatives (not preferred)

Formspree / Web3Forms still work via `formspreeId` / `formAccessKey` if the Worker is down. Prefer Resend.

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
