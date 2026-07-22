# Lyra Distribuidora

Wholesale product catalog with a persistent cart and WhatsApp checkout. Live production site for a distributor in Córdoba, Argentina.

**[distribuidoralyra.com](https://distribuidoralyra.com/)**

---

## What it does

- **Category catalog** (deals, stationery, hair accessories, hair dye, bags, sublimated goods) with responsive carousels.
- **Extended catalog** of 2,700+ products with search, price sorting, infinite scroll and a detail view.
- **Persistent cart** shared across every page of the site (localStorage), with quantities and running total.
- **Backend-free checkout**: the order is assembled into a message and opened directly in WhatsApp via deep link.

## Stack

Vanilla JavaScript (ES Modules) · HTML5 · CSS3 · Bootstrap 5 · localStorage API

No frameworks, no build step, no server dependencies. Deployed as a static site.

## Technical decisions

**Data-driven catalog.** All content lives in `products.js` as plain data; `catalogProducts.js` generates the DOM from it. Adding a product means editing one object — no HTML involved.

**Cart as a self-contained widget.** `lyra-cart-widget.js` is an IIFE that injects its own CSS and markup, exposes a global API (`window.lyraCart`) and works on any page with a single `<script>` tag. It handles automatic migration from the previous data format, cross-tab syncing via the `storage` event, and polling for same-tab changes.

**Genuinely responsive carousels.** Instead of hiding cards with CSS, the carousel re-renders when the breakpoint is crossed (1 card on mobile, 2 on desktop), with resize debounced at 250 ms.

**Priority search.** Results that *start with* the query rank above those that merely contain it — closer to what users expect than a flat `includes()`. Input is debounced.

**Performance on long lists.** Batched rendering (40 at a time) with `IntersectionObserver` and `loading="lazy"` images, handling thousands of products without virtualization or extra libraries.

## Structure

```
├── index.html              # Landing page + category sections
├── script.js               # Entry point (module initialization)
├── products.js             # Product database
├── catalogProducts.js      # Catalog rendering
├── navigation.js           # Navigation and active menu state
├── animations.js           # Animations
├── lyra-cart-widget.js     # Global cart (standalone)
├── styles.css
└── libreria/               # Extended catalog (JSON + search)
```

---

Built by Luciana Caminos Cano  (https://github.com/lucianatux) · Córdoba, Argentina
