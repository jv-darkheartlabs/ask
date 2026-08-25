# Client build checklist

Copy this folder to `p/{slug}/` and edit `config.js`.

- [ ] Generate unguessable slug (e.g. `a7k2-alex` — not just the recipient's name)
- [ ] Set `recipientName` and `senderName`
- [ ] Customize `openingLine`, `days`, `times`, and `foodOptions` if desired
- [ ] Write custom `punchline` or keep the default
- [ ] Confirm `noindex: true` and static robots meta on the page
- [ ] Do not commit a personal inbox or real client email
- [ ] Push to `main` and verify `https://ask.darkheartlabs.technology/p/{slug}/`
- [ ] Send the unlisted URL to the client
