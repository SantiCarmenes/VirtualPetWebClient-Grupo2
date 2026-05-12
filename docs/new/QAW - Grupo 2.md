# QAW

## Escenarios de calidad

+-----------------+----------------+----------------+------------------+---------------+
| **Fuente de     | **Estímulo**   | **Artefacto    | **Respuesta del  | **Métrica de  |
| estímulo**      |                | Afectado**     | Sistema**        | Éxito**       |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Consulta su    | API de         | Se retorna la    | Tiempo de     |
|                 | historial de   | historial      |                  |               |
|                 | compras        |                | información en   | respuesta \<  |
|                 |                | de pedidos     |                  | 1.5s          |
|                 |                |                | tiempo real      |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Accede desde   | Web cliente    | Adapta las       | Las páginas   |
|                 | celular        |                | páginas de       | se renderizan |
|                 |                |                | manera           | correctamente |
|                 |                |                | responsive       | en celulares  |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | El cliente     | Servicio de    | Procesa el       | 0% de cobros  |
|                 | presiona el    | Pagos          | primer intento y | duplicados    |
|                 | botón          |                | descarta los     | por error de  |
|                 | \"Confirmar    |                | duplicados       | usuario o     |
|                 | Pago\"         |                | silenciosamente. | reintentos de |
|                 | múltiples      |                |                  | red;          |
|                 | veces en un    |                |                  | respuesta a   |
|                 | lapso de 2     |                |                  | las           |
|                 | segundos,      |                |                  | peticiones    |
|                 | enviando       |                |                  | duplicadas en |
|                 | peticiones     |                |                  | \< 0.5s.      |
|                 | duplicadas a   |                |                  |               |
|                 | la pasarela de |                |                  |               |
|                 | pagos          |                |                  |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Dos usuarios   | Servicio de    | Sólo uno obtiene | En 1000       |
|                 | confirman el   | Inventario     | los ítem; el     | ejecuciones   |
|                 | pedido del     |                | otro recibe      | concurrentes  |
|                 | mismo producto |                | error de stock   | simuladas, 0  |
|                 |                |                | antes del pago   | ventas        |
|                 |                |                |                  | duplicadas    |
|                 |                |                |                  | del mismo     |
|                 |                |                |                  | ítem único    |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Quiere         | Web cliente y  | Permite checkout | 100% de       |
|                 | realizar       | Servicio de    | como invitado    | usuarios      |
|                 | compra sin     | Pedidos        |                  | pueden        |
|                 | crear cuenta   |                |                  | completar la  |
|                 |                |                |                  | compra sin    |
|                 |                |                |                  | necesidad de  |
|                 |                |                |                  | loguearse     |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Solicita la    | Servicio de    | Devuelve         | Tiempo de     |
|                 | página         | Catálogo       | productos        | respuesta ≤   |
|                 | principal de   |                | paginados        | 500ms en P95  |
|                 | catálogo       |                |                  | con 50        |
|                 |                |                |                  | usuarios      |
|                 |                |                |                  | concurrentes; |
|                 |                |                |                  | tiempo total  |
|                 |                |                |                  | de página ≤   |
|                 |                |                |                  | 2s            |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Ejecuta        | Servicio de    | Devuelve         | Tiempo de     |
|                 | búsqueda con   | Catálogo       | resultados       | respuesta ≤   |
|                 | filtros        |                | filtrados        | 800ms en P95  |
|                 | multi-atributo |                |                  | sobre         |
|                 |                |                |                  | catálogo de   |
|                 |                |                |                  | 2000          |
|                 |                |                |                  | productos con |
|                 |                |                |                  | 25 variantes  |
|                 |                |                |                  | promedio      |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Visualiza      | Servicio de    | Muestra el       | 100% de       |
|                 | producto sin   | Catálogo       | producto         | productos sin |
|                 | stock          |                | deshabilitado    | stock         |
|                 | disponible     |                | con mensaje      | claramente    |
|                 |                |                | \"Agotado\"      | identificados |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Abandona el    | Servicio de    | Mantiene el      | 95% retención |
|                 | carrito por    | Pedidos,       | carrito intacto  | de carritos   |
|                 | más de 30      | Servicio de    | si los productos | abandonados;  |
|                 | minutos y      | Carrito de     | siguen           | notificación  |
|                 | retorna        | compras        | disponibles;     | de cambios en |
|                 |                |                | ajusta           | \< 1s         |
|                 |                |                | cantidades si    |               |
|                 |                |                | hubo cambios de  |               |
|                 |                |                | stock            |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Presiona el    | Servicio de    | Se verifica el   | Tiempo de     |
|                 | botón "Agregar | Pedidos,       | stock del        | respuesta ≤   |
|                 | al carrito"    | Servicio de    | producto, si hay | 600ms en P95; |
|                 |                | Carrito de     | disponibles se   | respuesta     |
|                 |                | compras        | agrega al        | clara para el |
|                 |                |                | carrito y si no  | usuario       |
|                 |                |                | está disponible  |               |
|                 |                |                | se genera un     |               |
|                 |                |                | cartel que lo    |               |
|                 |                |                | indique          |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Revisa el      | Servicio de    | Se muestran:     | 100% de       |
|                 | resumen de     | Carrito de     | productos,       | órdenes con   |
|                 | compra antes   | Compras        | cantidades,      | detalles      |
|                 | de pagar       |                | precios          | correctos y   |
|                 |                |                | unitarios,       | formato       |
|                 |                |                | precio           | legible en    |
|                 |                |                | acumulado, costo | cualquier     |
|                 |                |                | de envío, total  | dispositivo.  |
|                 |                |                | final y          |               |
|                 |                |                | dirección de     |               |
|                 |                |                | entrega          |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Ingresa        | Servicio de    | Se valida la     | Validación en |
|                 | dirección en   | Logística      | dirección, se    | \<2s en 95P,  |
|                 | zona cubierta  |                | confirma envío   | costos        |
|                 | por los envíos |                | bonificado o con | correctos de  |
|                 |                |                | costo y se       | envío.        |
|                 |                |                | calcula tiempo   |               |
|                 |                |                | de entrega       |               |
+-----------------+----------------+----------------+------------------+---------------+
| Usuario final   | Ingresa        | Servicio de    | Se informa en el |               |
|                 | dirección en   | Logística      | carrito de       |               |
|                 | zona no        |                | compras que la   |               |
|                 | alcanzable por |                | zona no está     |               |
|                 | los envíos     |                | disponible para  |               |
|                 |                |                | envíos en este   |               |
|                 |                |                | momento          |               |
+-----------------+----------------+----------------+------------------+---------------+
| Atacante /      | 15 intentos    | Servicio de    | El sistema       | Bloqueo       |
| Sistema de      | fallidos de    | Autenticación  | bloquea          |               |
| fraude          | inicio de      | y Motor de     | temporalmente el | automático    |
|                 | sesión en 5    | Notificaciones | acceso a la      |               |
|                 | minutos        |                | cuenta y se      | en \< 5s      |
|                 |                |                | notifica al      |               |
|                 |                |                | usuario          |               |
|                 |                |                |                  |               |
|                 |                |                | por correo/SMS   |               |
+-----------------+----------------+----------------+------------------+---------------+
| Atacante        | Intenta        | Servicio de    | Detecta patrones | Bloqueo en    |
|                 | múltiples      | Pagos          | sospechosos y    | \<3s,         |
|                 | pagos con      |                | bloquea la       | reducción de  |
|                 | tarjeta que    |                | cuenta           | fraudes,      |
|                 | resultan       |                | temporalmente    | usuario       |
|                 | inválidos      |                |                  | notificado en |
|                 |                |                |                  | \<1m          |
+-----------------+----------------+----------------+------------------+---------------+
| Proveedor de    | El servicio de | Servicio de    | El sistema       | Cambio de     |
| pagos externo   | pagos se cae o | Pagos          | oculta el método | método        |
| (ej.            | no responde    |                | fallido, no      | visible en \< |
| MercadoPago).   | durante el     |                | bloquea la       | 1s; 0% de     |
|                 | último paso de |                | pantalla y       | ventas caídas |
|                 | una compra.    |                | ofrece la opción | por fallo     |
|                 |                |                | de pago por      | técnico del   |
|                 |                |                | transferencia    | proveedor.    |
|                 |                |                | bancaria.        |               |
+-----------------+----------------+----------------+------------------+---------------+
| Sistema         | Pedido         | Motor de       | Envía            | Órdenes       |
|                 | confirmado y   | Notificaciones | confirmación por | notificadas   |
|                 | pagado         |                | mail/SMS con     | en \<2m       |
|                 | exitosamente   |                | número de órden  |               |
|                 |                |                | e información    |               |
|                 |                |                | del pedido       |               |
+-----------------+----------------+----------------+------------------+---------------+
| Sistema         | Envío en       | Motor de       | Envía mail/SMS   | Notificación  |
|                 | proceso,       | Notificaciones | con el horario   | en \<2m       |
|                 | delivery hacia |                | de entrega       |               |
|                 | el cliente     |                | estimado         |               |
+-----------------+----------------+----------------+------------------+---------------+
| Administradores | La empresa     | Servicio de    | El equipo agrega | Tiempo de     |
| de Negocio      | decide         | Pagos          | el nuevo         | desarrollo e  |
|                 | incorporar un  |                | proveedor        | integración   |
|                 | nuevo          |                | creando un       | \<= 3         |
|                 | proveedor de   |                | \"adaptador\"    | semanas; 0    |
|                 | pagos (ej.     |                | específico para  | bugs en los   |
|                 | PayU) al flujo |                | esa pasarela,    | métodos de    |
|                 | de compras.    |                | sin tener que    | pago          |
|                 |                |                | tocar ni alterar | anteriores;   |
|                 |                |                | el código        |               |
|                 |                |                | central (*core*) |               |
|                 |                |                | del carrito ni   |               |
|                 |                |                | de los pagos que |               |
|                 |                |                | ya existen.      |               |
+-----------------+----------------+----------------+------------------+---------------+
| Administradores | La empresa     | Servicio de    | El equipo        | Tiempo de     |
| de Negocio      | decide         | Logística      | conecta la nueva | integración   |
|                 | incorporar un  |                | API de logística | \<= 3         |
|                 | nuevo          |                | mediante un      | semanas; el   |
|                 | proveedor      |                | \"adaptador\",   | cotizador     |
|                 | logístico (ej. |                | permitiendo      | devuelve el   |
|                 | Envíopack o    |                | cotizar envíos y | precio del    |
|                 | Andreani) para |                | generar          | nuevo correo  |
|                 | llegar a       |                | etiquetas sin    | en \< 1s      |
|                 | provincias     |                | alterar el       | durante el    |
|                 | donde no       |                | código de la     | checkout;     |
|                 | tienen equipo  |                | logística propia |               |
|                 | propio.        |                | ni de            |               |
|                 |                |                | proveedores      |               |
|                 |                |                | anteriores.      |               |
+-----------------+----------------+----------------+------------------+---------------+
| Area Comercial  | La empresa     | Servicio de    |                  | Tiempo de     |
|                 | decide         | promoción      |                  | desarrollo e  |
|                 | incorporar una |                |                  | integración   |
|                 | nueva          |                |                  | \< 1 día      |
|                 | promoción      |                |                  |               |
+-----------------+----------------+----------------+------------------+---------------+
| Repartidor      | Marca envío    | Servicio de    | El sistema       | 100% de los   |
|                 | como fallido   | Envíos         | agenda           | envíos        |
|                 | por primer o   |                | automáticamente  | fallidos      |
|                 | segunda vez    |                | un segundo       | generan un    |
|                 |                |                | intento al día   | nuevo intento |
|                 |                |                | siguiente        | programado a  |
|                 |                |                |                  | +24hs;        |
+-----------------+----------------+----------------+------------------+---------------+
| Repartidor      | Marca envío    | Servicio de    | El pedido pasa a | 100% de los   |
|                 | como fallido   | Envíos         | CANCELADO POR    | envíos        |
|                 | por tercer vez |                | FALLIDOS y se    | fallidos en   |
|                 |                |                | notifica al      | su tercer     |
|                 |                |                | cliente en ≤ 1   | intento, se   |
|                 |                |                | minuto           | cancelan y    |
|                 |                |                |                  | liberan el    |
|                 |                |                |                  | stock         |
+-----------------+----------------+----------------+------------------+---------------+
| Desarrolladores | Mantenimiento  | Sistema        | Indisponibilidad |               |
|                 | planificado    | completo       | mínima durante   |               |
|                 |                |                | el deploy        |               |
+-----------------+----------------+----------------+------------------+---------------+
| Depósito        | Marca producto | Servicio de    | Se genera        | Notificación  |
|                 | como "No       | Inventario,    | automáticamente  | en \<2m,      |
|                 | disponible" en | Servicio de    | una oferta       | tiempo        |
|                 | una orden      | Pedidos, Motor | alternativa y se | perdido por   |
|                 |                | de             | da la opción de  | falta de      |
|                 |                | Notificaciones | reembolso        | stock         |
|                 |                |                | parcial del      | reducido      |
|                 |                |                | pedido           |               |
+-----------------+----------------+----------------+------------------+---------------+
| Depósito        | Escanea        | Servicio de    | Se verifican los | 100% de       |
|                 | productos      | Inventario     | productos        | productos     |
|                 | durante el     |                | empacados en el  | guardados en  |
|                 | armado del     |                | envío            | el pedido     |
|                 | pedido         |                |                  |               |
+-----------------+----------------+----------------+------------------+---------------+
| Depósito        | Finaliza el    | Servicio de    | Se marca como    | Validación en |
|                 | armado de un   | Pedidos,       | "Listo para      | \<1s          |
|                 | pedido         | Servicio de    | envío" y genera  |               |
|                 |                | Logística      | la etiqueta de   |               |
|                 |                |                | envío            |               |
|                 |                |                | automáticamente  |               |
+=================+================+================+==================+===============+

##  

## Priorización de atributos de calidad

  -----------------------
  **Atributo**
  -----------------------
  **Rendimiento**

  **Escalabilidad**

  **Seguridad**

  **Mantenibilidad**

  **Interoperabilidad**

  **Disponibilidad**

  **Testeabilidad**

  **Usabilidad**

  **Portabilidad**

  **Confiabilidad**

  **Compatibilidad**
  -----------------------

## Justificación de atributos de calidad elegidos

**Seguridad**

Para un ecommerce es muy importante generar confianza en los clientes,
más en las fases tempranas. El cliente dejó en claro una política de
manejo de riesgos "No almacenar datos de tarjetas ni datos sensibles"
además de marcar una separación de responsabilidades operativas "el
cliente usa el portal para comprar, el personal de backoffice gestiona
los pedidos". Esto impone la necesidad de usar un mecanismo de gestión
de identidades y control de acceso basado en roles, aislando los
dominios del cliente y el backoffice

**Usabilidad**

El sistema está destinado a la compra de productos para mascotas, es
claro que la importancia de la interfaz y experiencia de usuario es
relevante para que los productos puedan mostrarse de forma eficaz y
atractiva. Durante la elicitación, se mencionó la importancia de que la
interfaz sea responsive y que, por lo tanto, pueda adaptarse a
dispositivos móviles y de escritorio. Por otro lado, también se menciona
la existencia de filtros para amenizar la búsqueda de productos
apropiados de una forma sencilla, ya que en la elicitación se habla
sobre un catálogo de 20000 productos con hasta 25 variaciones posibles
en algunos de ellos.

**Mantenibilidad**

Durante la elicitación, el cliente dejó en claro que el sistema, al
estar en fase inicial, requerirá de la incorporación paulatina de nuevas
funcionalidades. Dichas funcionalidades, no solo incluyen features para
el cliente sino también la conexión con diferentes providers para la
realización de pagos y para el tratamiento de los envíos por courier.
Por estas razones, consideramos resulta fundamental contar con un código
altamente cohesivo y con bajo acoplamiento que permita realizar las
modificaciones y el mantenimiento para la adición de features o la
integración con nuevos sistemas de forma rápida, segura y sin afectar a
todo el sistema.

**Confiabilidad**

Se ha seleccionado a la confiabilidad como atributo de calidad de alta
prioridad debido a que el cliente define como éxito crítico "no
defraudar a los usuarios" y sus mascotas. Dado que el modelo de negocio
contempla una futura expansión nacional y la integración de múltiples
proveedores externos (pagos y logística), el sistema debe garantizar la
integridad de las transacciones y la mínima interrupción de servicio. De
esta manera, para asegurar que el sistema sea confiable, se debe
priorizar la tolerancia a fallos: si el pago se completa, el stock se
descuenta correctamente; si algo falla, el sistema se recupera sin
afectar la experiencia del cliente ni la integridad de los datos.

**Rendimiento**

El último atributo de calidad que hemos de mencionar es el rendimiento,
que viene apareado a la usabilidad en este caso. Al tener la usabilidad
como un QA, se debe tener en cuenta la experiencia de usuario. Un factor
importante de UX es el tiempo de respuesta. El ecommerce maneja una
amplia variedad de productos en su catálogo, es de suma importancia que
la web del cliente sea rápida y que el cliente no note una demora
importante en la carga de la misma, como lo menciona el cliente durante
la elicitación.

####
