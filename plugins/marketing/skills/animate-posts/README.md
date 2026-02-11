# 🎬 Animate Posts

Convert static infographics into professional 10-second animated GIFs using Remotion.

## Overview

Animate Posts is a Claude Cowork plugin that automates the creation of animated GIFs from infographics. Designed for content creators, marketers, and agencies who need to quickly produce engaging animated content for social media.

## ✨ Features

- **AI-Powered Animation**: Automatically detect and animate elements
- **Multi-Platform Support**: 1:1, 16:9, 9:16, 4:5 aspect ratios
- **Fast Generation**: < 2 minutes per animation
- **Smart Adaptation**: Intelligently fits images to target ratios
- **Optimized Output**: GIFs < 5MB, perfect for social uploads
- **Customizable**: AI auto-animate or custom preferences

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- FFmpeg ([Installation guide](#installing-ffmpeg))

### Installation

```bash
# Navigate to plugin directory
cd shared-skills/animate-posts

# Install dependencies
npm install

# Verify installation
npm run dev --help
```

### Basic Usage

```bash
# Simple animation with defaults (1:1 square)
npm run dev /path/to/infographic.png

# Specify aspect ratio
npm run dev /path/to/image.png --ratio 16:9

# Custom animation preferences
npm run dev /path/to/image.png --mode custom --preferences "Fade in title, zoom stats simultaneously"

# Specify output directory
npm run dev /path/to/image.png --output /path/to/output
```

## 📐 Supported Aspect Ratios

| Ratio | Resolution | Best For |
|-------|------------|----------|
| **1:1** | 1080×1080 | Instagram/LinkedIn Posts |
| **16:9** | 1920×1080 | YouTube/LinkedIn Videos |
| **9:16** | 1080×1920 | Stories/Reels/TikTok |
| **4:5** | 1080×1350 | Instagram Feed |

## 🎨 How It Works

### 1. Upload Your Infographic
Drag and drop or select a PNG, JPG, or WebP file (max 10MB).

### 2. Select Aspect Ratio
Choose the target platform format (Instagram, YouTube, Stories, etc.).

### 3. Choose Animation Style
- **AI Auto-Animate** (Recommended): Professional animations applied automatically
- **Custom Preferences**: Describe your animation preferences in plain English

### 4. Generate
Sit back while the plugin:
- Analyzes your infographic elements
- Generates Remotion animations
- Renders and optimizes your GIF

### 5. Download
Get your optimized, ready-to-post animated GIF (< 5MB, 10 seconds).

## 💡 Animation Examples

### AI Auto-Animate
The AI automatically applies professional animations based on element types:

- **Titles**: Fade in with subtle scale
- **Stat Boxes**: Zoom in with stagger
- **CTAs**: Pulse effect
- **Icons**: Pop-in animation
- **Body Text**: Simple fade

### Custom Preferences Examples

```
"Fade in title over 2 seconds, then zoom stats simultaneously"

"Slide in header from top, show bullets one by one, pulse the CTA at the end"

"Dramatic zoom on the product image, then fade in the features"
```

## ⚙️ System Requirements

### Required
- **Node.js**: Version 18 or higher
- **FFmpeg**: For video processing and GIF export
- **Disk Space**: Minimum 500MB free

### Recommended
- **RAM**: 4GB+ for faster rendering
- **CPU**: Multi-core processor for parallel rendering

## 🛠️ Installing FFmpeg

### macOS
```bash
brew install ffmpeg
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### Windows
1. Download from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract and add to system PATH
3. Verify: `ffmpeg -version`

## 📊 Technical Details

### Input Specifications
- **Formats**: PNG, JPG, JPEG, WebP
- **Max Size**: 10MB
- **Min Resolution**: 500×500px (recommended: 1080×1080+)

### Output Specifications
- **Duration**: Always 10 seconds
- **Format**: GIF (optimized)
- **FPS**: 30
- **File Size**: < 5MB target
- **Color Palette**: 256 colors (GIF standard)
- **Loop**: Infinite

## 🐛 Troubleshooting

### "FFmpeg not found"
**Solution:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Verify installation
ffmpeg -version
```

### "Rendering failed"
**Possible causes:**
- Node.js version < 18 (run `node --version`)
- Insufficient disk space (need > 500MB)
- Corrupted input image

**Solution:**
1. Update Node.js to 18+
2. Free up disk space
3. Try a different image file

### "GIF file too large"
**Solution:**
The plugin auto-optimizes to < 5MB. If still large:
1. Use a smaller input image
2. Choose simpler animations
3. The optimization may slightly reduce quality but ensures uploadability

### "Animation looks choppy"
**Possible causes:**
- Low-quality input image
- Aggressive GIF optimization

**Solution:**
1. Use higher resolution source image (min 1080×1080)
2. Ensure source image is clear and high-quality
3. Consider exporting as MP4 (coming in v1.1)

### "Text elements not detected"
**Possible causes:**
- Very stylized fonts
- Low contrast text
- Image too low resolution

**Solution:**
1. The animation will still work with fallback
2. Use custom preferences to manually specify animations
3. Or provide clearer, higher-contrast infographic

## 🔧 Advanced Configuration

### Environment Variables

Create a `.env` file in the plugin directory:

```bash
# Output directory (default: /tmp/animate-posts-output)
OUTPUT_DIRECTORY=/path/to/output

# Remotion license key (optional, for commercial use)
REMOTION_LICENSE_KEY=your_license_key

# Enable debug logging
ENABLE_DEBUG_LOGGING=true

# Max file size in MB
MAX_FILE_SIZE_MB=10
```

### Custom Animation Timing

When using custom preferences, you can specify:
- **Duration**: "over 2 seconds", "for 3s"
- **Timing**: "starting at 2 seconds", "at the end"
- **Stagger**: "one by one", "staggered 0.5 seconds apart"
- **Simultaneous**: "all at once", "simultaneously"
- **Loops**: "pulse continuously", "bounce repeatedly"

Example:
```
"Fade in title (1) over 3 seconds, zoom stats (2,3,4) simultaneously starting at 2s, pulse CTA (5) continuously from 8s to end"
```

## 📈 Performance Tips

### Faster Rendering
- Use simpler images (fewer elements)
- Choose AI auto-animate (faster than custom)
- Close other applications to free RAM
- Use SSD for output directory

### Better Quality
- Start with high-resolution images (1920×1920 or larger)
- Use clear, high-contrast designs
- Avoid overly complex gradients
- Ensure text is readable

## 🗺️ Roadmap

### v1.1 (Planned)
- [ ] MP4/WebM output format
- [ ] Variable duration (5s, 10s, 15s)
- [ ] Animation template library
- [ ] Preview before render

### v1.2 (Planned)
- [ ] Batch processing (multiple images)
- [ ] Brand consistency checker
- [ ] Cloud rendering (Remotion Lambda)
- [ ] Audio track support

### v2.0 (Future)
- [ ] Real-time preview editor
- [ ] Keyframe control
- [ ] Collaborative editing
- [ ] Plugin marketplace integration

## 📚 Resources

- [Remotion Documentation](https://remotion.dev)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [GIF Optimization Guide](https://developers.google.com/speed/docs/insights/OptimizeImages)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 💬 Support

- **GitHub Issues**: [Report a bug](https://github.com/naveedharri/benai-skills/issues)
- **Email**: support@benai.com
- **Documentation**: [Full Skill Documentation](SKILL.md)

## 🎯 Use Cases

- **Social Media Marketing**: Create eye-catching animated posts
- **Content Repurposing**: Turn blog graphics into video content
- **Email Campaigns**: Add animated visuals to newsletters
- **Presentations**: Export slides as animated clips
- **Product Launches**: Announce features with animated infographics
- **Data Visualization**: Bring statistics to life

## ⭐ Examples

Check the `/tests/sample-infographics/` directory for example inputs and outputs.

---

**Made with ❤️ by BenAI**

*Transform your static infographics into engaging animations in seconds.*
