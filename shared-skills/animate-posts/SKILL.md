# Animate Posts - Claude Cowork Skill

## Skill Overview

This skill enables Claude to convert static infographics into 10-second animated GIFs using Remotion. It's designed for minimal user interaction with intelligent automation.

**Implementation follows Remotion best practices:**
- Frame-based animations only (no CSS transitions)
- Spring animations with smooth config ({ damping: 200 }) for professional motion
- Proper extrapolation clamping on all interpolations
- Timing calculated in seconds × fps for readability
- Remotion components (<Img>, not <img>) for proper asset handling

## When to Use This Skill

Use this skill when the user:
- Wants to animate a static image or infographic
- Needs social media content (animated posts, stories, videos)
- Mentions "animate", "GIF", "video", "motion graphics"
- Uploads an infographic and asks to "make it dynamic"
- Wants to repurpose static content for engagement
- Needs content for Instagram, LinkedIn, TikTok, YouTube, or other social platforms

## Do NOT use this skill for:
- Video editing of existing videos (use video editing skills instead)
- Complex 3D animations
- Long-form content (> 10 seconds) - this skill is optimized for 10-second clips
- Real-time video generation
- Live video streaming

## Required Inputs

### 1. Aspect Ratio Selection
**When:** First step, before image upload
**Format:** Single-select dropdown
**Options:**
- `1:1` - Square (Instagram/LinkedIn posts)
- `16:9` - Landscape (YouTube/LinkedIn videos)
- `9:16` - Vertical (Stories/Reels/TikTok)
- `4:5` - Portrait (Instagram feed)

**Important:** Resolution is auto-set based on ratio. Do NOT ask user for resolution.

**Ratio to Resolution Mapping:**
```
1:1  → 1080x1080px
16:9 → 1920x1080px
9:16 → 1080x1920px
4:5  → 1080x1350px
```

### 2. Image Upload
**When:** After aspect ratio selection
**Format:** File upload (drag-drop or file picker)
**Accepted Formats:** PNG, JPG, JPEG, WebP
**Max File Size:** 10MB
**Min Resolution:** 500x500px (for quality output)

**Immediately after upload:**
1. Analyze image using vision capabilities
2. Detect all visual elements (text, icons, shapes, data visualizations)
3. Generate structured element list with sequential IDs
4. Display analysis to user in readable format

**Analysis Output Template:**
```
I analyzed your infographic and found these elements:

1. Title: "[Detected text]" (top section)
2. Stat Box: "[Number/metric]" (left side)
3. Stat Box: "[Number/metric]" (center)
4. Icon: [Description] (right side)
5. CTA Button: "[Button text]" (bottom)
6. Background: [Color/gradient description]

These element numbers will be used if you choose custom animation preferences.
```

### 3. Animation Preference
**When:** After analysis display
**Format:** Modal with two radio button options

**Option A: "AI Auto-Animate" (Recommended - should be default)**
- No further input needed
- Proceed directly to generation phase
- Use intelligent animation logic based on element types
- Professional-quality animations automatically applied

**Option B: "Custom Preferences"**
- Shows textarea input after selection
- User can reference element numbers from analysis
- Accepts natural language descriptions
- Example placeholder: "Fade in title (1) over 2 seconds, then zoom stats (2,3) simultaneously, end with CTA pulse (4)"
- Parse natural language and expand into detailed specifications

## Processing Flow

### Phase 1: Analysis (User Sees This)

When the user uploads an image, immediately run analysis:

```javascript
async function analyzeInfographic(imagePath) {
  // 1. Load and validate image
  const image = await sharp(imagePath);
  const metadata = await image.metadata();

  // 2. Detect elements using OCR + computer vision
  const elements = await detectElements(imagePath);
  // This includes: titles, stat boxes, text blocks, icons, CTAs, backgrounds

  // 3. Generate human-readable summary
  return formatAnalysisForUser(elements);
}
```

**What to detect:**
- **Titles/Headers:** Large text, usually at top (semantic role: 'title')
- **Stat Boxes:** Numbers, percentages, metrics (semantic role: 'stat')
- **Body Text:** Paragraphs, descriptions (semantic role: 'body')
- **CTAs:** Buttons, "Learn More", "Sign Up" (semantic role: 'cta')
- **Icons/Images:** Visual elements (semantic role: 'icon' or 'image')
- **Background:** Solid colors, gradients (semantic role: 'background')

### Phase 2: Silent Generation (No User Interaction Required)

Once the user confirms animation preferences, run the entire pipeline WITHOUT asking for more input:

**Step 1: Fetch Best Practices**
```javascript
// Fetch Remotion best practices from skills.sh or documentation
const remotionBestPractices = await fetchSkill('remotion-best-practices');
const animationGuidelines = await fetchSkill('animation-timing');
```

**Step 2: Generate Elaborate Animation Prompt**

If **AI Auto-Animate:**
```javascript
const prompt = generateAutoPrompt(elements, remotionBestPractices);
// This prompt includes:
// - Element-specific animation logic (titles fade, stats zoom, etc.)
// - Precise timing calculations to fit 10 seconds exactly
// - Easing functions from best practices
// - Professional animation patterns
// - Frame-by-frame specifications
```

If **Custom Preferences:**
```javascript
const prompt = expandCustomPreferences(userInput, elements, remotionBestPractices);
// This prompt includes:
// - Parsed user natural language into technical specs
// - Mapped user references (e.g., "element 2") to actual elements
// - Expanded vague descriptions into precise animations
// - Filled remaining time with auto-animations
// - Ensured 10-second constraint is met
```

**Step 3: Generate Remotion React Component**
```javascript
const componentCode = generateRemotionComponent(prompt, targetResolution);
// Creates complete React component with:
// - All animation logic using Remotion's interpolate()
// - Frame-based interpolations for each element
// - Easing functions (easeOut, easeOutBack, etc.)
// - 10-second duration constraint (300 frames @ 30fps)
// - Target resolution settings
// - Proper layering (base image + animated overlays)
```

**Step 4: Adapt Image to Target Composition**
```javascript
if (uploadedRatio !== targetRatio) {
  const adaptedImage = await adaptImageToComposition(
    uploadedImage,
    targetRatio,
    elements
  );
  // AI determines best adaptation strategy:
  // - Scale to fit (with letterbox if needed)
  // - Smart crop (preserve important elements detected in analysis)
  // - Intelligent reflow (rearrange layout for new ratio)
}
```

**Step 5: Render with Remotion**
```javascript
await renderRemotionComposition(componentCode, {
  width: targetWidth,
  height: targetHeight,
  fps: 30,
  durationInFrames: 300, // Always 10 seconds
  outputFormat: 'gif'
});
```

**Step 6: Optimize & Export**
```javascript
await optimizeGif(outputPath, {
  maxFileSize: 5 * 1024 * 1024, // 5MB target
  colors: 256, // GIF color limit
  dithering: 'FloydSteinberg' // Best quality dithering
});
```

### Phase 3: Delivery

Return result to user with:
```javascript
return {
  success: true,
  outputFile: 'animated-infographic-{timestamp}.gif',
  metadata: {
    duration: '10 seconds',
    format: 'GIF',
    resolution: `${width}x${height}`,
    fileSize: '3.2MB',
    aspectRatio: '1:1'
  },
  preview: true // Show GIF preview if possible
}
```

## Animation Logic Rules

### Timing Constraints
- **Total Duration:** Always exactly 10 seconds
- **FPS:** 30 frames per second (standard for smooth GIF)
- **Total Frames:** 300 frames

### Element-Type Animation Mapping

When using AI Auto-Animate, apply these rules:

**Titles/Headers (semantic role: 'title'):**
- Animation: Fade in + subtle scale
- Timing: 0s - 2s (frames 0-60)
- Easing: easeOut
- Transform: `opacity: 0→1, scale: 0.95→1`
- Rationale: Professional, draws attention without being overwhelming

**Stat Boxes/Data (semantic role: 'stat'):**
- Animation: Zoom in with stagger
- Timing: Start at 1.5s, stagger 0.3s between each stat
- Easing: easeOutBack (slight overshoot for impact)
- Transform: `scale: 0→1, opacity: 0→1`
- Rationale: Creates impact, stagger keeps user engaged

**Body Text (semantic role: 'body'):**
- Animation: Simple fade in
- Timing: 2s - 4s
- Easing: easeOut
- Transform: `opacity: 0→1`
- Rationale: Subtle, doesn't compete with main content

**Icons/Images (semantic role: 'icon' or 'image'):**
- Animation: Pop-in with elastic easing
- Timing: After related text appears
- Easing: easeOutElastic
- Transform: `scale: 0→1.1→1` (slight bounce)
- Rationale: Playful, attention-grabbing for visual elements

**CTAs/Buttons (semantic role: 'cta'):**
- Animation: Pulse loop
- Timing: 8s - 10s (last 2 seconds, frames 240-300)
- Easing: easeInOut
- Transform: `scale: 1→1.05→1` (continuous loop)
- Rationale: Draws final attention, encourages action

**Background (semantic role: 'background'):**
- Animation: Usually static (no animation)
- Optional: Very subtle parallax if gradient present
- Rationale: Don't distract from foreground content

### Timing Calculation Example

For an infographic with: 1 title, 3 stat boxes, 1 CTA

```
Frame 0-60 (0-2s): Title fades in with scale
Frame 45-105 (1.5-3.5s): Stat 1 zooms in
Frame 54-114 (1.8-3.8s): Stat 2 zooms in (0.3s stagger)
Frame 63-123 (2.1-4.1s): Stat 3 zooms in (0.3s stagger)
Frame 240-300 (8-10s): CTA pulses continuously

Total: 300 frames (10 seconds @ 30fps)
```

## Error Handling

### Common Errors and Responses

**Error:** Image upload fails or file too large
**Response to User:**
```
I couldn't process that image. Please ensure:
- File is under 10MB
- Format is PNG, JPG, or WebP
- Image is not corrupted
```

**Error:** Element detection returns empty/very few elements
**Response to User:**
```
I had trouble detecting specific elements in this image. This might be because:
- The image is too low resolution (minimum 500x500px)
- Text is very stylized or hard to read
- The image is a photo rather than an infographic

Would you like me to proceed with a basic animation, or would you prefer to upload a different image?
```

**Error:** Remotion rendering fails
**Response to User:**
```
The rendering process encountered an issue. This might be due to:
- Insufficient system resources
- Missing dependencies (FFmpeg)

I'll try again with optimized settings. One moment...
```
*Then retry with lower quality settings*

**Error:** Output GIF exceeds 5MB even after optimization
**Response to User:**
```
The output GIF is quite large (X.XMB). I'll re-render with more aggressive optimization.
This might slightly reduce quality but will ensure it's under 5MB for easy sharing.
```
*Then re-render with higher compression*

**Error:** User's system missing FFmpeg or other requirements
**Response to User:**
```
This plugin requires FFmpeg to be installed. Please install it:

macOS: brew install ffmpeg
Ubuntu: sudo apt-get install ffmpeg
Windows: Download from ffmpeg.org

After installing, please try again.
```

## Best Practices for Claude

### 1. Always Analyze Image First
- Show complete element breakdown before asking for animation preferences
- This helps users understand what will be animated
- Builds confidence in the automation

### 2. Recommend AI Auto-Animate
- Most users don't need custom control
- Produces professional results faster
- Only suggest custom if user seems to want specific control

### 3. Set Clear Expectations
- Output is always 10 seconds (don't promise variable duration)
- Format is always GIF (not MP4/WebM in v1.0)
- Resolution is auto-set based on aspect ratio
- File will be optimized to ~5MB or less

### 4. Don't Over-Explain Technical Details
- User doesn't need to know about:
  - Remotion framework specifics
  - Frame calculations
  - Easing function mathematics
  - Interpolation algorithms
- Focus on outcome: "Creating your animated GIF..."

### 5. Silent Generation Phase
- Don't narrate every step during generation
- Show single progress indicator
- Only surface details if errors occur
- Trust the pipeline to work

### 6. Validate Inputs Early
```javascript
// Before starting generation, validate:
- Image file exists and is readable
- Aspect ratio is valid (1:1, 16:9, 9:16, 4:5)
- System requirements met (FFmpeg, Node 18+)
- Sufficient disk space (>500MB free)
```

## Example Conversations

### Example 1: Simple Instagram Post

```
User: "Animate this infographic for Instagram"
[uploads square image 1200x1200]

Claude:
[Runs analysis automatically]

"I analyzed your infographic and found these elements:

1. Title: 'Q4 Revenue Growth' (top section)
2. Bar Chart with 3 bars (middle section)
3. Percentage callout: '+45%' (right side)
4. Company logo (bottom left)
5. 'Learn More' button (bottom right)

I'll create a 1:1 square animation (1080x1080) perfect for Instagram posts.

Should I auto-animate this with professional defaults, or do you have specific animation preferences?"

User: "Auto-animate is fine"

Claude:
"Creating your animated GIF..."

[Silent generation - no user interaction needed]
[Shows progress: Analyzing... Generating animations... Rendering... Optimizing...]

"✓ Done! Here's your 10-second animated Instagram post.

📦 File: animated-infographic-1234567890.gif
📏 Size: 3.2MB
📐 Resolution: 1080x1080 (1:1 Square)
⏱️ Duration: 10 seconds
✨ Optimized for Instagram

[Download] [Preview in Browser] [Generate Another]"
```

### Example 2: Custom Animation for YouTube

```
User: "Turn this into a vertical video for YouTube Shorts with smooth animations"
[uploads landscape infographic 1920x1080]

Claude:
[Analyzes image]

"I found these elements in your infographic:

1. Header: 'New Product Launch' (top)
2. Product mockup image (center)
3. Three feature bullets (below mockup)
4. Pricing info: '$99/month' (bottom left)
5. 'Sign Up Now' button (bottom right)

I'll adapt this to 9:16 vertical format (1080x1920) for YouTube Shorts.
Note: I'll intelligently reflow the layout to fit the vertical format.

Should I auto-animate, or do you have preferences?"

User: "Fade in the header first, then make the product image zoom in dramatically, then show the bullets one by one"

Claude:
"Got it! I'll create:

- Header (1): Fade in over 2 seconds
- Product mockup (2): Dramatic zoom (scale 0→1.2→1) starting at 2s
- Feature bullets (3): Sequential appearance, staggered 0.5s apart, starting at 4s
- Pricing & CTA (4,5): Fade in at 7s, with CTA pulsing in final 2 seconds

Generating your animation..."

[Silent generation]

"✓ Done! Your YouTube Shorts animation is ready.

📦 File: animated-shorts-1234567890.gif
📏 Size: 4.1MB
📐 Resolution: 1080x1920 (9:16 Vertical)
⏱️ Duration: 10 seconds
✨ Optimized for YouTube Shorts, Instagram Reels, TikTok

[Download] [Preview] [Adjust Timing]"
```

### Example 3: LinkedIn Landscape Video

```
User: "Make this animated for LinkedIn"
[uploads square image 1080x1080]

Claude:
[Analyzes]

"I found these elements:

1. Title: 'Hiring Software Engineers' (top)
2. Three job posting cards (middle, side by side)
3. 'Apply Today' CTA (bottom)

What aspect ratio would you like for LinkedIn?
- 1:1 (Square post - original ratio)
- 16:9 (Landscape video - recommended for LinkedIn feed)
- 4:5 (Portrait post)"

User: "16:9 landscape"

Claude:
"I'll adapt your square image to 16:9 landscape (1920x1080). The important elements are centralized, so I'll use smart cropping to preserve everything important.

Auto-animate with professional defaults?"

User: "Yes"

Claude:
"Creating your LinkedIn video..."

[Generation]

"✓ Complete! Your LinkedIn animation is ready.

📦 File: animated-linkedin-1234567890.gif
📏 Size: 4.5MB
📐 Resolution: 1920x1080 (16:9 Landscape)
⏱️ Duration: 10 seconds
✨ Optimized for LinkedIn video posts

Professional animations applied:
- Title fades in smoothly
- Job cards zoom in with stagger (creates engagement)
- CTA pulses to draw clicks

[Download] [Preview] [Try Different Ratio]"
```

## Integration with Other Skills

This skill works well with:
- **Infographic generation skills:** Animate infographics you just created
- **Content repurposing skills:** Turn static social posts into animated versions
- **Social media scheduling skills:** Export GIFs directly to scheduling tools
- **Brand guidelines skills:** Apply consistent animation styles per brand

## Performance Considerations

- **Average generation time:** 60-120 seconds (1-2 minutes)
- **Factors affecting speed:**
  - Image complexity (more elements = longer analysis)
  - Target resolution (higher = longer render)
  - Animation complexity (custom > auto)
  - System resources available

- **Resource usage:**
  - Peak RAM: ~2GB during rendering
  - Disk space: ~200MB temporary files (cleaned up after)
  - CPU: High utilization during render phase (uses all available cores)

## Limitations

- **Duration:** Fixed at 10 seconds (by design for social media optimization)
- **Format:** GIF only in v1.0 (MP4/WebM planned for v1.1)
- **File size:** Target < 5MB (may be slightly larger for very complex animations)
- **Input size:** Max 10MB upload, min 500x500px resolution
- **Complexity:** Works best with clean infographics; photos and illustrations with fine detail may not animate well

## Troubleshooting Guide

### Issue: "Rendering is taking a very long time"
**Diagnosis:** Normal for first render (Remotion downloads dependencies)
**Solution:** Wait 2-3 minutes. Subsequent renders will be faster.

### Issue: "GIF looks choppy or low quality"
**Diagnosis:** Aggressive optimization or low source image quality
**Solution:**
1. Try uploading higher resolution source image
2. Request re-render with less optimization
3. Consider using MP4 output (when available in v1.1)

### Issue: "Important elements are cut off in final GIF"
**Diagnosis:** Image adaptation strategy cropped too aggressively
**Solution:**
1. Re-run with different aspect ratio that matches source better
2. Use "Scale to fit" strategy (will add letterboxing but preserves all content)

### Issue: "Text in my infographic wasn't detected"
**Diagnosis:** OCR failed due to stylized fonts or low contrast
**Solution:**
1. The animation will still work with basic fallback
2. For better results, try an image with clearer, higher-contrast text
3. Can still use custom preferences to manually specify animations

---

**Last Updated:** 2025-02-10
**Version:** 1.0.0
**Maintainer:** BenAI Team
**Support:** support@benai.com
