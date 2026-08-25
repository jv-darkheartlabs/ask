# Client build checklist

Copy this folder to `p/{slug}/` in a **private** deploy tree (not the public `ask` repo) and edit `config.js`.

- [ ] Generate unguessable slug (e.g. `a7k2-alex` — not just the recipient's name)
- [ ] Set `recipientName` and `senderName`
- [ ] Customize `openingLine`, `days`, `times`, and `foodOptions` if desired
- [ ] Write custom `punchline` or keep the default
- [ ] Confirm `noindex: true` and static robots meta on the page
- [ ] Do not commit a personal inbox or real client email
- [ ] Confirm you are pushing to a **private** host — not `jv-darkheartlabs/ask`
- [ ] Verify the live unlisted URL end-to-end (including send)
- [ ] Send the unlisted URL to the client
