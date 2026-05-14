Análisis comparativo de proveedores Cloud

Este documento analiza las alternativas de despliegue evaluadas para el proyecto y justifica la selección de Railway como plataforma de hosting. Cada proveedor se evalúa bajo cuatro ejes: costo operativo, carga operativa, escalabilidad y time-to-market.

### 1. AWS (Amazon Web Services)

Perfil: Ecosistema integral de infraestructura y servicios gestionados (IaaS/PaaS) orientado a escalabilidad empresarial.

Ventajas

* Desacoplamiento total: separación nativa entre cómputo (EC2), persistencia (RDS) y red (VPC), facilitando una arquitectura de capas con aislamiento físico.
* Cobertura regional: presencia en Sudamérica (São Paulo, sa-east-1) que reduce la latencia para usuarios locales.
* Madurez del ecosistema: amplia oferta de servicios complementarios (S3, CloudFront) y documentación extensa.

Desventajas

* Costos fijos desde el inicio: una configuración mínima de producción con SSL requiere Application Load Balancer (~USD $16/mes solo por estar prendido) además de EC2 t3.small (~USD $15/mes) y RDS db.t3.micro (~USD $13/mes). Total estimado base: ~USD $45–60/mes sin considerar tráfico ni almacenamiento.
* Alta carga operativa: requiere mucha configuración, certificados pipelines de despliegue manuales. Tiempo de setup inicial estimado: 2–5 días para un equipo sin experiencia previa en AWS.
* Complejidad de facturación: el modelo de costos es difícil de predecir

### 2. GCP (Google Cloud Platform)

Perfil: Plataforma cloud orientada a servicios administrados (PaaS/SaaS) con foco en serverless y analítica de datos.

Ventajas

* Créditos iniciales: USD $300 por 90 días para experimentación, suficiente para validar el MVP sin compromiso económico.
* Ecosistema serverless maduro: Cloud Run y Cloud Functions habilitan despliegues escalables con facturación por uso.
* Always Free real: instancia e2-micro permanente en regiones de EE.UU. (no Sudamérica).

Desventajas

* Curva de aprendizaje elevada: configuración requiere conocimiento específico de la plataforma.
* Costo post-créditos: ~USD $80–100/mes estimados para el stack completo (Cloud Run + Cloud SQL + load balancer) una vez agotados los créditos iniciales.
* Sin región en Sudamérica para Always Free: la opción gratuita permanente queda fuera de la región más cercana al usuario final.

### 3. VPS Tradicional (Oracle Cloud / Hostinger / DigitalOcean)

Perfil: Infraestructura autogestionada (IaaS), control total sobre el sistema operativo y la configuración.

Ventajas

* Costo bajo y predecible: Oracle Cloud ofrece Always Free permanente con 2 VMs ARM Ampere (4 OCPU / 24GB RAM total) sin límite temporal. DigitalOcean parte de USD $6/mes.
* Flexibilidad técnica: permite orquestar contenedores Docker (NestJS, Next.js, PostgreSQL) sin restricciones de plataforma ni vendor lock-in.
* Performance directa: acceso sin abstracciones a CPU, RAM y red.

Desventajas

* Sobrecarga operativa alta: el equipo es responsable de configuración del SO, actualización de paquetes, renovación de certificados SSL (Certbot), backups, monitoreo y respuesta a incidentes.
* Riesgo de disponibilidad: la configuración manual aumenta la probabilidad de errores humanos que afecten el uptime, contradiciendo los requerimientos de disponibilidad del sistema.
* Sin CI/CD nativo: requiere construir pipelines propios (GitHub Actions + SSH/Docker) que el equipo debe mantener.

### 4. Railway (PaaS)

Perfil: Plataforma centrada en experiencia del desarrollador (DX) que abstrae infraestructura subyacente.

Ventajas

* CI/CD nativo: integración directa con GitHub; cada git push a la rama configurada dispara un despliegue automático con health checks y rollback ante fallos.
* Operación cero: SSL automático, escalado vertical configurable, métricas integradas, logs centralizados y bases de datos provisionables con un clic.
* Costo arranque bajo y predecible: plan Hobby a USD $5/mes que incluye USD $5 de uso. Para un proyecto en fase de validación, el costo total mensual estimado se sitúa en USD $10–25/mes según consumo de CPU, RAM y red.
* Tiempo de salida a producción: configuración inicial de 1–2 horas frente a 2–5 días en AWS.

Desventajas

* Sin región en Sudamérica: las regiones disponibles están en Norteamérica, Europa y Asia. Esto introduce una latencia adicional estimada para usuarios argentinos
* Costo a escala desfavorable: el precio por GB de RAM/CPU es más alto que un VPS autogestionado a partir de cierto umbral. En escenarios de uso intensivo y sostenido (>USD $50/mes), un VPS resulta más eficiente.
* Vendor lock-in moderado: la facilidad operativa proviene de abstracciones propietarias (Railway templates, plugins) que requerirían adaptación si se migra a otra plataforma.

### Comparativa Técnica

| Característica             | AWS                                                 | GCP                            | VPS Tradicional  | Railway                |
| --------------------------- | --------------------------------------------------- | ------------------------------ | ---------------- | ---------------------- |
| Costo mensual base estimado | USD $45–60         | USD $80–100 (post-créditos) | USD $0–6        | USD $10–25 |                  |                        |
| Carga operativa             | Alta                                                | Alta                           | Muy Alta         | Muy Baja               |
| Escalabilidad               | Alta (configurable)                                 | Muy Alta (serverless)          | Manual           | Automática (limitada) |
| Configuración SSL          | Pago (vía ALB)                                     | Compleja                       | Manual (Certbot) | Automática y gratis   |
| CI/CD                       | Requiere setup                                      | Requiere setup                 | Manual           | Nativo                 |
| Región Sudamérica         | Sí (São Paulo)                                    | Sí (São Paulo)               | Sí (varios)     | No                     |
| Time-to-market estimado     | 2–5 días                                          | 3–7 días                     | 1–3 días       | 1–2 horas             |

### Elección Final: Railway

Se selecciona Railway como proveedor de hosting. Cada motivo se acompaña del trade-off aceptado:

1. Experiencia previa del equipo El equipo tiene experiencia con  la plataforma, lo que reduce el time-to-market y minimiza errores de configuración. Trade-off aceptado: se prioriza velocidad de validación sobre la optimización de costos a largo plazo, asumiendo una eventual migración a VPS o cloud tradicional si el negocio escala más allá del punto de inflexión económico de Railway.
2. CI/CD nativo y baja carga operativa La integración con GitHub elimina la necesidad de mantener pipelines manuales, y el aprovisionamiento automático de SSL y contenedores permite al equipo enfocarse en lógica de negocio. Trade-off aceptado: se introduce un nivel moderado de vendor lock-in que se mitiga manteniendo todo el código de aplicación en contenedores Docker portables.
3. Costo inicial predecible y proporcional al uso El modelo pay-as-you-go evita los costos fijos de AWS (ALB ~USD $16/mes solo por estar disponible) y el costo escalado de GCP post-créditos. Trade-off aceptado: a partir de aproximadamente USD $50/mes de consumo, un VPS autogestionado resulta más económico. Se acepta este sobrecosto a cambio de las horas de operación que se ahorran.
4. Compatibilidad con la arquitectura definida Railway soporta nativamente el stack del proyecto (NestJS + Next.js + PostgreSQL) y la organización por servicios independientes encaja con la separación de capas definida en ADR-01. Trade-off aceptado: la latencia adicional desde Sudamérica se considera tolerable para la fase inicial**
