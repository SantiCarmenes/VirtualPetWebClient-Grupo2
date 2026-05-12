# Roles: 

**PM**: Micaela Rasso

**DevOps**: Santiago Cármenes

**DBA**: Gian Franco Magliotti

**Dev**: Todos

# Planificación de actividades

## Semana 1 - Planificación - 1/5 al 8/5

Definición de roles

Elicitación de requerimientos

QAW - Escenarios

Priorización de atributos de calidad y justificación

Generación de esquemas de bases de datos (relacional o no relacional)
(Gian)

Planteo de ADRs

Generación del mock de la plataforma web (Santi)

Presentación de planificación (Mica)

## Semana 2 - Arquitectura y ADRs - 8/5 al 14/5

Definición de la arquitectura y justificación

Elaboración de diagramas de componentes y despliegue

Desarrollo de backend: (Gian)

- Autenticación y usuarios

- Catálogo

Comienzo desarrollo web cliente (Implementación de las funcionalidades
de compra):

- Pantalla productos (Mica)

- Filtros de productos (Gian)

- Perfil (datos de envío, info de pago, etc) (Santi)

Búsqueda de hosting para el sistema (Santi)

Presentación de ADRs (Mica)

Presentación de la arquitectura (Mica)

## Semana 3 - Peer review - 14/5 al 21/5

Presentación de Pair Review (Mica)

Desarrollo de backend: inventario y logística (Gian)

Comienzo desarrollo web backoffice

- CRUD de inventario (Gian)

- Armado de pedidos (Mica)

Desarrollo web cliente (Implementación de las funcionalidades de
compra):

- Carrito de compras (ver, eliminar producto, elegir envío) (Mica)

Confirmación hosting y configuración (Santi)

## Semana 4 - Presentación final - 21/5 al 28/5

Desarrollo web backoffice

- Estado de pedido (pendiente, en preparación, enviado, recibido) (Mica)

Desarrollo web cliente (Implementación de las funcionalidades de
compra):

- Vista de envíos (Gian)

Deploy en producción (Santi)

Presentacion planificacion final y sistema funcionando

**Propuesta stack:**

- web cliente next

- web backoffice next

- back en nest

- bd postgresql

**PREGUNTAS QAW**

**Atributos de calidad**

¿Cuánto se espera que crezca el sistema? ¿Se planea una expansión
regional?

¿Cuántos usuarios concurrentes se esperan?¿Hay eventos con picos de
ventas? Si es así, ¿cuántos clientes esperan?

¿Puede caerse el sistema? ¿Cuánto tiempo es aceptable?

¿Las GUI deben ser mobile friendly?

¿Con qué frecuencia cambia el sistema? ¿Tienen planeado agregar nuevas
funcionalidades una vez que el sistema esté en funcionamiento?

¿Qué pasa si el envío falla? ¿Qué pasa si el pago falla?

¿Qué datos son sensibles?

¿Quién puede acceder a qué? ¿Hay privilegios para ciertos usuarios?

¿Existen ventanas de tiempo aceptables para dar de baja el sistema por
mantenimiento planificado?

¿Se integrará a una única pasarela de pagos (Ej. MercadoPago) o debe
estar preparado para soportar múltiples proveedores en un futuro?

¿Los usuarios deben estar registrados y logueados para realizar compras?

Para evitar inconvenientes en pedidos ¿El stock se reserva al ingresar
un producto al carrito o al confirmar el pedido?

**Funcionalidades:**

¿Cómo desea filtrar los productos? (solo tipo de producto, por color,
por precio, etc.)

¿Se debe permitir la carga de stock desde la web del backoffice?

¿Quién elige el método de envío y desde donde?

¿Cuántos productos y variaciones de estos tendrá? (Color, tamaño, etc.)

¿Desea que el cliente pueda tener la lista de envíos históricos o solo
los que estén en proceso de envío actual?

**Gantt actualizado:** [[Planificación
VirtualPet]{.underline}](https://docs.google.com/spreadsheets/d/1SRhrO2rVV4WV_uZY5G90HDrW9ztfQ6YXUhabXsCbOlk/edit?gid=0#gid=0)
