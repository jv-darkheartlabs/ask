window.PROPOSAL_CONFIG = {
  recipientName: "Jennifer",
  collectRequester: true,
  // Resend via dhl-mail-intake Worker (free). Paste Worker URL after deploy.
  formProvider: "resend",
  formEndpoint: "https://dhl-mail-intake.cheddar-oxygen.workers.dev",
  formspreeId: "",
  showQueue: true,
  queueCount: 4,
  badgeLabel: "date requests · open",
  openingLine: "Think you can take Jennifer on a date?",
  openingSubtitle: "Others are in line. The No button works for them too.",
  summaryTitle: "Request ready to send.",
  days: ["Friday", "Saturday", "Sunday", "Surprise me"],
  times: ["6:30 PM", "7:00 PM", "8:00 PM", "Surprise me"],
  foodOptions: [
    { id: "gelatos", label: "Gelatos", emoji: "🍨" },
    { id: "gyros", label: "Gyros", emoji: "🥙" },
    { id: "nachos", label: "Nachos", emoji: "🧀" },
    { id: "tacos", label: "Tacos", emoji: "🌮" }
  ],
  deposit: {
    label: "Priority security deposit",
    amount: "$25",
    description: "Completely optional. Pay via Wise to skip a few places in the queue.",
    url: ""
  },
  punchline:
    "P.S. Normal people text. I made a website in Cursor during lunch for you. No big deal.",
  noindex: true,
  // Optional Turnstile site key (public). Pair with TURNSTILE_SECRET_KEY on dhl-mail-intake Worker.
  turnstileSiteKey: "0x4AAAAAAEcKzdQzWdenLucK"
};
