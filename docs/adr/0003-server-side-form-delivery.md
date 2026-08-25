# 3. Server-side form delivery instead of mailto

Date: 2026-08-25

## Status

Accepted

## Context

Ask demo "Send request" and the Dark Heart Labs contact/service briefs used `mailto:` links. Visitors compose from Gmail or iCloud. `darkheartlabs.technology` MX is iCloud Custom Email Domain (`mx01.mail.icloud.com` / `mx02.mail.icloud.com`, SPF `include:icloud.com ~all`).

iCloud delays or junks those messages. Notices can take days. Many browsers never open a mail client at all. Long bodies also hit URL length limits and truncate without warning. That path cannot be sold as a service.

## Decision

POST JSON to a form backend (Formspree, or Web3Forms) from the browser. Show success or failure from the HTTP response. Do not fall back to mailto. Do not put a personal inbox in public `config.js`.

Client theatrical pages (`_template/`) keep send hidden unless a form endpoint is configured.

## Consequences

- Positive: mail originates from Resend (via `dhl-mail-intake` Worker), not the visitor's Gmail/iCloud client.
- Positive: requester email is collected so a reply is possible.
- Negative: requires a one-time Cloudflare Worker deploy and Resend API secret.
- Follow-up: verify `darkheartlabs.technology` in Resend for `forms@` From; keep iCloud MX for receiving.

---

**Maintained by:** [Dark Heart Labs](https://darkheartlabs.technology)  
**Author:** Jennifer ([@jv-darkheartlabs](https://github.com/jv-darkheartlabs))  
**Site:** https://darkheartlabs.technology
