# 🎬 Automated Video Tutorial Generator

## Complete Setup & First Video Guide

---

## ⚠️ IMPORTANT: First Steps

Before running any commands, you need to install dependencies. The TypeScript errors you may see are expected until dependencies are installed.

---

## 📋 Step-by-Step Setup

### **Step 1: Install All Dependencies**

Run this single command to set everything up:

```bash
npm run setup
```

This will:

1. Install root project dependencies (Playwright, TypeScript, etc.)
2. Navigate to `remotion/` and install video composition dependencies
3. Download Chromium browser for automation

**Expected time**: 2-5 minutes depending on your internet speed.

---

### **Step 2: Create Environment File**

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and set your base URL:

```env
BASE_URL=http://localhost:3000
```

If you don't have a local app running, you can:

- Use any public website for testing (e.g., `https://example.com`)
- Modify the demo flows to use a different URL
- Create flows for your own local application

---

### **Step 3: Verify Installation**

Check that everything is installed correctly:

```bash
# Verify TypeScript compilation
npx tsc --noEmit

# Validate a demo flow
npm run validate flows/demo-navegacion.json
```

You should see: **"✅ Flow is valid!"**

---

### **Step 4: Generate Your First Video**

#### **Option A: Quick Test (Any Website)**

Modify `flows/demo-navegacion.json` to use a public site:

```json
{
  "name": "demo-navegacion",
  "title": "Website Tour",
  "baseUrl": "https://example.com",
  "steps": [
    {
      "action": "goto",
      "url": "/",
      "name": "Homepage"
    },
    {
      "action": "screenshot",
      "name": "First View"
    }
  ]
}
```

Then generate:

```bash
npm run generate -- flows/demo-navegacion.json
```

#### **Option B: Use Demo Flows (Requires Local App)**

If you have a local app running at `localhost:3000`:

```bash
npm run generate -- flows/demo-navegacion.json
```

Or run in headed mode to see browser actions:

```bash
npm run generate -- flows/demo-navegacion.json --headed
```

---

### **Step 5: View Your Video**

After generation completes successfully, find your video at:

```
output/demo-navegacion/demo-navegacion.mp4
```

Open it with any video player (Windows Media Player, VLC, etc.)!

---

## 🎨 Next Steps

### **Customize Your First Flow**

1. Create a new flow file:

   ```bash
   cp flows/demo-navegacion.json flows/my-first-video.json
   ```

2. Edit `flows/my-first-video.json`:

   ```json
   {
     "name": "my-first-video",
     "title": "My Tutorial",
     "description": "A custom tutorial",
     "baseUrl": "https://your-site.com",
     "video": {
       "appName": "My Brand",
       "ctaText": "Visit my-site.com!"
     },
     "steps": [
       {
         "action": "goto",
         "url": "/",
         "name": "Homepage",
         "delayAfter": 1000
       },
       {
         "action": "screenshot",
         "name": "Homepage View"
       },
       {
         "action": "click",
         "selector": "button.primary",
         "name": "Click Main Button",
         "delayAfter": 800
       },
       {
         "action": "screenshot",
         "name": "After Click"
       }
     ]
   }
   ```

3. Validate your flow:

   ```bash
   npm run validate flows/my-first-video.json
   ```

4. Generate the video:
   ```bash
   npm run generate -- flows/my-first-video.json
   ```

### **Customize Video Design**

Edit `remotion/src/design.ts` to change colors, fonts, and timing:

```typescript
export const COLORS = {
  primary: "#6C63FF", // Change to your brand color
  secondary: "#00D4FF", // Change accent color
  // ... more colors
};
```

### **Preview in Remotion Studio**

See your video composition in real-time:

```bash
npm run remotion:preview
```

This opens a browser where you can adjust props and preview animations.

---

## 📚 Available Commands

```bash
# Generate video from flow
npm run generate -- flows/your-flow.json

# Validate flow JSON
npm run validate flows/your-flow.json

# Run Playwright only (no render)
npm run generate -- flows/your-flow.json --skip-render

# Use custom base URL
npm run generate -- flows/your-flow.json --base-url https://example.com

# Show browser during capture
npm run generate -- flows/your-flow.json --headed

# Preview in Remotion Studio
npm run remotion:preview

# Setup everything
npm run setup

# Install Chromium browser
npm run setup:browsers
```

---

## 🐛 Troubleshooting

### **"Cannot find module 'fs-extra'"**

Run: `npm install`

### **"Browser not found"**

Run: `npm run setup:browsers`

### **"Cannot navigate to [URL]"**

- Ensure your app is running at the `BASE_URL`
- Check the URL is correct in your flow JSON
- Try with `--base-url` flag to override

### **"Target closed" or timeout errors**

- Increase `delayAfter` in your steps
- Use `"waitUntil": "networkidle"` in goto actions
- Run with `--headed` to debug
- Check your selectors are correct

### **Remotion render fails**

- Ensure screenshots were captured (check `output/[flow-name]/`)
- Verify `remotion/public/frames/[flow-name]/` has images
- Check `metadata.json` exists
- Try running from `remotion/` directory manually

---

## 📖 Documentation

- **[README.md](README.md)** - Complete documentation with all features
- **[QUICK_START.md](QUICK_START.md)** - 5-minute quick start guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Implementation overview
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

---

## ✅ Success Checklist

Before you start creating videos:

- [ ] Dependencies installed (`npm run setup`)
- [ ] `.env` file created and configured
- [ ] Chromium browser downloaded
- [ ] Demo flow validated successfully
- [ ] First test video generated
- [ ] Video plays correctly

---

## 🎉 You're Ready!

Once you've completed the steps above, you're ready to create professional tutorial videos automatically!

For more advanced features:

- Add voiceover with ElevenLabs (see README.md)
- Add background music (see README.md)
- Create complex flows with multiple actions
- Customize video scenes and animations

**Happy video creating! 🚀**

Need help? Check the full [README.md](README.md) or open an issue.
