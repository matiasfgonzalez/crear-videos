# 🎬 Automated Video Tutorial Generator

> 🌍 **Languages**: **English** | [Español](README.es.md)

Generate professional tutorial videos automatically from browser interactions. This tool combines **Playwright** for browser automation with **Remotion** for video composition to create engaging vertical-format videos perfect for social media (TikTok, Instagram Reels, YouTube Shorts).

## ✨ Features

- 🤖 **Automated Browser Recording**: Define flows in JSON, let Playwright capture high-quality screenshots
- 🎨 **Beautiful Video Composition**: Remotion renders smooth transitions, animations, and branded scenes
- 📱 **Vertical Format (9:16)**: Optimized for mobile-first platforms
- 🎯 **Action Types**: goto, click, fill, type, scroll, hover, wait, and more
- 🎙️ **Voiceover Support**: Optional ElevenLabs integration for AI narration
- 🎵 **Background Music**: Add custom audio tracks
- ⚡ **Fast & Customizable**: Fully TypeScript-based with extensible architecture

---

## 📦 Project Structure

```
crear-videos/
├── flows/                     # Flow configuration JSON files
│   ├── demo-navegacion.json
│   └── demo-registro.json
├── scripts/                   # Playwright automation logic
│   ├── runner.ts             # Main Playwright runner
│   ├── actions.ts            # Action handlers (click, fill, etc.)
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utilities (screenshots, delays)
│   ├── logger.ts             # Colored CLI logger
│   └── voiceover.ts          # ElevenLabs voiceover generation
├── remotion/                  # Video composition (Remotion project)
│   ├── src/
│   │   ├── Root.tsx          # Remotion composition root
│   │   ├── TutorialVideo.tsx # Main video component
│   │   ├── design.ts         # Design tokens (colors, timing)
│   │   ├── types.ts          # Video props types
│   │   └── components/
│   │       ├── IntroScene.tsx    # Video intro
│   │       ├── StepScene.tsx     # Individual step scene
│   │       └── OutroScene.tsx    # Call-to-action outro
│   └── public/               # Static assets (frames, music)
├── output/                    # Generated screenshots and videos
├── generate-video.ts         # 🚀 Main orchestration script
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### **1. Prerequisites**

- **Node.js** >= 18
- **npm** or **pnpm**

### **2. Installation**

```bash
# Clone or download this repository
cd crear-videos

# Install dependencies (root + remotion)
npm run setup

# This will:
# - Install Node.js dependencies
# - Install Remotion dependencies
# - Download Chromium browser for Playwright
```

### **3. Configure Environment**

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your local server URL
BASE_URL=http://localhost:3000

# (Optional) Add ElevenLabs keys for voiceover
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

### **4. Create a Flow**

Create a JSON file in `flows/` directory. Example `flows/my-tutorial.json`:

```json
{
  "name": "my-tutorial",
  "title": "How to Use Our Dashboard",
  "description": "A quick walkthrough of key features",
  "baseUrl": "http://localhost:3000",
  "video": {
    "appName": "My App",
    "ctaText": "Try it free at myapp.com!"
  },
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "steps": [
    {
      "action": "goto",
      "url": "/dashboard",
      "name": "Open Dashboard",
      "narration": "First, navigate to your dashboard.",
      "waitUntil": "networkidle",
      "delayAfter": 1000
    },
    {
      "action": "screenshot",
      "name": "Dashboard Overview"
    },
    {
      "action": "click",
      "selector": "button[aria-label='Create New']",
      "name": "Click Create Button",
      "narration": "Click the create button to start.",
      "delayAfter": 800
    },
    {
      "action": "screenshot",
      "name": "Create Modal"
    }
  ]
}
```

### **5. Generate Your Video**

```bash
# Make sure your local app is running at BASE_URL
npm run dev  # or however you start your app

# In another terminal, generate the video
npm run generate -- flows/my-tutorial.json

# Or run in headed mode to see browser actions
npm run generate -- flows/my-tutorial.json --headed
```

The script will:

1. ✅ Capture screenshots using Playwright
2. ✅ Copy assets to Remotion
3. ✅ Render the final video

Output will be saved to: `output/my-tutorial/my-tutorial.mp4`

---

## 📚 Flow Configuration Reference

### **Flow Schema**

```typescript
{
  "name": "flow-slug",              // Used for output folder name
  "title": "Video Title",            // Shown in intro scene
  "description": "Subtitle",         // Optional subtitle
  "baseUrl": "http://localhost:3000", // Base URL for navigation
  "video": {
    "appName": "Your Brand",         // Brand name in intro/outro
    "ctaText": "Call to action!",    // Outro CTA button text
    "backgroundMusic": "music/bg.mp3" // Optional audio file
  },
  "viewport": {
    "width": 1280,                   // Browser viewport width
    "height": 720                    // Browser viewport height
  },
  "steps": [ /* Array of actions */ ]
}
```

### **Action Types**

| Action            | Description            | Example                                                                             |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `goto`            | Navigate to URL        | `{ "action": "goto", "url": "/page", "name": "Load Page" }`                         |
| `click`           | Click element          | `{ "action": "click", "selector": "button", "name": "Click Button" }`               |
| `fill`            | Fill input field       | `{ "action": "fill", "selector": "#email", "value": "test@example.com" }`           |
| `type`            | Type with delay        | `{ "action": "type", "selector": "#search", "value": "query", "typingDelay": 100 }` |
| `hover`           | Hover over element     | `{ "action": "hover", "selector": ".tooltip-trigger" }`                             |
| `scroll`          | Scroll page or element | `{ "action": "scroll", "y": 500 }`                                                  |
| `wait`            | Wait for time          | `{ "action": "wait", "ms": 2000 }`                                                  |
| `waitForSelector` | Wait for element       | `{ "action": "waitForSelector", "selector": ".loaded" }`                            |
| `screenshot`      | Explicit screenshot    | `{ "action": "screenshot", "name": "Custom Frame" }`                                |
| `press`           | Press keyboard key     | `{ "action": "press", "selector": "input", "key": "Enter" }`                        |
| `selectOption`    | Select dropdown option | `{ "action": "selectOption", "selector": "select", "value": "option1" }`            |

### **Common Properties**

All actions support:

- `name` (string): Human-readable label shown in video
- `narration` (string): Text for voiceover (requires ElevenLabs)
- `delayAfter` (number): Wait N milliseconds after action completes
- `screenshot` (boolean): Capture screenshot after this step (default: true except for wait actions)

---

## 🎨 Customizing Video Style

### **Design Tokens**

Edit `remotion/src/design.ts`:

```typescript
export const COLORS = {
  bg: "#0A0A0F", // Background
  primary: "#6C63FF", // Primary accent color
  secondary: "#00D4FF", // Secondary accent
  // ... more colors
};

export const CANVAS = {
  width: 1080, // 9:16 vertical format
  height: 1920,
  fps: 30,
};

export const TIMING = {
  introDurationFrames: 90, // Intro length (3s at 30fps)
  stepDurationFrames: 120, // Per-step duration (4s)
  outroDurationFrames: 90, // Outro length (3s)
};
```

### **Scenes**

- **IntroScene** (`components/IntroScene.tsx`): Animated title + brand logo
- **StepScene** (`components/StepScene.tsx`): Screenshot with Ken Burns zoom + text overlay
- **OutroScene** (`components/OutroScene.tsx`): Success checkmark + CTA button

Modify these React components to change animations, layout, or styling.

---

## 🎙️ Adding Voiceover (Optional)

### **1. Get ElevenLabs API Key**

Sign up at [elevenlabs.io](https://elevenlabs.io) and get:

- API Key
- Voice ID (from your voice library)

### **2. Configure .env**

```bash
ELEVENLABS_API_KEY=sk_abc123...
ELEVENLABS_VOICE_ID=21m00T...
```

### **3. Add Narration to Steps**

In your flow JSON:

```json
{
  "action": "click",
  "selector": "button",
  "name": "Submit Form",
  "narration": "Now click the submit button to save your changes."
}
```

The runner will generate audio files in `output/<flow>/audio/` and pass them to Remotion.

---

## 🎵 Background Music

1. Add music file to `remotion/public/music/background.mp3`
2. Reference in flow JSON:

```json
{
  "video": {
    "backgroundMusic": "music/background.mp3"
  }
}
```

---

## 📖 Advanced Usage

### **Run Only Playwright (Skip Render)**

```bash
npm run generate -- flows/demo.json --skip-render
```

This captures screenshots without rendering video. Useful for testing flows quickly.

### **Custom Output Name**

```bash
npm run generate -- flows/demo.json --output my-custom-video.mp4
```

### **Preview in Remotion Studio**

```bash
npm run remotion:preview
```

Opens interactive preview where you can edit props and see changes live.

### **Manual Render**

```bash
cd remotion
npx remotion render TutorialVideo output.mp4 --props='{"title":"Test","frames":[]}'
```

---

## 🛠️ Troubleshooting

### **"Browser not installed"**

Run:

```bash
npm run setup:browsers
```

### **"Cannot find module"**

Ensure both root and remotion dependencies are installed:

```bash
npm install
cd remotion && npm install
```

### **"Target closed" or "Navigation timeout"**

- Increase timeout in flow: `"waitUntil": "networkidle"`
- Check that `BASE_URL` is correct and server is running
- Run in headed mode to debug: `--headed`

### **Remotion render fails**

- Ensure `remotion/public/frames/<flowName>/` has screenshot files
- Check metadata.json was copied correctly
- Try rendering manually from `remotion/` directory

---

## 🧪 Testing Flows

Use the included demo flows:

```bash
# Demo 1: Navigation tutorial
npm run generate -- flows/demo-navegacion.json

# Demo 2: Registration tutorial
npm run generate -- flows/demo-registro.json
```

---

## 📝 Tips & Best Practices

### **Writing Effective Flows**

1. **Keep steps atomic**: One action per step for clarity
2. **Add delays**: Use `delayAfter` to let animations finish
3. **Use descriptive names**: `name` field appears in video overlay
4. **Test selectors**: Run with `--headed` to verify selectors work
5. **Optimize screenshots**: Don't capture every single action—only key moments

### **Video Quality**

- Screenshots are captured at 2x device scale (Retina quality)
- Viewport of 1280x720 scales well to 1080x1920 vertical format
- Disable browser animations if you want instant transitions: set `animations: 'disabled'` in utils.ts

### **Performance**

- Playwright runs headless by default (faster)
- Remotion concurrency is set in `.env`: `REMOTION_CONCURRENCY=4`
- Each step takes ~4 seconds (120 frames) — adjust in `design.ts`

---

## 🤝 Contributing

This is a template project. Feel free to:

- Add new action types in `scripts/actions.ts`
- Create custom scene components in `remotion/src/components/`
- Add new design themes
- Improve error handling

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

Built with:

- [Playwright](https://playwright.dev/) - Browser automation
- [Remotion](https://remotion.dev/) - Video composition in React
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [ElevenLabs](https://elevenlabs.io/) - AI voiceover (optional)

---

## 🚧 Roadmap / Future Ideas

- [ ] Multiple video aspect ratios (16:9, 1:1, 9:16)
- [ ] WebM output for smaller file sizes
- [ ] Audio narration from text files (TTS alternatives)
- [ ] GitHub Actions CI/CD integration
- [ ] Web UI for flow creation
- [ ] Video analytics (view tracking)

---

**Happy video creating! 🎉**

For questions or issues, open an issue on GitHub or contact the maintainer.
