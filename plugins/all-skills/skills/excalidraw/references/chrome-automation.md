# Chrome Browser Automation for Excalidraw

Step-by-step procedure for injecting Excalidraw slides directly into excalidraw.com via Claude in Chrome.

## Prerequisites

- **Claude in Chrome extension** installed and active
  - If not installed: https://chromewebstore.google.com/detail/claude-in-chrome/anthropic
  - Browser window available

### Checking Extension Availability

Before starting, call `tabs_context_mcp`. If it errors or returns no context, the extension is not available.
 
**If extension unavailable, respond to user:**
```
To create Excalidraw presentations, please install the Claude in Chrome extension:
https://chromewebstore.google.com/detail/claude-in-chrome/anthropic
 
Once installed:
1. Restart Chrome
2. Click the extension icon and connect
3. Try your request again
```
 
Do NOT fall back to creating .excalidraw files. The Chrome injection workflow is required.

---

## The Robust Injection Workflow

### Step 1: Get Tab Context

```
Tool: tabs_context_mcp (createIfEmpty: true)
```

This returns available tabs. If no Excalidraw tab exists, create one:

```
Tool: tabs_create_mcp
```

### Step 2: Navigate to Excalidraw

```
Tool: navigate (tabId: <tab_id>, url: "https://excalidraw.com")
```

Wait for page load, then take a screenshot to assess the current state.

---

## Step 3: Detect Page State & Prepare Canvas

**Critical:** Excalidraw has different states. You MUST detect which one and handle accordingly.

### State Detection via Screenshot

Take a screenshot and check for these indicators:

| State | Visual Indicators | Action Required |
|-------|-------------------|-----------------|
| **Demo/Not Logged In** | Shows "plus.excalidraw.com" banner, desert/welcome scene | Can work directly on canvas |
| **Logged In - File View** | Shows sidebar with files, "New" button visible | Click "New" to create scene |
| **Logged In - Active Scene** | Canvas visible, possibly with sidebar | Hide sidebar, then work |
| **Modal/Dialog Open** | Overlay visible (e.g., settings, export) | Press Escape to dismiss |

### Handle Each State

#### If Demo Mode (Not Logged In):
```javascript
// Good to go - just focus canvas
Tool: computer (action: "left_click", coordinate: [600, 400], tabId: <tab_id>)
```

#### If Logged In with Sidebar/Files Visible:

**Step 3a: Create New Scene (if in file browser)**
```
Tool: computer (action: "left_click", coordinate: [100, 100], tabId: <tab_id>)
// Click "New" or "+" button in top-left area
```

**Step 3b: Hide Sidebar (CRITICAL)**
```javascript
// Use keyboard shortcut to toggle sidebar off
Tool: computer (action: "key", text: "cmd+shift+.", tabId: <tab_id>)
// or on Windows: "ctrl+shift+."
```

Alternatively, use JavaScript to hide it:
```javascript
(async () => {
  // Find and click the sidebar toggle if visible
  const toggle = document.querySelector('[data-testid="main-menu-trigger"]');
  if (toggle) {
    toggle.click();
    await new Promise(r => setTimeout(r, 300));
  }
  // Alternatively, hide by clicking away
  const canvas = document.querySelector('.excalidraw__canvas');
  if (canvas) canvas.focus();
  return "Sidebar handled";
})()
```

**Step 3c: Verify Clean Canvas**
Take another screenshot. You should see:
- Full canvas visible (no sidebar)
- No modals or dialogs
- Canvas is ready

---

## Step 4: Focus Canvas (CRITICAL - Never Skip)

**The clipboard API WILL fail without proper focus.** This is non-negotiable.

```javascript
// ALWAYS run this before any clipboard operation
(async () => {
  // 1. Find the canvas
  const canvas = document.querySelector('.excalidraw__canvas') 
                 || document.querySelector('canvas');
  
  // 2. Dismiss any modals by pressing Escape
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  await new Promise(r => setTimeout(r, 100));
  
  // 3. Focus the canvas
  if (canvas) {
    canvas.focus();
    canvas.click();
  }
  
  // 4. Click center of viewport to ensure focus
  document.elementFromPoint(window.innerWidth/2, window.innerHeight/2)?.click();
  
  await new Promise(r => setTimeout(r, 200));
  return "Canvas focused";
})()
```

Then physically click to be sure:
```
Tool: computer (action: "left_click", coordinate: [600, 400], tabId: <tab_id>)
```

---

## Step 5: The Atomic Inject-and-Paste

**Do NOT separate clipboard write from paste.** They must happen as one atomic sequence.

```javascript
(async () => {
  // === PREPARE ELEMENTS ===
  const elements = [
    // ... all slide elements here
  ];
  
  const clipboardData = {
    type: "excalidraw/clipboard",
    elements: elements,
    files: {}
  };
  
  // === ENSURE FOCUS ===
  const canvas = document.querySelector('.excalidraw__canvas') || document.querySelector('canvas');
  if (canvas) {
    canvas.focus();
    canvas.click();
  }
  await new Promise(r => setTimeout(r, 100));
  
  // === WRITE TO CLIPBOARD ===
  await navigator.clipboard.writeText(JSON.stringify(clipboardData));
  
  // === TRIGGER PASTE IMMEDIATELY ===
  // Use execCommand as backup, or the paste will happen via keyboard next
  document.execCommand('paste');
  
  return "Slide ready - paste now";
})()
```

**Immediately after** the JS returns, send the paste keystroke:
```
Tool: computer (action: "key", text: "cmd+v", tabId: <tab_id>)
```

**Why both?** `execCommand('paste')` sometimes works directly. But the `cmd+v` keystroke is insurance. One of them will work.

---

## Step 6: Verify and Continue

```
Tool: computer (action: "screenshot", tabId: <tab_id>)
```

Check the screenshot:
- Elements visible?
- Positioned correctly?
- Text not clipped?

### Deselect Before Next Slide

Click an empty area to deselect:
```
Tool: computer (action: "left_click", coordinate: [100, 500], tabId: <tab_id>)
```

### Re-Focus Before Each New Slide

**CRITICAL:** Before injecting the next slide, ALWAYS re-run the focus script:
```javascript
(async () => {
  const canvas = document.querySelector('.excalidraw__canvas') || document.querySelector('canvas');
  if (canvas) { canvas.focus(); canvas.click(); }
  await new Promise(r => setTimeout(r, 100));
  return "Ready for next slide";
})()
```

Then inject. This prevents the "Document is not focused" error.

---

## The Complete Per-Slide Sequence

For each slide, execute this exact sequence:

1. **Focus Canvas** (JS + click)
2. **Inject Clipboard Data** (JS with elements)
3. **Paste Keystroke** (cmd+v / ctrl+v)
4. **Screenshot** (verify)
5. **Deselect** (click empty area)

**Never batch steps.** Never assume focus persists between slides.

---

## Error Handling

### "Document is not focused" Error

**Cause:** Clipboard API called without focus.
**Fix:** Run the focus sequence again, then retry injection immediately.

```javascript
// Emergency focus recovery
(async () => {
  document.body.click();
  await new Promise(r => setTimeout(r, 50));
  const canvas = document.querySelector('canvas');
  if (canvas) canvas.click();
  await new Promise(r => setTimeout(r, 100));
  return "Focus recovered";
})()
```

### Elements Not Appearing After Paste

| Symptom | Cause | Fix |
|---------|-------|-----|
| Nothing appears | Elements off-screen | Check x/y are within 0-800, 0-500 range |
| Partial elements | Missing required props | Every element needs: id, seed, version, versionNonce, isDeleted, groupIds, boundElements |
| Text missing | Bad containerId | Bound text must reference existing container id |
| Can't move together | No groupIds | All slide elements need same groupIds value |

### Sidebar Won't Hide

If keyboard shortcut doesn't work:
```javascript
(async () => {
  // Force sidebar closed via localStorage
  localStorage.setItem('excalidraw_sidebar_docked', 'false');
  // Reload may be needed
  return "Sidebar setting updated";
})()
```

### Extension Disconnected

- Inform user to restart Chrome/extension
- Canvas retains all previously pasted content
- Resume from last incomplete slide after reconnection

---

## Multi-Slide Strategy

When injecting multiple slides into one canvas:

1. **Offset each slide's elements** by grid position:
   - Slide 1: x=0, y=0
   - Slide 2: x=900, y=0
   - Slide 3: x=0, y=600
   - Slide 4: x=900, y=600
   
2. **Inject one slide at a time** — clipboard paste replaces previous content

3. **Focus → Inject → Paste → Deselect** for each slide

4. **Increment seeds globally** — no two elements share a seed:
   - Slide 1: seeds 1000-1099
   - Slide 2: seeds 2000-2099
   - etc.

---

## Performance Notes

- Keep each slide under ~30 elements
- Minimize JS payload size — compact JSON, no extra whitespace
- Each inject-paste cycle takes ~2-3 seconds
- For decks >6 slides, batch: inject 1-3, verify, then 4-6
- Always include focus step overhead in timing estimates