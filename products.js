// ============================================================
//  LYRA DISTRIBUIDORA — Base de datos de productos
//  Para agregar o editar un producto, solo modificar acá.
//  No tocar index.html para cambios de catálogo.
// ============================================================

export const CATEGORIAS = {
  promos: {
    id: "promos",
    titulo: "PROMOCIONES",
    icono: "./assets/promo.png",
    tipo: "simple", // tarjetas sin inputs
  },
  libreria: {
    id: "libreria",
    titulo: "LIBRERÍA",
    icono: "./assets/libreria.png",
    tipo: "inputs",
    extras: {
      // Podés sumar más catálogos web agregando objetos a este array.
      catalogoWeb: [
        {
          url: "./libreria/libreria.html",
          titulo: "Catálogo completo de Librería",
          descripcion:
            "Explorá nuestro catálogo online de librería. Buscá por nombre, filtrá por precio y agregá directo al carrito.",
          boton: "Ver catálogo de librería →",
          preview: [
            { icon: "📚", label: "Cuadernos" },
            { icon: "✏️", label: "Útiles" },
            { icon: "🎨", label: "Arte" },
            { icon: "📐", label: "Escolar" },
          ],
        },
        {
          url: "./jugueteria/jugueteria.html",
          titulo: "Catálogo completo de Juguetería",
          descripcion:
            "Juegos, muñecas, autos, rompecabezas, cotillón y mucho más. Precios por mayor, pedí directo desde el catálogo.",
          boton: "Ver catálogo de juguetes →",
          preview: [
            { icon: "🧸", label: "Peluches" },
            { icon: "🚗", label: "Autos" },
            { icon: "🧩", label: "Rompecabezas" },
            { icon: "🎲", label: "Juegos" },
          ],
        },
      ],
    },
  },
  hebillas: {
    id: "hebillas",
    titulo: "HEBILLAS | ACCESORIOS PARA EL PELO",
    icono: "./assets/pelo.png",
    tipo: "simple",
  },
  tinturas: {
    id: "tinturas",
    titulo: "TINTURAS Y TRATAMIENTOS",
    icono: "./assets/tinturas.png",
    tipo: "inputs",
    extras: {
      carta: {
        pdf: "./tinturas/carta.pdf",
        imagenes: ["./tinturas/carta.jpg", "./tinturas/cartafunky.jpg"],
      },
    },
  },
  carteras: {
    id: "carteras",
    titulo: "CARTERAS Y AFINES",
    icono: "./assets/carteras.png",
    tipo: "mixto",
    subcategorias: [
      "Carteras",
      "Bandoleras",
      "Mochilas",
      "Accesorios",
      "Handbags-Sobres",
    ],
  },
  sublimados: {
    id: "sublimados",
    titulo: "PRODUCTOS SUBLIMADOS",
    icono: "./assets/sublim.png",
    tipo: "inputs",
    extras: {
      pdf: {
        src: "./sublimados/Sublimados2026.pdf",
        url: "./sublimados/Sublimados2026.pdf",
      },
    },
  },
};

// ------------------------------------------------------------
//  Cada producto tiene:
//   imagen    → ruta a la foto
//   nombre    → texto que aparece en la tarjeta
//   info      → descripción adicional (precio, medidas, etc.)
//   categoria → key de CATEGORIAS
//   subcategoria → (opcional) para carteras
//   tipo      → "simple" | "input-texto" | "input-select" | "input-doble"
//   placeholder → texto del input libre (si aplica)
//   opciones  → array de strings para el <select> (si aplica)
//   step / min → para el input numérico
//   infoExtra → array de strings para el botón "ver más" (opcional)
// ------------------------------------------------------------

export const PRODUCTOS = [
  // ── PROMOS ────────────────────────────────────────────────
  {
    id: "promo-cartulinas",
    categoria: "promos",
    imagen: "./promos/cartu.jpeg",
    nombre: "PROMO CARTULINAS",
    info: "100 cartulinas (20 colores a elección. 5 unidades por color) $46.900",
    tipo: "simple",
  },
  {
    id: "promo-bolsas",
    categoria: "promos",
    imagen: "./promos/bolsas.jpeg",
    nombre: "PROMO BOLSAS",
    info: "70 bolsas (5 de cada tamaño y estilo + 20 de cotillón) $35.900",
    tipo: "simple",
  },
  {
    id: "promo-libritos",
    categoria: "promos",
    imagen: "./promos/libritos.jpg",
    nombre: "PROMO LIBRITOS PARA COLOREAR",
    info: "50 libritos surtidos $18.390",
    tipo: "simple",
  },
  {
    id: "promo-papelafiche",
    categoria: "promos",
    imagen: "./promos/papelafiche.jpg",
    nombre: "PROMO PAPEL AFICHE",
    info: "50 papeles afiche color $38.900 · 5 colores a elección. 10 unidades por color",
    tipo: "simple",
  },
  {
    id: "promo-papelregalo",
    categoria: "promos",
    imagen: "./promos/papelderegalo.jpg",
    nombre: "PROMO PAPEL DE REGALO",
    info: "50 papeles de regalo surtidos $39.900",
    tipo: "simple",
  },
  {
    id: "promo-crepe",
    categoria: "promos",
    imagen: "./promos/crepe2.jpg",
    nombre: "PROMO PAPEL CREPÉ",
    info: "$32.900 · 50 unidades. 5 colores, 10 unidades por color",
    tipo: "simple",
  },
  {
    id: "promo-vinchas",
    categoria: "promos",
    imagen: "./promos/vinchas.jpeg",
    nombre: "PROMO ACCESORIOS PELO",
    info: "10 vinchas infantiles · 10 scrunchis y 10 moños de gasa $36.900",
    tipo: "simple",
  },
  {
    id: "promo-hebillas3",
    categoria: "promos",
    imagen: "./promos/hebillas3.jpg",
    nombre: "PROMO ACCESORIOS PELO 2",
    info: "30 hebillas infantiles · 30 hebillas adulto $66.900",
    tipo: "simple",
  },
  {
    id: "promo-cartucheras",
    categoria: "promos",
    imagen: "./promos/cartus.jpg",
    nombre: "PROMO CARTUCHERAS",
    info: "10 cartucheras de neoprene sublimadas $55.600 · Diseños a elección",
    tipo: "simple",
  },
  {
    id: "promo-tinturas",
    categoria: "promos",
    imagen: "./promos/kit.jpg",
    nombre: "PROMO TINTURAS",
    info: "20 tinturas kit EstereoColor y 10 funky surtidas $66.300",
    tipo: "simple",
  },

  // ── LIBRERÍA ──────────────────────────────────────────────
  {
    id: "lib-cartulinas",
    categoria: "libreria",
    imagen: "./libreria/colorescartulinas.jpg",
    nombre: "Cartulinas",
    info: "Blanca $363 · Color $498 · Flúor $1044 · Mínimo 5 u. por color · 45x64cm",
    tipo: "input-doble",
    labelTipo: "color",
    step: 5,
    min: 5,
  },
  {
    id: "lib-gomaeva",
    categoria: "libreria",
    imagen: "./libreria/gomaeva.jpg",
    nombre: "Goma eva",
    info: "Goma eva $683 · Goma eva con brillo $1323",
    tipo: "input-doble",
    labelTipo: "color",
    step: 2,
    min: 2,
  },
  {
    id: "lib-papelafiche",
    categoria: "libreria",
    imagen: "./libreria/papelafiche.jpg",
    nombre: "Papel afiche",
    info: "Blanco $594 · Color $819 · Mínimo 10 unidades por color",
    tipo: "input-doble",
    labelTipo: "color",
    step: 10,
    min: 10,
    infoExtra: [
      "verde claro, verde medio, verde pastel, amarillo, naranja, rojo, rosa, rosa pastel, fucsia, lila, celeste, celeste pastel, azul, marrón claro, marrón oscuro, negro, gris, blanco",
    ],
    infoExtraLabel: "ver colores",
  },
  {
    id: "lib-crepe",
    categoria: "libreria",
    imagen: "./libreria/crepe2.jpg",
    nombre: "Papel crepé",
    info: "$695 · Mínimo 10 unidades por color",
    tipo: "input-doble",
    labelTipo: "color",
    step: 10,
    min: 10,
    infoExtra: [
      "verde claro, verde, amarillo, naranja, rojo, rosa, fucsia, lila, celeste, azul, marrón claro, marrón oscuro, negro, gris, blanco, bandera",
    ],
    infoExtraLabel: "ver colores",
  },
  {
    id: "lib-papelregalo",
    categoria: "libreria",
    imagen: "./libreria/papelderegalo.jpg",
    nombre: "Papel de regalo",
    info: "$850 · 70cmx100cm · Mínimo 5 u. por diseño",
    tipo: "input-select",
    labelTipo: "diseño",
    opciones: [
      "pinceladas",
      "love",
      "unicornios",
      "corazones",
      "trama multicolor",
      "corbatas",
      "mandalas",
      "juguetes",
      "llamas",
      "aviones",
      "surtido",
    ],
    step: 5,
    min: 5,
  },
  {
    id: "lib-sobres",
    categoria: "libreria",
    imagen: "./libreria/sobres.jpeg",
    nombre: "Sobres de colores",
    info: "Chico $95 · Mediano $140 · Grande $178",
    tipo: "input-select",
    labelTipo: "tamaño",
    opciones: ["chico", "mediano", "grande", "surtido"],
    step: 5,
    min: 5,
  },
  {
    id: "lib-bolsaskraft",
    categoria: "libreria",
    imagen: "./libreria/bolsaskraft.jpg",
    nombre: "Bolsas kraft",
    info: "14x20cm $414 · 22x30cm $472 · 30x41cm $532 · 14x40cm $499",
    tipo: "input-select",
    labelTipo: "medida",
    opciones: [
      "14cmx20cm",
      "22cmx30cm",
      "30cmx41cm",
      "14cmx40cm(vino)",
      "surtido",
    ],
    step: 5,
    min: 5,
  },
  {
    id: "lib-bolsasacuario",
    categoria: "libreria",
    imagen: "./libreria/bolsasacuario.jpg",
    nombre: "Bolsas Acuario (lisas de colores)",
    info: "14x20cm $536 · 22x30cm $660 · 30x41cm $871",
    tipo: "input-doble",
    labelTipo: "medida y color",
    step: 5,
    min: 5,
  },
  {
    id: "lib-bolsasfantasia",
    categoria: "libreria",
    imagen: "./libreria/bolsasfantasia.jpeg",
    nombre: "Bolsas Fantasía",
    info: "14x20cm $648 · 22x30cm $885 · 30x41cm $1229",
    tipo: "input-select",
    labelTipo: "medida",
    opciones: ["14cmx20cm", "22cmx30cm", "30cmx41cm", "surtido"],
    step: 5,
    min: 5,
  },
  {
    id: "lib-libritos",
    categoria: "libreria",
    imagen: "./libreria/libritos.jpg",
    nombre: "Libritos para colorear",
    info: "$386 · Tamaño A4 · Clásicos · Cuentos · Didácticos",
    tipo: "input-doble",
    labelTipo: "detalle",
    step: 5,
    min: 5,
  },

  // ── HEBILLAS ──────────────────────────────────────────────
  {
    id: "heb-clasicas",
    categoria: "hebillas",
    imagen: "./hebillas/broches.jpg",
    nombre: "Hebillas clásicas de adulto",
    info: "$31.000 las 20 unidades ($1.550 c/u)",
    tipo: "simple",
  },
  {
    id: "heb-infantiles",
    categoria: "hebillas",
    imagen: "./hebillas/hebinfantiles.jpeg",
    nombre: "Hebillas infantiles",
    info: "$16.600 los 20 blister ($830 c/par)",
    tipo: "simple",
  },
  {
    id: "heb-vinchasinfantiles",
    categoria: "hebillas",
    imagen: "./hebillas/vinchasinfantiles.jpg",
    nombre: "Vinchas infantiles",
    info: "$17.900 las 10 unidades surtidas ($1.790 c/u)",
    tipo: "simple",
  },
  {
    id: "heb-vinchasfiesta",
    categoria: "hebillas",
    imagen: "./hebillas/fiesta.jpg",
    nombre: "Vinchas de fiesta",
    info: "$14.500 las 5 unidades surtidas ($2.900 c/u)",
    tipo: "simple",
  },
  {
    id: "heb-monosgasa",
    categoria: "hebillas",
    imagen: "./hebillas/monosgas.jpeg",
    nombre: "Moños de gasa grandes",
    info: "$10.800 las 10 unidades surtidas ($1.080 c/u)",
    tipo: "simple",
  },
  {
    id: "heb-scrunchis",
    categoria: "hebillas",
    imagen: "./hebillas/scrunch.jpeg",
    nombre: "Scrunchis",
    info: "$10.800 las 10 unidades surtidas ($1.080 c/u)",
    tipo: "simple",
  },

  // ── TINTURAS ──────────────────────────────────────────────
  {
    id: "tin-kit",
    categoria: "tinturas",
    imagen: "./tinturas/kit.jpg",
    nombre: "Kit EstereoColor",
    info: "$2.990 c/u · (Tintura + oxidante + guantes + post-coloración)",
    tipo: "input-doble",
    labelTipo: "tono",
    step: 1,
    min: 1,
  },
  {
    id: "tin-sachet",
    categoria: "tinturas",
    imagen: "./tinturas/sachet.jpg",
    nombre: "Sachet EstereoColor (tintura + oxidante)",
    info: "$2.020 · Solo tonos 93 y 562",
    tipo: "input-select",
    labelTipo: "tono",
    opciones: ["tono 93", "tono 562"],
    step: 1,
    min: 1,
  },
  {
    id: "tin-funky",
    categoria: "tinturas",
    imagen: "./tinturas/funky4.jpg",
    nombre: "Funky color",
    info: "$2.020 · Tintura semipermanente. Dura 12 lavados",
    tipo: "input-doble",
    labelTipo: "color",
  },
  {
    id: "tin-funkyneon",
    categoria: "tinturas",
    imagen: "./tinturas/funkyneon.jpg",
    nombre: "Funky neón",
    info: "$2.020 · Tintura semipermanente",
    tipo: "input-select",
    labelTipo: "color",
    opciones: ["amarillo neón", "fucsia neón", "verde neón", "naranja neón"],
    step: 1,
    min: 1,
  },
  {
    id: "tin-shock",
    categoria: "tinturas",
    imagen: "./tinturas/shock.jpg",
    nombre: "Shock capilar",
    info: "$1.990 · 47gr.",
    tipo: "input-doble",
    labelTipo: "tratamiento",
    infoExtra: [
      "Argán, keratina, macadamia, coco, bótox, colágeno, blindaje, minuto express, rubios luminosos, carbón detox, oro 24k, silver y co-wash",
    ],
    infoExtraLabel: "ver tratamientos",
  },
  {
    id: "tin-oleo",
    categoria: "tinturas",
    imagen: "./tinturas/oleo.jpg",
    nombre: "Óleo capilar",
    info: "$7.100 las 10 unidades",
    tipo: "input-select",
    labelTipo: "fragancia",
    opciones: ["argán", "macadamia", "coco", "almendras"],
    step: 10,
    min: 10,
  },

  // ── CARTERAS — Carteras ───────────────────────────────────

  // ── CARTERAS — Mochilas ───────────────────────────────────
 

  
  // ── SUBLIMADOS ────────────────────────────────────────────
  {
    id: "sub-cartucheras",
    categoria: "sublimados",
    imagen: "./sublimados/cartucheras.jpg",
    nombre: "Cartucheras",
    info: "$4.800 · 23cmx12cm",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
  {
    id: "sub-portacosmeticos",
    categoria: "sublimados",
    imagen: "./sublimados/portacosmeticos.jpeg",
    nombre: "Portacosméticos",
    info: "$4.800 · 19cmx13cm",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
  {
    id: "sub-luncheras",
    categoria: "sublimados",
    imagen: "./sublimados/luncheras.jpg",
    nombre: "Luncheras",
    info: "$6.800 · 18cmx23cm",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
  {
    id: "sub-rinoneras",
    categoria: "sublimados",
    imagen: "./sublimados/rinoneras.jpeg",
    nombre: "Riñoneras infantiles",
    info: "$5.900",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
  {
    id: "sub-bandoleras",
    categoria: "sublimados",
    imagen: "./sublimados/bandoleras.jpeg",
    nombre: "Bandoleras infantiles",
    info: "$7.800 · 21cmx14cmx7cm",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
  {
    id: "sub-bolsilloauto",
    categoria: "sublimados",
    imagen: "./sublimados/bolsilloauto.jpg",
    nombre: "Bolsillo para el auto",
    info: "$5.200 · 21cmx23cm",
    tipo: "input-doble",
    labelTipo: "diseño",
  },
];
