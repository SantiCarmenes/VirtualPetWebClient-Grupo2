# ADR-01

## 1. Título

Uso de Arquitectura en Capas en la plataforma de VirtualPet

## 2. Contexto

El proyecto requiere una arquitectura simple y el cumplimiento de los siguientes  atributos de calidad elicitados y priorizados durante el QAW

* Seguridad: ofrecer una experiencia segura y libre de fraudes.
* Mantenibilidad: evolución independiente de cada componente.
* Usabilidad: excelente experiencia de usuario.
* Rendimiento: respuestas rápidas y procesamiento paralelo entre UI y consultas de datos.
* Confiabilidad: limitación del alcance de los fallos

## 3. Alternativas Consideradas

Cliente-Servidor

Se integra la persistencia directamente con la lógica de negocio en una única aplicación. Si bien simplifica el desarrollo inicial, genera un acoplamiento estructural que dificulta la evolución del sistema. Cualquier cambio en el motor de base de datos o en el modelo de datos requeriría modificaciones profundas en la lógica de negocio, violando el principio de separación de responsabilidades.

Event-Driven Puro

Una arquitectura completamente orientada a eventos distribuiría la lógica de negocio a través de múltiples consumidores asíncronos conectados por un broker de eventos. Aunque este patrón es ideal para sistemas escalables con requisitos de consistencia eventual, introduce complejidad operativa significativa: garantías de entrega, monitoreo distribuido, debugging en sistemas distribuidos y gestión de fallos parciales. Para el volumen actual y la fase inicial del proyecto, esta inversión técnica no se justifica y contradice directamente el objetivo de negocio de mantener una "arquitectura simple de bajo costo". Por lo tanto, fue descartado en favor de una solución más pragmática.

## 4. Decisión

Capa de Presentación

Dos aplicaciones web independientes:

* Web Cliente: catálogo, carrito, checkout, seguimiento pedidos (responsive)
* Web Backoffice: gestión operativa de pedidos y entregas

Ambas consumen la lógica de negocio exclusivamente mediante API REST, garantizando un único punto de entrada con políticas centralizadas de autenticación, autorización y validación.

Capa de Lógica de Negocio

Implementada como un Monolito Modular. Esta capa se divide internamente en módulos autónomos (Catalog, Order, etc.) que comparten un mismo proceso de ejecución pero mantienen fronteras lógicas estrictas.

Capa de Datos

Base de datos centralizada organizada en esquemas independientes por módulo. Acceso exclusivamente a través de repositorios internos respetando el aislamiento de datos.

## 5. Justificación

La decisión responde a:

1. Objetivo de negocio: arquitectura simple de bajo costo.
2. Atributos priorizados: Seguridad, Usabilidad, Mantenibilidad, Confiabilidad, Rendimiento.
3. Fase inicial: flexibilidad para incorporar funcionalidades sin sobreinversión en infraestructura distribuida.

## 6. Consecuencias

Ventajas

* Separación clara de responsabilidades
* Políticas de seguridad centralizadas
* Componentes evolucionan independientemente
* Bajo costo operativo inicial

Riesgos y Mitigación

| Riesgo                                      | Mitigación                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Acoplamiento entre capas                    | Contrato REST con DTOs; sin imports de modelos del backend en la presentación.            |
| Bypass de capas                             | API REST como único punto de entrada; credenciales de BD no expuestas a la presentación. |
| Lógica de negocio filtrándose entre capas | Validaciones de dominio centralizadas en la Capa de Negocio;                               |

## 7. Referencias

* Documento de arquitectura
* Diagrama de componentes

## 8. Implementación y seguimiento

Backend:

1. Autenticación y Usuarios
2. Catálogo e Inventario
3. Pedidos
4. Pagos
5. Logística

Web Cliente:

1. Pantalla de productos
2. Filtros avanzados
3. Perfil de usuario
4. Carrito de compras
5. Seguimiento de envíos

Web Backoffice:

1. Armado de pedidos
2. Verificación de stock
3. Estado del pedido

# ADR-02

## 1. Título

Uso de Monolito Modular como arquitectura para la capa de negocio

## 2. Contexto

Tras definir la Arquitectura en Capas (ADR-01), es necesario organizar eficientemente la Capa de Negocio y el dominio del sistema  (Catálogo, Pagos, Inventario). Para esta fase de startup, se requiere una arquitectura simple y de bajo costo en infraestructura que prevenga el desorden estructural y garantice la mantenibilidad operando sobre un único servidor

## 3. Alternativas Consideradas

* Microservicios: Ofrece la máxima escalabilidad granular. Se rechaza debido a los altos costos de infraestructura, complejidad en la observabilidad y los desafíos de consistencia distribuida, los cuales resultan desproporcionados para la fase inicial del proyecto.
* Monolito Tradicional: Es la opción más simple de desplegar. Se rechaza porque el alto acoplamiento interno comprometería severamente la mantenibilidad a largo plazo y dificultaría la incorporación de nuevas funcionalidades sin afectar el sistema global.

## 4. Decisión

Se elige una arquitectura de Monolito Modular. El sistema se desplegará como una única unidad, pero estará dividido internamente en siete módulos con límites estrictos y responsabilidades únicas: Auth, User, Catalog, Inventory, Order, Payment y Shipping.

## 5. Justificación

La elección se sustenta en los siguientes atributos de calidad y requisitos de negocio:

1. Costo y simplicidad operativa: Permite operar con una infraestructura mínima, reduciendo la complejidad de redes y despliegue característica de sistemas distribuidos.
2. Rendimiento : La comunicación inter-modular ocurre mediante llamadas en memoria, eliminando el overhead de red y serialización
3. Mantenibilidad y Seguridad: El aislamiento (reforzado por el ADR-03 de esquemas de datos) confina los cambios a módulos específicos y aplica el principio de mínimo privilegio, limitando el radio de impacto ante fallos o vulnerabilidades.
4. Camino evolutivo: Esta estructura no impone la complejidad de los microservicios hoy, pero deja la puerta abierta para extraer cualquier módulo (como Catalog) si el tráfico futuro lo justifica.

## 5. Consecuencias

Ventajas

* Desarrollo unificado: Facilita el trabajo de los equipos al mantener un único repositorio y flujo de despliegue.
* Consistencia de datos: Permite gestionar transacciones de manera más sencilla que en ambientes distribuidos, manteniendo la integridad referencial lógica.

Riesgos y Mitigación

| Riesgo                                                                  | Mitigación                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Acoplamientoaccidental mediante dependencias circulares entre módulos. | Definir interfaces de servicio claras para la comunicación inter-modular |
| Escalabilidad:no hay escalado aislado por módulo``              | Escalado vertical; extracción a microservicios cuando sea justificado    |
| Complejidad:acoplamiento silencioso entre módulos                      | Aislamiento estricto por esquema, contratos explícitos, code reviews     |

## 6. Referencias

* Documento de arquitectura
* ADR-01: Arquitectura en Capas.
* ADR-03: Aislamiento de datos a nivel de esquema entre módulos.
* Diagrama de componentes

## 7. Implementación y Seguimiento

Estrategia de Ejecución

* Definición de interfaces: Establecer contratos para cada uno de los siete módulos
* Implementación: implementar cada módulo respetando su responsabilidades y la arquitectura que corresponda a cada módulo

Control

* Revisión de cohesión: Evaluar periódicamente que cada módulo mantenga su responsabilidad única y no absorba lógica de dominios adyacentes.

# ADR-03

## 1. Título

Aislamiento de datos a nivel de esquema entre módulos

## 2. Contexto

Tras la decisión de adoptar una arquitectura de Monolito Modular (ADR-02) en la Capa de Negocio, es necesario garantizar que la independencia de los módulos no sea solo a nivel de código, sino también en la capa de persistencia. Sin un aislamiento claro, los módulos tienden a acoplarse compartiendo tablas o realizando JOINs indiscriminados, lo que dificulta una futura extracción a microservicios y rompe el principio de Single Responsibility.

## 3. Alternativas Consideradas

Aislamiento a nivel de tabla (Prefijos)

* Todas las tablas en un único esquema. diferenciadas por prefijos (ej: catalog_product, order_order).
* Razones para rechazarla: No ofrece una barrera técnica real. Es propenso a errores humanos donde se termina accediendo a datos de otros módulos por comodidad, generando acoplamiento fuerte en la capa de persistencia.

Aislamiento a nivel de base de datos

* Una base de datos física independiente para cada módulo.
* Razones para rechazarla: Elevada complejidad operativa en esta fase del proyecto. Requiere gestionar múltiples pools de conexión y complica las transacciones y los backups en el VPS.

Aislamiento mediante distintos tipos de persistencia

* Usar SQL para un módulo y NoSQL para otro según la necesidad.
* Razones para rechazarla: Aumenta innecesariamente la curva de aprendizaje y el consumo de recursos del servidor sin una justificación técnica de peso en el volumen de datos actual.

## 4. Decisión

Se implementará un aislamiento lógico utilizando esquemas. Cada módulo del sistema tendrá su propio esquema (ej: catalog, orders, inventory) y será el dueño exclusivo de sus tablas. La comunicación inter-modular de datos se realizará estrictamente a través de servicios de aplicación (interfaces), prohibiendo el acceso directo a tablas de esquemas ajenos.

## 5. Justificación

Esta decisión garantiza un equilibrio entre la simplicidad de un único motor de base de datos y la rigidez necesaria para mantener un Monolito Modular sano. Facilita la identificación de responsabilidades, permite aplicar políticas de seguridad por esquema y prepara el terreno para una migración transparente a microservicios si el sistema escala regionalmente.

## 6. Consecuencias

Ventajas

* Desacoplamiento aislado: Los cambios en el modelo de datos de un módulo no impactan a los demás.
* Escalabilidad fluida: Prepara el terreno para una transición directa a bases de datos independientes (microservicios) en el futuro.
* Orden estructural: Límites claros que mejoran la organización visual y la seguridad.

Riesgos y Mitigación

| Riesgo                                                                           | Mitigación                                                                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Ausencia de integridad referencialdura (sinForeign Keysfísicas entre esquemas). | Delegar la garantía deintegridad y la consistencia eventual a la lógica de negocio y eventos del sistema. |
| Mayor complejidad en consultasy reportes que cruzan múltiples módulos.         | Resolver la agregación de datos en la capa de aplicación outilizar vistas de lectura específicas.        |

## 7. Referencias

* Documento de definición de arquitectura
* ADR-02: Monolito Modular en la capa de negocio
* Diagramas de componentes

## 8. Implementación y seguimiento

Estrategia de Ejecución

* Modelado de dominio: Delimitar con precisión qué entidades  pertenecen a cada módulo lógico antes de la creación.

Control

* Auditoría: Validar periódicamente que no existan vínculos o dependencias directas entre los diferentes silos de datos

# ADR-04

## 1. Título

Uso de Arquitectura Hexagonal en los módulos de Payment y Shipping

## 2. Contexto

La Capa de Negocio se encuentra organizada bajo una arquitectura de Monolito Modular (ADR-02), y cada módulo debe contar con su propia organización interna. No todos los módulos tienen la misma complejidad ni los mismos riesgos de cambio, lo que se traduce en necesidades arquitectónicas distintas.

En particular, Payment y Shipping presentan una característica que los diferencia del resto: integran sistemas externos múltiples y reemplazables.

## 3. Alternativas Consideradas

Capas tradicionales (controller + service + repository)

Es el estilo aplicado al resto de los módulos de la Capa de Negocio. Se rechazó para Payment y Shipping porque acopla la lógica de negocio directamente a la implementación de cada proveedor externo. Cada vez que se incorpore una nueva pasarela o courier, sería necesario modificar el servicio principal del módulo, multiplicando el riesgo de regresiones en proveedores ya integrados y dificultando el cumplimiento del escenario QAW.

Patrón Adapter aislado dentro de un módulo en capas

Una variante intermedia donde se mantiene la estructura de capas y se introducen adaptadores únicamente para encapsular las llamadas a proveedores externos. Se rechazó porque resuelve parcialmente el problema (aislamiento técnico del proveedor) pero no garantiza que la lógica de dominio sea agnóstica a los detalles del adaptador. Sin una frontera explícita (puerto), el dominio termina dependiendo de tipos, errores o convenciones del proveedor inicial.

Arquitectura Hexagonal (Puertos y Adaptadores)

 Define la lógica de dominio detrás de interfaces (puertos) que el dominio mismo declara. Cada proveedor externo se implementa como un adaptador específico que satisface el puerto. La lógica de negocio nunca conoce al proveedor concreto; solo conoce el puerto. Es la opción que mejor cubre el requisito de reemplazabilidad y el escenario QAW asociado.

## 4. Decisión

Se adopta Arquitectura Hexagonal (Puertos y Adaptadores)  como estilo interno de los módulos Payment y Shipping. La estructura interna de cada módulo será:

* Dominio: contiene la lógica de negocio y las interfaces (puertos) que define el módulo. No conoce a ningún proveedor concreto.
* Puertos de salida (driven ports): interfaces que el dominio requiere del exterior (ej. PaymentGateway, ShippingProvider).
* Adaptadores: implementaciones concretas de los puertos, una por proveedor (MercadoPagoAdapter, PaywayAdapter, AndreaniAdapter, EnviopackAdapter).
* Puertos de entrada (driving ports): interfaz de aplicación expuestas hacia los otros módulos (ej. Order) y hacia la capa de presentación.

Los demás módulos (Auth, User, Catalog, Inventory, Order) conservan el estilo de capas tradicionales, como define el documento general de arquitectura.

## 5. Justificación

La decisión responde a tres factores principales alineados con atributos de calidad priorizados:

* Mantenibilidad: incorporar un nuevo proveedor requiere escribir un nuevo adaptador, sin modificar la lógica de dominio. Esto cubre directamente el escenario QAW "Tiempo de desarrollo e integración ≤ 3 semanas; 0 bugs en los métodos anteriores". La regresión queda acotada al nuevo adaptador.
* Confiabilidad: el dominio queda aislado de los detalles técnicos del proveedor (formatos de respuesta, autenticación, manejo de errores específicos). Un fallo o cambio en una API externa no se propaga al dominio del módulo.
* Seguridad: el aislamiento del dominio respecto del adaptador permite aplicar políticas de seguridad uniformes (validación de payloads, sanitización, manejo de credenciales) en un único punto del módulo, en lugar de replicarlas por proveedor.
* Coherencia con ADR-02: el monolito modular permite usar estilos internos diferenciados por módulo. Aplicar hexagonal solo donde aporta valor real evita imponer su complejidad al resto del sistema.

## 6. Consecuencias

Ventajas

* Aislamiento total del dominio respecto de proveedores externos.
* Incorporación rápida de nuevos proveedores sin tocar la lógica de negocio.
* Testabilidad mejorada del dominio mediante adaptadores mock.
* Política de seguridad centralizada en el módulo, no por proveedor.

Riesgos y Mitigación

| Riesgo                                                                                                                      | Mitigación                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Mayor cantidad de archivos y boilerplate(puertos, adaptadores, mappers) respecto de capas tradicionales.                    | Limitar el estilo exclusivamente a los módulos que integran proveedores reemplazables, evitando su propagación al resto del sistema.         |
| Curva de aprendizajepara desarrolladores no familiarizados con el patrón.                                                  | Documentación por módulo, ADRs y plantillas estandarizadaspara crear un nuevo adaptador.                                                     |
| La convivencia de dos estilos internosen el mismo monolito puede generar confusión sobre cuál aplicar en módulos nuevos. | Regla explícita de selección documentada: hexagonal sólo donde existen adaptadores externos reemplazables; capas tradicionales en el resto. |

## 7. Referencias

* Documento de definición de arquitectura
* ADR-02: Monolito Modular en la capa de negocio
* ADR-03: Aislamiento de datos a nivel de esquema entre módulos
* Diagramas de componentes
* Escenarios del QAW: incorporación de pasarela de pago y courier

## 8. Implementación y Seguimiento

Estrategia de Ejecución

* Definición de puertos primero: cada módulo declara sus puertos de salida (lo que necesita del exterior) antes de implementar adaptadores concretos.
* Adaptador por proveedor: cada integración externa se implementa como un adaptador independiente que satisface el contrato del puerto.
* Inyección de dependencias: los adaptadores se inyectan en el dominio en tiempo de configuración, no se importan directamente.

# ADR-05

## 1. Título

Uso de un ORM(Prisma) para el acceso a la capa de datos

## 2. Contexto

El proyectoVirtual Pet requiere el desarrollo de  un backend robusto que garantice la integridad de los datos y facilite la evolución ágil del esquema. Debido a los plazos ajustados para el prototipo funcional y la arquitectura de Monolito Modular, se busca una herramienta que acelere el desarrollo y asegure una sincronización total entre la base de datos y el código

## 3. Alternativas Consideradas

* TypeORM: Es la opción tradicional en el ecosistema NestJS. Se rechazó porque la gestión de migraciones en esquemas muy cambiantes suele ser compleja y la sincronización de tipos requiere mayor intervención manual.
* SQL Puro / Query Builders: Ofrece control total, pero se descartó debido al elevado tiempo de desarrollo inicial y la carga operativa de mantener manualmente cada consulta y relación en un sistema con múltiples módulos.

## 4. Decisión

Se selecciona Prisma como el ORM principal. Su implementación  estará restringida exclusivamente a la capa de infraestructura (repositorios), asegurando que el cliente de persistencia no se filtre hacia la lógica de dominio.

## 5. Justificación

La elección se basa en tres pilares estratégicos:

1. Developer experience (DX): El autocompletado nativo reduce errores en el tiempo de desarrollo.
2. Migraciones declarativas: El archivo de esquema funciona como única fuente de verdad, simplificando la evolución del modelo de datos.
3. Seguridad de tipos: La generación automática de tipos elimina la discrepancia entre el código TypeScript y la estructura real de PostgreSQL.

## 6. Consecuencias

Ventajas

* Velocidad de entrega: Desarrollo acelerado de la lógica de persistencia y operaciones CRUD.
* Claridad: El esquema centralizado facilita la documentación y el entendimiento del modelo de datos.
* Fiabilidad: Tipado automático que previene errores de coincidencia entre la base de datos y la aplicación.

Riesgos y Mitigación

| Riesgo                                                                 | Mitigación                                                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Acoplamientoa los binarios y al ecosistema de la herramienta.          | Aplicar el patrónRepositorypara desacoplar la lógica de negocio de la implementación técnica del ORM..               |
| Limitaciones en consultasde extrema complejidad o consumo de recursos. | Permitir el uso deconsultas nativas(raw queries) únicamente en casos donde la abstracción del motor sea insuficiente.. |

## 7. Referencias

* Documentación oficial de Prisma y NestJS.
* ADR-03: Aislamiento de datos a nivel de esquema.

## 8. Implementación y Seguimiento

Estrategia de Ejecución

* Definición declarativa: Centralizar el modelado de datos en un contrato único que automatice la creación de tablas y tipos.
* Aislamiento: Configurar el acceso a datos para que el motor de persistencia sea inyectado solo en los servicios de repositorio.

Control

* Auditoría: Verificar en las revisiones de código que las entidades de dominio permanezcan agnósticas a la tecnología de persistencia.
* Validación de esquema: Asegurar que cada iteración del modelo esté respaldada por una migración reproducible para mantener la paridad entre entornos.

# ADR-06

## 1. Título

Uso de un servicio externo (Cloudinary) de CDN/Object Storage para almacenamiento de imágenes

## 2. Contexto

El módulo Catalog gestiona imágenes de productos como parte de su dominio. Estas imágenes son binarios estáticos de tamaño variable, consumidos masivamente desde los browsers de los clientes finales durante la navegación del catálogo. Almacenarlas en la base de datos relacional, junto con los datos transaccionales, degradaría el rendimiento de consultas , aumentaría el costo de backups e implicaría que todo el tráfico de imágenes pase por el proceso de aplicación, saturando recursos sin necesidad.

## 3. Alternativas Consideradas

* BLOBs en PostgreSQL: las imágenes se guardan como columnas binarias dentro de la base de datos relacional. Se rechazó porque degrada el rendimiento de queries transaccionales, infla el tamaño de los backups, e impone una carga innecesaria sobre la base de datos.
* Almacenamiento en disco local del servidor backend: :Se rechazó porque esta opción genera un acoplamiento innecesario entre el servidor de aplicaciones y los activos estáticos. Delegar la servidumbre de imágenes al backend consume recursos (CPU/RAM) que deberían ser exclusivos para la lógica de negocio, degradando el rendimiento general y complicando innecesariamente el backup y la migración de datos.
* Object Storage genérico (S3, MinIO): ofrece almacenamiento durable y separado del backend. Se evaluó como alternativa válida, pero no incluye transformaciones on-the-fly (redimensionamiento, optimización de formato) ni CDN integrado, lo que requeriría agregar otro servicio en frente.
* CDN especializado con object storage integrado (Cloudinary): combina almacenamiento, distribución global y transformaciones on-the-fly en un único servicio. Es la opción elegida.

## 4. Decisión

Se utilizará el  servicio externo de Cloudinary  de CDN con object storage integrado  para el almacenamiento y distribución de imágenes de productos. La base de datos relacional almacena únicamente las URLs o identificadores públicos de cada imagen.

## 5. Justificación

* Rendimiento: los browsers de los clientes consumen las imágenes directamente del CDN sin pasar por el backend, descargando el tráfico del servidor de aplicación y aprovechando caché geográfico.
* Mantenibilidad: la base de datos queda enfocada exclusivamente en datos transaccionales; el modelo de datos no se contamina con campos binarios pesados.
* Costo: Cuenta con buena capacidad gratuita 25Gb
* Usabilidad: las transformaciones on-the-fly (resize, formato, compresión) permiten servir imágenes optimizadas para cada dispositivo sin lógica adicional en el backend, contribuyendo al QA de Usabilidad y al requisito de experiencia responsive.

## 6. Consecuencias

Ventajas

* Backend liberado del tráfico de imágenes.
* Optimización automática de imágenes según dispositivo y conexión.
* Backups de la base de datos más livianos y rápidos.
* Aislamiento de la capa transaccional respecto a binarios pesados.

Riesgos y Mitigación

| Riesgo                                                                                                                   | Mitigación                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Pérdida de integridad referencial entre la URL almacenada en la base y el archivo en el CDN (ej. imágenes huérfanas). | Lógica de aplicación que sincroniza el ciclo de vida:si se elimina un producto, se elimina la imagen asociada; |
| Dependencia externa: si el CDN no responde, las imágenes no se cargan.                                                  | Aceptable: los CDNs comercialesofrecen SLAs muy altas.                                                           |

## 7. Referencias

* Documento de definición de arquitectura
* ADR-03: Aislamiento de datos a nivel de esquema
* Diagrama de despliegue

## 8. Implementación y Seguimiento

Estrategia de Ejecución

* Almacenar en la base de datos únicamente la URL pública y el identificador del recurso en el CDN.

**
