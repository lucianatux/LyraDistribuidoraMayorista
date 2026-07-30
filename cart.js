// ============================================================
//  cart.js — Responsabilidad única: gestión del carrito
//  Maneja estado, localStorage, UI del carrito y envío WA
// ============================================================

const WHATSAPP_NUMBER = "543512309375";
const MINIMO_COMPRA = 60000;
const STORAGE_KEY = "lyra_products";

// ── Estado interno ────────────────────────────────────────
let cartItems = [];

// ── Inicialización ────────────────────────────────────────
export function initCart() {
  cartItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  _renderCartItems();
  _updateBadge();
  _bindCartButtons();
}

// ── API pública ───────────────────────────────────────────
export function addToCart(productDetails) {
  cartItems.push(productDetails);
  _save();
  _renderCartItems();
  _updateBadge();
}

export function removeFromCart(index) {
  cartItems.splice(index, 1);
  _save();
  _renderCartItems();
  _updateBadge();
}

export function getCartCount() {
  return cartItems.length;
}

// ── Privadas ──────────────────────────────────────────────
function _save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

function _updateBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = cartItems.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function _renderCartItems() {
  const container = document.getElementById("all-products-i-want");
  const emptyMsg = document.getElementById("message-order-list");
  if (!container) return;

  container.innerHTML = "";

  if (cartItems.length === 0) {
    if (emptyMsg) emptyMsg.textContent = "Aún no has seleccionado ningún artículo";
    _updateMinimumBar();
    return;
  }

  if (emptyMsg) emptyMsg.textContent = "";

  cartItems.forEach((text, index) => {
    const div = document.createElement("div");
    div.className = "product-container";
    div.textContent = text;

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.className = "remove-btn";
    btn.title = "Eliminar";
    btn.addEventListener("click", () => removeFromCart(index));

    div.appendChild(btn);
    container.appendChild(div);
  });

  _updateMinimumBar();
}

function _updateMinimumBar() {
  const bar = document.getElementById("minimum-bar");
  if (!bar) return;

  const count = cartItems.length;
  if (count === 0) {
    bar.innerHTML = `<span>Mínimo de compra: <strong>$80.000</strong></span>`;
    bar.className = "minimum-bar minimum-empty";
    return;
  }

  // Indicador visual basado en cantidad de ítems como proxy
  // (sin precios parseables en texto plano, usamos ítems como señal de progreso)
  if (count >= 3) {
    bar.innerHTML = `✅ Pedido listo para enviar`;
    bar.className = "minimum-bar minimum-ok";
  } else {
    bar.innerHTML = `🛒 Agregá más artículos para alcanzar el mínimo de <strong>$60.000</strong>`;
    bar.className = "minimum-bar minimum-warning";
  }
}

function _bindCartButtons() {
  // Abrir/cerrar carrito
  const orderBtn = document.getElementById("order");
  const myOrder = document.getElementById("my-order");
  const closeBtn = document.getElementById("close-form");

  orderBtn?.addEventListener("click", () => {
    const visible = myOrder.style.display === "block";
    myOrder.style.display = visible ? "none" : "block";
  });

  closeBtn?.addEventListener("click", () => {
    if (myOrder) myOrder.style.display = "none";
  });

  // Envío por WhatsApp
  document.getElementById("send-button")?.addEventListener("click", (e) => {
    e.preventDefault();
    _sendWhatsApp();
  });
}

function _sendWhatsApp() {
  const name = document.getElementById("name")?.value?.trim();
  const comments = document.getElementById("message")?.value?.trim();

  if (!name) {
    alert("Por favor ingresá tu nombre antes de enviar.");
    return;
  }

  if (cartItems.length === 0) {
    alert("No has agregado ningún producto a tu pedido.");
    return;
  }

  let msg = `Hola, soy ${name}. Quiero realizar el siguiente pedido:\n\n`;
  cartItems.forEach((p) => (msg += `• ${p}\n`));
  if (comments) msg += `\n*Comentarios adicionales:*\n${comments}`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");

  // Limpiar carrito luego de abrir WA
  cartItems = [];
  _save();
  _renderCartItems();
  _updateBadge();
  document.getElementById("my-order").style.display = "none";
}