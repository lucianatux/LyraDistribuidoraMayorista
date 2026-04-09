// ============================================================
//  animations.js — Animaciones y comportamientos visuales
// ============================================================

export function initAnimations() {
  _initBriseida();
  _initResponsiveCarousels();
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

// ── Carrusel responsive: convierte pares en slides simples ─
export function initResponsiveCarousels() {
  if (window.innerWidth > 868) return;

  document.querySelectorAll('[id^="carousel-"]').forEach((carousel) => {
    const inner = carousel.querySelector(".carousel-inner");
    if (!inner) return;

    const extraSlides = [];
    carousel.querySelectorAll(".carousel-item").forEach((slide) => {
      const second = slide.querySelector(".img-and-text:nth-child(2)");
      if (!second) return;

      const newSlide = document.createElement("div");
      newSlide.className = "carousel-item";
      const newSlides = document.createElement("div");
      newSlides.className = "slides";
      const clone = second.cloneNode(true);
      newSlides.appendChild(clone);
      newSlide.appendChild(newSlides);
      extraSlides.push(newSlide);
    });

    extraSlides.forEach((s) => inner.appendChild(s));
  });
}

// Exportar alias para compatibilidad
function _initResponsiveCarousels() {
  initResponsiveCarousels();
}