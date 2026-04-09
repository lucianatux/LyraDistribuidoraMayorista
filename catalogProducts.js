// ============================================================
//  catalog.js — Responsabilidad única: renderizar catálogo
//  Lee products.js y genera el HTML de los carruseles.
//  Para agregar productos → editar solo products.js
// ============================================================

import { PRODUCTOS, CATEGORIAS } from "./products.js";
import { addToCart } from "./cart.js";

// ── Breakpoint: ≤868px = 1 card por slide, >868px = 2 ────
function _getCardsPerSlide() {
  return window.innerWidth > 868 ? 2 : 1;
}

// ── Entrada pública ───────────────────────────────────────
export function renderAllCatalogs() {
  Object.keys(CATEGORIAS).forEach((catId) => {
    const cat = CATEGORIAS[catId];
    const section = document.getElementById(catId);
    if (!section) return;

    const mountPoint = section.querySelector(".carousel-mount");
    if (!mountPoint) return;

    if (catId === "carteras") {
      _renderCarterasConSubcategorias(mountPoint);
    } else {
      const productos = PRODUCTOS.filter((p) => p.categoria === catId);
      const carouselId = `carousel-${catId}`;
      mountPoint.innerHTML = _buildCarousel(carouselId, productos);
    }

    // Extras específicos por categoría
    _renderExtras(cat, section);
  });

  // Delegar eventos de botones después del render
  _bindAllWantButtons();
  _bindAllInfoButtons();
}

// ── Rebuild en resize (cambia de 1↔2 cards por slide) ─────
let _lastCardsPerSlide = _getCardsPerSlide();

export function handleResize() {
  const newVal = _getCardsPerSlide();
  if (newVal !== _lastCardsPerSlide) {
    _lastCardsPerSlide = newVal;
    renderAllCatalogs();
  }
}

// ── Carruseles generales ──────────────────────────────────
function _buildCarousel(id, productos) {
  if (productos.length === 0) return "";

  const perSlide = _getCardsPerSlide();
  const chunks = _chunkArray(productos, perSlide);

  const items = chunks
    .map((chunk, i) => {
      const slides = chunk.map((p) => _buildCard(p)).join("");
      return `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="slides">${slides}</div>
        </div>`;
    })
    .join("");

  return `
    <div id="${id}" class="carousel slide carousel-fade">
      <div class="carousel-inner">${items}</div>
      <button class="carousel-control-prev" type="button"
        data-bs-target="#${id}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button"
        data-bs-target="#${id}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;
}

// ── Tarjeta individual ────────────────────────────────────
//  Todas las imágenes usan .card-img-container (aspect-ratio 1:1).
//  Si el producto tiene fondoBlur: true → fondo blur.
//  Si no → fondo blanco (por defecto).
function _buildCard(p) {
  const useBlur = !!p.fondoBlur;

  const infoExtra = p.infoExtra
    ? `<button class="info-btn">${p.infoExtraLabel || "ver más"}</button>
       <div class="info-div" style="display:none">${p.infoExtra.join("<br>")}</div>`
    : "";

  // Contenedor de imagen unificado
  const blurBg = useBlur
    ? `<div class="bg-blur" style="background-image: url('${p.imagen}')"></div>`
    : "";
  const containerClass = useBlur ? "card-img-container bg-blur-mode" : "card-img-container";

  const imgHtml = `
    <div class="${containerClass}">
      ${blurBg}
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
    </div>`;

  if (p.tipo === "simple") {
    return `
      <div class="img-and-text">
        ${imgHtml}
        <p class="product-text">
          ${p.nombre}<br/>
          ${p.info}
          ${infoExtra}
          <button class="want-btn" data-product="${p.nombre} — ${p.info}">
            Agregar al 🛒
          </button>
        </p>
      </div>`;
  }

  // Tipos con inputs
  const inputField =
    p.tipo === "input-select"
      ? `<select class="type-product" name="type-product" required>
           <option value=""></option>
           ${(p.opciones || []).map((o) => `<option value="${o}">${o}</option>`).join("")}
         </select>`
      : `<input type="text" class="type-product" name="type-product"
           placeholder="${p.labelTipo || "detalle"}" required />`;

  const stepAttr = p.step ? `step="${p.step}" min="${p.min || p.step}"` : "";

  return `
    <div class="img-and-text">
      ${imgHtml}
      <p class="info-product">
        ${p.nombre}<br/>${p.info}
        ${infoExtra}
      </p>
      <p class="product-input" data-product-name="${p.nombre}">
        ${p.nombre}
        ${inputField}
        <input type="number" class="number-product" name="number-product"
          placeholder="cantidad" ${stepAttr} required />
        <button class="want-btn">Agregar al 🛒</button>
      </p>
    </div>`;
}

// ── Carteras con subcategorías ────────────────────────────
//  Carteras siempre usa fondoBlur por defecto (a menos que el producto diga fondoBlur: false)
function _renderCarterasConSubcategorias(mountPoint) {
  const cat = CATEGORIAS.carteras;
  const subcats = cat.subcategorias;

  const selectHtml = `
    <div class="extra-div">
      <h5>Ver galería de imágenes de:</h5>
      <select id="carteras-select" name="carteras_select">
        ${subcats
          .map(
            (s, i) =>
              `<option value="carousel-carteras-${i}">${s}</option>`
          )
          .join("")}
      </select>
    </div>`;

  const carouselHtml = subcats
    .map((sub, i) => {
      const prods = PRODUCTOS.filter(
        (p) => p.categoria === "carteras" && p.subcategoria === sub
      ).map((p) => {
        // Carteras usan blur por defecto, salvo que el producto diga fondoBlur: false
        if (p.fondoBlur === undefined) return { ...p, fondoBlur: true };
        return p;
      });
      const carouselId = `carousel-carteras-${i}`;
      const html = _buildCarousel(carouselId, prods);
      return `<div class="subcat-carousel" id="wrap-${carouselId}"
        style="display:${i === 0 ? "block" : "none"}">${html}</div>`;
    })
    .join("");

  mountPoint.innerHTML = selectHtml + carouselHtml;

  // Bind select
  const select = mountPoint.querySelector("#carteras-select");
  select?.addEventListener("change", function () {
    mountPoint.querySelectorAll(".subcat-carousel").forEach((el) => {
      el.style.display = "none";
    });
    const target = mountPoint.querySelector(`#wrap-${this.value}`);
    if (target) target.style.display = "block";
  });
}

// ── Extras (catálogos, PDFs, carta de tinturas) ───────────
function _renderExtras(cat, section) {
  const extrasMount = section.querySelector(".extras-mount");
  if (!extrasMount || !cat.extras) return;

  let html = "";

  // Catálogos (librería)
  if (cat.extras.catalogos) {
    html += `
      <div class="extra-div">
        <h6 class="mt-5">Haz click para ver nuestros catálogos completos 🔽</h6>
        <div class="catalogo">
          ${cat.extras.catalogos
            .map(
              (c) => `
            <div>
              <a href="${c.url}" target="_blank" rel="noopener noreferrer">
                <h5>${c.titulo}</h5>
                <img src="${c.imagen}" alt="${c.titulo}" />
              </a>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  // Carta de tinturas
  if (cat.extras.carta) {
    html += `
      <div class="extra-div">
        <h5>Carta de tonos</h5>
        <a href="${cat.extras.carta.pdf}" target="_blank" rel="noopener noreferrer">
          <button class="download-btn">
            Descargar carta
            <img class="icon-img" src="./assets/descargar.png" alt="" />
          </button>
        </a>
        <div class="carta-img-div">
          ${cat.extras.carta.imagenes
            .map((img) => `<img src="${img}" alt="Carta de colores" />`)
            .join("")}
        </div>
      </div>`;
  }

  // PDF sublimados
  if (cat.extras.pdf) {
    html += `
      <div class="extra-div my-5">
        <h5 class="mt-5">Elige aquí tus diseños preferidos para sublimar:</h5>
        <div class="pdf-viewer">
          <iframe src="${cat.extras.pdf.src}"></iframe>
        </div>
        <div class="btn-div">
          <a href="${cat.extras.pdf.url}" target="_blank" rel="noopener noreferrer">
            <button class="download-btn">
              Ver catálogo en una pestaña nueva
              <img class="icon-img" src="./assets/openicon.png" alt="" />
            </button>
          </a>
        </div>
      </div>`;
  }

  extrasMount.innerHTML = html;
}

// ── Event delegation — botones "Agregar al 🛒" ────────────
function _bindAllWantButtons() {
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("want-btn")) return;

    const btn = e.target;
    const parent = btn.parentElement;

    // Producto simple: data-product en el botón
    if (btn.dataset.product) {
      addToCart(btn.dataset.product);
      _showAddedMessage(btn);
      return;
    }

    // Producto con inputs
    const typeInput = parent.querySelector(".type-product");
    const qtyInput = parent.querySelector(".number-product");
    const productName = parent.dataset.productName || parent.textContent.split("\n")[0].trim();

    let detail = "";
    if (typeInput?.tagName === "SELECT") {
      detail = typeInput.options[typeInput.selectedIndex]?.text || "";
    } else if (typeInput) {
      detail = typeInput.value.trim();
    }

    const qty = qtyInput ? qtyInput.value.trim() : "";
    const productText = [
      productName,
      detail ? detail : null,
      qty ? `cantidad: ${qty}` : null,
    ]
      .filter(Boolean)
      .join(" — ");

    addToCart(productText);
    _showAddedMessage(btn);

    if (typeInput) typeInput.value = "";
    if (qtyInput) qtyInput.value = "";
  });
}

function _showAddedMessage(btn) {
  const msg = document.createElement("p");
  msg.textContent = "Producto añadido ✓";
  msg.className = "added-message";
  btn.parentElement.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

// ── Info buttons (mostrar/ocultar lista de colores) ───────
function _bindAllInfoButtons() {
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("info-btn")) return;
    const infoDiv = e.target.nextElementSibling;
    if (infoDiv?.classList.contains("info-div")) {
      infoDiv.style.display =
        infoDiv.style.display === "block" ? "none" : "block";
    }
  });
}

// ── Helpers ───────────────────────────────────────────────
function _chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}