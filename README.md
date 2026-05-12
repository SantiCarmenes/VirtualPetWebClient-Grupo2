# Virtual Pet MDQ - Web Client

Este repositorio contiene el prototipo funcional de la aplicación web cliente para **Virtual Pet MDQ**, una tienda de mascotas 100% digital con alcance a la ciudad de Mar del Plata.

## Características Principales

Cumpliendo con los requerimientos de Arquitectura y los Atributos de Calidad (QAW):

- **Experiencia de Usuario Premium:** Diseño moderno (Mobile First) implementado con *Tailwind CSS*.
- **Modo Claro / Oscuro:** Paleta de colores adaptable e integrada con `next-themes` (tonos pastel y slate para no cansar la vista).
- **Checkout para Invitados:** Permite a los usuarios realizar compras rápidas sin obligación de crear una cuenta.
- **Grilla de Productos Responsiva:** Catálogo ágil y rápido, con identificadores visuales claros para productos sin stock.

## Vistas Implementadas

El prototipo cuenta con el siguiente flujo navegable simulado:

- `/` - **Home**: Hero section promocional, propuesta de valor (envío gratis en MDQ, pagos seguros) y categorías principales.
- `/catalog` - **Catálogo**: Listado completo de productos (alimentos, juguetes, higiene, accesorios) y grilla de stock.
- `/checkout` - **Checkout**: Formulario de envío y resumen persistente de compra.
- `/login` - **Login**: Interfaz de ingreso amigable.

## Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Estilos:** CSS Puro + [Tailwind CSS v4](https://tailwindcss.com/)
- **Íconos:** [Lucide React](https://lucide.dev/)
- **Datos Simulados:** Integración inicial en `/src/lib/mock-data.ts` como capa intermedia hasta que el *Monolito Modular* (Backend) exponga la API REST real.

## Cómo empezar a desarrollar

Para levantar el entorno de manera local:

1. Cloná este repositorio.
2. Asegurate de tener `Node.js` instalado.
3. Instalá las dependencias del proyecto:
   ```bash
   npm install
   ```
4. Corré el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abrí tu navegador en [http://localhost:3000](http://localhost:3000) para ver el sitio funcionando.

## Sobre el Grupo 2

Este es un proyecto académico de la asignatura de Diseño de Arquitectura de Software para la resolución del "TP Real 1.0". Todo el trabajo realizado, incluyendo ADRs, QAW y la definición arquitectónica, se puede encontrar documentado en la carpeta `/docs` en formato Markdown.
