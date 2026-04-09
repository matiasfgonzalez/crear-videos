# 🚀 Guía de Inicio Rápido

¡Genera tu primer video en 5 minutos!

## Paso 1: Instalar Dependencias

```bash
# Instala todas las dependencias
npm install

# Instala dependencias de Remotion
cd remotion && npm install && cd ..

# Descarga el navegador Chromium
npx playwright install chromium
```

O usa el atajo:

```bash
npm run setup
```

## Paso 2: Configurar Entorno

Crea un archivo `.env` (copia desde `.env.example`):

```bash
cp .env.example .env
```

Edita `.env` y configura la URL de tu servidor local:

```env
BASE_URL=http://localhost:3000
```

## Paso 3: Probar con Flujo Demo

El proyecto incluye dos flujos demo listos para usar:

### Opción A: Demo Simple de Navegación

```bash
npm run generate -- flows/demo-navegacion.json
```

Esto crea un video mostrando:

- Navegación del dashboard
- Desplazamiento por el contenido
- Exploración de la UI

### Opción B: Demo de Flujo de Registro

```bash
npm run generate -- flows/demo-registro.json
```

Esto crea un video mostrando:

- Apertura del formulario de registro
- Llenado de email y contraseña
- Envío del formulario

**Nota**: Estos demos esperan una app local en `http://localhost:3000`. Puedes:

- Modificar el `baseUrl` en el archivo JSON
- Sobrescribir con el flag `--base-url`: `npm run generate -- flows/demo-navegacion.json --base-url https://ejemplo.com`
- O crear tu propio flujo

## Paso 4: Ver tu Video

Después de que la generación se complete, encuentra tu video en:

```
output/demo-navegacion/demo-navegacion.mp4
```

¡Abrilo con cualquier reproductor de video!

## Paso 5: Crear tu Propio Flujo

1. Copia uno de los archivos demo:

```bash
cp flows/demo-navegacion.json flows/mi-tutorial.json
```

2. Edita `flows/mi-tutorial.json`:

```json
{
  "name": "mi-tutorial",
  "title": "Mi Primer Tutorial",
  "description": "Una demo personalizada",
  "baseUrl": "https://tu-sitio.com",
  "steps": [
    {
      "action": "goto",
      "url": "/",
      "name": "Página de Inicio"
    },
    {
      "action": "screenshot",
      "name": "Vista de la Página de Inicio"
    },
    {
      "action": "click",
      "selector": "button.primary",
      "name": "Click en Botón Principal",
      "delayAfter": 800
    },
    {
      "action": "screenshot",
      "name": "Después del Click"
    }
  ]
}
```

3. Valida tu flujo:

```bash
npm run validate flows/mi-tutorial.json
```

4. Genera el video:

```bash
npm run generate -- flows/mi-tutorial.json
```

## 🔍 Modo Debug

Ejecuta con `--headed` para ver el navegador:

```bash
npm run generate -- flows/mi-tutorial.json --headed
```

## 🎨 Vista Previa en Remotion Studio

Para ver tu composición de video en tiempo real:

```bash
npm run remotion:preview
```

Esto abre un navegador donde puedes:

- Ajustar props en tiempo real
- Previsualizar animaciones cuadro por cuadro
- Probar diferentes configuraciones

## ✅ Lista de Verificación

Antes de generar videos, asegúrate de:

- [ ] Node.js 18+ está instalado
- [ ] Dependencias instaladas (`npm run setup`)
- [ ] Navegador Chromium descargado
- [ ] Archivo `.env` existe con `BASE_URL` correcta
- [ ] Tu app local está corriendo (si usas localhost)

## 🐛 Problemas Comunes

### **"Browser not found" (Navegador no encontrado)**

```bash
npx playwright install chromium
```

### **"Cannot navigate to URL" (No se puede navegar a la URL)**

- Verifica que tu app esté corriendo en `BASE_URL`
- Intenta con el flag `--base-url http://tu-url-real.com`

### **"Module not found" (Módulo no encontrado)**

```bash
npm install
cd remotion && npm install
```

### **"Target closed" o errores de timeout**

- Aumenta `delayAfter` en tus pasos
- Usa `"waitUntil": "networkidle"` en acciones goto
- Ejecuta con `--headed` para depurar
- Verifica que tus selectores sean correctos

### **Falla el renderizado de Remotion**

- Asegúrate de que las capturas fueron capturadas (verifica `output/[nombre-flujo]/`)
- Verifica que `remotion/public/frames/[nombre-flujo]/` tenga imágenes
- Verifica que `metadata.json` existe
- Intenta ejecutar manualmente desde el directorio `remotion/`

---

## 📚 Documentación

- **[README.md](README.md)** - Documentación completa con todas las características
- **[README.es.md](README.es.md)** - Documentación completa en español
- **[QUICK_START.md](QUICK_START.md)** - Guía de inicio rápido (EN)
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen de implementación
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Cómo contribuir
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de versiones

---

## ✅ Lista de Verificación de Éxito

Antes de empezar a crear videos:

- [ ] Dependencias instaladas (`npm run setup`)
- [ ] Archivo `.env` creado y configurado
- [ ] Navegador Chromium descargado
- [ ] Flujo demo validado exitosamente
- [ ] Primer video de prueba generado
- [ ] El video se reproduce correctamente

---

## 🎉 ¡Estás Listo!

Una vez que hayas completado los pasos anteriores, ¡estás listo para crear videos tutoriales profesionales automáticamente!

Para características más avanzadas:

- Agrega locución con ElevenLabs (ver README.md)
- Agrega música de fondo (ver README.md)
- Crea flujos complejos con múltiples acciones
- Personaliza escenas y animaciones del video

**¡Feliz creación de videos! 🚀**

¿Necesitas ayuda? Revisa el [README completo](README.es.md) o abre un issue.
