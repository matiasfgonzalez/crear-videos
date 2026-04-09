# 🚀 Quick Start Guide

> 🌍 **Languages**: **English** | [Español](QUICK_START.es.md)

Get your first video generated in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install all dependencies
npm install

# Install Remotion dependencies
cd remotion && npm install && cd ..

# Download Chromium browser
npx playwright install chromium
```

Or use the shortcut:

```bash
npm run setup
```

## Step 2: Set Up Environment

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set your local server URL:

```env
BASE_URL=http://localhost:3000
```

## Step 3: Test with Demo Flow

The project includes two ready-to-use demo flows:

### Option A: Simple Navigation Demo

```bash
npm run generate -- flows/demo-navegacion.json
```

This creates a video showing:

- Dashboard navigation
- Scrolling through content
- UI exploration

### Option B: Registration Flow Demo

```bash
npm run generate -- flows/demo-registro.json
```

This creates a video showing:

- Opening the registration form
- Filling in email and password
- Submitting the form

**Note**: These demos expect a local app at `http://localhost:3000`. You can:

- Modify the `baseUrl` in the JSON file
- Override with `--base-url` flag: `npm run generate -- flows/demo-navegacion.json --base-url https://example.com`
- Or create your own flow

## Step 4: View Your Video

After generation completes, find your video at:

```
output/demo-navegacion/demo-navegacion.mp4
```

Open it with any video player!

## Step 5: Create Your Own Flow

1. Copy one of the demo files:

```bash
cp flows/demo-navegacion.json flows/my-tutorial.json
```

2. Edit `flows/my-tutorial.json`:

```json
{
  "name": "my-tutorial",
  "title": "My First Tutorial",
  "description": "A quick demo",
  "baseUrl": "http://localhost:3000",
  "steps": [
    {
      "action": "goto",
      "url": "/",
      "name": "Open Homepage"
    },
    {
      "action": "screenshot",
      "name": "Homepage View"
    }
  ]
}
```

3. Generate your video:

```bash
npm run generate -- flows/my-tutorial.json
```

## 🔍 Debug Mode

Run with `--headed` to see the browser:

```bash
npm run generate -- flows/my-tutorial.json --headed
```

## 🎨 Preview in Remotion Studio

To see the video in Remotion's interactive preview:

```bash
npm run remotion:preview
```

This opens a browser where you can:

- Adjust props in real-time
- Preview animations frame-by-frame
- Test different configurations

## ✅ Verification Checklist

Before generating videos, ensure:

- [ ] Node.js 18+ is installed
- [ ] Dependencies installed (`npm run setup`)
- [ ] Chromium browser downloaded
- [ ] `.env` file exists with correct `BASE_URL`
- [ ] Your local app is running (if using localhost)

## 🐛 Common Issues

### "Browser not found"

```bash
npx playwright install chromium
```

### "Cannot navigate to URL"

- Check your app is running at the `BASE_URL`
- Try `--base-url http://your-actual-url.com`

### "Module not found"

```bash
npm install
cd remotion && npm install
```

### "Render failed"

- Check `output/<flow-name>/metadata.json` exists
- Verify screenshots are in `remotion/public/frames/<flow-name>/`
- Try rendering manually from `remotion/` directory

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore action types in the README
- Customize video style in `remotion/src/design.ts`
- Add voiceover with ElevenLabs (optional)

**Happy creating! 🎉**
