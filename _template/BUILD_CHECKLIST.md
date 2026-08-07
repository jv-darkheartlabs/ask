# Client build checklist

Copy this folder to `p/{slug}/` and edit `config.js`.

- [ ] Generate unguessable slug (e.g. `a7k2-alex` — not just the recipient's name)
- [ ] Set `recipientName` and `senderName`
- [ ] Set `theme`: `"dhl"` or `"chaos"`
- [ ] Customize `openingLine` if desired
- [ ] Update `days`, `times`, and `foodOptions`
- [ ] Write custom `punchline` or keep the default
- [ ] Confirm `noindex: true` for private client links
- [ ] Push to `main` and verify `https://ask.darkheartlabs.technology/p/{slug}/`
- [ ] Send the private URL to the client
