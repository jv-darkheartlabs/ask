# Client build checklist

Copy this folder to `p/{slug}/` and edit `config.js`.

- [ ] Generate unguessable slug (e.g. `a7k2-alex` — not just the recipient's name)
- [ ] Set `recipientName` and `senderName`
- [ ] Customize `openingLine`, `days`, `times`, and `foodOptions` if desired
- [ ] Write custom `punchline` or keep the default
- [ ] Confirm `noindex: true` for private client links
- [ ] Push to `main` and verify `https://ask.darkheartlabs.technology/p/{slug}/`
- [ ] Send the private URL to the client
