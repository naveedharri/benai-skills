#!/usr/bin/env node
/*
 * Lantern-style design-system renderer.
 *
 * Takes any SVG file(s) and renders them to high-quality JPG + PNG using the
 * Chromium installed by Playwright. Used by the design-system-creator skill
 * to rasterize logo lockups and asset templates.
 *
 * Usage:
 *   node render.mjs <svg-path> [<svg-path> ...]
 *
 *   Or with explicit dimensions (width×height) and optional background:
 *   node render.mjs path/to/logo.svg --width 1600 --height 400 --bg "#FBFAF7"
 *
 * Produces: <svg-path-without-extension>.jpg and .png alongside the input.
 *
 * Prerequisites (installed once per project):
 *   npm install playwright
 *   npx playwright install chromium
 */

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

// ── Argument parsing ──────────────────────────────────────────
const args = process.argv.slice(2);
const svgPaths = [];
let width = null;
let height = null;
let bg = '#FBFAF7';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--width')       { width = parseInt(args[++i], 10); }
  else if (a === '--height') { height = parseInt(args[++i], 10); }
  else if (a === '--bg')     { bg = args[++i]; }
  else if (a.endsWith('.svg')) { svgPaths.push(a); }
}

if (svgPaths.length === 0) {
  console.error('Usage: node render.mjs <svg-path> [--width N] [--height N] [--bg #RRGGBB]');
  process.exit(1);
}

// ── Infer default dimensions from the SVG's viewBox if not provided ──
async function inferDimensions(svgPath) {
  if (width && height) return { width, height };
  const content = await fs.readFile(svgPath, 'utf8');
  const vbMatch = content.match(/viewBox="([\d.\s-]+)"/);
  if (vbMatch) {
    const [, , w, h] = vbMatch[1].trim().split(/\s+/).map(Number);
    // Scale up 2x for crisp renders
    return { width: (width || w * 2), height: (height || h * 2) };
  }
  // fallback
  return { width: width || 1200, height: height || 630 };
}

// ── Rendering ─────────────────────────────────────────────────
const browser = await chromium.launch();

for (const svgPath of svgPaths) {
  const svg = await fs.readFile(svgPath, 'utf8');
  const { width: w, height: h } = await inferDimensions(svgPath);
  const base = svgPath.replace(/\.svg$/, '');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; background: ${bg}; }
  body {
    width: ${w}px; height: ${h}px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  svg { width: 100%; height: 100%; display: block; }
</style>
</head>
<body>${svg}</body>
</html>`;

  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${base}.png`, type: 'png' });
  await page.screenshot({ path: `${base}.jpg`, type: 'jpeg', quality: 92 });
  console.log(`✓ rendered ${path.basename(svgPath)} → ${base}.png + .jpg (${w}×${h})`);

  await ctx.close();
}

await browser.close();
