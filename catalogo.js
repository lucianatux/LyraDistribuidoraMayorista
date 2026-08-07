/* ============================================================
   catalogo.js — Motor compartido de los catálogos Lyra
   ------------------------------------------------------------
   Lee un archivo JSON de productos y dibuja las tarjetas.
   Lo usan carteras y las próximas secciones (sublimados,
   promos, hebillas, tinturas). Para cambiar productos NO se
   toca este archivo: se edita el JSON de cada sección.

   Uso desde el HTML de cada catálogo:
     <main class="catalog-grid" id="catalog"></main>
     <script src="../catalogo.js"></script>
     <script>Catalogo.init({ json: "carteras.json" });</script>

   El JSON define su propia carpeta de imágenes en "imgBase".
   ============================================================ */
(function () {
  "use strict";

  // --- Íconos (idénticos a los que usaba carteras) ---
  var CART_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>';
  var CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';

  // --- Helpers ---
  function fmt(n) {
    return "$" + Number(n).toLocaleString("es-AR");
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // === RENDER: arma las tarjetas desde las secciones del JSON ===
  function render(secciones, imgBase) {
    var catalog = document.getElementById("catalog");
    if (!catalog) return;
    var html = "";

    secciones.forEach(function (sec) {
      var items = sec.productos || [];
      if (!items.length) return;

      html +=
        '<div class="section-header" data-section="' + sec.id + '">' +
        "<h3>" + esc(sec.titulo) + "</h3>" +
        '<span class="count">' +
        items.length +
        " producto" +
        (items.length === 1 ? "" : "s") +
        "</span>" +
        "</div>";

      items.forEach(function (p, i) {
        var delay = (0.05 + i * 0.05).toFixed(2);
        var badge = p.badge
          ? '<span class="card-badge">' + esc(p.badge) + "</span>"
          : "";

        // Precio base + selector (según tipo de producto)
        var precioInicial,
          selectHtml = "",
          nombreCarrito,
          colores;

        if (p.variantesPrecio) {
          // Producto con precio por variante (ej. cartucheras)
          precioInicial = p.variantesPrecio[0].precio;
          colores = p.variantesPrecio.map(function (v) {
            return v.label;
          });
          nombreCarrito = p.nombre + " - " + p.variantesPrecio[0].label;
          selectHtml =
            '<select class="variant-select" onchange="updateVariantPrice(this)">' +
            p.variantesPrecio
              .map(function (v) {
                return (
                  '<option value="' +
                  esc(v.label) +
                  '" data-price="' +
                  v.precio +
                  '">' +
                  esc(v.label) +
                  " - " +
                  fmt(v.precio) +
                  "</option>"
                );
              })
              .join("") +
            "</select>";
        } else {
          precioInicial = p.precio;
          colores = p.colores || [];
          var base = p.nombreCarrito || p.nombre;
          nombreCarrito = colores.length > 1 ? base + " - " + colores[0] : base;
          if (colores.length > 1) {
            selectHtml =
              '<select class="variant-select" onchange="updateVariant(this)">' +
              colores
                .map(function (c) {
                  return '<option value="' + esc(c) + '">' + esc(c) + "</option>";
                })
                .join("") +
              "</select>";
          }
        }

        var chips = (colores || [])
          .map(function (c) {
            return '<span class="color-tag">' + esc(c) + "</span>";
          })
          .join("");

        // Texto libre opcional (ej. "Diseño a elección"). Solo si el producto lo trae.
        var textoLibreHtml = "";
        if (p.textoLibre) {
          var tl = p.textoLibre;
          textoLibreHtml =
            '<label class="free-text-label">' +
            esc(tl.label || "Personalización") +
            '<input type="text" class="free-text-input" ' +
            'placeholder="' + esc(tl.placeholder || "") + '" ' +
            'oninput="updateFreeText(this)" />' +
            "</label>";
        }

        html +=
          '<article class="product-card" data-category="' +
          sec.id +
          '" style="animation-delay: ' +
          delay +
          's">' +
          '<div class="card-image">' +
          '<img src="./' +
          imgBase +
          esc(p.img) +
          '" alt="' +
          esc(p.nombre) +
          '" loading="lazy" />' +
          badge +
          "</div>" +
          '<div class="card-body">' +
          '<h4 class="card-name">' +
          esc(p.nombre) +
          "</h4>" +
          '<p class="card-desc">' +
          esc(p.desc) +
          "</p>" +
          '<div class="card-colors">' +
          chips +
          "</div>" +
          selectHtml +
          textoLibreHtml +
          '<div class="card-footer">' +
          '<div class="card-price">' +
          fmt(precioInicial) +
          "<small>precio por mayor</small></div>" +
          '<button class="btn-add" data-name="' +
          esc(nombreCarrito) +
          '" data-price="' +
          precioInicial +
          '" onclick="addToCart(this)">' +
          CART_SVG +
          " Agregar" +
          "</button>" +
          "</div>" +
          "</div>" +
          "</article>";
      });
    });

    catalog.innerHTML = html;
  }

  // === FILTROS (lee las pills que están en el HTML) ===
  function initFilters() {
    document.querySelectorAll(".filter-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        document.querySelectorAll(".filter-pill").forEach(function (p) {
          p.classList.remove("active");
        });
        pill.classList.add("active");
        var filter = pill.dataset.filter;
        document.querySelectorAll(".product-card").forEach(function (card) {
          card.dataset.hidden =
            filter !== "all" && card.dataset.category !== filter
              ? "true"
              : "false";
        });
        document.querySelectorAll(".section-header").forEach(function (header) {
          var section = header.dataset.section;
          header.style.display =
            filter !== "all" && section !== filter ? "none" : "";
        });
      });
    });
  }

  // === Arma el nombre para el carrito según el estado de la tarjeta ===
  // Combina: nombre base + opción del desplegable (si hay) + texto libre (si hay).
  // Así el desplegable y el texto libre conviven sin pisarse.
  function composeName(card) {
    var parts = [card.querySelector(".card-name").textContent];
    var sel = card.querySelector(".variant-select");
    if (sel) parts.push(sel.value);
    var free = card.querySelector(".free-text-input");
    if (free && free.value.trim()) parts.push(free.value.trim());
    return parts.join(" - ");
  }

  // Vuelve el botón al estado "Agregar" (si se cambió algo tras haber agregado)
  function resetAddButton(btn) {
    btn.classList.remove("added");
    btn.innerHTML = CART_SVG + " Agregar";
  }

  // === SELECTOR DE COLOR (mismo precio) ===
  function updateVariant(select) {
    var card = select.closest(".product-card");
    var btn = card.querySelector(".btn-add");
    btn.dataset.name = composeName(card);
    resetAddButton(btn);
  }

  // === SELECTOR DE VARIANTE CON PRECIO (ej. cartucheras) ===
  function updateVariantPrice(select) {
    var opt = select.options[select.selectedIndex];
    var price = opt.dataset.price;
    var card = select.closest(".product-card");
    var priceEl = card.querySelector(".card-price");
    var btn = card.querySelector(".btn-add");
    priceEl.innerHTML = fmt(price) + "<small>precio por mayor</small>";
    btn.dataset.price = price;
    btn.dataset.name = composeName(card);
    resetAddButton(btn);
  }

  // === TEXTO LIBRE (opcional, ej. "Diseño a elección") ===
  function updateFreeText(input) {
    var card = input.closest(".product-card");
    var btn = card.querySelector(".btn-add");
    btn.dataset.name = composeName(card);
    resetAddButton(btn);
  }

  // === AGREGAR AL CARRITO — usa window.lyraCart.add(nombre, precio, cantidad) ===
  function addToCart(btn) {
    var nombre = btn.dataset.name;
    var precio = parseInt(btn.dataset.price);

    if (window.lyraCart && typeof window.lyraCart.add === "function") {
      window.lyraCart.add(nombre, precio, 1);
    } else {
      var cart = JSON.parse(localStorage.getItem("lyra_products") || "[]");
      var existing = cart.findIndex(function (i) {
        return i.nombre === nombre;
      });
      if (existing >= 0) {
        cart[existing].cantidad++;
      } else {
        cart.push({ nombre: nombre, precio: precio, cantidad: 1 });
      }
      localStorage.setItem("lyra_products", JSON.stringify(cart));
    }

    btn.classList.add("added");
    btn.innerHTML = CHECK_SVG + " Agregado";
    setTimeout(function () {
      btn.classList.remove("added");
      btn.innerHTML = CART_SVG + " Agregar";
    }, 1500);
  }

  // === INIT: descarga el JSON y dibuja ===
  function init(opts) {
    opts = opts || {};
    var jsonUrl = opts.json;
    if (!jsonUrl) {
      console.error("[catalogo] Falta la opción 'json' con la ruta del archivo.");
      return;
    }
    fetch(jsonUrl)
      .then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar " + jsonUrl + " (" + r.status + ")");
        return r.json();
      })
      .then(function (data) {
        var imgBase = data.imgBase || "";
        render(data.secciones || [], imgBase);
        initFilters();
      })
      .catch(function (err) {
        console.error("[catalogo] Error:", err);
        var catalog = document.getElementById("catalog");
        if (catalog) {
          catalog.innerHTML =
            '<p style="text-align:center;padding:2rem;color:#a00">' +
            "No se pudieron cargar los productos. Revisá la consola." +
            "</p>";
        }
      });
  }

  // Exponer lo necesario en window (los onclick/onchange inline los usan)
  window.Catalogo = { init: init };
  window.updateVariant = updateVariant;
  window.updateVariantPrice = updateVariantPrice;
  window.updateFreeText = updateFreeText;
  window.addToCart = addToCart;
})();
