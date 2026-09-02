// Builds split-flap style character cells for elements with [data-flap],
// then runs a short mechanical-looking flip through random glyphs before
// settling on the real text. Skips the animation for reduced-motion users.

(function () {
  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789>-";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function randomChar() {
    return CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }

  function buildRow(el) {
    const text = el.getAttribute("data-flap") || "";
    const chars = text.split("");
    el.innerHTML = "";

    const cells = chars.map((ch) => {
      const span = document.createElement("span");
      span.className = "flap" + (ch === " " ? " is-space" : "");
      span.textContent = prefersReduced ? ch : " ";
      el.appendChild(span);
      return { span, ch };
    });

    if (prefersReduced) return;

    cells.forEach(({ span, ch }, i) => {
      const delay = i * 45;
      const ticks = 5 + Math.floor(Math.random() * 4);
      let tick = 0;

      window.setTimeout(function spin() {
        if (ch === " ") {
          span.textContent = " ";
          return;
        }
        tick++;
        span.textContent = tick >= ticks ? ch : randomChar();
        if (tick < ticks) {
          window.setTimeout(spin, 55);
        }
      }, delay);
    });
  }

  document.querySelectorAll("[data-flap]").forEach(buildRow);
})();
