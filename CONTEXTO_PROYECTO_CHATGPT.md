# INFORME TÉCNICO DE TRANSFERENCIA DE CONTEXTO — PROYECTO ANDREW CAMISETAS

## 1. PROPÓSITO Y ESTADO ACTUAL

### 1.1 Qué hace la aplicación y para quién está diseñada
**ANDREW Camisetas de Fútbol** (`andrew-camisetas`) es una aplicación web e-commerce especializada en la venta de camisetas de fútbol versión jugador/hincha (grado 1.1 tailandés) y ediciones retro en el mercado peruano (moneda en Soles `S/`).
- **Público objetivo (Cliente):** Hinchas y coleccionistas en Lima Metropolitana y provincias del Perú que compran prendas **En Stock** (entrega inmediata con stock por talla) o **Bajo Pedido / Encargo** (importación personalizada con nombre, dorsal y parches oficiales abonando un adelanto fijo de `S/ 40.00` por prenda bajo pedido o el `100%` del total, mediante Yape, Plin o transferencia BCP).
- **Usuario interno (Administrador):** Gestor de la tienda que administra el catálogo de camisetas (CRUD, precios, tallas, stock), verifica comprobantes de pago/códigos de operación y modera reseñas de clientes desde el panel `/admin`.

### 1.2 Funcionalidades implementadas
1. **Portada principal (`HomePage`):** Hero principal, banner de personalización gratuita, grilla de Estrellas del Mundial 2026, sección institucional ("Sobre el Club"), marquesina infinita de escudos de clubes y carrusel/grilla de reseñas de clientes reales.
2. **Catálogo interactivo (`CatalogoPage`):** Búsqueda por texto, filtrado por categoría, rango máximo de precio dinámico, etiquetas rápidas (`POPULAR_TAGS`), ordenamiento (destacados, menor/mayor precio) y vista en cuadrícula o lista.
3. **Detalle de producto (`ProductDetailsPage`):** Galería con lupa/zoom HD, selector de tallas con conteo de stock real por talla, modal de guía de tallas, personalización de nombre y dorsal (para artículos bajo pedido), pestañas técnicas, módulo de reseñas con subida de foto y productos relacionados.
4. **Carrito lateral (`CartDrawer` y `CartContext`):** Persistencia en `localStorage`, control de límite de stock por talla, agrupación inteligente de partidas, desglose de ítems en stock vs. bajo pedido y cálculo automático de adelanto (`S/ 40.00` por prenda bajo pedido).
5. **Pasarela de Checkout en 4 pasos (`CheckoutStepByStepPage`):**
   - Paso 1: Revisión de prendas, elección de destino (Lima `S/ 10.00` / Provincias `S/ 18.00`) y modalidad de pago (`completo` o `adelanto`).
   - Paso 2: Datos de envío (validación de email, nombre, DNI, teléfono, dirección/agencia Shalom u Olva) con soporte para invitado o usuario autenticado.
   - Paso 3: Pago manual con visor QR (Yape/Plin) o cuentas BCP, ingreso de código de operación, titular y subida de foto del comprobante (con compresión en canvas).
   - Paso 4: Confirmación de orden (`#AND-xxxxxx`), descuento automático de stock y botón para enviar el resumen estructurado por WhatsApp.
6. **Pedidos a Medida (`PedirAMedidaPage`):** Formulario especializado para encargos fuera de catálogo (equipo, temporada, versión jugador/hincha/retro, manga corta/larga, dorsal, parches) que construye y abre un mensaje formateado hacia WhatsApp.
7. **Autenticación (`AuthPage`):** Login y registro con Supabase Auth + rate limiter en memoria + flujo de acceso administrativo.
8. **Seguimiento de Compras (`MisPedidosPage`):** Historial de órdenes filtrado estrictamente por el `email` o `user_id` del usuario autenticado (o vista total si es `ADMIN`), con línea de tiempo de 3 etapas (`Verificación` -> `Confirmado` -> `Entregado`).
9. **Panel de Administración (`AdminPanelPage`):** Dashboard con métricas, CRUD de productos con subida de fotos, edición rápida de stock, bandeja de pedidos con visor de comprobantes y bandeja de moderación de reseñas.
10. **Sistema Dual de Temas (`ThemeContext`):** Modo Oscuro (`dark`, predeterminado) y Modo Claro (`light-theme`), persistido en `localStorage`.

### 1.3 Qué funciona con servicios reales, datos locales o simulaciones (Observado en código)
| Módulo | Funcionamiento Real (Supabase) | Funcionamiento Local / Fallback (`localStorage`) | Simulación / Hardcoded |
| :--- | :--- | :--- | :--- |
| **Catálogo (`productService.js`)** | Lee/escribe tabla `productos` y sube fotos al bucket `camisetas`. | Caché de respuesta inmediata (`0ms`) en `andrew_admin_productos`. Si el bucket falla, convierte la imagen a Base64 (`DataURL`). | `CATALOGO_DATA` en `src/data/catalogoData.js` está actualmente vacío (`[]`), por lo que el catálogo inicial depende de `localStorage` o de lo cargado desde Supabase. |
| **Pedidos (`orderService.js`)** | Inserta, actualiza y elimina en tabla `pedidos`. | Guarda primero en `andrew_pedidos_locales` y sincroniza con Supabase en segundo plano (`fire-and-forget`). | El pago no usa pasarela bancaria automática (Stripe/Niubiz); es validación manual de voucher/código de operación. |
| **Reseñas (`reviewService.js`)** | Consulta, inserta, aprueba y elimina en tabla `reviews`. | Fusiona resultados de Supabase con `andrew_reviews_locales_v1` y bloquea re-inyección de borrados con `andrew_reviews_deleted_ids_v1`. | Incluye 4 reseñas semilla (`SEED_REVIEWS`) cuando no hay datos previos en `localStorage`. |
| **Autenticación (`AuthPage.jsx`)** | Usa `supabase.auth.signInWithPassword` y `supabase.auth.signUp`. | Persiste sesión activa y ruta en `sessionStorage` (`andrew_session_user`). | Incluye un acceso directo local en cliente para el correo de administrador definido en las reglas del proyecto. |

### 1.4 Qué está incompleto o pendiente
- **Políticas RLS y seguridad backend en Supabase (Pendiente de verificar en servidor):** No existen migraciones SQL ni archivos de políticas RLS dentro del repositorio; la seguridad de las tablas `productos`, `pedidos` y `reviews` en el servidor de Supabase debe verificarse en el panel de Supabase.
- **Autenticación de Administrador en servidor:** Actualmente el login de administrador se resuelve mediante una validación en el frontend (`src/pages/auth/AuthPage.jsx`). Para producción real debe migrarse a una cuenta de Supabase Auth verificada mediante JWT y políticas RLS.
- **Opción de Short Oficial en Detalle de Producto (Observado en código):** Aunque `useProductDetails.js` mantiene los estados `incluirShort` y `tallaShort` y `ProductDetailsPage.jsx` los pasa como props a `CustomizationOptions.jsx`, el componente `CustomizationOptions.jsx` actual no recibe ni renderiza el interruptor de short, y `construirItemPedido()` en `ProductDetailsPage.jsx` tampoco incluye `incluirShort` ni suma `precioShort` al objeto enviado al carrito.
- **Componentes huérfanos en `src/components/auth/`:** Los archivos `src/components/auth/AuthModal.jsx`, `src/components/auth/AuthFormFields.jsx` y `src/components/auth/UserOrdersHistory.jsx` corresponden a una versión previa basada en modales y ya no son importados por `src/App.jsx` (que ahora usa las páginas completas `AuthPage.jsx` y `MisPedidosPage.jsx`).

### 1.5 Entorno inspeccionado
- **Sistema Operativo:** Windows (PowerShell).
- **Directorio de trabajo:** `c:\Users\Freddy\Desktop\FREDDY\andrew-camisetas`
- **Fecha de inspección:** `2026-11-10` / `2026-11-12`
- **Rama Git:** `main` (tracking `origin/main`)
- **Último Commit HEAD:** `0e8adaf` (Nota: el árbol de trabajo local tiene la migración completa desde un antiguo proyecto Django/SQLite eliminado en el working tree hacia la arquitectura actual SPA en React + Vite + Supabase).

---

## 2. TECNOLOGÍAS Y EJECUCIÓN

### 2.1 Framework, librerías y versiones (`package.json`)
- **Runtime / UI:** `react` (`^19.2.4`), `react-dom` (`^19.2.4`)
- **Backend-as-a-Service (BaaS):** `@supabase/supabase-js` (`^2.117.2`)
- **Iconografía:** `lucide-react` (`^1.8.0`)
- **Bundler y Servidor de Desarrollo:** `vite` (`^8.0.4`), `@vitejs/plugin-react` (`^6.0.1`)
- **Estilos:** `tailwindcss` (`^4.2.2`), `@tailwindcss/postcss` (`^4.2.2`), `postcss` (`^8.5.10`), `autoprefixer` (`^10.5.0`)
- **Linter:** `eslint` (`^9.39.4`), `@eslint/js` (`^9.39.4`), `eslint-plugin-react-hooks` (`^7.0.1`), `eslint-plugin-react-refresh` (`^0.5.2`), `globals` (`^17.4.0`)
- **Procesamiento de imágenes (devDependency):** `sharp` (`^0.35.5`)

### 2.2 Gestor de paquetes y scripts disponibles
El proyecto utiliza **npm** (cuenta con `package-lock.json`). Scripts definidos en `package.json`:
- `npm run dev` -> Inicia servidor de desarrollo Vite (`vite`) en `http://0.0.0.0:5174`.
- `npm run build` -> Compila el bundle de producción (`vite build`) en la carpeta `dist/`.
- `npm run lint` -> Ejecuta análisis estático (`eslint .`).
- `npm run preview` -> Sirve localmente la compilación de producción (`vite preview`).

### 2.3 Configuración de herramientas
- **Vite (`vite.config.js`):** Puerto `5174`, `host: '0.0.0.0'`, `sourcemap: false`, y nombres de salida con hash (`assets/[name].[hash].js`) para cache busting.
- **Tailwind CSS v4 (`postcss.config.js` y `src/index.css`):** Usa `@tailwindcss/postcss` e importa `@import "tailwindcss";` en `src/index.css` junto con un bloque `@theme` que mapea variables CSS semánticas (`--color-bg-base`, `--color-surface-card`, `--color-txt-main`, `--color-andrew-primary`, etc.). No utiliza `tailwind.config.js` (fue eliminado al migrar a Tailwind v4).
- **ESLint (`eslint.config.js`):** Configuración Flat Config (`defineConfig`). Ignora `['dist', '.vite', 'find-orphans.cjs', 'eslint-report.json']`. Desactiva `'react-hooks/set-state-in-effect'` globalmente y `'react-refresh/only-export-components'` en `src/context/**/*.{js,jsx}`.

### 2.4 Variables de entorno necesarias
Leídas en `src/supabaseClient.js` mediante `import.meta.env`:
1. `VITE_SUPABASE_URL`: URL del proyecto en Supabase.
2. `VITE_SUPABASE_ANON_KEY`: Clave pública anónima (`publishable` / `anon`) de Supabase para llamadas desde el navegador.
*(Observado: `src/supabaseClient.js` incluye valores por defecto de respaldo en código para ambas variables si no existe archivo `.env`).*

### 2.5 Alojamiento y despliegue
No hay archivos `vercel.json`, `netlify.toml` ni `Dockerfile` en la raíz. Es una SPA estática estándar que genera `dist/index.html` y `dist/assets/*`. Dado que el enrutamiento se maneja por estado e historial con hashes (`#catalogo`, `#producto-...`), no sufre errores `404` al recargar rutas en servidores estáticos.

---

## 3. ARQUITECTURA

### 3.1 Árbol de carpetas relevante
```text
andrew-camisetas/
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── eslint.config.js
├── public/
│   ├── banners/          # Fondos hero y banners promocionales (.webp)
│   ├── brand/            # Logos oficiales y códigos QR de pago (.webp)
│   ├── clientes/         # Fotos de clientes reales y taller (.webp)
│   ├── clubs/            # Escudos de clubes y selecciones (.webp)
│   └── stars/            # Fotografías de estrellas del Mundial 2026 (.webp)
└── src/
    ├── main.jsx          # Punto de entrada React DOM
    ├── App.jsx           # Enrutador por estado, RBAC, proveedores y layout base
    ├── index.css         # Entrada CSS, imports modulares y @theme de Tailwind v4
    ├── supabaseClient.js # Instancia de cliente Supabase
    ├── config/
    │   └── siteConfig.js # Configuración centralizada (WhatsApp, Yape/Plin, BCP, adelanto)
    ├── context/
    │   ├── CartContext.jsx   # Estado global del carrito persistido en localStorage
    │   ├── ThemeContext.jsx  # Tema oscuro/claro persistido en localStorage
    │   └── ToastContext.jsx  # Sistema de notificaciones flotantes
    ├── data/
    │   └── catalogoData.js   # Categorías oficiales y constantes base del catálogo
    ├── services/
    │   ├── productService.js # Lectura/escritura híbrida (Memoria + localStorage + Supabase)
    │   ├── orderService.js   # Gestión de pedidos y estados (localStorage + Supabase)
    │   └── reviewService.js  # Gestión y moderación de reseñas (localStorage + Supabase)
    ├── styles/
    │   ├── variables.css     # Reset, tipografías, scrollbars y foco accesible
    │   ├── components.css    # Glassmorphism, tarjetas y utilidades deportivas
    │   ├── animations.css    # Keyframes y marquesina infinita
    │   ├── theme-dark.css    # Variables del tema oscuro (#0a0a0a)
    │   └── theme-light.css   # Variables y overrides del tema claro (#f8fafc)
    ├── utils/
    │   └── security.js       # Sanitizadores (XSS, teléfono, operación) y rate limiter
    ├── components/
    │   ├── layout/           # Navbar.jsx y Footer.jsx
    │   ├── cart/             # CartDrawer.jsx
    │   ├── common/           # WhatsAppFloatingWidget.jsx
    │   ├── product/          # ProductReviewsSection.jsx
    │   └── auth/             # Componentes heredados (AuthModal, AuthFormFields, UserOrdersHistory)
    └── pages/
        ├── home/             # HomePage.jsx + 6 secciones en sections/
        ├── catalogo/         # CatalogoPage.jsx + useCatalogo.js + CatalogSidebar / CatalogProductsList
        ├── producto/         # ProductDetailsPage.jsx + useProductDetails.js + 5 subcomponentes
        ├── checkout/         # CheckoutStepByStepPage.jsx + useCheckout.js + 6 subcomponentes
        ├── pedir-a-medida/   # PedirAMedidaPage.jsx + usePedirAMedida.js + 3 subcomponentes
        ├── nosotros/         # NosotrosPage.jsx + 3 subcomponentes
        ├── pedidos/          # MisPedidosPage.jsx
        ├── auth/             # AuthPage.jsx
        ├── info/             # InfoPoliciesPage.jsx (FAQ y Términos)
        └── admin/            # AdminPanelPage.jsx + 3 hooks + 4 subcomponentes
```

### 3.2 Punto de entrada, estado global y enrutamiento
- **Composición raíz (`src/main.jsx` y `src/App.jsx`):** `App` envuelve `AppContent` dentro de `<ToastProvider>` y `<CartProvider>`. Dentro de `AppContent` se monta `<ThemeProvider>`, `<Navbar>`, `<main>` (con `<Suspense>` y carga diferida `React.lazy` para todas las páginas secundarias), `<Footer>`, `<WhatsAppFloatingWidget>` y `<CartDrawer>`.
- **Enrutamiento e historial (`src/App.jsx`):** No utiliza `react-router-dom`. El enrutamiento está controlado por el estado `currentRoute` (`'inicio'`, `'catalogo'`, `'producto-detalle'`, `'pedir_a_medida'`, `'nosotros'`, `'mis_pedidos'`, `'checkout'`, `'auth'`, `'admin'`, `'faq'`, `'terminos'`) y `selectedProductId`.
  - Se persiste en `sessionStorage` (`andrew_current_route` y `andrew_selected_product_id`) para conservar la vista al recargar con `F5`.
  - Al navegar (`handleNavigate` y `handleOpenProduct`), ejecuta `window.history.pushState({ route, productId }, '', '#...')` y escucha el evento `popstate` de `window` para soportar los botones **Atrás / Adelante** del navegador.

### 3.3 Diagrama de Arquitectura y Sincronización Híbrida
```mermaid
flowchart TD
    UI["Componentes & Páginas React"] --> Hooks["Custom Hooks (useCatalogo, useCheckout, useAdmin...)"]
    UI --> Contexts["Contextos (CartContext, ThemeContext, ToastContext)"]
    Hooks --> Services["Servicios (productService, orderService, reviewService)"]
    Services -->|1. Lectura/Escritura Síncrona 0ms| Cache["Memoria RAM + localStorage"]
    Services -->|2. Sincronización Asíncrona en Background| SB["Supabase (Tablas: productos, pedidos, reviews + Storage: camisetas)"]
    SB -->|3. Custom Event (window.dispatchEvent)| Hooks
```

---

## 4. PÁGINAS Y FLUJOS

| Flujo / Página | Archivos Principales | Entrada | Operaciones Principales | Datos Utilizados | Resultado y Dependencias |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Inicio y Navegación** | `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/pages/home/HomePage.jsx` | Carga inicial (`currentRoute = 'inicio'`) o clic en logo/menú. | Renderiza 6 secciones de portada; búsqueda rápida en `Navbar`; cambio de tema; apertura de carrito o menú móvil. | `SITE_CONFIG`, `SEED_REVIEWS` / reseñas aprobadas, lista de clubes y estrellas 2026. | Navega a `'catalogo'` (con o sin filtro de jugador/club) o a `'pedir_a_medida'`. |
| **2. Catálogo, Búsqueda y Filtros** | `src/pages/catalogo/CatalogoPage.jsx`, `hooks/useCatalogo.js`, `CatalogSidebar.jsx`, `CatalogProductsList.jsx` | `initialSearchQuery` desde `App.jsx` o navegación directa. | Filtra en memoria por texto (`nombre`, `categoria`, `tag`, `descripcion`), `categoriaId`, `maxPrecio` y `tagSeleccionado`. Ordena por destacados o precio. | `getProductosSync()` + `getProductos()` (`productService.js`), `CATEGORIAS`, `POPULAR_TAGS`. | Abre detalle (`onSelectProduct`) o añade directo al carrito (`onAddToCart`). Escucha `'andrew_productos_updated'`. |
| **3. Detalle del Producto** | `src/pages/producto/ProductDetailsPage.jsx`, `hooks/useProductDetails.js`, `CustomizationOptions.jsx`, `ProductGalleryZoom.jsx` | `productoId` (`selectedProductId` en `App.jsx`). | Filtra `tallasValidas` (si `inStock === true`, solo muestra tallas con `stockPorTalla[t] > 0`). Si es bajo pedido (`!inStock`), habilita inputs de nombre/dorsal y cantidad. | Producto normalizado de `productService.js` y reseñas de `reviewService.js`. | Construye ítem con `construirItemPedido()` y ejecuta `onAddToCart` (abre `CartDrawer`) u `onBuyNow` (va a `'checkout'`). |
| **4. Carrito de Compras** | `src/context/CartContext.jsx`, `src/components/cart/CartDrawer.jsx` | Objeto `producto` enviado a `addToCart`. | Normaliza `tallaSeleccionada` y `cantidad`. Agrupa ítems con igual `id`, `tallaSeleccionada`, `inStock`, `personalizacion` y `short`. Limita `cantidad <= stockPorTalla[talla]`. | Clave `andrew_cart_v2` en `localStorage`. | Calcula `cartCount`, `cartTotal`, separa prendas en stock vs. bajo pedido y redirige a `'checkout'`. |
| **5. Checkout y Comprobantes** | `src/pages/checkout/CheckoutStepByStepPage.jsx`, `hooks/useCheckout.js`, `StepCartReview.jsx`, `StepShippingAddress.jsx`, `StepPaymentTabs.jsx`, `StepOrderSuccess.jsx` | `cart`, `user` (opcional). | Paso 1: elige envío (`S/ 10` Lima, `S/ 18` Provincias) y modalidad (`completo` o `adelanto`). Paso 2: valida datos del cliente. Paso 3: comprime foto de voucher en `<canvas>` y sanitiza textos. Paso 4: guarda orden y descuenta stock. | `SITE_CONFIG.datosPago`, `sanitizeText`, `sanitizePhone`, `sanitizeCodigoOperacion`. | Crea orden en `orderService.js`, ejecuta `descontarStockProductos()`, vacía el carrito y genera mensaje a WhatsApp (`51963345510`). |
| **6. Pedidos a Medida** | `src/pages/pedir-a-medida/PedirAMedidaPage.jsx`, `hooks/usePedirAMedida.js`, `PedirAMedidaForm.jsx` | Selección de club/categoría o formulario libre. | Captura equipo, temporada, versión (`jugador`, `hincha`, `retro`), manga, talla, cantidad, dorsal y parche. | `SITE_CONFIG.whatsapp.link`, `SITE_CONFIG.reserva.montoMinimoAdelanto`. | Abre `wa.me/51963345510` con el mensaje formateado; no escribe en base de datos. |
| **7. Autenticación** | `src/pages/auth/AuthPage.jsx`, `src/utils/security.js` | Ruta `'auth'`, modo `'login'` o `'register'`. | Verifica rate limit (`checkLoginRateLimit`, máx. 5 intentos/60s), comprueba acceso admin o invoca `supabase.auth.signInWithPassword` / `signUp`. | `supabase.auth`, `sessionStorage` (`andrew_session_user`). | Actualiza `user` en `App.jsx` y redirige a `postLoginRoute`, `'admin'` o `'inicio'`. |
| **8. Mis Pedidos** | `src/pages/pedidos/MisPedidosPage.jsx` | Usuario autenticado (`user`). Si `!user`, muestra pantalla de bloqueo con botón a Login. | Filtra órdenes donde `user.email === order.user_email` o `user.id === order.user_id` (salvo `ADMIN`, que ve todas). Permite buscar y filtrar por estado. | `getPedidosSync()` y `getPedidos()` (`orderService.js`). | Muestra línea de tiempo (3 pasos), desglose financiero y botón de seguimiento por WhatsApp. |
| **9. Panel Administrativo** | `src/pages/admin/AdminPanelPage.jsx`, `useAdminProducts.js`, `useAdminOrders.js`, `useAdminReviews.js` | Ruta `'admin'` + validación `user?.role === 'ADMIN'`. | Pestaña 1: CRUD de camisetas, toggle de stock y edición rápida de stock. Pestaña 2: cambio de estado de pedidos y visor de vouchers. Pestaña 3: aprobar/eliminar reseñas. | `productService.js`, `orderService.js`, `reviewService.js`. | Actualiza `localStorage`, emite eventos globales (`andrew_*_updated`) y sincroniza con Supabase. |
| **10. Reseñas** | `src/components/product/ProductReviewsSection.jsx`, `src/pages/home/sections/CustomerReviewsSection.jsx` | `productoId` (o `'general'`). | Lista reseñas aprobadas, calcula promedio de estrellas, comprime foto subida/cámara (`compressImageToDataUrl`) y publica con `autoAprobar = true`. | `reviewService.js` (`SEED_REVIEWS`, `localStorage` y tabla `reviews`). | Persiste en `localStorage` y en tabla `reviews` de Supabase. |

---

## 5. MODELOS DE DATOS Y REGLAS DE NEGOCIO

### 5.1 Estructura de Producto (`normalizarProducto` en `src/services/productService.js`)
```json
{
  "id": "peru-oficial-2025",
  "nombre": "Perú Oficial 2025/2026",
  "categoria": "SELECCIONES",
  "categoriaId": "selecciones",
  "precio": 89,
  "precioAntes": 120,
  "precioShort": 35,
  "stock": 12,
  "inStock": true,
  "stockPorTalla": { "S": 3, "M": 3, "L": 3, "XL": 3 },
  "tallas": ["S", "M", "L", "XL"],
  "oferta": true,
  "tag": "NOVEDAD",
  "imagen": "https://.../camiseta.webp",
  "galeria": ["https://.../camiseta.webp"],
  "descripcion": "Prenda versión jugador con parches oficiales termo-sellados...",
  "rating": 5,
  "reviewsCount": 1
}
```
- **Reglas de stock (`productService.js` líneas 41–72):**
  - Si `stockPorTalla` no existe, `normalizarProducto` reparte `item.stock` equitativamente entre `tallas`.
  - `stockCalculado` es la suma de los valores de `stockPorTalla`.
  - Si `item.inStock` es `false` o la suma de stock es `0`, `inStock` queda en `false` y `stock` en `0` (pasa automáticamente a modalidad **Bajo Pedido**).

### 5.2 Estructura de Artículo en Carrito (`src/context/CartContext.jsx`)
- **Identificación y agrupación (`addToCart`):** Dos artículos se agrupan en la misma fila del carrito únicamente si coinciden en:
  1. `item.id === productoNormalizado.id`
  2. `item.tallaSeleccionada === productoNormalizado.tallaSeleccionada`
  3. `Boolean(item.inStock) === Boolean(productoNormalizado.inStock)`
  4. `clavePersonalizacion(item) === clavePersonalizacion(productoNormalizado)` (donde la clave concatena `nombre-numero|short-tallaShort`).
- **Precios y adicionales:**
  - La personalización (nombre y dorsal en espalda) para productos **Bajo Pedido** es **GRATIS** (`S/ 0.00`).
  - Los productos **En Stock** tienen `personalizacion: null` (se venden tal como están en almacén).

### 5.3 Costos de envío, reservas y saldo pendiente (`src/pages/checkout/hooks/useCheckout.js`)
- `subtotal`: Suma de `precio * cantidad` de cada ítem del carrito.
- `costoEnvio`:
  - `metodoEntrega === 'lima'` -> `S/ 10.00`
  - `metodoEntrega === 'provincias'` -> `S/ 18.00`
- `totalConEnvio`: `subtotal + costoEnvio`.
- `montoAdelantoCalculado`:
  - Cuenta cuántas unidades del carrito tienen `inStock === false` (`cantidadPrendasBajoPedido`).
  - Si `cantidadPrendasBajoPedido > 0`, el adelanto es `cantidadPrendasBajoPedido * 40.00`. Si todas están en stock pero se eligiera adelanto, el piso es `40.00` (aunque en la UI del Paso 1 la opción de adelanto solo se habilita cuando `tieneBajoPedido === true`).
- `montoAPagarHoy`: Si `modalidadPago === 'adelanto'`, es `Math.min(montoAdelantoCalculado, totalConEnvio)`; si es `'completo'`, es `totalConEnvio`.
- `saldoRestante`: `Math.max(0, totalConEnvio - montoAPagarHoy)`.

### 5.4 Estructura y Estados de un Pedido (`src/services/orderService.js` y `useCheckout.js`)
```json
{
  "id": "AND-849201",
  "created_at": "2026-11-10T23:00:00.000Z",
  "fecha": "10 nov 2026, 18:00",
  "estado": "PENDIENTE_VERIFICACION",
  "user_email": "cliente@ejemplo.com",
  "user_id": "uuid-opcional",
  "cliente": {
    "nombre": "Juan Perez",
    "email": "cliente@ejemplo.com",
    "dni": "71234567",
    "telefono": "999888777",
    "destino": "Av. Ejemplo 123, Miraflores",
    "referencia": "Frente al parque",
    "metodoEntrega": "lima"
  },
  "items": [ /* Array de objetos del carrito */ ],
  "finanzas": {
    "subtotal": 89,
    "costoEnvio": 10,
    "totalGeneral": 99,
    "modalidadPago": "completo",
    "montoAbonado": 99,
    "saldoPendiente": 0,
    "metodoPagoSeleccionado": "yape"
  },
  "pagoVerificacion": {
    "metodo": "YAPE",
    "codigoOperacion": "12345678",
    "titularCuenta": "Juan Perez",
    "comprobanteImagen": "data:image/jpeg;base64,..."
  }
}
```
- **Estados posibles del pedido (`OrdersDataTable.jsx` y `MisPedidosPage.jsx`):**
  1. `PENDIENTE_VERIFICACION` (etapa 1 al crearse).
  2. `ADELANTO_VERIFICADO` (etapa 2 para reservas de S/ 40).
  3. `PAGO_COMPLETO_CONFIRMADO` (etapa 2 para pagos al 100%).
  4. `ENTREGADO` (etapa 3 cuando el pedido llega al cliente).
  5. `RECHAZADO_FRAUDE` (visible y seleccionable en el panel de Admin).

---

## 6. BACKEND E INTEGRACIONES

### 6.1 Servicios y tablas de Supabase consumidas desde el cliente
El cliente de Supabase (`src/supabaseClient.js`) se consume directamente desde el navegador en 4 lugares:
1. **`src/App.jsx` y `src/pages/auth/AuthPage.jsx`:** `supabase.auth.getSession()`, `onAuthStateChange()`, `signInWithPassword()`, `signUp()` y `signOut()`.
2. **`src/services/productService.js`:**
   - Tabla `productos`: `.select('*').order('id', { ascending: false })`, `.upsert([producto])`, `.update({ stock, in_stock, inStock, stockPorTalla }).eq('id', prod.id)` y `.delete().eq('id', productoId)`.
   - Storage bucket `camisetas`: `supabase.storage.from('camisetas').upload(filePath, file)` y `.getPublicUrl(filePath)`.
3. **`src/services/orderService.js`:**
   - Tabla `pedidos`: `.select('*').order('created_at', { ascending: false })`, `.insert([nuevoPedido])`, `.update({ estado, updated_at }).eq('id', pedidoId)` y `.delete().eq('id', pedidoId)`.
4. **`src/services/reviewService.js`:**
   - Tabla `reviews`: Columnas enviadas en `insert`: `(producto_id, nombre_cliente, calificacion, comentario, aprobado)`. Operaciones: `.select('*')`, `.insert([payload]).select()`, `.update({ aprobado: true }).eq('id', id)` y `.delete().eq('id', id)`.

### 6.2 Lo que se conoce por el código vs. lo que queda sin verificar en el servidor
- **Conocido por el código (Observado):**
  - En `productService.js` (líneas 165–169), al descontar stock se envían tanto `in_stock` (snake_case) como `inStock` (camelCase) y `stockPorTalla` en el `.update()` hacia la tabla `productos`.
  - En `reviewService.js` (líneas 221–228), el `insert` hacia Supabase solo envía 5 columnas (`producto_id`, `nombre_cliente`, `calificacion`, `comentario`, `aprobado`), omitiendo `image`, `city`, `badge` y `product_nombre` (que sí se guardan en `localStorage`) para evitar errores si esas columnas no existen en el esquema remoto.
- **Sin verificar en el servidor (Pendiente de acceso a Supabase Dashboard):**
  - Definición DDL real de las tablas `productos`, `pedidos` y `reviews` (tipos de columnas JSONB para `items`, `finanzas`, `pagoVerificacion`, `stockPorTalla`).
  - Existencia y permisos públicos del bucket `camisetas` en Supabase Storage.
  - Estado de **Row Level Security (RLS)** en cada tabla.

### 6.3 Comportamiento ante fallos de red y diferencias entre remoto y fallback local
Todos los servicios siguen el patrón **Local-First / Optimistic UI**:
1. Leen primero de la variable en memoria (`memoriaProductos` / `memoriaPedidos`) o de `localStorage` en `0ms`.
2. Lanzan la petición a Supabase en segundo plano (`.then(...).catch(...)`).
3. Si Supabase responde con datos válidos (`data.length > 0`), sobrescriben la caché en `localStorage` y disparan un evento `window.dispatchEvent(new Event('andrew_..._updated'))` para que los hooks refresquen el estado de React.
4. **Diferencia importante:** Si en Supabase una tabla tiene al menos 1 registro pero una operación previa de escritura falló silenciosamente (por falta de columna o bloqueo RLS), la siguiente lectura de `getProductos()` o `getPedidos()` sobrescribirá `localStorage` con lo que devuelva Supabase. En cambio, si Supabase devuelve `error` o un arreglo vacío `[]`, la app conserva intactos los datos de `localStorage`.

---

## 7. ALMACENAMIENTO Y CONSISTENCIA

### 7.1 Mapa completo de claves en `localStorage` y `sessionStorage`

| Almacenamiento | Clave | Archivo Responsable | Contenido | Cuándo se actualiza o elimina |
| :--- | :--- | :--- | :--- | :--- |
| `localStorage` | `andrew_cart_v2` | `src/context/CartContext.jsx` | Array JSON de ítems del carrito. | En cada cambio de `cart`; se elimina en `clearCart()`. |
| `localStorage` | `andrew_theme` | `src/context/ThemeContext.jsx` | String `'dark'` o `'light'`. | Al alternar tema con `toggleTheme()`. |
| `localStorage` | `andrew_admin_productos` | `src/services/productService.js` | Array JSON del catálogo de productos. | Al sincronizar con Supabase, crear/editar/borrar en Admin o descontar stock tras una compra. |
| `localStorage` | `andrew_pedidos_locales` | `src/services/orderService.js` | Array JSON con todas las órdenes registradas. | Al crear un pedido, cambiar su estado, eliminarlo o sincronizar desde Supabase. |
| `localStorage` | `andrew_mis_pedidos_ids` | `src/services/orderService.js` | Array JSON de strings con IDs (`["AND-123456"]`). | Al registrar un nuevo pedido (`registrarMiPedidoId`). |
| `localStorage` | `andrew_reviews_locales_v1` | `src/services/reviewService.js` | Array JSON de reseñas (semillas + creadas). | Al inicializar por primera vez, crear, aprobar o borrar reseñas. |
| `localStorage` | `andrew_reviews_deleted_ids_v1` | `src/services/reviewService.js` | Array JSON de IDs de reseñas eliminadas. | Al ejecutar `eliminarReview(id)` en el panel Admin. |
| `sessionStorage` | `andrew_current_route` | `src/App.jsx` | String con el nombre de la ruta activa. | En cada cambio de `currentRoute`. |
| `sessionStorage` | `andrew_selected_product_id` | `src/App.jsx` | String con el `id` del producto seleccionado. | En cada cambio de `selectedProductId`. |
| `sessionStorage` | `andrew_session_user` | `src/App.jsx` | Objeto JSON del usuario autenticado (`id`, `email`, `role`, `nombre`). | Al iniciar sesión (Supabase o Admin); se elimina en `handleLogout()`. |

### 7.2 Cuotas de almacenamiento, orden de creación de pedido y concurrencia
- **Mitigación de `QuotaExceededError`:**
  - En `useCheckout.js` (`handleFileChange`), las fotos de comprobantes se redimensionan en un `<canvas>` hasta `900px` de lado máximo y se comprimen a `image/jpeg` (`0.78`).
  - En `orderService.js` (`guardarNuevoPedido`), `localStorage.setItem` está envuelto en `try/catch`; si aún así se excede la cuota de ~5 MB del navegador, un segundo `try` guarda el pedido descartando únicamente `comprobanteImagen: null` para no perder la orden.
- **Orden real en `handleFinalizarPedido` (`src/pages/checkout/hooks/useCheckout.js` líneas 168–232):**
  1. Verifica `if (enviando) return;` para impedir clics repetidos.
  2. Sanitiza todos los campos del formulario y activa `setEnviando(true)`.
  3. Llama a `await guardarNuevoPedido(pedidoData)` (persiste en `localStorage` y dispara `insert` a Supabase).
  4. Llama a `await descontarStockProductos(pedidoData.items)` (descuenta de `stockPorTalla` cada partida con `inStock !== false`, guarda en `localStorage` y dispara `update` a Supabase).
  5. Avanza a `setPasoActual(4)` y ejecuta `onOrderSuccess`, el cual invoca `clearCart(false)` en `src/App.jsx`.
- **Sincronización:** Dentro de la misma pestaña, los componentes se sincronizan en tiempo real mediante `CustomEvent` (`andrew_productos_updated`, `andrew_pedidos_updated`, `andrew_reviews_updated`). No hay listener del evento `storage` para sincronización automática entre pestañas distintas abiertas simultáneamente.

---

## 8. DISEÑO Y RESPONSIVE

### 8.1 Sistema de colores, tipografías y temas
- **Color institucional primario:** Verde deportivo `#22c55e` (`--color-primary` / `bg-andrew-primary` / `text-andrew-primary`), con hover `#16a34a`.
- **Tipografías (`index.html` y `src/styles/variables.css`):**
  - Display y títulos deportivos: `'Montserrat'` (pesos 700, 800, 900, uppercase, tracking estrecho).
  - Cuerpo e interfaz: `'Inter'` / `'Montserrat'`.
- **Sistema Dual de Temas (`src/styles/theme-dark.css` y `src/styles/theme-light.css`):**
  - **Modo Oscuro (`:root`, `html.dark`):** Fondo principal `#0a0a0a`, tarjetas `#121212`, superficies secundarias `#181c20`, texto `#ffffff` y secundario `#9ca3af`.
  - **Modo Claro (`html.light-theme`):** Fondo principal `#f8fafc`, tarjetas `#ffffff`, superficies secundarias `#f1f5f9`, texto `#0f172a` y secundario `#475569`. La barra de navegación (`Navbar`) y los banners fotográficos (`#hero` y `#promo-banner-card`) conservan estética oscura con textos blancos para preservar el contraste sobre fotografía.

### 8.2 Estrategia de adaptación y componentes revisados
En las iteraciones recientes se realizó una adaptación **Mobile-First** integral comprobada para los anchos de referencia (`320px`, `360px`, `375px`, `390px`, `414px`, `480px`, `600px`, `768px`, `820px`, `1024px`, `1280px`, `1440px` y `1920px`):
- **Prevención de desbordamiento horizontal:** Se configuró `overflow-x: clip; min-width: 320px;` en `body` (`src/styles/variables.css`), tipografía fluida con `clamp(...)` en títulos de portada, banners y detalles de producto, y `min-w-0` en contenedores flex/grid.
- **Cabecera (`Navbar.jsx`):** Cabecera flotante con objetivos táctiles >= 44x44 px (`w-11 h-11`), barra de búsqueda expandible, menú hamburguesa móvil con bloqueo de scroll del `body` al abrirse y cierre con tecla `Escape`.
- **Portada (`HeroSection.jsx` y `CustomOrderPromoBanner.jsx`):** Uso de unidades `min-h-[calc(100svh-5.5rem)]`, soporte para móviles en orientación horizontal (`max-lg:landscape:...`) y ajuste de encuadre fotográfico (`object-[65%_22%] sm:object-[62%_20%] lg:object-[center_22%]`) para la imagen de chilena de CR7 (`public/banners/cr7_chilena_juventus.webp`).
- **Widget flotante (`WhatsAppFloatingWidget.jsx`):** Respeta áreas seguras (`env(safe-area-inset-bottom)`), ancho fluido en pantallas de `320px` y ocultamiento automático del globo promocional en pantallas pequeñas.

---

## 9. CAMBIOS RECIENTES Y AUDITORÍA

Durante la última sesión de auditoría técnica se detectaron y corrigieron los siguientes problemas en el código:

| # | Problema Detectado | Archivos Modificados | Cambio de Comportamiento y Motivo | Estado de Verificación |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `descontarStockProductos` usaba `.find()` y solo descontaba la primera talla si un cliente compraba varias tallas de la misma camiseta en un pedido. | `src/services/productService.js` | Se reemplazó `.find()` por `.filter()` e iteración por cada partida comprada del mismo `prod.id` para descontar todas las tallas adquiridas. | Verificado en código, `lint` y `build`. |
| **2** | Al pulsar "Añadir/Pedir" desde una tarjeta del catálogo (`CatalogProductsList`), el producto llegaba a `addToCart` con `tallaSeleccionada: undefined` y los productos bajo pedido idénticos no se agrupaban. | `src/context/CartContext.jsx` | `addToCart` ahora normaliza `tallaSeleccionada` (primera talla con stock o `'M'`) y `cantidad` (`1`), y agrupa ítems idénticos tanto en stock como bajo pedido. | Verificado en código, `lint` y `build`. |
| **3** | Al recargar (`F5`) o pulsar "Atrás" en el navegador, se perdía la vista activa (`currentRoute`), el producto seleccionado y la sesión local de Administrador. | `src/App.jsx` | Se sincronizaron `currentRoute`, `selectedProductId` y `user` con `sessionStorage`, y se integraron `window.history.pushState` y el listener `popstate`. | Verificado en código, `lint` y `build`. |
| **4** | Subir una foto de comprobante pesada (4–8 MB) en el Paso 3 del Checkout podía lanzar `QuotaExceededError` en `localStorage`, y un doble clic rápido podía duplicar el pedido. | `src/pages/checkout/hooks/useCheckout.js`, `src/services/orderService.js` | Se añadió guarda `if (enviando) return;`, compresión de imagen en `<canvas>` (`900px`, JPEG `0.78`) y bloques `try/catch` con fallback en `localStorage.setItem`. | Verificado en código, `lint` y `build`. |
| **5** | En el Panel Admin, cambiar el stock rápido en la tabla (`handleCambioStockRapido`) o alternar stock (`handleToggleStock`) se revertía solo porque `normalizarProducto` recalculaba el stock desde el viejo `stockPorTalla`. | `src/pages/admin/hooks/useAdminProducts.js` | Ambos handlers ahora recalculan y actualizan `stockPorTalla` proporcionalmente al nuevo `stock` antes de llamar a `guardarProductosLocales`. | Verificado en código, `lint` y `build`. |
| **6** | El botón de WhatsApp en el Paso 4 de Checkout y en `MisPedidosPage` apuntaba al número de Yape (`934353097`) en lugar del WhatsApp oficial de atención (`963345510`). | `src/pages/checkout/hooks/useCheckout.js`, `src/pages/pedidos/MisPedidosPage.jsx` | Ambos enlaces ahora consumen centralizadamente `SITE_CONFIG.whatsapp` (`51963345510`). | Verificado en código, `lint` y `build`. |
| **7** | `npm run lint` fallaba con 227 problemas (archivos pre-empaquetados en `.vite/`, variables sin usar y warnings de `useEffect`). | `eslint.config.js`, `src/App.jsx`, `src/pages/auth/AuthPage.jsx`, `src/components/auth/AuthFormFields.jsx`, `src/pages/admin/hooks/useAdminOrders.js`, `src/pages/pedidos/MisPedidosPage.jsx`, `src/pages/producto/hooks/useProductDetails.js` | Se ignoró `.vite` en `eslint.config.js`, se limpiaron variables huérfanas y se estabilizaron hooks con `useCallback` / `useMemo`. | Verificado ejecutando `npm run lint` (0 errores, 0 warnings). |
| **8** | La pantalla de "Acceso Restringido" de `/admin` usaba `text-white` fijo y era ilegible en Modo Claro. | `src/App.jsx` | Se reemplazó por tokens semánticos `text-txt-main`, `text-txt-muted` y `bg-surface-card`. | Verificado en código y `build`. |

- **Decisiones tomadas sin indicación explícita del usuario:**
  - Al añadir una prenda directamente desde la grilla del catálogo sin pasar por el selector de tallas, se decidió asignarle por defecto la primera talla con stock disponible (o `'M'` si es bajo pedido) y mostrar la talla elegida en el toast de confirmación (`¡"Camiseta" (Talla M) agregada al carrito!`).
  - Se conservó el login administrativo local en `AuthPage.jsx` porque está establecido como regla explícita del proyecto en `.agents/AGENTS.md`.

---

## 10. VALIDACIÓN Y PROBLEMAS ABIERTOS

### 10.1 Comandos ejecutados y resultados observados
1. **`npm run lint` (`eslint .`):** Finalizó con **código de salida `0`** (0 errores y 0 advertencias).
2. **`npm run build` (`vite build`):** Finalizó con **código de salida `0`** en `7.29s` (`1825 modules transformed`), generando correctamente los chunks divididos por ruta en `dist/assets/`.

### 10.2 Diferencia entre lo verificado por compilación/código y lo pendiente de prueba interactiva
- **Verificado mediante ejecución de herramientas (`lint` y `build`) e inspección de código:** Sintaxis, árbol de importaciones, reglas de hooks de React, tipado de variables, fórmulas financieras y flujos de estado.
- **Flujos que requieren prueba interactiva en navegador con Supabase conectado:**
  1. Completar un Checkout real adjuntando una fotografía de cámara móvil y verificar que el registro se inserte en la tabla remota `pedidos` de Supabase sin error de esquema.
  2. Crear/editar un producto desde `/admin` subiendo una imagen nueva para comprobar si el bucket `camisetas` de Supabase Storage tiene permisos públicos de escritura o si cae en el fallback Base64.
  3. Recargar (`F5`) y usar los botones Atrás/Adelante del navegador recorriendo `inicio` -> `catalogo` -> `producto-detalle` -> `checkout`.

### 10.3 Problemas abiertos y riesgos conocidos
1. **Validación de Administrador en el cliente (`src/pages/auth/AuthPage.jsx`):** Las credenciales del bypass administrativo están presentes en el código cliente. En un despliegue público, cualquier usuario que inspeccione el bundle podría verlas y acceder a la vista `/admin`. **Impacto:** Alto en producción pública.
2. **Catálogo semilla vacío en código (`src/data/catalogoData.js`):** `export const CATALOGO_DATA = [];` está vacío. Si un visitante nuevo abre la tienda con `localStorage` limpio y la tabla `productos` de Supabase no responde o está vacía, verá el estado vacío *"Aún no hay camisetas disponibles"*. **Impacto:** Medio/Alto si Supabase está caído o sin datos.
3. **Opción de Short Oficial desconectada en la UI (`src/pages/producto/ProductDetailsPage.jsx` y `CustomizationOptions.jsx`):** El estado `incluirShort` existe en `useProductDetails.js` y el precio `precioShort` se edita en Admin, pero no se muestra el checkbox/selector de short en `CustomizationOptions.jsx` ni se incluye en `construirItemPedido()`. **Impacto:** Bajo/Medio (funcionalidad latente incompleta).
4. **Peso del banner principal (`public/banners/cr7_chilena_juventus.webp`):** Pesa `1.23 MB` (fue reemplazado recientemente con el archivo original del usuario). Redimensionarlo a `1920px` WebP (calidad 82%) reduciría su peso a ~180 KB. **Impacto:** Bajo (rendimiento de carga inicial en redes móviles).

### 10.4 Próximos pasos recomendados (ordenados por prioridad)
1. **Prioridad 1 (Seguridad Backend):** Verificar en el panel de Supabase las políticas **Row Level Security (RLS)** de las tablas `productos`, `pedidos` y `reviews`, y migrar el usuario administrador a **Supabase Auth** eliminando credenciales hardcodeadas del frontend antes de publicar el sitio.
2. **Prioridad 2 (Datos de Respaldo):** Poblar `CATALOGO_DATA` en `src/data/catalogoData.js` con 4 a 8 camisetas oficiales base para que la tienda nunca luzca vacía si un cliente entra sin caché local y falla la red hacia Supabase.
3. **Prioridad 3 (Funcionalidad de Short):** Decidir si se desea reactivar el selector de "Incluir Short Oficial (+S/ 35)" en `CustomizationOptions.jsx` y `construirItemPedido()` en `ProductDetailsPage.jsx`, o retirar la columna de short de la tabla de Admin.
4. **Prioridad 4 (Limpieza):** Eliminar los 3 archivos huérfanos en `src/components/auth/` (`AuthModal.jsx`, `AuthFormFields.jsx`, `UserOrdersHistory.jsx`) y optimizar el peso de `public/banners/cr7_chilena_juventus.webp`.

---

## 11. ARCHIVOS QUE CHATGPT NECESITA CONOCER

| Ruta Relativa | Responsabilidad | Funciones / Componentes Clave | Dependencias Importantes |
| :--- | :--- | :--- | :--- |
| `src/App.jsx` | Orquestador raíz, enrutador por estado + `sessionStorage` + History API y control de acceso `/admin`. | `App`, `AppContent`, `handleNavigate`, `handleOpenProduct`, `handleLogout` | `CartContext`, `ThemeContext`, `ToastContext`, `supabase` |
| `src/config/siteConfig.js` | Única fuente de verdad para teléfonos de WhatsApp, cuentas Yape/Plin/BCP y monto de adelanto (`S/ 40`). | `SITE_CONFIG` | Ninguna |
| `src/context/CartContext.jsx` | Estado global del carrito, validación de stock por talla y persistencia en `localStorage`. | `CartProvider`, `useCart`, `addToCart`, `updateQuantity`, `removeItem`, `clearCart` | `ToastContext` |
| `src/services/productService.js` | Normalización de productos, caché síncrona en `0ms`, sincronización con Supabase y descuento de stock multi-talla. | `getProductosSync`, `getProductos`, `normalizarProducto`, `descontarStockProductos`, `uploadProductoImagen` | `supabaseClient`, `catalogoData` |
| `src/services/orderService.js` | Creación, lectura, cambio de estado y borrado de pedidos con protección contra `QuotaExceededError`. | `getPedidosSync`, `getPedidos`, `guardarNuevoPedido`, `actualizarEstadoPedido`, `eliminarPedido` | `supabaseClient` |
| `src/pages/checkout/hooks/useCheckout.js` | Lógica financiera del checkout (envío, adelanto S/ 40, saldo), compresión de voucher, registro de pedido y mensaje de WhatsApp. | `useCheckout`, `handleFileChange`, `handleFinalizarPedido`, `handleEnviarMensajeWhatsApp` | `orderService`, `productService`, `security`, `siteConfig` |
| `src/pages/producto/ProductDetailsPage.jsx` | Vista de detalle de camiseta, armado del objeto para el carrito y conexión con galería, tallas y reseñas. | `ProductDetailsPage`, `construirItemPedido` | `useProductDetails`, `CustomizationOptions`, `ProductGalleryZoom` |
| `src/pages/admin/hooks/useAdminProducts.js` | Lógica de inventario del administrador (CRUD, subida de imagen, edición rápida de stock sincronizada con `stockPorTalla`). | `useAdminProducts`, `handleToggleStock`, `handleCambioStockRapido`, `handleCrearProducto`, `handleGuardarEdicion` | `productService`, `supabaseClient` |
| `src/pages/pedidos/MisPedidosPage.jsx` | Historial de compras del cliente con filtro de privacidad por `email`/`user_id` y línea de tiempo del pedido. | `MisPedidosPage`, `pedidosFiltrados`, `getStatusBadge` | `orderService`, `siteConfig` |
| `src/styles/theme-light.css` y `src/index.css` | Definición de tokens semánticos `@theme` en Tailwind v4 y reglas de adaptación para el Modo Claro y Modo Oscuro. | `@theme`, `html.light-theme` | `@tailwindcss/postcss` |

### Fragmentos clave de referencia

**1. Normalización y descuento de stock por talla (`src/services/productService.js`):**
```javascript
export async function descontarStockProductos(itemsComprados = []) {
  if (!Array.isArray(itemsComprados) || itemsComprados.length === 0) return;
  const productosActuales = getProductosSync().map(normalizarProducto);
  let huboCambios = false;

  const actualizados = productosActuales.map((prod) => {
    const partidasProducto = itemsComprados.filter(
      (item) => item.id === prod.id && item.inStock !== false
    );
    if (partidasProducto.length > 0) {
      huboCambios = true;
      const nuevoStockPorTalla = { ...(prod.stockPorTalla || {}) };
      partidasProducto.forEach((itemComprado) => {
        const cantAComprar = parseInt(itemComprado.cantidad) || 1;
        const tallaComprada = itemComprado.tallaSeleccionada || itemComprado.talla || 'M';
        const stockActualTalla = parseInt(nuevoStockPorTalla[tallaComprada]) || 0;
        nuevoStockPorTalla[tallaComprada] = Math.max(0, stockActualTalla - cantAComprar);
      });
      const nuevoStockTotal = Object.values(nuevoStockPorTalla).reduce(
        (acc, val) => acc + (parseInt(val) || 0), 0
      );
      return { ...prod, stockPorTalla: nuevoStockPorTalla, stock: nuevoStockTotal, inStock: nuevoStockTotal > 0 };
    }
    return prod;
  });
  if (huboCambios) guardarProductosLocales(actualizados);
}
```

**2. Cálculos financieros de reserva y envío en Checkout (`src/pages/checkout/hooks/useCheckout.js`):**
```javascript
const subtotal = cart.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
const costoEnvio = metodoEntrega === 'lima' ? 10.00 : 18.00;
const totalConEnvio = subtotal + costoEnvio;

const cantidadPrendasBajoPedido = cart
  .filter(i => i.inStock === false)
  .reduce((acc, i) => acc + (i.cantidad || 1), 0);

const montoAdelantoCalculado = cantidadPrendasBajoPedido > 0
  ? (cantidadPrendasBajoPedido * 40.00)
  : 40.00;

const montoAPagarHoy = modalidadPago === 'adelanto'
  ? Math.min(montoAdelantoCalculado, totalConEnvio)
  : totalConEnvio;

const saldoRestante = Math.max(0, totalConEnvio - montoAPagarHoy);
```

---

## 12. CONTEXTO PARA CONTINUAR (RESUMEN EJECUTIVO PARA CHATGPT)

- **Estado actual:** La aplicación **ANDREW Camisetas** es una SPA moderna en **React 19 + Vite 8 + Tailwind CSS 4 + Supabase** que compila limpiamente (`npm run build` en ~7.3s) y pasa `npm run lint` con **0 errores y 0 advertencias**. Cuenta con diseño responsive mobile-first revisado desde `320px` hasta `1920px`, tema oscuro/claro, carrito con control de stock por talla, pasarela de checkout manual (Yape/Plin/BCP) con compresión de vouchers y panel administrativo completo.
- **Decisiones vigentes:**
  - Arquitectura **Local-First (0ms)**: Todas las lecturas muestran primero la caché en memoria/`localStorage` y sincronizan en segundo plano con Supabase mediante eventos `window.dispatchEvent(new Event('andrew_*_updated'))`.
  - Regla de negocio dual: Prendas **En Stock** descuentan inventario por talla y se venden listas para entrega inmediata; prendas **Bajo Pedido** (`inStock: false`) incluyen estampado personalizado gratuito y permiten reservarse con `S/ 40.00` de adelanto por unidad.
- **Prioridades pendientes:**
  1. Asegurar las tablas de Supabase (`productos`, `pedidos`, `reviews`) con **Row Level Security (RLS)** y migrar la autenticación de Administrador al backend (Supabase Auth) antes de salir a producción.
  2. Agregar datos semilla de respaldo en `src/data/catalogoData.js` (`CATALOGO_DATA`).
  3. Definir si se reconecta en la UI de detalle de producto el selector de **Short Oficial (+S/ 35)** (cuya lógica ya existe parcialmente en `useProductDetails.js` y `AdminPanelPage.jsx`).
- **Riesgos comprobados:**
  - El acceso de administrador actual se valida en el cliente (`src/pages/auth/AuthPage.jsx`).
  - La sincronización con Supabase es asíncrona y silenciosa (`catch` con `console.warn`); si falla una escritura remota por permisos o esquema pero la tabla remota no está vacía, una lectura posterior sobrescribirá los cambios locales con el estado de Supabase.
- **Información que falta obtener del usuario / servidor:**
  - Esquema SQL exacto y estado de las políticas RLS en el proyecto de Supabase (`argncyqoxpawsjbcxsjw`).
  - Confirmación de si el usuario desea hacer un `git commit` para consolidar la eliminación de los antiguos archivos de Django/Python que aún figuran como eliminados (`D`) en `git status`.

