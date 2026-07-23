# Build, Deliver, Iterate (Phases 6-7)

## Contents

- Build the asset
- Output format
- Delivery message
- Iteration support
- Quality checklist

## Build the Asset

1. Generate structure per the structure decision
2. Create content per the content templates
3. Apply the visual design system
4. Ensure all interactive elements work
5. Test responsiveness (if applicable)

## Output Format

**All formats**: Self-contained HTML file
- All CSS inline or in `<style>` tags
- All JS inline or in `<script>` tags
- No external dependencies (except Google Fonts)
- Single file for easy sharing

**File naming**: `[ProspectName]-[format]-[date].html`
- Example: `CentricBrands-workflow-demo-2026-01-28.html`

## Delivery Message

```markdown
## ✓ Asset Created: [Prospect Name]

[View your asset](computer:///path/to/file.html)

---

**Summary**
- **Format**: [Interactive Page / Deck / One-Pager / Workflow Demo]
- **Audience**: [Type and roles]
- **Purpose**: [Goal] → [Desired action]
- **Sections/Steps**: [Count and list]

---

**Deployment Options**

To share this with your customer:
- **Static hosting**: Upload to Netlify, Vercel, GitHub Pages, AWS S3, or any static host
- **Password protection**: Most hosts offer this (e.g., Netlify site protection)
- **Direct share**: Send the HTML file directly, it's fully self-contained
- **Embed**: The file can be iframed into other pages if needed

---

**Customization**

Let me know if you'd like to:
- Adjust colors or styling
- Add, remove, or reorder sections
- Refine any messaging or copy
- Change the flow or architecture (for workflow demos)
- Add more interactive elements
- Export as PDF or static images
```

## Iteration Support

After delivery, be ready to iterate:

| User Request | Action |
|--------------|--------|
| "Change the colors" | Regenerate with new palette, keep content |
| "Add a section on X" | Insert new section, maintain flow |
| "Make it shorter" | Condense, prioritize key points |
| "The flow is wrong" | Rebuild architecture based on correction |
| "Use our brand instead" | Switch from prospect brand to seller brand |
| "Add more detail on step 3" | Expand that section specifically |
| "The research is wrong" (e.g., wrong CEO name) | Take the correction, regenerate with accurate info |
| "Can I get this as a PDF?" | Provide print-optimized version (user can print-to-PDF from the browser) |

**Remember**: Default to prospect's brand colors, but seller can adjust to their own brand or a neutral palette after initial build.

## Quality Checklist

Before delivering, verify:

### Content
- [ ] Prospect company name spelled correctly throughout
- [ ] Leadership names are current (not outdated)
- [ ] Pain points accurately reflect input/transcripts
- [ ] Seller's product accurately represented
- [ ] No placeholder text remaining
- [ ] Proof points are accurate and sourced

### Visual
- [ ] Brand colors applied correctly
- [ ] All text readable (contrast)
- [ ] Animations smooth, not distracting
- [ ] Mobile responsive (if interactive page)
- [ ] Dark theme looks polished

### Functional
- [ ] All tabs/sections load correctly
- [ ] Interactive elements work (calculators, demos)
- [ ] Workflow steps animate properly (if applicable)
- [ ] Navigation is intuitive
- [ ] CTA is clear and clickable

### Professional
- [ ] Tone matches audience
- [ ] Appropriate level of detail for purpose
- [ ] No typos or grammatical errors
- [ ] Feels tailored, not templated
