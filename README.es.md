# 🎬 Generador Automático de Videos Tutoriales

> 🌍 **Idiomas**: [English](README.md) | **Español**

Genera videos tutoriales profesionales automáticamente desde interacciones del navegador. Esta herramienta combina **Playwright** para automatización del navegador con **Remotion** para composición de video, creando videos atractivos en formato vertical perfectos para redes sociales (TikTok, Instagram Reels, YouTube Shorts).

## ✨ Características

- 🤖 **Grabación Automatizada del Navegador**: Define flujos en JSON, Playwright captura capturas de pantalla de alta calidad
- 🎨 **Composición de Video Hermosa**: Remotion renderiza transiciones suaves, animaciones y escenas con marca
- 📱 **Formato Vertical (9:16)**: Optimizado para plataformas mobile-first
- 🎯 **Tipos de Acciones**: goto, click, fill, type, scroll, hover, wait y más
- 🎙️ **Soporte para Locución**: Integración opcional con ElevenLabs para narración con IA
- 🎵 **Música de Fondo**: Agrega pistas de audio personalizadas
- ⚡ **Rápido y Personalizable**: Totalmente basado en TypeScript con arquitectura extensible

---

## 📦 Estructura del Proyecto

```
crear-videos/
├── flows/                     # Archivos JSON de configuración de flujos
│   ├── demo-navegacion.json
│   └── demo-registro.json
├── scripts/                   # Lógica de automatización de Playwright
│   ├── runner.ts             # Runner principal de Playwright
│   ├── actions.ts            # Manejadores de acciones (click, fill, etc.)
│   ├── types.ts              # Tipos TypeScript
│   ├── utils.ts              # Utilidades (capturas, delays)
│   ├── logger.ts             # Logger CLI con colores
│   └── voiceover.ts          # Generación de locución con ElevenLabs
├── remotion/                  # Composición de video (proyecto Remotion)
│   ├── src/
│   │   ├── Root.tsx          # Raíz de composición Remotion
│   │   ├── TutorialVideo.tsx # Componente principal de video
│   │   ├── design.ts         # Tokens de diseño (colores, timing)
│   │   ├── types.ts          # Tipos de props del video
│   │   └── components/
│   │       ├── IntroScene.tsx    # Intro del video
│   │       ├── StepScene.tsx     # Escena de paso individual
│   │       └── OutroScene.tsx    # Outro de llamado a la acción
│   └── public/               # Assets estáticos (frames, música)
├── output/                    # Capturas y videos generados
├── generate-video.ts         # 🚀 Script principal de orquestación
├── package.json
└── README.md
```

---

## 🚀 Inicio Rápido

### **1. Prerequisitos**

- **Node.js** >= 18
- **npm** o **pnpm**

### **2. Instalación**

```bash
# Clona o descarga este repositorio
cd crear-videos

# Instala las dependencias (raíz + remotion)
npm run setup

# Esto hará:
# - Instalar dependencias de Node.js
# - Instalar dependencias de Remotion
# - Descargar el navegador Chromium para Playwright
```

### **3. Configurar Entorno**

```bash
# Copia la plantilla de variables de entorno
cp .env.example .env

# Edita .env y configura la URL de tu servidor local
BASE_URL=http://localhost:3000

# (Opcional) Agrega las claves de ElevenLabs para locución
ELEVENLABS_API_KEY=tu_api_key_aqui
ELEVENLABS_VOICE_ID=tu_voice_id_aqui
```

### **4. Crea un Flujo**

Crea un archivo JSON en el directorio `flows/`. Ejemplo `flows/mi-tutorial.json`:

```json
{
  "name": "mi-tutorial",
  "title": "Cómo Usar Nuestro Dashboard",
  "description": "Un recorrido rápido por las funciones clave",
  "baseUrl": "http://localhost:3000",
  "video": {
    "appName": "Mi App",
    "ctaText": "¡Probalo gratis en miapp.com!"
  },
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "steps": [
    {
      "action": "goto",
      "url": "/dashboard",
      "name": "Abrir Dashboard",
      "narration": "Primero, navega a tu dashboard.",
      "waitUntil": "networkidle",
      "delayAfter": 1000
    },
    {
      "action": "screenshot",
      "name": "Vista General del Dashboard"
    },
    {
      "action": "click",
      "selector": "button[aria-label='Crear Nuevo']",
      "name": "Click en Botón Crear",
      "narration": "Hacé click en el botón crear para comenzar.",
      "delayAfter": 800
    },
    {
      "action": "screenshot",
      "name": "Modal de Creación"
    }
  ]
}
```

### **5. Genera tu Video**

```bash
# Asegúrate de que tu app local esté corriendo en BASE_URL
npm run dev  # o como inicies tu app

# En otra terminal, genera el video
npm run generate -- flows/mi-tutorial.json

# O ejecuta en modo con interfaz para ver las acciones del navegador
npm run generate -- flows/mi-tutorial.json --headed
```

El script hará:

1. ✅ Capturar capturas de pantalla usando Playwright
2. ✅ Copiar assets a Remotion
3. ✅ Renderizar el video final

La salida se guardará en: `output/mi-tutorial/mi-tutorial.mp4`

---

## 📚 Referencia de Configuración de Flujos

### **Esquema de Flujo**

```typescript
{
  "name": "slug-del-flujo",           // Usado para el nombre de carpeta de salida
  "title": "Título del Video",        // Mostrado en la escena de intro
  "description": "Subtítulo",         // Subtítulo opcional
  "baseUrl": "http://localhost:3000", // URL base para navegación
  "video": {
    "appName": "Tu Marca",            // Nombre de marca en intro/outro
    "ctaText": "¡Llamado a la acción!", // Texto del botón CTA en outro
    "backgroundMusic": "music/bg.mp3" // Archivo de audio opcional
  },
  "viewport": {
    "width": 1280,                    // Ancho del viewport del navegador
    "height": 720                     // Alto del viewport del navegador
  },
  "steps": [ /* Array de acciones */ ]
}
```

### **Tipos de Acciones**

| Acción            | Descripción                       | Ejemplo                                                                                |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `goto`            | Navegar a URL                     | `{ "action": "goto", "url": "/page", "name": "Cargar Página" }`                        |
| `click`           | Hacer click en elemento           | `{ "action": "click", "selector": "button", "name": "Click en Botón" }`                |
| `fill`            | Llenar campo de entrada           | `{ "action": "fill", "selector": "#email", "value": "test@ejemplo.com" }`              |
| `type`            | Escribir con delay                | `{ "action": "type", "selector": "#buscar", "value": "consulta", "typingDelay": 100 }` |
| `hover`           | Pasar sobre elemento              | `{ "action": "hover", "selector": ".tooltip-trigger" }`                                |
| `scroll`          | Hacer scroll en página o elemento | `{ "action": "scroll", "y": 500 }`                                                     |
| `wait`            | Esperar tiempo                    | `{ "action": "wait", "ms": 2000 }`                                                     |
| `waitForSelector` | Esperar elemento                  | `{ "action": "waitForSelector", "selector": ".loaded" }`                               |
| `screenshot`      | Captura explícita                 | `{ "action": "screenshot", "name": "Marco Personalizado" }`                            |
| `press`           | Presionar tecla                   | `{ "action": "press", "selector": "input", "key": "Enter" }`                           |
| `selectOption`    | Seleccionar opción de dropdown    | `{ "action": "selectOption", "selector": "select", "value": "opcion1" }`               |

### **Propiedades Comunes**

Todas las acciones soportan:

- `name` (string): Etiqueta legible mostrada en el video
- `narration` (string): Texto para locución (requiere ElevenLabs)
- `delayAfter` (number): Esperar N milisegundos después de que la acción completa
- `screenshot` (boolean): Capturar captura de pantalla después de este paso (default: true excepto para acciones wait)

---

## 🎨 Personalizar Estilo del Video

### **Tokens de Diseño**

Edita `remotion/src/design.ts`:

```typescript
export const COLORS = {
  bg: "#0A0A0F", // Fondo
  primary: "#6C63FF", // Color de acento primario
  secondary: "#00D4FF", // Acento secundario
  // ... más colores
};

export const CANVAS = {
  width: 1080, // Formato vertical 9:16
  height: 1920,
  fps: 30,
};

export const TIMING = {
  introDurationFrames: 90, // Duración del intro (3s a 30fps)
  stepDurationFrames: 120, // Duración por paso (4s)
  outroDurationFrames: 90, // Duración del outro (3s)
};
```

### **Escenas**

- **IntroScene** (`components/IntroScene.tsx`): Título animado + logo de marca
- **StepScene** (`components/StepScene.tsx`): Captura con zoom Ken Burns + superposición de texto
- **OutroScene** (`components/OutroScene.tsx`): Checkmark de éxito + botón CTA

Modifica estos componentes React para cambiar animaciones, diseño o estilo.

---

## 🎙️ Agregar Locución (Opcional)

### **1. Obtener Clave API de ElevenLabs**

Regístrate en [elevenlabs.io](https://elevenlabs.io) y obtén:

- API Key
- Voice ID (desde tu biblioteca de voces)

### **2. Configurar .env**

```bash
ELEVENLABS_API_KEY=sk_abc123...
ELEVENLABS_VOICE_ID=21m00T...
```

### **3. Agregar Narración a los Pasos**

En tu flujo JSON:

```json
{
  "action": "click",
  "selector": "button",
  "name": "Enviar Formulario",
  "narration": "Ahora hacé click en el botón enviar para guardar tus cambios."
}
```

El runner generará archivos de audio en `output/<flujo>/audio/` y los pasará a Remotion.

---

## 🎵 Música de Fondo

1. Agrega archivo de música a `remotion/public/music/background.mp3`
2. Referencia en el flujo JSON:

```json
{
  "video": {
    "backgroundMusic": "music/background.mp3"
  }
}
```

---

## 📖 Uso Avanzado

### **Ejecutar Solo Playwright (Saltar Renderizado)**

```bash
npm run generate -- flows/demo.json --skip-render
```

Esto captura capturas de pantalla sin renderizar video. Útil para probar flujos rápidamente.

### **Nombre de Salida Personalizado**

```bash
npm run generate -- flows/demo.json --output mi-video-personalizado.mp4
```

### **Vista Previa en Remotion Studio**

```bash
npm run remotion:preview
```

Abre vista previa interactiva donde puedes editar props y ver cambios en vivo.

### **Renderizado Manual**

```bash
cd remotion
npx remotion render TutorialVideo output.mp4 --props='{"title":"Test","frames":[]}'
```

---

## 🛠️ Resolución de Problemas

### **"Browser not installed" (Navegador no instalado)**

Ejecuta:

```bash
npm run setup:browsers
```

### **"Cannot find module" (No se puede encontrar el módulo)**

Asegúrate de que tanto las dependencias raíz como de remotion estén instaladas:

```bash
npm install
cd remotion && npm install
```

### **"Target closed" o "Navigation timeout"**

- Aumenta el timeout en el flujo: `"waitUntil": "networkidle"`
- Verifica que `BASE_URL` sea correcta y el servidor esté corriendo
- Ejecuta en modo con interfaz para depurar: `--headed`

### **Falla el renderizado de Remotion**

- Asegúrate de que `remotion/public/frames/<nombreFlujo>/` tenga archivos de captura
- Verifica que metadata.json se haya copiado correctamente
- Intenta renderizar manualmente desde el directorio `remotion/`

---

## 🧪 Probar Flujos

Usa los flujos demo incluidos:

```bash
# Demo 1: Tutorial de navegación
npm run generate -- flows/demo-navegacion.json

# Demo 2: Tutorial de registro
npm run generate -- flows/demo-registro.json
```

---

## 📝 Tips y Mejores Prácticas

### **Escribir Flujos Efectivos**

1. **Mantén los pasos atómicos**: Una acción por paso para claridad
2. **Agrega delays**: Usa `delayAfter` para permitir que las animaciones terminen
3. **Usa nombres descriptivos**: El campo `name` aparece en la superposición del video
4. **Prueba los selectores**: Ejecuta con `--headed` para verificar que los selectores funcionen
5. **Optimiza las capturas**: No captures cada acción—solo momentos clave

### **Calidad del Video**

- Las capturas se capturan a escala 2x del dispositivo (calidad Retina)
- Viewport de 1280x720 escala bien a formato vertical 1080x1920
- Desactiva las animaciones del navegador si quieres transiciones instantáneas: configura `animations: 'disabled'` en utils.ts

### **Rendimiento**

- Playwright se ejecuta sin interfaz por defecto (más rápido)
- La concurrencia de Remotion se configura en `.env`: `REMOTION_CONCURRENCY=4`
- Cada paso toma ~4 segundos (120 frames) — ajusta en `design.ts`

---

## 🤝 Contribuir

Este es un proyecto plantilla. Siéntete libre de:

- Agregar nuevos tipos de acciones en `scripts/actions.ts`
- Crear componentes de escena personalizados en `remotion/src/components/`
- Agregar nuevos temas de diseño
- Mejorar el manejo de errores

---

## 📄 Licencia

Licencia MIT - siéntete libre de usar para proyectos personales o comerciales.

---

## 🙏 Agradecimientos

Construido con:

- [Playwright](https://playwright.dev/) - Automatización de navegador
- [Remotion](https://remotion.dev/) - Composición de video en React
- [TypeScript](https://www.typescriptlang.org/) - Desarrollo con tipado seguro
- [ElevenLabs](https://elevenlabs.io/) - Locución con IA (opcional)

---

## 🚧 Hoja de Ruta / Ideas Futuras

- [ ] Múltiples relaciones de aspecto de video (16:9, 1:1, 9:16)
- [ ] Salida WebM para archivos más pequeños
- [ ] Narración de audio desde archivos de texto (alternativas TTS)
- [ ] Integración con GitHub Actions CI/CD
- [ ] UI Web para creación de flujos
- [ ] Analíticas de video (seguimiento de vistas)

---

**¡Feliz creación de videos! 🎉**

Para preguntas o problemas, abre un issue en GitHub o contacta al mantenedor.
