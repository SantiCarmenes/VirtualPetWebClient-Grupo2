# 🐾 Virtual Pet — Web Client (Grupo 2)

Cliente web del e-commerce **Virtual Pet**, desarrollado como SPA moderna sobre Next.js 16 con App Router. Opera de forma completamente independiente del backend, consumiendo la lógica de negocio exclusivamente a través de la API REST.

---

## 🚀 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2.6 | Framework (App Router + Server Components) |
| [React](https://react.dev/) | 19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilos |
| [Lucide React](https://lucide.dev/) | 1.14 | Iconografía |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Dark/Light mode |

---

## ✨ Funcionalidades implementadas

### Autenticación
- Login y registro integrados con la API real (`/auth/login`, `/auth/register`)
- **Refresh automático silencioso**: si el `accessToken` expira (401), el cliente lo renueva transparentemente con el `refreshToken` sin interrumpir al usuario
- Persistencia de sesión en `localStorage`
- Protección de rutas privadas vía `proxy.ts` (Next.js 16)
- Redirección automática si ya hay sesión activa al entrar a `/login` o `/register`

### Catálogo
- Server Component: fetch de categorías y atributos en el servidor (SSR con `revalidate: 300`)
- Filtros persistentes en la URL (`?category=`, `?search=`, `?sort=`, `?minPrice=`, `?maxPrice=`, `?attributeValueIds=`, `?page=`)
- Filtro de precio con botón **"Aplicar"** explícito y bloqueo de valores negativos
- Filtros de atributos agrupados y colapsables por sección
- Paginación integrada
- 12 skeletons animados durante la carga
- Empty state con botón de limpiar filtros

### Producto
- Página de detalle integrada con `GET /catalog/products/:slug`
- Imagen reactiva al seleccionar variante
- Precio dinámico: `$X` / `Desde $X` / `Sin stock`
- Selector de variantes con labels de atributos reales
- Feedback visual "¡Agregado!" (2s) al agregar al carrito
- `notFound()` automático si el slug no existe

### Carrito
- Contexto global (`CartContext`) con sincronización contra la API
- **Optimistic updates** en `removeItem` y `updateQuantity` (UI instantánea, revertida si la API falla)
- Panel deslizante (`CartSlideOver`) con subtotal en tiempo real
- Mini-modal de selección de variante en `ProductCard` (cuando hay más de una)
- Toast de confirmación al agregar productos
- Sincronización automática post-login

### Checkout
- Carga paralela de métodos de envío y pago desde la API
- Formulario de dirección tipado con `ShippingAddress`
- Manejo especial de `PriceConflictError` (409): muestra los precios actualizados antes de confirmar
- Procesamiento real con `POST /orders` y redirección a `/orders/:id`

### Perfil
- Datos del usuario desde `GET /users/me`
- Edición de perfil vía `PATCH /users/me`
- Tab de pedidos con lazy loading (`GET /orders`)

### Seguimiento de órdenes
- Detalle de orden desde `GET /orders/:id`
- Stepper visual por estado (`PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED`)
- Tabla con snapshots de productos (nombre, SKU, precio al momento de la compra)
- Desglose de costos: subtotal, descuento, envío, total
- Estado de pago y envío obtenidos de forma independiente
- Manejo de errores 403 y 404

---

## 🏗️ Arquitectura del proyecto

```
src/
├── app/
│   ├── (app)/                  # Rutas de la aplicación (requieren layout con Navbar)
│   │   ├── catalog/            # Catálogo + CatalogClient + CatalogSidebar + CatalogGrid
│   │   │   └── [id]/           # Detalle de producto
│   │   ├── checkout/           # Flujo de pago
│   │   ├── orders/[id]/        # Detalle y seguimiento de orden
│   │   ├── profile/            # Perfil de usuario
│   │   └── track/              # Tracking público
│   ├── (auth)/                 # Rutas de autenticación (sin Navbar)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (standalone)/           # Páginas standalone (404, mantenimiento, etc.)
│   ├── page.tsx                # Home (Server Component)
│   └── globals.css             # Variables de tema + utilidades CSS globales
│
├── components/                 # Componentes compartidos
│   ├── Navbar.tsx              # Barra de navegación con buscador y carrito
│   ├── Footer.tsx
│   ├── CartSlideOver.tsx       # Panel lateral del carrito
│   ├── ProductCard.tsx         # Tarjeta de producto con mini-modal de variantes
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
│
├── context/
│   ├── AuthContext.tsx          # Estado de sesión global (user, login, logout, register)
│   └── CartContext.tsx          # Estado del carrito global (items, addItem, etc.)
│
├── hooks/                      # Custom hooks reutilizables
│   ├── useProducts.ts           # Fetch paginado de productos
│   ├── useProduct.ts            # Fetch de un producto por slug
│   ├── useOrders.ts             # Lista de órdenes del usuario
│   ├── useOrder.ts              # Detalle de una orden
│   ├── useCheckout.ts           # Lógica de procesamiento de pedido
│   ├── useAuthForms.ts          # Lógica de formularios de auth
│   └── useStock.ts              # Stock por variantId (para página de detalle)
│
├── lib/
│   ├── api.ts                   # Cliente HTTP base con refresh automático de token
│   ├── types.ts                 # 20+ interfaces TypeScript que mapean la API
│   └── services/                # Capa de servicios (una función por endpoint)
│       ├── auth.service.ts       # login, register, logout
│       ├── user.service.ts       # getMe, updateMe
│       ├── catalog.service.ts    # getProducts, getProductBySlug, getCategories, getAttributes
│       ├── cart.service.ts       # getCart, addItem, updateItem, removeItem, clearCart
│       ├── order.service.ts      # createOrder, getMyOrders, getOrderById
│       ├── payment.service.ts    # getPaymentMethods, getOrderPayment
│       ├── shipping.service.ts   # getShippingMethods, getOrderShipment
│       └── address.service.ts    # getUserAddresses
│
└── proxy.ts                    # Protección de rutas y redirects (Next.js 16)
```

---

## ⚙️ Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# URL base de la API REST del backend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> El frontend corre en el **puerto 4000** por defecto para no colisionar con el backend (puerto 3000).

---

## ▶️ Cómo ejecutar localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local   # o crear manualmente con el contenido de arriba

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:4000](http://localhost:4000) en el navegador.

---

## 🔌 Contratos de API esperados

El frontend está listo para conectarse. El backend debe implementar los siguientes endpoints:

| Módulo | Endpoint | Método |
|--------|----------|--------|
| Auth | `/auth/login` | POST |
| Auth | `/auth/register` | POST |
| Auth | `/auth/logout` | POST |
| Auth | `/auth/refresh` | POST |
| Usuarios | `/users/me` | GET / PATCH |
| Catálogo | `/catalog/products` | GET (con filtros paginados) |
| Catálogo | `/catalog/products/:slug` | GET |
| Catálogo | `/catalog/categories` | GET |
| Catálogo | `/catalog/attributes` | GET |
| Carrito | `/cart` | GET / DELETE |
| Carrito | `/cart/items` | POST |
| Carrito | `/cart/items/:id` | PUT / DELETE |
| Órdenes | `/orders` | GET / POST |
| Órdenes | `/orders/:id` | GET |
| Envío | `/shipping/methods` | GET |
| Envío | `/shipping/orders/:orderId` | GET |
| Pago | `/payment/methods` | GET |
| Pago | `/payment/orders/:orderId` | GET |
| Stock | `/stock/variants/:variantId` | GET |

Los tipos de respuesta esperados están documentados en [`src/lib/types.ts`](./src/lib/types.ts).

---

## 🎨 Sistema de diseño

El tema visual se controla exclusivamente desde las variables CSS en `globals.css`:

```css
:root {
  --primary: #1C1917;
  --background: #FAFAF9;
  /* ... */
}
```

**Dark mode** habilitado: cada variable tiene su versión en `:root[class~="dark"]`. Para cambiar la paleta de colores, solo hay que editar esa sección.

---

## 🐳 Docker

```bash
docker build -t virtualpet-webclient .
docker run -p 4000:4000 -e NEXT_PUBLIC_API_URL=http://tu-backend:3000 virtualpet-webclient
```
