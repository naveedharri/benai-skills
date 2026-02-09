---
name: qa-testing
description: Quality assurance testing before user preview - test all sections automatically
metadata:
  tags: video, testing, qa, validation, remotion
---

# QA Testing

**ALWAYS run QA tests before asking the user to preview or approve content.**

This ensures all video clips, captions, and compositions work correctly before wasting the user's time.

---

## When to Run QA

Run QA testing after:
- Setting up a new Remotion project
- Adding or modifying video files
- Generating new caption files
- Making changes to compositions
- Before asking user to preview in Remotion Studio

---

## QA Checklist

### 1. Verify Files Exist

```bash
# Check video files
ls -la public/*.mp4

# Check caption files
ls -la public/*.captions.json

# Verify file sizes (should not be 0)
find public -name "*.mp4" -size 0
find public -name "*.captions.json" -size 0
```

### 2. Validate Caption Format

```bash
# Check each caption file has valid JSON with required fields
node -e "
const fs = require('fs');
const files = fs.readdirSync('public').filter(f => f.endsWith('.captions.json'));
for (const file of files) {
  const data = JSON.parse(fs.readFileSync('public/' + file));
  const valid = Array.isArray(data) && data.length > 0 &&
    data[0].hasOwnProperty('text') &&
    data[0].hasOwnProperty('startMs') &&
    data[0].hasOwnProperty('endMs');
  console.log(file + ': ' + (valid ? '✅ Valid' : '❌ Invalid'));
}
"
```

### 3. Test Render Each Section

Test render a few frames from each major section to catch errors early:

```bash
# Create test output directory
mkdir -p out/qa-tests

# Test teaser section (first 10 frames)
npx remotion render FinalVideo --frames=0-10 out/qa-tests/test-teaser.mp4

# Test intro section (after teaser ends)
npx remotion render FinalVideo --frames=650-660 out/qa-tests/test-intro.mp4

# Test each part at different points
npx remotion render FinalVideo --frames=2700-2710 out/qa-tests/test-part1.mp4
npx remotion render FinalVideo --frames=10000-10010 out/qa-tests/test-part2.mp4
npx remotion render FinalVideo --frames=20000-20010 out/qa-tests/test-part3.mp4

# Test TeaserOnly composition
npx remotion render TeaserOnly --frames=0-30 out/qa-tests/test-teaser-only.mp4
```

### 4. Check for Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `inputRange must be strictly monotonically increasing` | Small durationInFrames in interpolate() | Ensure fadeFrames < durationInFrames/2 |
| `404 file not found` | Symlinks not working | Copy actual files to public/ |
| `Could not extract frame` | Video file corrupted or missing | Re-copy video files |
| `Failed to load captions` | Invalid JSON or missing file | Re-run transcription |

---

## Automated QA Script

Save as `scripts/qa-test.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Running QA Tests..."
echo ""

# 1. Check files exist
echo "📁 Checking files..."
for f in intro part1 part2 part3; do
  if [ -f "public/$f.mp4" ]; then
    echo "  ✅ public/$f.mp4"
  else
    echo "  ❌ public/$f.mp4 MISSING"
    exit 1
  fi

  if [ -f "public/$f.captions.json" ]; then
    echo "  ✅ public/$f.captions.json"
  else
    echo "  ❌ public/$f.captions.json MISSING"
    exit 1
  fi
done
echo ""

# 2. Test renders
echo "🎬 Test rendering sections..."
mkdir -p out/qa-tests

echo "  Testing teaser..."
npx remotion render FinalVideo --frames=0-10 out/qa-tests/teaser.mp4 --log=error

echo "  Testing intro..."
npx remotion render FinalVideo --frames=650-660 out/qa-tests/intro.mp4 --log=error

echo "  Testing part1..."
npx remotion render FinalVideo --frames=2700-2710 out/qa-tests/part1.mp4 --log=error

echo "  Testing part2..."
npx remotion render FinalVideo --frames=10000-10010 out/qa-tests/part2.mp4 --log=error

echo "  Testing part3..."
npx remotion render FinalVideo --frames=20000-20010 out/qa-tests/part3.mp4 --log=error

echo ""
echo "✅ All QA tests passed!"
echo ""
echo "Ready for preview at http://localhost:3000"
```

Run with: `bash scripts/qa-test.sh`

---

## QA Test Results Format

When reporting QA results to user:

```
## QA Tests Passed ✅

| Section | Frames Tested | Status |
|---------|---------------|--------|
| Teaser | 0-10 | ✅ |
| Intro | 650-660 | ✅ |
| Part 1 | 2700-2710 | ✅ |
| Part 2 | 10000-10010 | ✅ |
| Part 3 | 20000-20010 | ✅ |

**Ready for preview at http://localhost:3000**
```

---

## Fixing Common Issues

### Symlinks Not Working

Remotion bundler doesn't follow symlinks. Copy actual files:

```bash
# Remove symlinks
rm -f public/*.mp4

# Copy actual files
cp "/path/to/source/video.mp4" public/video.mp4
```

### interpolate() Monotonic Error

When durationInFrames is small, the fade animation breaks. Fix:

```tsx
// Before (broken when durationInFrames < fadeFrames * 2)
const fadeFrames = Math.round(0.2 * fps);
const opacity = interpolate(frame,
  [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
  [0, 1, 1, 0]
);

// After (safe)
const maxFade = Math.floor(durationInFrames / 2) - 1;
const fadeFrames = Math.min(Math.round(0.2 * fps), Math.max(0, maxFade));
const opacity = durationInFrames > 4 ? interpolate(frame,
  [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
  [0, 1, 1, 0]
) : 1;
```

### Caption File Invalid

Re-run transcription:

```bash
# Delete invalid caption file
rm public/video.captions.json

# Re-transcribe
npx ts-node scripts/transcribe-fast.ts
```

---

## Integration with Workflow

In the intelligent editing workflow:

1. **Analyze** - Examine videos
2. **Transcribe** - Generate captions
3. **Setup** - Create Remotion project
4. **QA Test** - Run automated tests ← **NEW**
5. **Preview** - Only after QA passes
6. **Iterate** - Refine based on feedback
7. **Render** - Final output
