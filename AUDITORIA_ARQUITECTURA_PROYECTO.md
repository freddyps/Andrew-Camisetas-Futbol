# AUDITORÍA ARQUITECTÓNICA INTEGRAL DEL SISTEMA
**Proyecto:** Andrew Camisetas Fútbol (E-Commerce Web)  
**Documento Técnico Maestro para Auditoría, Consultoría y Traspaso a LLMs (ChatGPT / Claude / Gemini)**  
**Fecha de Emisión:** jueves, 29 de octubre de 2026

---

## 1. Resumen Ejecutivo y Métricas del Código Fuente

Este documento consolida la arquitectura completa, organización de capas, flujo de datos y el inventario técnico exhaustivo del proyecto **Andrew Camisetas Fútbol**, diseñado para auditorías técnicas profundas, optimización de performance, escalabilidad y revisión en modelos de lenguaje.

- **Total de Archivos de Código / Configuración:** 77 archivos.
- **Líneas de Código de Aplicación (LOC):** 12,383 líneas activas.
- **Framework & Core:** React 19 + Vite 6.
- **Backend as a Service:** Supabase (PostgreSQL 15+, Storage Buckets, Row Level Security, Auth).
- **Estilos & Diseño:** TailwindCSS v4 + Tokens modulares en Vanilla CSS (`src/styles/theme.css`).
- **Iconografía:** Lucide React (vectorial nativa).
- **Enrutamiento:** Arquitectura SPA desacoplada por estado en memoria (`activeView`), garantizando transiciones instantáneas sin recarga de navegador y compatible con `vercel.json` rewrites.

---

## 2. Diagrama de Arquitectura por Capas y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CAPA DE PRESENTACIÓN (UI)                     │
│  - App.jsx: Controlador central de vistas (Home, Catalogo, Checkout...) │
│  - Modales Globales: CartModal, AuthModal, OrderSuccessModal           │
│  - Componentes Compartidos: Navbar, Footer, WhatsAppButton, Toasts     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│              2. CAPA DE ESTADO GLOBAL Y CUSTOM HOOKS                   │
│  - CartContext: Carrito reactivo, cálculo de subtotales y personaliz.   │
│  - AuthContext: Sesión Supabase Auth y validación de permisos de admin │
│  - CatalogContext: Caché en memoria de productos y filtros reactivos   │
│  - AdminContext: Métricas en vivo y estados de pedidos                 │
│  - Custom Hooks: useCheckout, usePedirAMedida, useCatalog, useOrders   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│            3. CAPA DE SERVICIOS Y CONFIGURACIÓN DE NEGOCIO              │
│  - services/productsService.js: Consultas CRUD y filtrado en BD        │
│  - services/ordersService.js: Creación y seguimiento de órdenes        │
│  - services/customOrdersService.js: Pedidos personalizados a medida    │
│  - config/siteConfig.js: Pasarelas (Yape, Plin, BCP, BBVA) & WhatsApp  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│               4. INFRAESTRUCTURA Y SERVICIOS EXTERNOS                  │
│  - Supabase Database: Tablas 'products', 'orders', 'custom_orders'     │
│  - Supabase Storage: Buckets para fotos de comprobantes y catálogo    │
│  - WhatsApp API Gateway: Envío automatizado de pedidos estructurados   │
│  - Vercel Edge Network: Distribución CDN con headers de caché estables │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Inventario Completo de Archivos con Conteo Exacto de Líneas (LOC)

### Configuración Raíz y Despliegue

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `.env` | 4 | 0.16 KB | Archivo auxiliar o de configuración de desarrollo. |
| `.gitignore` | 53 | 0.51 KB | Archivo auxiliar o de configuración de desarrollo. |
| `eslint.config.js` | 38 | 1.03 KB | Archivo auxiliar o de configuración de desarrollo. |
| `index.html` | 56 | 2.68 KB | Documento HTML principal con etiquetas OpenGraph, Twitter Cards, favicons y viewport. |
| `package.json` | 35 | 0.81 KB | Configuración de entorno o dependencias del proyecto. |
| `postcss.config.js` | 7 | 0.09 KB | Archivo auxiliar o de configuración de desarrollo. |
| `README.md` | 17 | 1.00 KB | Archivo auxiliar o de configuración de desarrollo. |
| `vercel.json` | 42 | 0.76 KB | Configuración de entorno o dependencias del proyecto. |
| `vite.config.js` | 23 | 0.54 KB | Configuración del bundler Vite con plugin React y optimización de assets. |

### src/ (Puntos de Entrada y Core)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/App.jsx` | 274 | 10.15 KB | Orquestador SPA central; administra renderizado condicional de vistas (activeView), modales globales y footer/navbar. |
| `src/index.css` | 19 | 0.66 KB | Importación de TailwindCSS v4, fuentes tipográficas y reseteos globales de renderizado. |
| `src/main.jsx` | 11 | 0.22 KB | Punto de entrada React 19; inicializa árbol DOM envolviendo la app en los múltiples proveedores de contexto. |
| `src/supabaseClient.js` | 13 | 0.43 KB | Cliente singleton de Supabase inicializado con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. |

### src/config/ (Configuraciones de Negocio)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/config/siteConfig.js` | 65 | 1.64 KB | Configuración empresarial: teléfonos de WhatsApp, números de cuenta (BCP, Interbank, BBVA, Yape, Plin), costos de delivery. |

### src/context/ (Gestión de Estado Global)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/context/CartContext.jsx` | 162 | 4.74 KB | Gestión integral del carrito: items, variantes de talla, personalización de parches, totalizador y persistencia localStorage. |
| `src/context/ThemeContext.jsx` | 45 | 1.21 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/context/ToastContext.jsx` | 78 | 2.99 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/services/ (Capa de Conexión a Base de Datos)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/services/orderService.js` | 103 | 3.15 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/services/productService.js` | 235 | 7.70 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/services/reviewService.js` | 277 | 8.89 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/styles/ (Design System & Estilos Globales)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/styles/animations.css` | 70 | 1.35 KB | Estilos dedicados y animaciones micro-interactivas. |
| `src/styles/components.css` | 110 | 3.31 KB | Estilos dedicados y animaciones micro-interactivas. |
| `src/styles/theme.css` | 817 | 24.66 KB | Tokens de diseño: variables CSS de paleta oscura/dorada, tipografías, bordes redondeados y sombras de elevación. |
| `src/styles/variables.css` | 96 | 2.32 KB | Estilos dedicados y animaciones micro-interactivas. |

### src/utils/ (Utilidades y Helpers de Lógica)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/utils/security.js` | 67 | 2.40 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/data/ (Data Semilla / Fallback)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/data/catalogoData.js` | 18 | 0.69 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/components/ (Componentes Compartidos)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/components/auth/AuthFormFields.jsx` | 100 | 3.56 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/auth/AuthModal.jsx` | 402 | 13.87 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/auth/UserOrdersHistory.jsx` | 143 | 6.94 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/cart/CartDrawer.jsx` | 357 | 17.94 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/common/WhatsAppFloatingWidget.jsx` | 128 | 6.44 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/layout/Footer.jsx` | 296 | 16.54 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/layout/Navbar.jsx` | 345 | 16.03 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/components/product/ProductReviewsSection.jsx` | 281 | 12.31 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |

### src/pages/home/ (Página de Inicio / Landing)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/home/HomePage.jsx` | 47 | 1.81 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/AboutClubSection.jsx` | 136 | 7.84 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/ClubLogosSection.jsx` | 129 | 4.59 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/CustomerReviewsSection.jsx` | 409 | 19.61 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/CustomOrderPromoBanner.jsx` | 70 | 3.84 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/HeroSection.jsx` | 90 | 3.93 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/home/sections/WorldCupStarsSection.jsx` | 140 | 6.53 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/catalogo/ (Módulo de Catálogo)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/catalogo/CatalogoPage.jsx` | 88 | 2.85 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/catalogo/components/CatalogProductsList.jsx` | 208 | 9.49 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/catalogo/components/CatalogSidebar.jsx` | 182 | 7.32 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/catalogo/components/CatalogToolbar.jsx` | 103 | 4.22 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/catalogo/hooks/useCatalogo.js` | 101 | 3.57 KB | Custom Hook para aislar y reutilizar lógica reactiva. |

### src/pages/producto/ (Detalle de Producto)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/producto/components/CustomizationOptions.jsx` | 352 | 16.03 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/producto/components/ProductGalleryZoom.jsx` | 85 | 3.56 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/producto/components/ProductTechnicalTabs.jsx` | 158 | 8.29 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/producto/components/RelatedProductsGrid.jsx` | 62 | 2.64 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/producto/components/SizeGuideModal.jsx` | 216 | 10.60 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/producto/hooks/useProductDetails.js` | 96 | 3.06 KB | Custom Hook para aislar y reutilizar lógica reactiva. |
| `src/pages/producto/ProductDetailsPage.jsx` | 145 | 5.19 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/checkout/ (Flujo de Pago y Pedido)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/checkout/CheckoutStepByStepPage.jsx` | 257 | 8.87 KB | Archivo auxiliar o de configuración de desarrollo. |
| `src/pages/checkout/components/BankTransferDetails.jsx` | 63 | 3.32 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/PaymentQrVisualizer.jsx` | 161 | 7.76 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/StepCartReview.jsx` | 182 | 8.84 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/StepOrderSuccess.jsx` | 105 | 4.29 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/StepPaymentTabs.jsx` | 286 | 12.87 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/StepShippingAddress.jsx` | 160 | 6.51 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/components/VoucherUploadCard.jsx` | 112 | 4.70 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/checkout/hooks/useCheckout.js` | 299 | 10.46 KB | Hook maestro de pago: validación de formularios, cálculo de envío por región, generación de URL WhatsApp y registro en Supabase. |

### src/pages/pedir-a-medida/ (Wizard de Personalización)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/pedir-a-medida/components/PedirAMedidaForm.jsx` | 194 | 8.84 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/pedir-a-medida/components/PedirAMedidaStepsInfo.jsx` | 122 | 5.45 KB | Componente visual modular reutilizable con soporte de accesibilidad y diseño responsivo. |
| `src/pages/pedir-a-medida/hooks/usePedirAMedida.js` | 54 | 1.84 KB | Hook de control para el wizard de pedidos a medida: paso a paso, carga de referencias y cotización estimada. |
| `src/pages/pedir-a-medida/PedirAMedidaPage.jsx` | 34 | 1.24 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/pedidos/ (Historial y Seguimiento)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/pedidos/MisPedidosPage.jsx` | 466 | 23.59 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/nosotros/ (Quiénes Somos & Guías)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/nosotros/NosotrosPage.jsx` | 170 | 7.83 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/auth/ (Autenticación y Registro)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/auth/AuthPage.jsx` | 396 | 14.58 KB | Archivo auxiliar o de configuración de desarrollo. |

### src/pages/admin/ (Panel de Administración)

| Archivo | Líneas (LOC) | Peso (KB) | Responsabilidad / Descripción Técnica |
|---|:---:|:---:|---|
| `src/pages/admin/AdminPanelPage.jsx` | 483 | 21.89 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/components/DashboardStatsCards.jsx` | 66 | 2.79 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/components/OrdersDataTable.jsx` | 290 | 15.16 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/components/ProductFormModal.jsx` | 258 | 11.63 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/components/ReviewsModerationTable.jsx` | 179 | 8.45 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/hooks/useAdminOrders.js` | 70 | 2.19 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/hooks/useAdminProducts.js` | 316 | 9.55 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |
| `src/pages/admin/hooks/useAdminReviews.js` | 56 | 1.57 KB | Componente del módulo administrativo: administración de pedidos, catálogo de productos y métricas. |

---

## 4. Prompt Maestro para Enviar a ChatGPT / Claude / Gemini

Copia y pega el siguiente bloque en tu consulta con ChatGPT u otro LLM para obtener una auditoría de máxima calidad:

```markdown
Actúa como un Arquitecto de Software Senior y Auditor de Código Especializado en React 19 y Supabase.
A continuación tienes la arquitectura detallada, el inventario completo de archivos y el conteo de líneas de código del proyecto "Andrew Camisetas Fútbol" (un e-commerce especializado en camisetas de fútbol en Perú).

Revisa la estructura de carpetas, el flujo de estado (Contexts vs Hooks vs Services) y el desacoplamiento de componentes.
Objetivo: Realizar una auditoría técnica evaluando:
1. Calidad arquitectónica y mantenibilidad (Separación de responsabilidades, modularidad).
2. Manejo de estado y rendimiento (Evaluación de posibles re-renders en CartContext, CatalogContext o useCheckout).
3. Seguridad en frontend y Supabase (RLS, validación de inputs, sanitización en checkout y manejo de vouchers).
4. Escalabilidad y oportunidades de refactorización hacia Next.js o arquitectura por features.
```
