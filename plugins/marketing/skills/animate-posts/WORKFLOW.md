# Animate Posts - Interactive Workflow

## New Interactive Workflow (v2.0)

### 1. User Describes Animation
**No auto mode** - User must always provide specific instructions on how they want the animation to look.

Examples:
- "Slow zoom in"
- "Fast zoom with dramatic effect"
- "Pan right across the image"
- "Pulse/breathing effect"
- "Zoom out slowly"

### 2. Generate Preview
System creates the animation based on instructions and starts a local preview server.

```
🎬 Creating animation based on your instructions...
⏳ Step 1/3: Rendering video...
⏳ Step 2/3: Generating palette...
⏳ Step 3/3: Creating GIF...
✅ Animation created!

📊 Preview Details:
   Size: 4.7MB
   Resolution: 720x720
   Duration: 10s
   FPS: 10

🌐 Starting preview server...
✨ Preview ready! Open in browser:
   http://localhost:3000
```

### 3. Review in Browser
- Opens automatically in default browser
- Shows looping GIF preview
- Clean, dark UI for easy viewing
- User can refresh to see updates

### 4. Iterate or Export

**Option A: Edit**
```
What would you like to do? (edit/export/cancel): edit
Describe the changes you want: make it zoom faster and add rotation
```
- System regenerates with new instructions
- Preview auto-refreshes in browser
- Repeat until satisfied

**Option B: Export**
```
What would you like to do? (edit/export/cancel): export
Export to which folder? (press Enter for Downloads):

📦 Exporting final animation...
✅ Exported successfully!
   Location: /Users/.../life-wheel-animated-final.gif
   Size: 4.7MB
```

**Option C: Cancel**
```
What would you like to do? (edit/export/cancel): cancel
❌ Cancelled. Preview server stopped.
```

## Animation Instructions Parser

### Supported Effects

**Zoom Effects:**
- "zoom in" - Gradual zoom in (default speed)
- "slow zoom in" - Slower zoom
- "fast zoom in" - Faster zoom
- "dramatic zoom" - Zoom to 1.3x (vs 1.15x default)
- "zoom out" - Start zoomed in, zoom out to normal
- "pulse" / "breathing" - Continuous pulse effect

**Pan Effects:**
- "pan left" - Pan from right to left
- "pan right" - Pan from left to right
- "pan up" - Pan from bottom to top
- "pan down" - Pan from top to bottom

**Combinations:**
Can combine multiple effects (experimental):
- "zoom in and pan right"
- "slow zoom with fade"

## Technical Specs

### Output Format
- Resolution: 720x720px (1:1 square)
- Duration: 10 seconds
- Frame rate: 10fps
- Colors: 64 max (optimized palette)
- Target size: <5MB
- Format: Animated GIF
- Loop: Infinite

### Files Created
- Working directory: `/tmp/animate-posts-work/`
- Preview files: `preview-{timestamp}.gif`
- Temporary files auto-cleaned after each generation

### Preview Server
- Port: 3000 (configurable)
- Auto-opens in default browser
- Serves GIF with elegant viewer UI
- Stops automatically on export/cancel

## Benefits of Interactive Workflow

1. **User Control**: Always explicit about animation style
2. **Preview Before Commit**: See result before saving
3. **Iterative Refinement**: Make changes until perfect
4. **No Wasted Files**: Only export when satisfied
5. **Fast Iteration**: Changes regenerate quickly (10-20 seconds)
6. **Visual Feedback**: See exactly what you're getting

## Future Enhancements

- [ ] Multiple aspect ratios (16:9, 9:16, 4:5)
- [ ] Variable duration (5s, 10s, 15s)
- [ ] More animation effects (rotate, shake, bounce)
- [ ] Text overlays with animations
- [ ] Multiple image layers
- [ ] Audio track support
- [ ] Export to MP4 (in addition to GIF)
- [ ] Batch processing mode
