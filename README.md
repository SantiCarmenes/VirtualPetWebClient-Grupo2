# 🐾 Virtual Pet - Web Client (Grupo 2)

Este repositorio contiene el **Cliente Web (Frontend)** de la plataforma e-commerce de **Virtual Pet**, desarrollado como Prototipo Funcional 1.0.

Siguiendo las decisiones arquitectónicas del equipo (**ADR-01**), este cliente opera como una aplicación web completamente independiente, diseñada para consumir la lógica de negocio exclusivamente a través de APIs REST (actualmente simulado con Mock Data local para esta fase).

## 🚀 Tecnologías Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Iconos:** [Lucide React](https://lucide.dev/)

## ✨ Funcionalidades (Prototipo 1.0)

El prototipo abarca el 100% del "Viaje del Cliente", incorporando una estética moderna con efectos de *Glassmorphism* y micro-animaciones:

- **Catálogo Interactivo:** Grilla responsiva de productos con filtrado dinámico por categorías, campos de rango de precios y ordenamiento personalizado.
- **Carrito de Compras:** Gestionado globalmente vía `React Context` y persistido localmente (`localStorage`). Panel deslizante (*Slide-Over*) y notificaciones *Toast*.
- **Checkout Seguro:** Flujo de pago validado y segmentado (Datos -> Envío -> Pago) simulando una pasarela de pago real.
- **Autenticación (UI):** Interfaces modernas para Iniciar Sesión y Registro de cuentas.
- **Perfil de Usuario (SPA):** Panel de administración personal con pestañas interactivas, modales de edición simulados y listado de direcciones/tarjetas.
- **Seguimiento de Envíos:** Línea de tiempo interactiva (*Timeline*) para monitorear el estado logístico de una orden.

## ⚙️ Cómo ejecutar el proyecto localmente

1. Clonar el repositorio.
2. Asegurarse de tener Node.js instalado (v18+ recomendado).
3. Instalar las dependencias:

```bash
npm install
```

4. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🏗️ Arquitectura y Próximos Pasos

Actualmente, toda la información de productos y órdenes provienen de `/src/lib/mock-data.ts`. 

Una vez que el equipo de Backend finalice los endpoints REST del **Monolito Modular**, el siguiente paso será reemplazar la lógica de persistencia local por llamadas HTTP (usando `fetch` o `axios`) hacia dichos endpoints, sin alterar la maquetación ni las vistas de este repositorio.
