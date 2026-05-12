# **Arquitectura elegida**

El sistema se estructura bajo un **estilo en capas** con tres capas
lógicas, cada una con una responsabilidad única y bien delimitada:
**presentación, lógica de negocio y datos**. Las capas se comunican
únicamente en sentido descendente y a través de interfaces explícitas,
lo que asegura separación de responsabilidades, favorece la
mantenibilidad y la posibilidad de evolucionar cada una de forma
independiente.

A su vez, las capas de presentación y de lógica de negocio cuentan con
su propia organización interna:

## **Capa de presentación**

Está compuesta por dos componentes web independientes, cada uno
orientado a un rol del sistema:

- **Web Cliente:** UI destinada al rol de cliente final, optimizada para
  la navegación del catálogo, la gestión del carrito, el checkout y el
  seguimiento de pedidos. Diseñada bajo principios responsive para
  soportar dispositivos móviles y de escritorio.

- **Web Backoffice:** UI destinada al personal de depósito, orientada a
  la consulta y gestión operativa de pedidos y entregas.

Ambas aplicaciones consumen la lógica de negocio exclusivamente a través
de una **API REST**, sin acceso directo a la capa de datos. Esto
garantiza un único punto de entrada al backend, sobre el cual se aplican
las políticas de autenticación, autorización y validación.

## **Capa de lógica de negocio**

Implementada como un **Monolito Modular**, organizado en siete módulos
con responsabilidades de negocio claramente diferenciadas:

  **Módulo**   **Responsabilidad Principal**
  ------------ ------------------------------------------------------------
  Auth         Autenticación y autorización (RBAC)
  User         Gestión de datos personales
  Catalog      Productos, variantes, búsqueda y filtros
  Inventory    Stock, reservas y disponibilidad
  Order        Ciclo de vida del pedido
  Payment      Procesamiento de pagos e integración con pasarelas
  Shipping     Cotización, generación de envíos e integración con courier

La organización interna de los módulos se define según la complejidad de
su dominio:

- **Módulos en arquitectura de capas:** Auth, User, Catalog, Inventory.
  Se implementa una arquitectura en capas: controller + service +
  repository

- **Módulos en arquitectura hexagonal (puertos y adaptadores):** Payment
  y Shipping. Son módulos con integraciones externas múltiples y
  reemplazables (pasarelas de pago, couriers).

Los módulos se comunican entre sí mediante **llamadas en memoria** sobre
interfaces públicas explícitas. El **aislamiento de datos se aplica a
nivel de esquema**: cada módulo accede únicamente a las tablas de su
propio esquema y queda **prohibido el acceso directo (incluyendo JOINs)
a tablas de esquemas ajenos**. Cuando un módulo requiere información de
otro dominio, debe solicitarla a través de la interfaz pública del
módulo responsable.

## **Capa de datos**

Centraliza la persistencia del sistema sobre el motor de base de datos
seleccionado, organizado en esquemas independientes por módulo. Cada
módulo de la capa de negocio accede a su esquema correspondiente
exclusivamente a través de sus repositorios internos, respetando el
aislamiento definido.

##  

# **Justificación de la elección de la arquitectura**

La elección arquitectónica responde a la conjunción de tres condiciones
del proyecto: el objetivo de negocio explícito de contar con una
*\"arquitectura simple de bajo costo\"*, los atributos de calidad
priorizados en el QAW (Seguridad, Usabilidad, Mantenibilidad,
Confiabilidad y Rendimiento), y la fase inicial de la startup, que
requiere flexibilidad para incorporar nuevas funcionalidades de manera
progresiva sin sobreinvertir en infraestructura distribuida.

A continuación se justifica cada decisión arquitectónica y el impacto
que tiene sobre los atributos de calidad priorizados.

## **Justificación del estilo en capas**

Se eligió un estilo en capas como organización general del sistema
porque permite separar responsabilidades en tres planos bien
diferenciados. Esta decisión impacta directamente sobre cuatro de los
cinco atributos priorizados:

- **Seguridad:** la separación entre presentación y negocio garantiza
  que las webs nunca accedan directamente a la base de datos. Toda
  interacción pasa por la API expuesta por la capa de negocio, donde se
  concentran las políticas de autenticación, autorización y validación.
  Esto sostiene el requisito del cliente de mantener una **separación
  estricta de responsabilidades operativas** entre el portal del cliente
  y el backoffice, e impide que un fallo en la capa de presentación
  comprometa los datos persistidos.

- **Mantenibilidad:** cada capa puede evolucionar de forma
  independiente. La UI puede modificarse sin tocar la lógica de negocio,
  y el motor de base de datos puede reemplazarse o ajustarse sin afectar
  a los módulos del backend. Esto es decisivo dado que el cliente
  anticipó que *\"el sistema irá cambiando porque estamos arrancando e
  incorporaremos muchas funcionalidades\"*.

- **Usabilidad:** la capa de presentación queda libre para optimizarse
  exclusivamente bajo criterios de experiencia de usuario (responsive,
  accesibilidad, conversión), sin que decisiones técnicas de bajo nivel
  contaminen el diseño visual. Esto sostiene el requisito de
  *\"experiencia responsive\"* y la prioridad del cliente de contar con
  un *\"ecommerce con excelente experiencia de usuario\"*.

- **Rendimiento:** al servirse las dos webs como aplicaciones
  independientes, se reduce la carga sobre la capa de negocio y se
  habilita paralelismo natural entre la carga de UI y la consulta de
  datos.

Cabe aclarar que la separación en capas descrita es **lógica**: define
cómo se organizan las responsabilidades en el sistema, no necesariamente
cómo se distribuyen físicamente. A nivel físico, se opta por desplegar
las tres capas en el mismo proveedor cloud, en procesos independientes
(la Web Cliente y la Web Backoffice como aplicaciones servidas por
separado, el backend como un proceso de aplicación, y la base de datos
como servicio gestionado o instancia dedicada). Esta decisión mantiene
la separación lógica y los beneficios sobre los atributos descritos,
mientras sostiene el objetivo de *\"arquitectura simple de bajo costo\"*
evitando la complejidad y el costo de operar infraestructura multi-cloud
en la fase inicial del proyecto. La separación lógica entre capas y
entre procesos preserva, además, un **camino evolutivo abierto**: si en
el futuro el crecimiento del negocio lo justifica, es posible separar
físicamente cada capa (por ejemplo, mover la base de datos a un servicio
gestionado dedicado, distribuir las webs en una CDN, o desplegar el
backend en múltiples instancias detrás de un balanceador) sin requerir
cambios estructurales en el código.

Se evaluaron y descartaron las siguientes alternativas:

- **Cliente-Servidor:** acopla la persistencia con la lógica de negocio,
  lo que perjudica la **Mantenibilidad** (cualquier cambio de motor o de
  modelo de datos obliga a modificar la lógica de negocio) y la
  **Seguridad** (no permite aplicar políticas centralizadas sobre el
  acceso a datos).

- **Estilos event-driven puros:** introducen complejidad operativa
  significativa (broker de eventos, garantías de entrega, *eventual
  consistency*, monitoreo distribuido) injustificada para el volumen y
  los requisitos actuales, y atentan directamente contra el objetivo de
  negocio de *\"arquitectura simple de bajo costo\"*.

## **Justificación del Monolito Modular en la capa de negocio**

Dentro de la capa de negocio se evaluaron dos alternativas principales:
**Microservicios** y **Monolito Modular**. Se eligió Monolito Modular
por las siguientes razones, cada una asociada a un atributo de calidad
priorizado o a un requisito de negocio:

- **Costo y simplicidad operativa:** una arquitectura de microservicios
  implica costos de infraestructura, observabilidad, redes y operación
  que son desproporcionados para una startup que arranca en una sola
  ciudad y aún no conoce su volumen real de tráfico. El Monolito Modular
  se despliega como una sola unidad, reduciendo costo y complejidad
  operativa.

- **Rendimiento:** la comunicación entre módulos ocurre mediante
  **llamadas en memoria** (invocaciones a funciones), sin overhead de
  red, serialización ni latencia inter-servicio. Esto es decisivo para
  escenarios del QAW como *\"agregar al carrito en ≤600ms p95\"* o
  *\"resumen de compra\"*, que en una arquitectura distribuida
  implicaría múltiples saltos de red.

- **Mantenibilidad:** la división explícita en siete módulos (Auth,
  User, Catalog, Inventory, Order, Payment, Shipping) con
  responsabilidades únicas permite que cualquier cambio quede confinado
  a uno o pocos módulos, sin propagación horizontal. Esto sostiene la
  incorporación progresiva de funcionalidades anticipada por el cliente.

- **Seguridad y Mantenibilidad:** cada módulo accede únicamente a las
  tablas de su propio esquema. Esto impide acoplamientos silenciosos a
  estructuras de datos ajenas (Mantenibilidad) y aplica el principio de
  mínimo privilegio a nivel de datos: un módulo comprometido no puede
  leer ni modificar datos de otros dominios sensibles como User o
  Payment (Seguridad).

- **Confiabilidad:** el aislamiento por esquema limita el radio de
  impacto de cualquier fallo. Una corrupción de datos en un módulo no se
  propaga al resto del sistema.

- **Camino evolutivo abierto:** el aislamiento por esquema y la
  separación clara de responsabilidades habilitan extraer un módulo como
  servicio independiente si en el futuro el negocio lo justifica (por
  ejemplo, escalar Catalog ante crecimiento masivo del tráfico de
  búsqueda durante la expansión nacional). La arquitectura no impone
  microservicios hoy, pero no los cierra a futuro.

Se descartó la arquitectura de **microservicios** porque, si bien ofrece
mayor escalabilidad granular, introduce complejidad operativa, costo de
infraestructura y desafíos de consistencia distribuida que son
innecesarios en la fase actual del negocio. Se descartó también el
**monolito tradicional** porque comprometería severamente la
Mantenibilidad esperada del sistema.

## **Justificación de los estilos internos por módulo**

No todos los módulos tienen la misma complejidad ni los mismos riesgos
de cambio, por lo que se aplicaron dos estilos internos diferentes según
el caso. La regla de selección es simple: **arquitectura hexagonal sólo
donde existen adaptadores externos reemplazables; capas tradicionales en
el resto**.

#### **Módulos en arquitectura de capas tradicionales (**Auth, User, Catalog, Inventory, Order**)**

Estos módulos tienen un dominio internamente estable y **no integran
sistemas externos reemplazables**. Su lógica se modela adecuadamente con
un patrón controller + service + repository:

- Auth y User son CRUD con reglas simples de autenticación y datos
  personales.

- Catalog es mayoritariamente de consulta (búsqueda y filtrado).

- Inventory requiere reglas de concurrencia para reservas, pero esas se
  resuelven a nivel de transacción de base de datos, no de arquitectura.

- Order es un orquestador que coordina Inventory, Payment y Shipping,
  pero **todos sus colaboradores son módulos internos** que se invocan
  en memoria, no proveedores externos.

**Impacto sobre los atributos:**

- **Mantenibilidad:** aplicar arquitectura hexagonal en estos módulos
  sería *overengineering:* más capas, más boilerplate y mayor curva de
  aprendizaje para nuevos desarrolladores, sin un beneficio real. Las
  capas tradicionales mantienen el código accesible y proporcionan una
  estructura conocida y ampliamente documentada en la industria.

- **Rendimiento:** evita capas de indirección innecesarias en módulos
  donde la latencia de cada llamada cuenta

#### **Módulos en arquitectura hexagonal (**Payment, Shipping**)**

Estos módulos integran **sistemas externos múltiples y reemplazables**
identificados explícitamente en la elicitación: *\"En el futuro usaremos
múltiples pasarelas de pagos y couriers\"*. Aquí, la arquitectura
hexagonal define la lógica de dominio detrás de un **puerto**
(interfaz), y cada proveedor externo (MercadoPago, Payway, Andreani,
Envíopack) se implementa como un **adaptador** específico.

**Impacto sobre los atributos:**

- **Mantenibilidad:** incorporar un nuevo proveedor requiere escribir un
  nuevo adaptador, sin tocar la lógica de dominio del módulo. Esto cubre
  directamente el escenario QAW *\"Tiempo de desarrollo e integración ≤
  3 semanas; 0 bugs en los métodos de pago anteriores\"* y el escenario
  equivalente para nuevos couriers logísticos.

- **Confiabilidad:** el dominio queda totalmente aislado de detalles
  técnicos del proveedor (formatos de respuesta, autenticación, manejo
  de errores específicos), lo que reduce el impacto de fallos externos.

- **Seguridad:** el aislamiento del dominio respecto del adaptador
  permite aplicar políticas de seguridad uniformes (validación de
  payloads, sanitización, manejo de credenciales) en un solo punto, en
  lugar de replicarlas por proveedor.

## **Trade-offs aceptados**

Toda decisión arquitectónica introduce compromisos. Los más relevantes
que asume esta arquitectura:

- **Disponibilidad:** una falla crítica en un módulo puede degradar el
  proceso completo. *Mitigación:* aislamiento por esquema y manejo de
  errores en cada módulo.

- **Escalabilidad:** no se puede escalar en backend un módulo de forma
  aislada; el sistema escala como un todo. *Mitigación:* escalado
  vertical y replicación del proceso en la fase actual; extracción a
  microservicios cuando el negocio lo justifique.

- **Complejidad:** con el tiempo, los módulos en la capa de negocio
  pueden acoplarse silenciosamente y degradar la modularidad.
  *Mitigación:* aislamiento estricto por esquema, contratos explícitos
  entre módulos y revisiones de código orientadas a límites.

- **Curva de aprendizaje por convivencia de estilos:** los
  desarrolladores deben saber cuándo aplicar capas y cuándo hexagonal.
  *Mitigación:* documentación por módulo y ADRs

- **Acoplamiento al motor de base de datos:** una única instancia
  compartida impide usar motores especializados por módulo.
  *Mitigación:* repositorios encapsulados que permiten migrar un módulo
  a otro motor sin afectar al resto.
