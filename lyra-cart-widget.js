// ============================================================
//  lyra-cart-widget.js — Carrito unificado para todo el sitio
//
//  REEMPLAZA a cart.js — un solo archivo para todas las páginas.
//  Incluir en cada página con:
//    <script src="./lyra-cart-widget.js"></script>
//    (o "../lyra-cart-widget.js" desde subcarpetas)
//
//  Formato de datos en localStorage:
//    [{nombre: "Cartulinas color", precio: 498, cantidad: 10}, ...]
//
//  API global disponible para otros scripts:
//    window.lyraCart.add(nombre, precio, cantidad)
//    window.lyraCart.getCount()
//    window.lyraCart.open()
// ============================================================

(function () {
  var CART_KEY = "lyra_products";
  var WA_NUMBER = "543512309375";

  // ── Data ──
  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      // Migrate old format (array of strings) to new format
      if (data.length > 0 && typeof data[0] === "string") {
        return data.map(function (text) {
          var precio = 0;
          var match = text.match(/\$[\d.,]+/);
          if (match) {
            precio =
              parseFloat(
                match[0].replace("$", "").replace(/\./g, "").replace(",", "."),
              ) || 0;
          }
          var nombre = text.replace(/\s*—\s*\$[\d.,]+/, "").trim();
          return { nombre: nombre, precio: precio, cantidad: 1, sku: "" };
        });
      }
      return data;
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateBadge();
    if (panel && panel.classList.contains("open")) renderPanel();
    syncLegacyBadge();
  }

  function addItem(nombre, precio, cantidad, sku) {
    var cart = getCart();
    cantidad = cantidad || 1;
    // Redondeamos el precio al entrar: de acá en adelante el carrito solo
    // maneja enteros, así el precio guardado coincide con el que se ve en
    // la tarjeta y la suma siempre cierra.
    precio = Math.round(precio || 0);
    sku = sku || "";

    // Buscar si ya existe (por SKU si lo tiene, si no por nombre)
    var existing = -1;
    for (var i = 0; i < cart.length; i++) {
      var mismo = sku ? cart[i].sku === sku : cart[i].nombre === nombre;
      if (mismo) {
        existing = i;
        break;
      }
    }

    if (existing >= 0) {
      cart[existing].cantidad += cantidad;
      cart[existing].precio = precio || cart[existing].precio;
      if (sku) cart[existing].sku = sku;
      saveCart(cart);
      showToast(
        "Cantidad actualizada en el carrito (" + cart[existing].cantidad + ")",
        false,
      );
      return;
    }

    cart.push({ nombre: nombre, precio: precio, cantidad: cantidad, sku: sku });
    saveCart(cart);
    showToast("Producto añadido ✓", true);
  }

  function removeItem(index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }

  function updateQuantity(index, newQty) {
    var cart = getCart();
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].cantidad = newQty;
    }
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function getTotal() {
    var cart = getCart();
    var total = 0;
    cart.forEach(function (item) {
      // Redondeamos el unitario y recién ahí multiplicamos, así el total
      // es exactamente la suma de los subtotales que ve el cliente.
      total += Math.round(item.precio || 0) * (item.cantidad || 1);
    });
    return total;
  }

  function getItemCount() {
    var cart = getCart();
    var count = 0;
    cart.forEach(function (item) {
      count += item.cantidad || 1;
    });
    return count;
  }

  // ── Toast notification ──
  var toastTimeout;
  function showToast(text, isNew) {
    var existing = document.getElementById("lyra-toast");
    if (existing) existing.remove();
    clearTimeout(toastTimeout);

    var toast = document.createElement("div");
    toast.id = "lyra-toast";
    toast.style.cssText =
      "position:fixed;bottom:84px;right:24px;z-index:10001;" +
      "background:" +
      (isNew ? "#2d5a27" : "#3d444c") +
      ";color:#eef;padding:10px 18px;" +
      "border-radius:8px;font-family:system-ui,sans-serif;font-size:13px;font-weight:500;" +
      "box-shadow:0 4px 16px rgba(0,0,0,0.2);opacity:0;transform:translateY(8px);" +
      "transition:opacity 0.25s,transform 0.25s;pointer-events:none;max-width:280px";
    toast.textContent = text;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    toastTimeout = setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2200);
  }

  // ── Inject CSS ──
  var style = document.createElement("style");
  style.textContent =
    "#lyra-cw{position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Instrument Sans','DM Sans',system-ui,sans-serif}" +
    "#lyra-cw-btn{width:54px;height:54px;border-radius:50%;background:#3d444c;color:#eef;border:none;cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.22);position:relative;transition:transform 0.15s,background 0.15s}" +
    "#lyra-cw-btn:hover{transform:scale(1.08);background:#4a525a}" +
    "#lyra-cw-badge{position:absolute;top:-4px;right:-4px;background:#f0b913;color:#1a1815;font-size:11px;font-weight:700;min-width:22px;height:22px;border-radius:11px;display:none;align-items:center;justify-content:center;padding:0 5px}" +
    "#lyra-cw-badge.on{display:flex}" +
    "#lyra-cw-panel{display:none;position:fixed;bottom:86px;right:24px;width:360px;max-height:75vh;background:#eef;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,0.18);overflow:hidden;flex-direction:column;z-index:10000}" +
    "#lyra-cw-panel.open{display:flex}" +
    ".lcw-hd{padding:14px 18px;background:#3d444c;color:#eef;display:flex;align-items:center;justify-content:space-between}" +
    ".lcw-hd h3{font-size:15px;font-weight:600;margin:0}" +
    ".lcw-hd-x{background:none;border:none;color:rgba(255,255,255,0.7);font-size:20px;cursor:pointer;padding:0;line-height:1}.lcw-hd-x:hover{color:#eef}" +
    ".lcw-list{flex:1;overflow-y:auto;max-height:45vh}" +
    ".lcw-empty{padding:28px;text-align:center;color:#999;font-size:13px}" +
    ".lcw-item{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid #f3f1ec;font-size:13px;color:#333}" +
    ".lcw-item:last-child{border-bottom:none}" +
    ".lcw-item-info{flex:1;min-width:0}" +
    ".lcw-item-name{font-weight:500;line-height:1.3;margin-bottom:2px;word-wrap:break-word}" +
    ".lcw-item-price{font-size:12px;color:#888}" +
    ".lcw-qty{display:flex;align-items:center;gap:0;border:1px solid #eef;border-radius:6px;overflow:hidden;flex-shrink:0}" +
    ".lcw-qty button{width:28px;height:28px;background:#f5f3ee;border:none;cursor:pointer;font-size:14px;color:#555;display:flex;align-items:center;justify-content:center;transition:background 0.1s}" +
    ".lcw-qty button:hover{background:#e8e5dd}" +
    ".lcw-qty span{width:32px;text-align:center;font-size:13px;font-weight:600;background:#eef}" +
    ".lcw-del{background:none;border:none;color:#ccc;font-size:16px;cursor:pointer;padding:2px;flex-shrink:0}.lcw-del:hover{color:#e55}" +
    ".lcw-ft{padding:14px 18px;border-top:1px solid #eef;background:#faf9f6}" +
    ".lcw-total{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:14px}" +
    ".lcw-total-label{color:#888}" +
    ".lcw-total-val{font-size:20px;font-weight:700;color:#1a1815}" +
    ".lcw-name{width:100%;padding:8px 12px;border:1px solid #eef;border-radius:6px;font-family:inherit;font-size:13px;outline:none;margin-bottom:8px;box-sizing:border-box}.lcw-name:focus{border-color:#f0b913}" +
    ".lcw-send{width:100%;padding:10px;background:#1baa4a;color:#eef;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 0.15s}.lcw-send:hover{background:#20bd5a}" +
    ".lcw-clear{display:block;width:100%;background:none;border:none;color:#bbb;font-size:12px;cursor:pointer;padding:6px 0;text-align:center;margin-top:4px}.lcw-clear:hover{color:#e55}" +
    "@media(max-width:500px){#lyra-cw-panel{right:8px;left:8px;width:auto;bottom:86px}#lyra-cw{right:16px;bottom:16px}}";
  document.head.appendChild(style);

  // ── Inject HTML ──
  var container = document.createElement("div");
  container.id = "lyra-cw";
  container.innerHTML =
    '<button id="lyra-cw-btn" title="Ver carrito"><span style="pointer-events:none">🛒</span><span id="lyra-cw-badge">0</span></button>' +
    '<div id="lyra-cw-panel">' +
    '<div class="lcw-hd"><h3>Carrito de compras</h3><button class="lcw-hd-x" id="lcw-close">\u2715</button></div>' +
    '<div class="lcw-list" id="lcw-list"></div>' +
    '<div class="lcw-ft" id="lcw-ft">' +
    '<div class="lcw-total"><span class="lcw-total-label">Total estimado</span><span class="lcw-total-val" id="lcw-total">$0</span></div>' +
    '<input class="lcw-name" id="lcw-name" type="text" placeholder="Tu nombre">' +
    '<button class="lcw-send" id="lcw-send">Enviar pedido por WhatsApp</button>' +
    '<button class="lcw-clear" id="lcw-clear">Vaciar carrito</button>' +
    "</div>" +
    "</div>";
  document.body.appendChild(container);

  var btn = document.getElementById("lyra-cw-btn");
  var badge = document.getElementById("lyra-cw-badge");
  var panel = document.getElementById("lyra-cw-panel");

  // ── Toggle panel ──
  btn.addEventListener("click", function () {
    if (panel.classList.contains("open")) {
      panel.classList.remove("open");
    } else {
      renderPanel();
      panel.classList.add("open");
    }
  });
  document.getElementById("lcw-close").addEventListener("click", function () {
    panel.classList.remove("open");
  });

  // ── Render panel ──
  function renderPanel() {
    var cart = getCart();
    var listEl = document.getElementById("lcw-list");

    if (cart.length === 0) {
      listEl.innerHTML =
        '<div class="lcw-empty">Aún no agregaste productos al carrito</div>';
      document.getElementById("lcw-total").textContent = "$0";
      return;
    }

    listEl.innerHTML = cart
      .map(function (item, i) {
        var unit = Math.round(item.precio || 0);
        var subtotal = unit * (item.cantidad || 1);
        var priceText = unit
          ? fmtP(unit) +
            (item.cantidad > 1
              ? " × " + item.cantidad + " = " + fmtP(subtotal)
              : "")
          : "";
        var skuTag = item.sku
          ? '<span style="color:#b0a9a0;font-size:11px;font-weight:600">SKU ' +
            escH(item.sku) +
            "</span> "
          : "";
        return (
          '<div class="lcw-item">' +
          '<div class="lcw-item-info"><div class="lcw-item-name">' +
          skuTag +
          escH(item.nombre) +
          "</div>" +
          '<div class="lcw-item-price">' +
          priceText +
          "</div></div>" +
          '<div class="lcw-qty">' +
          '<button data-act="dec" data-i="' +
          i +
          '">−</button>' +
          "<span>" +
          (item.cantidad || 1) +
          "</span>" +
          '<button data-act="inc" data-i="' +
          i +
          '">+</button>' +
          "</div>" +
          '<button class="lcw-del" data-act="del" data-i="' +
          i +
          '" title="Quitar">\u2715</button>' +
          "</div>"
        );
      })
      .join("");

    document.getElementById("lcw-total").textContent = fmtP(getTotal());

    // Bind actions via delegation
    listEl.onclick = function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var idx = parseInt(btn.dataset.i);
      var act = btn.dataset.act;
      var cart = getCart();
      if (act === "inc") {
        updateQuantity(idx, (cart[idx].cantidad || 1) + 1);
      } else if (act === "dec") {
        updateQuantity(idx, (cart[idx].cantidad || 1) - 1);
      } else if (act === "del") {
        removeItem(idx);
      }
    };
  }

  // ── Send WhatsApp ──
  document.getElementById("lcw-send").addEventListener("click", function () {
    var name = document.getElementById("lcw-name").value.trim();
    if (!name) {
      var input = document.getElementById("lcw-name");
      input.style.borderColor = "#e55";
      input.focus();
      input.addEventListener(
        "input",
        function () {
          input.style.borderColor = "";
        },
        { once: true },
      );
      return;
    }
    var cart = getCart();
    if (cart.length === 0) return;

    var msg =
      "Hola, soy " + name + ". Quiero realizar el siguiente pedido:\n\n";
    cart.forEach(function (item) {
      var cant = item.cantidad || 1;
      var unit = Math.round(item.precio || 0);
      var unidad = cant === 1 ? "unidad" : "unidades";

      // Renglón 1: cantidad
      msg += "• " + cant + " " + unidad + " de\n";
      // Renglón 2: SKU (solo si el producto lo tiene — los de la home no)
      if (item.sku) msg += "Sku " + item.sku + "\n";
      // Renglón 3: nombre
      msg += item.nombre + "\n";
      // Renglón 4: precio unitario × cantidad = subtotal
      if (unit) {
        if (cant > 1) {
          msg +=
            fmtP(unit) + " c/u x " + cant + " = " + fmtP(unit * cant) + "\n";
        } else {
          msg += fmtP(unit) + "\n";
        }
      }
      msg += "\n"; // línea en blanco entre productos
    });
    var total = getTotal();
    if (total > 0) msg += "\nTotal estimado: " + fmtP(total);

    window.open(
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg),
      "_blank",
    );
    clearCart();
    panel.classList.remove("open");
  });

  // ── Clear ──
  document.getElementById("lcw-clear").addEventListener("click", function () {
    if (getCart().length === 0) return;
    if (confirm("\u00bfVaciar el carrito?")) clearCart();
  });

  // ── Badge ──
  function updateBadge() {
    var count = getItemCount();
    badge.textContent = count;
    badge.className = count > 0 ? "on" : "";
  }

  // ── Sync legacy badge on main page ──
  function syncLegacyBadge() {
    var legacyBadge = document.getElementById("cart-badge");
    if (legacyBadge) {
      var count = getItemCount();
      legacyBadge.textContent = count;
      legacyBadge.style.display = count > 0 ? "flex" : "none";
    }
  }

  // ── Helpers ──
  function fmtP(n) {
    return "$" + Math.round(n).toLocaleString("es-AR");
  }
  function escH(s) {
    var d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  // ── Listen for storage changes from other tabs ──
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) {
      updateBadge();
      if (panel.classList.contains("open")) renderPanel();
    }
  });

  // ── Poll for same-tab changes (from other scripts adding items) ──
  var lastJson = localStorage.getItem(CART_KEY) || "[]";
  setInterval(function () {
    var current = localStorage.getItem(CART_KEY) || "[]";
    if (current !== lastJson) {
      lastJson = current;
      updateBadge();
      if (panel.classList.contains("open")) renderPanel();
    }
  }, 400);

  // ── Global API ──
  window.lyraCart = {
    add: addItem,
    remove: removeItem,
    getCount: getItemCount,
    getTotal: getTotal,
    open: function () {
      renderPanel();
      panel.classList.add("open");
    },
    close: function () {
      panel.classList.remove("open");
    },
  };

  // ── Also expose addToCart for backward compatibility with catalogProducts.js ──
  // catalogProducts.js imports addToCart from cart.js, but we want it to use our system.
  // Since catalogProducts uses ES modules, we can't override the import directly.
  // Instead, we intercept localStorage writes from the old cart.js format and migrate them.
  // The polling above handles this automatically.

  // ── Init ──
  // Migrate old data if needed
  var migrated = getCart();
  if (migrated.length > 0) {
    var raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed.length > 0 && typeof parsed[0] === "string") {
          saveCart(migrated); // saves migrated format
        }
      } catch (e) {}
    }
  }
  updateBadge();

  // ── Hide old cart button on main page to avoid duplicates ──
  // We keep the old #order button working but make it open our panel instead
  setTimeout(function () {
    var oldOrder = document.getElementById("order");
    if (oldOrder) {
      // Clone to remove old event listeners
      var newOrder = oldOrder.cloneNode(true);
      oldOrder.parentNode.replaceChild(newOrder, oldOrder);
      newOrder.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        renderPanel();
        panel.classList.add("open");
      });
    }
    // Hide old cart modal
    var oldModal = document.getElementById("my-order");
    if (oldModal) oldModal.style.display = "none";
  }, 500);
})();
