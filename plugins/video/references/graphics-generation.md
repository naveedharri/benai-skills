---
name: graphics-generation
description: Generate graphics, thumbnails, overlays, and animated elements for videos
metadata:
  tags: graphics, image, thumbnail, overlay, remotion, design, animation
---

# Graphics Generation for Video

Generate professional graphics for videos using Remotion's React-based rendering or AI image generation APIs.

---

## Types of Video Graphics

| Type | Description | Use Case |
|------|-------------|----------|
| **Thumbnails** | Static images for video preview | YouTube, social media |
| **Title Cards** | Animated text/graphics for sections | Chapter intros |
| **Lower Thirds** | Name/topic overlays at bottom | Speaker identification |
| **Overlays** | Graphics that appear over video | Logos, watermarks, CTAs |
| **End Screens** | Closing graphics with CTAs | Subscribe buttons, links |
| **Social Graphics** | Platform-specific images | Instagram, Twitter posts |
| **Animated Text** | Motion typography | Quotes, highlights |

---

## ALWAYS ASK User Preferences

| Question | Options |
|----------|---------|
| "What type of graphic?" | Thumbnail / Title card / Lower third / Overlay |
| "What dimensions?" | 1920×1080 (16:9) / 1080×1080 (1:1) / 1080×1920 (9:16) |
| "Brand colors to use?" | Extract from website / Custom hex codes |
| "Include logo?" | Yes / No |
| "Animation style?" | Static / Fade / Slide / Scale / Particle |
| "Text content?" | User provides / Generate from transcript |

---

## Method 1: Remotion Graphics (React-Based)

Generate graphics programmatically with full control over design and animation.

### Setup

```bash
# Already installed with video-editor
npm install remotion @remotion/cli
```

### Basic Graphic Component

```tsx
import {AbsoluteFill, Img, staticFile} from 'remotion';

interface GraphicProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  accentColor?: string;
}

export const VideoGraphic: React.FC<GraphicProps> = ({
  title,
  subtitle,
  backgroundColor = '#000000',
  accentColor = '#D2ECD0',
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: 120,
          height: 4,
          backgroundColor: accentColor,
          marginBottom: 40,
        }}
      />

      <h1
        style={{
          color: '#ffffff',
          fontSize: 72,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            color: accentColor,
            fontSize: 32,
            marginTop: 20,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
```

### Render as Static Image

```bash
# Render a single frame as PNG
npx remotion still GraphicComposition out/thumbnail.png --frame=0

# Render as JPEG with quality
npx remotion still GraphicComposition out/thumbnail.jpg --frame=0 --image-format=jpeg --quality=90
```

### Composition for Graphics

```tsx
import {Composition} from 'remotion';
import {VideoGraphic} from './VideoGraphic';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Thumbnail */}
      <Composition
        id="Thumbnail16x9"
        component={VideoGraphic}
        width={1920}
        height={1080}
        fps={1}
        durationInFrames={1}
        defaultProps={{
          title: 'Video Title Here',
          subtitle: 'Subtitle or tagline',
        }}
      />

      {/* 1:1 Square for Instagram */}
      <Composition
        id="SquareGraphic"
        component={VideoGraphic}
        width={1080}
        height={1080}
        fps={1}
        durationInFrames={1}
        defaultProps={{
          title: 'Square Post',
        }}
      />

      {/* 9:16 Vertical for Stories/Reels */}
      <Composition
        id="VerticalGraphic"
        component={VideoGraphic}
        width={1080}
        height={1920}
        fps={1}
        durationInFrames={1}
        defaultProps={{
          title: 'Story Graphic',
        }}
      />
    </>
  );
};
```

---

## Method 2: AI Image Generation

Use AI APIs for complex graphics, backgrounds, or creative imagery.

### Option A: OpenAI DALL-E

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1792x1024', // 16:9 ratio
    quality: 'hd',
  });

  return response.data[0].url!;
}

// Example: Generate a thumbnail background
const backgroundUrl = await generateImage(
  'Abstract geometric background with dark blue and mint green gradients, modern tech aesthetic, suitable for video thumbnail'
);
```

### Option B: Stability AI

```typescript
async function generateWithStability(prompt: string): Promise<Buffer> {
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [{text: prompt}],
        cfg_scale: 7,
        width: 1920,
        height: 1080,
        samples: 1,
      }),
    }
  );

  const data = await response.json();
  return Buffer.from(data.artifacts[0].base64, 'base64');
}
```

### Option C: Google Gemini (Imagen)

```typescript
// Requires: pip install google-genai Pillow
// Or use via API

async function generateWithGemini(prompt: string): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-002:generateImage',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GOOGLE_API_KEY!,
      },
      body: JSON.stringify({
        prompt: {text: prompt},
        number_of_images: 1,
        aspect_ratio: '16:9',
      }),
    }
  );

  const data = await response.json();
  return data.images[0].uri;
}
```

---

## Combining AI + Remotion

Generate AI background, then composite with Remotion:

```tsx
import {AbsoluteFill, Img, staticFile} from 'remotion';

interface ThumbnailProps {
  backgroundImage: string; // AI-generated or from public/
  title: string;
  subtitle?: string;
}

export const AIThumbnail: React.FC<ThumbnailProps> = ({
  backgroundImage,
  title,
  subtitle,
}) => {
  return (
    <AbsoluteFill>
      {/* AI-generated background */}
      <Img
        src={backgroundImage}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 60,
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 700,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{color: '#D2ECD0', fontSize: 28, marginTop: 16}}>
            {subtitle}
          </p>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

---

## Template Library

### YouTube Thumbnail

```tsx
export const YouTubeThumbnail: React.FC<{
  title: string;
  face?: string; // Path to speaker image
  accentColor?: string;
}> = ({title, face, accentColor = '#FF0000'}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0f0f0f'}}>
      {/* Large text on left */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 0,
          bottom: 0,
          width: '55%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: accentColor,
        }}
      />

      {/* Face/image on right */}
      {face && (
        <Img
          src={staticFile(face)}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
```

### Social Media Quote Card

```tsx
export const QuoteCard: React.FC<{
  quote: string;
  author: string;
  backgroundColor?: string;
}> = ({quote, author, backgroundColor = '#1a1a2e'}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Quote marks */}
      <span style={{fontSize: 120, color: '#D2ECD0', opacity: 0.3}}>"</span>

      <p
        style={{
          color: 'white',
          fontSize: 48,
          lineHeight: 1.4,
          fontStyle: 'italic',
          marginTop: -40,
        }}
      >
        {quote}
      </p>

      <p style={{color: '#D2ECD0', fontSize: 28, marginTop: 40}}>
        — {author}
      </p>
    </AbsoluteFill>
  );
};
```

### End Screen with CTA

```tsx
export const EndScreen: React.FC<{
  ctaText: string;
  logoPath?: string;
}> = ({ctaText, logoPath}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const buttonScale = interpolate(
    frame,
    [0, 0.3 * fps],
    [0.8, 1],
    {extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {logoPath && (
        <Img
          src={staticFile(logoPath)}
          style={{width: 120, marginBottom: 40}}
        />
      )}

      <div
        style={{
          transform: `scale(${buttonScale})`,
          backgroundColor: '#D2ECD0',
          padding: '20px 60px',
          borderRadius: 40,
        }}
      >
        <span style={{color: '#000', fontSize: 32, fontWeight: 600}}>
          {ctaText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## Batch Generation Script

Generate multiple graphics at once:

```typescript
// scripts/generate-graphics.ts
import {bundle} from '@remotion/bundler';
import {renderStill} from '@remotion/renderer';
import path from 'path';

const graphics = [
  {id: 'Thumbnail16x9', output: 'thumbnail.png', props: {title: 'Main Video'}},
  {id: 'SquareGraphic', output: 'instagram.png', props: {title: 'Follow for more'}},
  {id: 'VerticalGraphic', output: 'story.png', props: {title: 'New Video!'}},
];

async function generateAll() {
  const bundled = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  for (const graphic of graphics) {
    await renderStill({
      composition: graphic.id,
      serveUrl: bundled,
      output: `out/${graphic.output}`,
      inputProps: graphic.props,
    });
    console.log(`Generated: ${graphic.output}`);
  }
}

generateAll();
```

Run:
```bash
npx ts-node scripts/generate-graphics.ts
```

---

## AI Prompt Best Practices

### For Backgrounds

```
✅ Good: "Abstract geometric background with dark navy blue (#1a1a2e) and mint green (#D2ECD0) gradients, modern tech aesthetic, subtle particle effects, 16:9 aspect ratio, suitable for video thumbnail"

❌ Bad: "cool background"
```

### For Thumbnails

```
✅ Good: "Professional YouTube thumbnail background, dramatic lighting, dark moody atmosphere with accent lighting in mint green, no text, space for overlay text on left side"

❌ Bad: "thumbnail background"
```

### Style Modifiers

| Modifier | Effect |
|----------|--------|
| "photorealistic" | Realistic rendering |
| "minimalist" | Clean, simple design |
| "abstract geometric" | Modern tech feel |
| "gradient" | Smooth color transitions |
| "no text" | Prevents AI text in image |
| "space for overlay" | Leaves room for text |

---

## Edge Cases & Gotchas

### Render as Still vs Video

```bash
# Still image (1 frame)
npx remotion still CompositionId out/image.png

# Animated graphic (multiple frames)
npx remotion render CompositionId out/animated.gif --codec=gif
```

### Image Quality

```bash
# High quality JPEG
npx remotion still CompositionId out/image.jpg --quality=95

# PNG (lossless)
npx remotion still CompositionId out/image.png
```

### Dynamic Props

```bash
# Pass props via CLI
npx remotion still Thumbnail out/custom.png --props='{"title":"Custom Title"}'
```

### Font Loading

Ensure fonts are loaded before rendering:
```tsx
import {loadFont} from '@remotion/google-fonts/SpaceGrotesk';
const {fontFamily} = loadFont();

// Use fontFamily in styles
```
