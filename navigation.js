// ============================================================
//  navigation.js — Responsabilidad única: navegación y menú
// ============================================================

export function initNavigation() {
  _bindAnchorClicks();
  _bindScrollHighlight();
  _bindIconRotation();
}

// ── Scroll instantáneo a secciones ───────────────────────
function _bindAnchorClicks() {
  document.querySelectorAll("#menu a, #icons-div a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href.startsWith("http")) return; // links externos → comportamiento normal
      e.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
      } else {
        window.location.href = href;
      }
    });
  });
}

// ── Ítem de menú activo según sección visible ─────────────
function _bindScrollHighlight() {
  const menuItems = document.querySelectorAll(".item-menu");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (pageYOffset >= s.offsetTop - s.clientHeight / 3) {
        current = s.id;
      }
    });
    menuItems.forEach((item) => {
      item.classList.toggle(
        "observer-active",
        item.getAttribute("href")?.substring(1) === current
      );
    });
  });
}

// ── Rotación de íconos en el home ─────────────────────────
function _bindIconRotation() {
  const items = document.querySelectorAll(".icons-div > div");
  const textDisplay = document.getElementById("text-display");
  if (!items.length || !textDisplay) return;

  const texts = [
    "Promociones",
    "Librería y Juguetería",
    "Accesorios para el pelo",
    "Tinturas y tratamientos",
    "Carteras y afines",
    "Productos Sublimados",
  ];

  let currentIndex = 0;
  let interval = null;

  function updateActive() {
    items.forEach((it) => it.classList.remove("special"));
    items[currentIndex].classList.add("special");
    textDisplay.textContent = texts[currentIndex];
    currentIndex = (currentIndex + 1) % items.length;
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  updateActive();
  interval = setInterval(updateActive, 3000);

  window.addEventListener("scroll", () => {
    const iconsDiv = document.querySelector(".icons-div");
    if (!iconsDiv) return;
    if (isVisible(iconsDiv)) {
      if (!interval) interval = setInterval(updateActive, 3000);
    } else {
      clearInterval(interval);
      interval = null;
    }
  });
}