(function () {
  "use strict";

  var config = window.PROPOSAL_CONFIG || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var noAttempts = 0;
  var selections = { day: null, time: null, food: null };
  var steps = ["ask", "day", "time", "food", "summary"];
  var currentStep = 0;

  function qs(sel) {
    return document.querySelector(sel);
  }

  function qsa(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
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
    if (el && text) el.textContent = text;
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
        setTimeout(function () {
          onSelect();
        }, 280);
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
        setTimeout(function () {
          onSelect();
        }, 600);
      });
      container.appendChild(btn);
    });
  }

  function renderSummary() {
    setText("summary-recipient", config.recipientName || "you");
    setText("summary-day", selections.day || "—");
    setText("summary-time", selections.time || "—");
    setText("summary-food", selections.food || "—");
    setText("summary-sender", config.senderName || "me");
    var punchline = qs("[data-punchline]");
    if (punchline) {
      punchline.textContent =
        config.punchline ||
        "P.S. Normal people text. I made a website in Cursor during lunch for you. No big deal.";
    }
  }

  function initThemeToggle() {
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

  function init() {
    applyTheme(config.theme);
    applyNoindex();

    var opening = config.openingLine || "Will you go on a date with me?";
    setText("opening-line", opening);

    var recipient = config.recipientName;
    if (recipient) {
      var sub = qs("[data-recipient-sub]");
      if (sub) sub.textContent = "Hey " + recipient + " — this is kind of a big deal.";
    }

    buildChips(qs("[data-day-chips]"), config.days || ["Friday", "Saturday", "Sunday"], "day", function () {
      showStep(2);
    });

    buildChips(qs("[data-time-chips]"), config.times || ["6:30 PM", "7:00 PM", "Surprise me"], "time", function () {
      showStep(3);
    });

    buildFoodCards(qs("[data-food-grid]"), config.foodOptions || [
      { id: "gelatos", label: "Gelatos", emoji: "🍨" },
      { id: "gyros", label: "Gyros", emoji: "🥙" },
      { id: "nachos", label: "Nachos", emoji: "🧀" },
      { id: "tacos", label: "Tacos", emoji: "🌮" }
    ], function () {
      renderSummary();
      showStep(4);
    });

    var yesBtn = qs("[data-yes]");
    if (yesBtn) {
      yesBtn.addEventListener("click", function () {
        showStep(1);
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
