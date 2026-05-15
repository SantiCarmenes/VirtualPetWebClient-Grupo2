# 🐾 Virtual Pet - Web Client (Grupo 2)

Este repositorio contiene el **Cliente Web (Frontend)** de la plataforma e-commerce de **Virtual Pet**, desarrollado como Prototipo Funcional 1.0 y comenzando la fase de Integración.

Siguiendo las decisiones arquitectónicas del equipo (**ADR-01**), este cliente opera como una aplicación web completamente independiente, diseñada para consumir la lógica de negocio exclusivamente a través de APIs REST del Backend.

## 🚀 Tecnologías Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Iconos:** [Lucide React](https://lucide.dev/)

## ✨ Funcionalidades (Estado Actual)

El proyecto abarca el 100% del "Viaje del Cliente" a nivel maquetación y comenzó a conectarse a la Base de Datos real:

- **Autenticación Real:** El Login y Registro están totalmente integrados al servidor NestJS. Envía peticiones HTTP, recibe códigos de error, persistencia de `accessToken` vía localStorage.
- **Catálogo Interactivo (Mock):** Grilla responsiva de productos con filtrado dinámico por categorías, campos de rango de precios y ordenamiento personalizado.
- **Carrito de Compras (Local):** Gestionado globalmente vía `React Context` y persistido en `localStorage`. Panel deslizante (*Slide-Over*) y notificaciones *Toast*.
- **Checkout Seguro (Mock):** Flujo de pago validado y segmentado (Datos -> Envío -> Pago).
- **Perfil de Usuario (SPA):** Panel de administración personal con pestañas interactivas y modales.
- **Seguimiento de Envíos:** Línea de tiempo interactiva (*Timeline*) para monitorear el estado logístico de una orden.

## ⚙️ Cómo ejecutar el proyecto localmente

1. Clonar el repositorio.
2. Asegurarse de tener Node.js instalado (v18+ recomendado).
3. Instalar las dependencias:

```bash
npm install
```

4. Crear un archivo `.env.local` en la raíz del proyecto para indicarle a dónde apunta el Backend (que usualmente corre en el puerto 3000):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

5. Ejecutar el servidor de desarrollo (configurado para correr en el puerto 4000 y no chocar con el backend):

```bash
npm run dev
```

6. Abrir [http://localhost:4000](http://localhost:4000) en el navegador.

## 🏗️ Arquitectura y Próximos Pasos

La autenticación ya consume los Endpoints reales (`/auth/login` y `/auth/register`). 
Actualmente, la información de productos y órdenes aún proviene temporalmente de `/src/lib/mock-data.ts`. 

Una vez que el equipo de Backend finalice los endpoints REST restantes, el siguiente paso será reemplazar la lógica de `mock-data.ts` por llamadas a la API usando la utilidad que ya creamos en `src/lib/api.ts`.
