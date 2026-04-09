// ============================================================
//  animations.js — Animaciones y comportamientos visuales
// ============================================================

export function initAnimations() {
  _initBriseida();
}

// ── Auto de delivery (Briseida) ───────────────────────────
function _initBriseida() {
  const briseida = document.getElementById("briseida");
  if (!briseida) return;

  briseida.addEventListener("mouseover", () => {
    briseida.style.transform = "translateX(300px)";
  });

  briseida.addEventListener("transitionend", () => {
    if (briseida.style.transform === "translateX(300px)") {
      briseida.style.transition = "none";
      briseida.style.transform = "translateX(0)";
      briseida.offsetHeight; // reflow
      briseida.style.transition = "transform 1s linear, opacity 0.5s linear";
    }
  });
}

// ── initResponsiveCarousels ya no es necesaria ────────────
//  catalog.js ahora maneja el chunking responsive directamente.
//  Exportamos stub vacío por compatibilidad con script.js
export function initResponsiveCarousels() {
  // No-op: el renderizado responsive se hace en catalog.js
}