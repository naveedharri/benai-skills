# Pattern Bank Guide

The pattern bank (`.infographic-patterns.json`) stores learned user preferences to speed up future sessions and provide personalized defaults.

---

## Purpose

The pattern bank:
- Remembers user's style preferences across sessions
- Tracks common choices (metaphors, platforms, tones)
- Records feedback (what they liked, what they changed)
- Enables pre-filling of questions in future sessions
- Learns which questions can be skipped vs. must be asked

---

## File Location

```
.infographic-patterns.json
```

Stored in the user's working directory alongside `.infographic-brand.json`.

---

## Schema

```json
{
  "learnedPreferences": {
    "titleStyle": "bold-large | elegant-thin | handwritten | all-caps",
    "textDensity": "minimal | moderate | detailed",
    "iconUsage": true | false,
    "colorTone": "warm | cool | neutral",
    "layoutStyle": "centered | asymmetric | top-heavy",
    "whitespacePreference": "generous | moderate | compact",
    "borderStyle": "thin | none | rounded",
    "visualElements": "icons | illustrations | text-only"
  },
  "commonChoices": {
    "metaphors": ["iceberg", "pyramid", "timeline"],
    "platforms": ["linkedin", "instagram"],
    "tones": ["professional", "playful"]
  },
  "feedback": [
    {
      "session": "2026-02-06",
      "liked": ["bold title", "minimal text", "blue palette"],
      "changed": ["made colors warmer", "added more whitespace"]
    },
    {
      "session": "2026-02-10",
      "liked": ["iceberg metaphor", "clean layout"],
      "changed": ["simplified labels"]
    }
  ],
  "sessionCount": 5,
  "lastUpdated": "2026-02-10T14:30:00Z"
}
```

---

## Field Definitions

### learnedPreferences

Explicit preferences derived from user choices:

| Field | Values | Derived From |
|-------|--------|--------------|
| `titleStyle` | bold-large, elegant-thin, handwritten, all-caps | Phase 5 title treatment choice |
| `textDensity` | minimal, moderate, detailed | Phase 5 text density choice |
| `iconUsage` | true, false | Phase 5 visual elements choice |
| `colorTone` | warm, cool, neutral | Analysis of chosen colors |
| `layoutStyle` | centered, asymmetric, top-heavy | Phase 5 hierarchy choice |
| `whitespacePreference` | generous, moderate, compact | Feedback patterns |
| `borderStyle` | thin, none, rounded | Phase 5 border choice |
| `visualElements` | icons, illustrations, text-only | Phase 5 elements choice |

### commonChoices

Frequency-based tracking of selections:

| Field | Purpose |
|-------|---------|
| `metaphors` | Most frequently chosen visualization types |
| `platforms` | Platforms user typically targets |
| `tones` | Visual tones user prefers |

Arrays are ordered by frequency (most common first).

### feedback

History of session-level feedback:

| Field | Purpose |
|-------|---------|
| `session` | ISO date of the session |
| `liked` | Things the user approved without changes |
| `changed` | Modifications requested during Phase 7 |

Keep the last 10 sessions to avoid file bloat.

---

## Reading the Pattern Bank

At skill load (Phase 0), check for and load patterns:

```bash
if [ -f .infographic-patterns.json ]; then
  cat .infographic-patterns.json
fi
```

Parse the JSON to understand:
- Which preferences are established (high confidence)
- Which choices are variable (low confidence)
- Recent feedback trends

---

## Using Patterns to Pre-Fill Questions

### High-Confidence Patterns (3+ consistent choices)

If a preference appears consistently across 3+ sessions, propose it as the default:

```
Based on your history, I'll use:
- Bold titles (you've chosen this 4/5 times)
- Minimal text (3-5 labels)
- Professional tone

Sound good, or would you like to adjust?
```

Use `AskUserQuestion`:
```
question: "Use your usual style preferences?"
header: "Style"
options:
  - label: "Yes, use my preferences (Recommended)"
    description: "Bold titles, minimal text, professional tone"
  - label: "Start fresh"
    description: "I want to choose everything this time"
```

### Medium-Confidence Patterns (2 consistent choices)

Mention but don't assume:

```
I noticed you often use icebergs for this type of content.
Want to try that again, or explore other options?
```

### Low-Confidence Patterns (1 or inconsistent)

Don't pre-fill. Ask the question normally.

---

## Updating the Pattern Bank

### After Each Session (Phase 8)

Update the pattern bank with new data:

1. **Update learnedPreferences** with this session's choices
2. **Add to commonChoices** arrays (maintain frequency order)
3. **Append to feedback** array
4. **Increment sessionCount**
5. **Update lastUpdated timestamp**

### Writing the Updated File

```bash
cat > .infographic-patterns.json <<'EOF'
{
  "learnedPreferences": {
    "titleStyle": "bold-large",
    "textDensity": "minimal",
    "iconUsage": true,
    "colorTone": "warm",
    "layoutStyle": "centered",
    "whitespacePreference": "generous",
    "borderStyle": "none",
    "visualElements": "icons"
  },
  "commonChoices": {
    "metaphors": ["iceberg", "pyramid"],
    "platforms": ["linkedin"],
    "tones": ["professional"]
  },
  "feedback": [
    {
      "session": "2026-02-06",
      "liked": ["bold title", "iceberg"],
      "changed": ["warmer colors"]
    }
  ],
  "sessionCount": 1,
  "lastUpdated": "2026-02-06T10:30:00Z"
}
EOF
```

---

## When to Ask vs. Assume

### Always Ask (Never Assume)

- **Core insight extraction** — Content is always unique
- **Platform choice** — May vary per project
- **Exact text content** — Titles, labels, etc.
- **Content mapping** — How content maps to metaphor

### Can Pre-Fill After 3+ Sessions

- Title style (bold/elegant/handwritten)
- Text density (minimal/moderate/detailed)
- Visual elements (icons/illustrations/text-only)
- Border style
- Visual tone

### Can Skip After 5+ Consistent Sessions

- If user has chosen "professional" tone 5 times in a row, don't ask about tone — just confirm: "Using your usual professional tone."

---

## Handling Pattern Conflicts

When patterns suggest conflicting preferences:

```
I've noticed you sometimes prefer bold titles and sometimes elegant ones.
Which fits this project better?
```

Present as `AskUserQuestion` with the two options plus "Something else."

---

## Resetting Patterns

If user wants to start fresh:

```bash
rm .infographic-patterns.json
```

Or offer in Phase 8:
```
question: "Reset your saved preferences?"
header: "Reset"
options:
  - label: "Keep my preferences"
    description: "Continue building on what I've learned"
  - label: "Reset everything"
    description: "Start fresh, forget my patterns"
```

---

## Privacy Considerations

The pattern bank is:
- Stored locally in the user's working directory
- Not transmitted anywhere
- Fully under user control
- Can be deleted anytime

Inform users:
```
Your preferences are stored locally in .infographic-patterns.json.
You can view, edit, or delete this file anytime.
```
