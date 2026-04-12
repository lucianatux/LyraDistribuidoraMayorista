// ============================================================
//  script.js — Punto de entrada (orquestador)
//  Solo importa módulos y los inicializa en orden.
//  No contiene lógica de negocio.
// ============================================================

import { renderAllCatalogs, handleResize } from "./catalogProducts.js";
import { initNavigation } from "./navigation.js";
import { initAnimations } from "./animations.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Renderizar catálogo desde datos (products.js)
  renderAllCatalogs();

  // 3. Navegación y menú
  initNavigation();

  // 4. Animaciones
  initAnimations();

  // 5. Re-render carruseles si cambia el breakpoint (1↔2 cards)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });
});