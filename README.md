# Red de Libros Latinoamérica

Prototipo web basado en el audio suministrado. Permite visualizar el avance de la distribución de libros entre grupos comunitarios, destacar la maratón de diciembre y registrar nuevas entregas con evidencia fotográfica.

## Incluye

- Récord general latinoamericano y avance frente a la meta anual.
- Indicadores del grupo, la maratón de diciembre, grupos activos y evidencias.
- Comparación entre el ritmo anual y la maratón.
- Clasificación de grupos.
- Actividad comunitaria con evidencia visual.
- Formulario funcional para registrar libros, fecha, campaña, lugar y fotografía.
- Diseño adaptable para computador, tableta y móvil.

## Ejecutar localmente

Requiere Node.js 22 o posterior.

```bash
npm install
npm run dev
```

Después, abre `http://localhost:3000`.

Para verificar la versión de producción:

```bash
npm run build
```

## Estructura principal

- `app/page.tsx`: tablero e interacciones.
- `app/globals.css`: identidad visual y estilos globales.
- `app/layout.tsx`: metadatos y configuración en español.
- `public/evidencia-distribucion.png`: imagen demostrativa generada para el prototipo.

## Alcance del prototipo

Los datos son demostrativos. Los registros actualizan el tablero durante la sesión actual; una versión de producción requerirá autenticación, base de datos y almacenamiento permanente para las fotografías.
