# **ADR-01**

## **1. Título**

Uso de Arquitectura en Capas en la plataforma de VirtualPet

## **2. Contexto**

El proyecto requiere una arquitectura simple y el cumplimiento de los
siguientes atributos de calidad elicitados y priorizados durante el QAW

- **Seguridad:** ofrecer una experiencia segura y libre de fraudes.

- **Mantenibilidad:** evolución independiente de cada componente.

- **Usabilidad:** excelente experiencia de usuario.

- **Rendimiento:** respuestas rápidas y procesamiento paralelo entre UI
  y consultas de datos.

- **Confiabilidad:** limitación del alcance de los fallos

## **3. Alternativas Consideradas**

**Cliente-Servidor**

Se integra la persistencia directamente con la lógica de negocio en una
única aplicación. Si bien simplifica el desarrollo inicial, genera un
acoplamiento estructural que dificulta la evolución del sistema.
Cualquier cambio en el motor de base de datos o en el modelo de datos
requeriría modificaciones profundas en la lógica de negocio, violando el
principio de separación de responsabilidades. Además, impide la
aplicación de políticas centralizadas de seguridad, pues no existe un
punto único de control sobre el acceso a datos.

**Event-Driven Puro**

Una arquitectura completamente orientada a eventos distribuiría la
lógica de negocio a través de múltiples consumidores asíncronos
conectados por un broker de eventos. Aunque este patrón es ideal para
sistemas escalables con requisitos de consistencia eventual, introduce
complejidad operativa significativa: garantías de entrega, monitoreo
distribuido, debugging en sistemas distribuidos y gestión de fallos
parciales. Para el volumen actual y la fase inicial del proyecto, esta
inversión técnica no se justifica y contradice directamente el objetivo
de negocio de mantener una \"arquitectura simple de bajo costo\". Por lo
tanto, fue descartado en favor de una solución más pragmática.

## **4. Decisión**

**Capa de Presentación**

Dos aplicaciones web independientes:

- **Web Cliente:** catálogo, carrito, checkout, seguimiento pedidos
  (responsive)

- **Web Backoffice:** gestión operativa de pedidos y entregas

Ambas consumen la lógica de negocio **exclusivamente mediante API
REST**, garantizando un único punto de entrada con políticas
centralizadas de autenticación, autorización y validación.

**Capa de Lógica de Negocio**

Implementada como un **Monolito Modular**. Esta capa se divide
internamente en módulos autónomos (Catalog, Order, etc.) que comparten
un mismo proceso de ejecución pero mantienen fronteras lógicas
estrictas.

**Capa de Datos**

Base de datos centralizada organizada en esquemas independientes por
módulo. Acceso exclusivamente a través de repositorios internos
respetando el aislamiento de datos.

## **5. Justificación**

La decisión responde a:

1.  **Objetivo de negocio**: arquitectura simple de bajo costo.

2.  **Atributos priorizados**: Seguridad, Usabilidad, Mantenibilidad,
    Confiabilidad, Rendimiento.

3.  **Fase inicial**: flexibilidad para incorporar funcionalidades sin
    sobreinversión en infraestructura distribuida.

## **6. Consecuencias** 

**Ventajas**

- Separación clara de responsabilidades

- Políticas de seguridad centralizadas

- Componentes evolucionan independientemente

- Bajo costo operativo inicial

**Riesgos y Mitigación**

  **Riesgo**                                                           **Mitigación**
  -------------------------------------------------------------------- -----------------------------------------------------------------------
  **Disponibilidad:** falla crítica degrada proceso completo           Aislamiento por esquema, manejo de errores robusto
  **Escalabilidad:** no hay escalado aislado por módulo                Escalado vertical; extracción a microservicios cuando sea justificado
  **Complejidad:** acoplamiento silencioso entre módulos               Aislamiento estricto por esquema, contratos explícitos, code reviews
  **Curva aprendizaje:** convivencia de estilos (capas + hexagonal)    Documentación por módulo, ADRs
  **Acoplamiento BD:** instancia única impide motores especializados   Repositorios encapsulados permiten migración modular

## **7. Referencias**

- Documento de arquitectura

- Diagrama de componentes

## **8. Implementación y seguimiento**

**Backend:**

1.  Autenticación y Usuarios

2.  Catálogo e Inventario

3.  Pedidos

4.  Pagos

5.  Logística

**Web Cliente:**

1.  Pantalla de productos

2.  Filtros avanzados

3.  Perfil de usuario

4.  Carrito de compras

5.  Seguimiento de envíos

**Web Backoffice:**

1.  Armado de pedidos

2.  Verificación de stock

3.  Estado del pedido

# **ADR-02**

## **1. Título**

Uso de Monolito Modular como arquitectura para la capa de negocio

## **2. Contexto**

Tras definir la Arquitectura en Capas (ADR-01), es necesario organizar
eficientemente la Capa de Negocio y el dominio del sistema (Catálogo,
Pagos, Inventario). Para esta fase de startup, se requiere una
arquitectura simple y de bajo costo en infraestructura que prevenga el
desorden estructural y garantice la mantenibilidad operando sobre un
único servidor

## **3. Alternativas Consideradas**

- **Microservicios:** Ofrece la máxima escalabilidad granular. Se
  rechaza debido a los altos costos de infraestructura, complejidad en
  la observabilidad y los desafíos de consistencia distribuida, los
  cuales resultan desproporcionados para la fase inicial del proyecto.

- **Monolito Tradicional:** Es la opción más simple de desplegar. Se
  rechaza porque el alto acoplamiento interno comprometería severamente
  la mantenibilidad a largo plazo y dificultaría la incorporación de
  nuevas funcionalidades sin afectar el sistema global.

## **4. Decisión**

Se elige una arquitectura de **Monolito Modular**. El sistema se
desplegará como una única unidad, pero estará dividido internamente en
siete módulos con límites estrictos y responsabilidades únicas: Auth,
User, Catalog, Inventory, Order, Payment y Shipping.

## **5. Justificación**

La elección se sustenta en los siguientes atributos de calidad y
requisitos de negocio:

1.  **Costo y simplicidad operativa:** Permite operar con una
    infraestructura mínima, reduciendo la complejidad de redes y
    despliegue característica de sistemas distribuidos.

2.  **Rendimiento :** La comunicación inter-modular ocurre mediante
    llamadas en memoria, eliminando el *overhead* de red y serialización

3.  **Mantenibilidad y Seguridad:** El aislamiento (reforzado por el
    ADR-03 de esquemas de datos) confina los cambios a módulos
    específicos y aplica el principio de mínimo privilegio, limitando el
    radio de impacto ante fallos o vulnerabilidades.

4.  **Camino evolutivo:** Esta estructura no impone la complejidad de
    los microservicios hoy, pero deja la puerta abierta para extraer
    cualquier módulo (como Catalog) si el tráfico futuro lo justifica.

## **5. Consecuencias**

**Ventajas**

- **Desarrollo unificado:** Facilita el trabajo de los equipos al
  mantener un único repositorio y flujo de despliegue.

- **Consistencia de datos:** Permite gestionar transacciones de manera
  más sencilla que en ambientes distribuidos, manteniendo la integridad
  referencial lógica.

**Riesgos y Mitigación**

  **Riesgo**                                                                    **Mitigación**
  ----------------------------------------------------------------------------- --------------------------------------------------------------------------
  **Acoplamiento** accidental mediante dependencias circulares entre módulos.   Definir interfaces de servicio claras para la comunicación inter-modular
  **Escalabilidad:** no hay escalado aislado por módulo                         Escalado vertical; extracción a microservicios cuando sea justificado
  **Complejidad:** acoplamiento silencioso entre módulos                        Aislamiento estricto por esquema, contratos explícitos, code reviews

## **6. Referencias**

- Documento de arquitectura

- ADR-01: Arquitectura en Capas.

- ADR-03: Aislamiento de datos a nivel de esquema entre módulos.

- Diagrama de componentes

## **7. Implementación y Seguimiento**

**Estrategia de Ejecución**

- **Definición de interfaces:** Establecer contratos para cada uno de
  los siete módulos

- **Implementación**: implementar cada módulo respetando su
  responsabilidades y la arquitectura que corresponda a cada módulo

**Control**

- **Revisión de cohesión:** Evaluar periódicamente que cada módulo
  mantenga su responsabilidad única y no absorba lógica de dominios
  adyacentes.

# **ADR-03**

## **1. Título**

Aislamiento de datos a nivel de esquema entre módulos

## **2. Contexto**

Tras la decisión de adoptar una arquitectura de Monolito Modular
(ADR-02), es necesario garantizar que la independencia de los módulos no
sea solo a nivel de código, sino también en la capa de persistencia. Sin
un aislamiento claro, los módulos tienden a acoplarse compartiendo
tablas o realizando JOINs indiscriminados, lo que dificulta una futura
extracción a microservicios y rompe el principio de Single
Responsibility.

## **3. Alternativas Consideradas**

**Aislamiento a nivel de tabla (Prefijos)**

- Todas las tablas en un único esquema. diferenciadas por prefijos (ej:
  catalog_product, order_order).

- *Razones para rechazarla:* No ofrece una barrera técnica real. Es
  propenso a errores humanos donde se termina accediendo a datos de
  otros módulos por comodidad, generando acoplamiento fuerte en la capa
  de persistencia.

**Aislamiento a nivel de base de datos**

- Una base de datos física independiente para cada módulo.

- *Razones para rechazarla:* Elevada complejidad operativa en esta fase
  del proyecto. Requiere gestionar múltiples pools de conexión y
  complica las transacciones y los backups en el VPS.

**Aislamiento mediante distintos tipos de persistencia**

- Usar SQL para un módulo y NoSQL para otro según la necesidad.

- *Razones para rechazarla:* Aumenta innecesariamente la curva de
  aprendizaje y el consumo de recursos del servidor sin una
  justificación técnica de peso en el volumen de datos actual.

## 

## 

## **4. Decisión**

Se implementará un aislamiento lógico utilizando esquemas. Cada módulo
del sistema tendrá su propio esquema (ej: catalog, orders, inventory) y
será el dueño exclusivo de sus tablas. La comunicación inter-modular de
datos se realizará estrictamente a través de servicios de aplicación
(interfaces), prohibiendo el acceso directo a tablas de esquemas ajenos.

## **5. Justificación**

Esta decisión garantiza un equilibrio entre la simplicidad de un único
motor de base de datos y la rigidez necesaria para mantener un Monolito
Modular sano. Facilita la identificación de responsabilidades, permite
aplicar políticas de seguridad por esquema y prepara el terreno para una
migración transparente a microservicios si el sistema escala
regionalmente.

## **6. Consecuencias**

**Ventajas**

- **Desacoplamiento aislado:** Los cambios en el modelo de datos de un
  módulo no impactan a los demás.

- **Escalabilidad fluida:** Prepara el terreno para una transición
  directa a bases de datos independientes (microservicios) en el futuro.

- **Orden estructural:** Límites claros que mejoran la organización
  visual y la seguridad.

**Riesgos y Mitigación**

  **Riesgo**                                                                             **Mitigación**
  -------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------
  Ausencia de integridad referencial dura (sin *Foreign Keys* físicas entre esquemas).   Delegar la garantía de integridad y la consistencia eventual a la lógica de negocio y eventos del sistema.
  Mayor complejidad en consultas y reportes que cruzan múltiples módulos.                Resolver la agregación de datos en la capa de aplicación o utilizar vistas de lectura específicas.

## **7. Referencias**

- Documento de definición de arquitectura

- ADR-02: Monolito Modular en la capa de negocio

- Diagramas de componentes

## 

## **8. Implementación y seguimiento**

**Estrategia de Ejecución**

- **Modelado de dominio:** Delimitar con precisión qué entidades
  pertenecen a cada módulo lógico antes de la creación.

**Control**

- **Auditoría:** Validar periódicamente que no existan vínculos o
  dependencias directas entre los diferentes silos de datos.

- **Monitoreo de consistencia:** Supervisar que los flujos de trabajo de
  la aplicación garanticen la integridad de la información que reside en
  particiones separadas.

# **ADR-04**

## **1. Título**

Uso de un ORM(Prisma) para el acceso a la capa de datos

## **2. Contexto**

El proyecto Virtual Pet requiere el desarrollo de un backend robusto que
garantice la integridad de los datos y facilite la evolución ágil del
esquema. Debido a los plazos ajustados para el prototipo funcional y la
arquitectura de Monolito Modular, se busca una herramienta que acelere
el desarrollo y asegure una sincronización total entre la base de datos
y el código (*Type Safety*).

## **3. Alternativas Consideradas**

- **TypeORM:** Es la opción tradicional en el ecosistema NestJS. Se
  rechazó porque la gestión de migraciones en esquemas muy cambiantes
  suele ser compleja y la sincronización de tipos requiere mayor
  intervención manual.

- **SQL Puro / Query Builders:** Ofrece control total, pero se descartó
  debido al elevado tiempo de desarrollo inicial y la carga operativa de
  mantener manualmente cada consulta y relación en un sistema con
  múltiples módulos.

## **4. Decisión**

Se selecciona **Prisma** como el ORM principal. Su implementación estará
restringida exclusivamente a la **capa de infraestructura
(repositorios)**, asegurando que el cliente de persistencia no se filtre
hacia la lógica de dominio.

## **5. Justificación**

La elección se basa en tres pilares estratégicos:

1.  **Developer experience (DX):** El autocompletado nativo reduce
    errores en el tiempo de desarrollo.

2.  **Migraciones declarativas:** El archivo de esquema funciona como
    única fuente de verdad, simplificando la evolución del modelo de
    datos.

3.  **Seguridad de tipos:** La generación automática de tipos elimina la
    discrepancia entre el código TypeScript y la estructura real de
    PostgreSQL.

## **6. Consecuencias**

**Ventajas**

- **Velocidad de entrega:** Desarrollo acelerado de la lógica de
  persistencia y operaciones CRUD.

- **Claridad:** El esquema centralizado facilita la documentación y el
  entendimiento del modelo de datos.

- **Fiabilidad:** Tipado automático que previene errores de coincidencia
  entre la base de datos y la aplicación.

**Riesgos y Mitigación**

  **Riesgo**                                                                    **Mitigación**
  ----------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------
  **Acoplamiento** a los binarios y al ecosistema de la herramienta.            Aplicar el patrón **Repository** para desacoplar la lógica de negocio de la implementación técnica del ORM..
  **Limitaciones en consultas** de extrema complejidad o consumo de recursos.   Permitir el uso de consultas nativas (*raw queries*) únicamente en casos donde la abstracción del motor sea insuficiente..

## **7. Referencias**

- Documentación oficial de Prisma y NestJS.

- ADR-03: Aislamiento de datos a nivel de esquema.

## **8. Implementación y Seguimiento**

**Estrategia de Ejecución**

- **Definición declarativa**: Centralizar el modelado de datos en un
  contrato único que automatice la creación de tablas y tipos.

- **Aislamiento:** Configurar el acceso a datos para que el motor de
  persistencia sea inyectado solo en los servicios de repositorio.

**Control**

- **Auditoría:** Verificar en las revisiones de código que las entidades
  de dominio permanezcan agnósticas a la tecnología de persistencia.

- **Validación de esquema:** Asegurar que cada iteración del modelo esté
  respaldada por una migración reproducible para mantener la paridad
  entre entornos.
