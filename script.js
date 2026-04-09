// ============================================================
//  script.js — Punto de entrada (orquestador)
//  Solo importa módulos y los inicializa en orden.
//  No contiene lógica de negocio.
// ============================================================

import { initCart } from "./cart.js";
import { renderAllCatalogs } from "./catalog.js";
import { initNavigation } from "./navigation.js";
import { initAnimations, initResponsiveCarousels } from "./animations.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Renderizar catálogo desde datos (products.js)
  renderAllCatalogs();

  // 2. Carrusel responsive (debe ir luego del render)
  initResponsiveCarousels();

  // 3. Carrito (inicializa estado y eventos)
  initCart();

  // 4. Navegación y menú
  initNavigation();

  // 5. Animaciones
  initAnimations();
});