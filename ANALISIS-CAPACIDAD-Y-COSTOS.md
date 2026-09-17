# Capacidad y propuesta comercial

Fecha de revisión: 16 de septiembre de 2026.

## Respuesta ejecutiva

La interfaz ya quedó configurada para una maratón de **108 grupos**. Sin embargo, la versión actual es un prototipo: los registros existen solamente durante la sesión del navegador. Para operar con datos reales se deben añadir autenticación, base de datos, almacenamiento permanente de fotografías, permisos por grupo, copias de seguridad y monitoreo.

Una versión productiva bien implementada puede trabajar cómodamente con:

- 108 grupos registrados.
- Aproximadamente 540 cuentas, suponiendo cinco responsables por grupo.
- Objetivo inicial de 250 a 300 personas conectadas simultáneamente.
- Prueba de carga recomendada para 500 sesiones simultáneas antes de la maratón.
- 108 reportes enviados prácticamente al mismo tiempo, siempre que cada fotografía se cargue directamente al almacenamiento de archivos y las consultas estén indexadas.

El límite real no es la cantidad de grupos, sino cuántas operaciones se ejecutan por segundo y cuánto tardan las consultas. Cloudflare Workers escala automáticamente y no establece un límite general de solicitudes por segundo. D1 procesa las consultas de cada base de datos de manera secuencial: una consulta de 1 ms permite aproximadamente 1.000 consultas por segundo; por eso deben existir índices y registros pequeños.

Fuentes oficiales:

- [Límites de Cloudflare Workers](https://developers.cloudflare.com/workers/platform/limits/)
- [Límites y concurrencia de Cloudflare D1](https://developers.cloudflare.com/d1/platform/limits/)
- [Uso de índices en D1](https://developers.cloudflare.com/d1/best-practices/use-indexes/)

## Arquitectura mínima para producción

1. **Aplicación web:** Cloudflare Workers.
2. **Datos estructurados:** D1 para grupos, usuarios, campañas y registros.
3. **Fotografías:** R2; D1 conserva solamente la referencia y los metadatos.
4. **Acceso:** autenticación por correo y roles de administrador, coordinador y consulta.
5. **Seguridad:** validación de archivos, límite de tamaño, Turnstile y trazabilidad de cambios.
6. **Operación:** copias de seguridad, alertas y prueba de carga antes de diciembre.

## Costo técnico estimado

Para 108 grupos, el uso normal debería permanecer muy cerca del costo base:

| Concepto | Estimación inicial |
|---|---:|
| Cloudflare Workers Paid | USD 5 al mes |
| D1 | Incluido mientras permanezca dentro de 25.000 millones de filas leídas, 50 millones escritas y 5 GB al mes |
| R2 | Primeros 10 GB gratuitos; luego USD 0,015 por GB-mes |
| Turnstile | Gratuito para la mayoría de aplicaciones |
| Correo de acceso o notificaciones | USD 0 con uso bajo; referencia de USD 20 al mes para 50.000 correos |
| Dominio propio | Cobro anual del registrador, variable según el nombre y la extensión |

Ejemplo de fotografías: si cada grupo carga 20 fotos mensuales de 2 MB, se agregan cerca de 4,3 GB al mes. Después de doce meses serían aproximadamente 52 GB; descontando los primeros 10 GB, el almacenamiento rondaría **USD 0,63 al mes** en ese momento, antes de impuestos y redondeos de facturación.

Fuentes oficiales:

- [Precios de Workers](https://developers.cloudflare.com/workers/platform/pricing/)
- [Precios de D1](https://developers.cloudflare.com/d1/platform/pricing/)
- [Precios de R2](https://developers.cloudflare.com/r2/pricing/)
- [Planes de Turnstile](https://developers.cloudflare.com/turnstile/plans/)
- [Precios de correo transaccional de Resend](https://resend.com/pricing)
- [Cloudflare Registrar sin margen adicional](https://developers.cloudflare.com/registrar/)

## Cómo cobrar la aplicación

El acuerdo comercial definido es el siguiente:

- **Desarrollo y entrega de la aplicación:** COP 6.000.000, pago único.
- **Cobro mensual:** únicamente el costo real de los servicios de nube utilizados, sin soporte, mantenimiento, utilidad ni recargo.
- **Dominio:** se cobra por separado cuando corresponda, porque normalmente es un pago anual.
- **Nuevas funciones o cambios:** requieren una cotización independiente.

### Valor mensual esperado

Con la TRM de COP 3.100,45 por dólar del 16 de septiembre de 2026:

- Workers Paid por USD 5 equivale aproximadamente a **COP 15.502**, antes de impuestos y diferencias de la tarjeta.
- D1 y R2 inicialmente pueden no producir cobros adicionales porque el uso esperado está dentro de sus cuotas incluidas.
- Un presupuesto prudente para nube, sin correo pagado, es de **COP 20.000 a COP 30.000 mensuales** durante la primera etapa.
- Si se contrata correo transaccional por USD 20, el total de servicios sería aproximadamente USD 25, es decir **COP 77.511 antes de impuestos**; con impuestos y variación cambiaria conviene reservar alrededor de COP 90.000 a COP 100.000.

[TRM oficial del Banco de la República](https://www.banrep.gov.co/es/glosario/tasa-cambio-trm).

### Fórmula de cobro mensual

Para que el cobro sea completamente transparente, no se recomienda fijar una mensualidad comercial. Debe cobrarse el valor de la factura real:

`Mensualidad = facturas de nube en USD × tasa efectivamente cobrada por el banco + impuestos`

Se debe adjuntar la factura o captura del proveedor. Si durante un mes el costo es cero, la mensualidad de infraestructura también debe ser cero. Otra opción práctica es cobrar un anticipo de COP 30.000 y hacer una conciliación trimestral a favor o en contra del cliente.

### Texto sugerido para la cotización

> El valor total por desarrollo y entrega de la aplicación es de COP 6.000.000. Adicionalmente, el cliente asumirá mensualmente, sin margen ni recargo, el costo efectivo de los servicios de infraestructura en la nube necesarios para su funcionamiento. Este pago mensual no incluye soporte, mantenimiento, actualizaciones ni nuevas funcionalidades. Los valores se liquidarán con base en las facturas de los proveedores y la tasa de cambio efectivamente aplicada por el medio de pago.

## Condiciones que deberían quedar por escrito

- Número de grupos y cuentas incluidas.
- Límite de almacenamiento y tamaño de fotografía.
- Aclaración expresa de que no se incluye soporte ni mantenimiento mensual.
- Propiedad del código y de los datos.
- Valor de nuevas funciones.
- Política de respaldo, privacidad y eliminación de fotografías.
- Qué ocurre si se supera el uso contratado.
- Quién paga el dominio, los correos y servicios externos.
