(function () {
  "use strict";

  var config = window.PROPOSAL_CONFIG || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var noAttempts = 0;
  var selections = {
    day: null,
    time: null,
    food: null,
    requesterName: "",
    depositIntent: false,
    depositPaid: false
  };
  var steps = [];
  var QUEUE_POOL = [
    { name: "Leopold Brandt", place: "Vienna" },
    { name: "Anouk De Smet", place: "Brussels" },
    { name: "Dmitri Volkov", place: "Odesa" },
    { name: "Saskia Van Der Berg", place: "Amsterdam" },
    { name: "Thierry Duval", place: "Lyon" },
    { name: "Inez Mendoza", place: "Lisbon" },
    { name: "Magnus Lindqvist", place: "Stockholm" },
    { name: "Chiara Monti", place: "Naples" },
    { name: "Raoul Benali", place: "Marrakech" },
    { name: "Esme Fontaine", place: "Geneva" },
    { name: "Nikolai Petrov", place: "Sofia" },
    { name: "Isabeau Laurent", place: "Montréal" },
    { name: "Rafael Costa", place: "Porto" },
    { name: "Helena Kovács", place: "Budapest" },
    { name: "Matteo Ricci", place: "Venice" }
  ];

  function qs(sel) {
    return document.querySelector(sel);
  }

  function qsa(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function buildStepList() {
    steps = ["ask"];
    if (config.collectRequester) steps.push("requester");
    steps.push("day", "time", "food", "summary");
  }

  function stepIndex(name) {
    return steps.indexOf(name);
  }

  function applyTheme(theme) {
    var resolved = theme === "chaos" ? "chaos" : "dhl";
    document.body.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }

  function applyNoindex() {
    if (!config.noindex) return;
    var meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text !== undefined && text !== null) el.textContent = text;
  }

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function renderQueue() {
    if (!config.showQueue) return;
    var aside = qs("[data-queue]");
    var list = qs("[data-queue-list]");
    if (!aside || !list) return;

    var count = config.queueCount || 4;
    var picked = shuffle(QUEUE_POOL).slice(0, count);
    list.innerHTML = "";

    picked.forEach(function (entry) {
      var li = document.createElement("li");
      li.className = "suitor-queue__item";
      li.innerHTML =
        '<span class="suitor-queue__name">' +
        entry.name +
        '</span><span class="suitor-queue__meta">' +
        entry.place +
        " · pending</span>";
      list.appendChild(li);
    });

    aside.hidden = false;
  }

  function renderProgress() {
    var container = qs("[data-progress]");
    if (!container) return;
    container.innerHTML = "";
    steps.forEach(function (_, i) {
      var dot = document.createElement("span");
      dot.className = "progress-dot";
      dot.setAttribute("aria-hidden", "true");
      if (i === currentStep) dot.classList.add("is-active");
      if (i < currentStep) dot.classList.add("is-done");
      container.appendChild(dot);
    });
  }

  var currentStep = 0;

  function showStep(index) {
    currentStep = index;
    qsa("[data-step]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-step") === steps[index]);
    });
    renderProgress();
  }

  function spawnConfetti() {
    if (reducedMotion) return;
    var layer = qs("[data-confetti]");
    if (!layer) return;
    var colors = ["#b47aff", "#ff1744", "#c86bff", "#eceaf2"];
    for (var i = 0; i < 24; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.animationDuration = 0.8 + Math.random() * 0.8 + "s";
      layer.appendChild(piece);
      setTimeout(function (p) {
        return function () {
          if (p.parentNode) p.parentNode.removeChild(p);
        };
      }(piece), 2000);
    }
  }

  function dodgeNo(btn) {
    noAttempts += 1;
    var scale = Math.max(0.55, 1 - noAttempts * 0.08);
    var padding = window.innerWidth <= 480 ? 12 : 24;
    var maxX = window.innerWidth - btn.offsetWidth - padding;
    var maxY = window.innerHeight - btn.offsetHeight - padding;
    var x = padding + Math.random() * Math.max(0, maxX - padding);
    var y = padding + Math.random() * Math.max(0, maxY - padding);

    btn.classList.add("is-dodging");
    btn.style.left = x + "px";
    btn.style.top = y + "px";
    btn.style.transform = "scale(" + scale + ")";

    if (noAttempts === 3 && config.theme !== "chaos") {
      var hint = qs("[data-no-hint]");
      if (hint) hint.hidden = false;
    }
    if (noAttempts >= 5 && config.theme === "chaos") {
      btn.textContent = "nice try lol";
    }
  }

  function bindNoButton(btn) {
    if (!btn) return;

    function onApproach(e) {
      e.preventDefault();
      dodgeNo(btn);
    }

    btn.addEventListener("mouseenter", onApproach);
    btn.addEventListener("focus", onApproach);
    btn.addEventListener("touchstart", onApproach, { passive: false });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      dodgeNo(btn);
    });
  }

  function buildChips(container, items, key, onSelect) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = item;
      btn.addEventListener("click", function () {
        selections[key] = item;
        container.querySelectorAll(".chip").forEach(function (c) {
          c.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        setTimeout(onSelect, 280);
      });
      container.appendChild(btn);
    });
  }

  function buildFoodCards(container, items, onSelect) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "food-card";
      btn.innerHTML =
        '<span class="food-emoji" aria-hidden="true">' +
        (item.emoji || "🍽") +
        '</span><span class="food-label">' +
        item.label +
        "</span>";
      btn.addEventListener("click", function () {
        selections.food = item.label;
        container.querySelectorAll(".food-card").forEach(function (c) {
          c.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        spawnConfetti();
        setTimeout(onSelect, 600);
      });
      container.appendChild(btn);
    });
  }

  function depositSummaryText() {
    if (!config.deposit) return "Not offered";
    if (selections.depositPaid) {
      return "Paid (" + (config.deposit.amount || "deposit") + ")";
    }
    if (selections.depositIntent) {
      return "Intent noted — pay link opened separately";
    }
    return "Declined (optional)";
  }

  function buildMailtoHref() {
    var email = config.recipientEmail;
    if (!email) return null;

    var recipient = config.recipientName || "Recipient";
    var requester = selections.requesterName || config.senderName || "Anonymous";
    var subject = "[Date request] " + requester + " → " + recipient;
    var lines = [
      "Date request via ask.darkheartlabs.technology",
      "",
      "Requester: " + requester,
      "For: " + recipient,
      "Day: " + (selections.day || "—"),
      "Time: " + (selections.time || "—"),
      "Food: " + (selections.food || "—"),
      "Priority deposit: " + depositSummaryText(),
      "",
      "— sent from the Ask mini-site"
    ];

    return (
      "mailto:" +
      encodeURIComponent(email) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  function renderSummary() {
    var recipient = config.recipientName || "you";
    setText("summary-recipient", recipient);
    setText("summary-day", selections.day || "—");
    setText("summary-time", selections.time || "—");
    setText("summary-food", selections.food || "—");
    setText("summary-sender", selections.requesterName || config.senderName || "—");
    setText("summary-deposit", depositSummaryText());

    var depositEl = document.getElementById("summary-deposit");
    if (depositEl) {
      var depositRow = depositEl.closest("li");
      if (depositRow) {
        depositRow.hidden = !config.deposit || !config.collectRequester;
      }
    }

    var titleEl = qs("[data-summary-title]");
    if (titleEl && config.summaryTitle) {
      titleEl.textContent = config.summaryTitle;
    }

    var punchline = qs("[data-punchline]");
    if (punchline) {
      punchline.textContent =
        config.punchline ||
        "P.S. Normal people text. I made a website in Cursor during lunch for you. No big deal.";
    }

    var sendBtn = qs("[data-send-request]");
    var mailto = buildMailtoHref();
    if (sendBtn) {
      if (mailto) {
        sendBtn.href = mailto;
        sendBtn.hidden = false;
      } else {
        sendBtn.hidden = true;
      }
    }
  }

  function initDepositBlock() {
    if (!config.collectRequester || !config.deposit) return;
    var block = qs("[data-deposit-block]");
    if (!block) return;

    block.hidden = false;
    var label = qs("[data-deposit-label]");
    var hint = qs("[data-deposit-hint]");
    var link = qs("[data-deposit-link]");
    var check = qs("[data-deposit-check]");
    var dep = config.deposit;

    if (label) {
      label.textContent =
        (dep.label || "Priority security deposit") +
        (dep.amount ? " · " + dep.amount : "") +
        " (optional)";
    }
    if (hint) {
      hint.textContent = dep.description || "Completely optional. Raises your priority in the queue.";
    }

    if (check) {
      check.addEventListener("change", function () {
        selections.depositIntent = check.checked;
        if (link) {
          link.hidden = !check.checked || !dep.url;
        }
        if (check.checked && dep.url) {
          selections.depositPaid = false;
        }
      });
    }

    if (link && dep.url) {
      link.href = dep.url;
      link.textContent = "Pay " + (dep.amount || "deposit") + " via Wise →";
      link.addEventListener("click", function () {
        selections.depositIntent = true;
        if (check) check.checked = true;
      });
    }
  }

  function initRequesterStep() {
    if (!config.collectRequester) return;
    var input = qs("[data-requester-name]");
    var continueBtn = qs("[data-requester-continue]");
    if (!input || !continueBtn) return;

    function syncContinue() {
      var valid = input.value.trim().length > 0;
      continueBtn.disabled = !valid;
      selections.requesterName = input.value.trim();
    }

    input.addEventListener("input", syncContinue);
    continueBtn.addEventListener("click", function () {
      syncContinue();
      if (!selections.requesterName) return;
      showStep(stepIndex("day"));
    });
  }

  function initThemeToggle() {
    if (config.showThemeToggle === false) return;
    var toggle = qs("[data-theme-toggle]");
    if (!toggle) return;

    var active = config.theme === "chaos" ? "chaos" : "dhl";
    toggle.hidden = false;
    toggle.textContent = active === "dhl" ? "chaos mode" : "dhl mode";

    toggle.addEventListener("click", function () {
      active = active === "dhl" ? "chaos" : "dhl";
      config.theme = active;
      applyTheme(active);
      toggle.textContent = active === "dhl" ? "chaos mode" : "dhl mode";
    });
  }

  function initCopy() {
    var opening = config.openingLine || "Will you go on a date with me?";
    setText("opening-line", opening);

    var badge = qs("[data-badge]");
    if (badge && config.badgeLabel) badge.textContent = config.badgeLabel;

    var openingSub = qs("[data-opening-sub]");
    if (openingSub && config.openingSubtitle) {
      openingSub.textContent = config.openingSubtitle;
    } else if (openingSub && config.recipientName && !config.collectRequester) {
      openingSub.textContent = "Hey " + config.recipientName + " — this is kind of a big deal.";
    }
  }

  function init() {
    buildStepList();
    applyTheme(config.theme);
    applyNoindex();
    initCopy();
    renderQueue();
    initDepositBlock();
    initRequesterStep();

    buildChips(qs("[data-day-chips]"), config.days || ["Friday", "Saturday", "Sunday"], "day", function () {
      showStep(stepIndex("time"));
    });

    buildChips(
      qs("[data-time-chips]"),
      config.times || ["6:30 PM", "7:00 PM", "Surprise me"],
      "time",
      function () {
        showStep(stepIndex("food"));
      }
    );

    buildFoodCards(
      qs("[data-food-grid]"),
      config.foodOptions || [
        { id: "gelatos", label: "Gelatos", emoji: "🍨" },
        { id: "gyros", label: "Gyros", emoji: "🥙" },
        { id: "nachos", label: "Nachos", emoji: "🧀" },
        { id: "tacos", label: "Tacos", emoji: "🌮" }
      ],
      function () {
        renderSummary();
        showStep(stepIndex("summary"));
      }
    );

    var yesBtn = qs("[data-yes]");
    if (yesBtn) {
      yesBtn.addEventListener("click", function () {
        var next = config.collectRequester ? stepIndex("requester") : stepIndex("day");
        showStep(next);
      });
    }

    bindNoButton(qs("[data-no]"));
    initThemeToggle();
    showStep(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
