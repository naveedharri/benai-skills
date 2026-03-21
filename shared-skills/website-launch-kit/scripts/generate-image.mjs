#!/usr/bin/env node
/**
 * generate-image.mjs — Direct Gemini Imagen API image generation
 *
 * Fallback for when Nano Banana MCP is not installed.
 * Reads GEMINI_API_KEY from .env or environment variable.
 *
 * Usage:
 *   node generate-image.mjs --prompt "A dark knowledge graph..." --output public/images/hero.png
 *   node generate-image.mjs --prompt "..." --output hero.png --aspect 16:9
 *
 * Options:
 *   --prompt   (required)  Image generation prompt
 *   --output   (required)  Output file path (png)
 *   --aspect   (optional)  Aspect ratio hint added to prompt (e.g. "16:9", "1:1")
 *   --model    (optional)  Imagen model (default: imagen-4.0-fast-generate-001)
 */

import fs from "fs";
import path from "path";
import https from "https";

// ─── Parse args ───────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--prompt" && args[i + 1]) parsed.prompt = args[++i];
    else if (args[i] === "--output" && args[i + 1]) parsed.output = args[++i];
    else if (args[i] === "--aspect" && args[i + 1]) parsed.aspect = args[++i];
    else if (args[i] === "--model" && args[i + 1]) parsed.model = args[++i];
  }
  if (!parsed.prompt || !parsed.output) {
    console.error("Usage: node generate-image.mjs --prompt '...' --output path.png [--aspect 16:9] [--model ...]");
    process.exit(1);
  }
  return parsed;
}

// ─── Load API key ─────────────────────────────────────────────────────────────
function loadApiKey() {
  // 1. Environment variable
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // 2. .env file in cwd
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^GEMINI_API_KEY\s*=\s*(.+)$/);
      if (match) return match[1].trim();
    }
  }

  // 3. .env in parent directories (up to 3 levels)
  let dir = process.cwd();
  for (let i = 0; i < 3; i++) {
    dir = path.dirname(dir);
    const parentEnv = path.join(dir, ".env");
    if (fs.existsSync(parentEnv)) {
      const lines = fs.readFileSync(parentEnv, "utf-8").split("\n");
      for (const line of lines) {
        const match = line.match(/^GEMINI_API_KEY\s*=\s*(.+)$/);
        if (match) return match[1].trim();
      }
    }
  }

  return null;
}

// ─── Load model preference ───────────────────────────────────────────────────
function loadModel() {
  // Check env or .env for GEMINI_IMAGE_MODEL
  if (process.env.GEMINI_IMAGE_MODEL) return process.env.GEMINI_IMAGE_MODEL;

  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^GEMINI_IMAGE_MODEL\s*=\s*(.+)$/);
      if (match) return match[1].trim();
    }
  }
  return null;
}

// ─── HTTPS POST ───────────────────────────────────────────────────────────────
function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ─── Detect which Imagen models are available ─────────────────────────────────
async function detectModel(apiKey) {
  return new Promise((resolve) => {
    https.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(d);
            const imagenModels = j.models
              .filter((m) => m.name.includes("imagen") && (m.supportedGenerationMethods || []).includes("predict"))
              .map((m) => m.name.replace("models/", ""));

            // Preference order: imagen-4.0-fast > imagen-4.0-generate > any imagen
            const fast = imagenModels.find((m) => m.includes("fast"));
            const standard = imagenModels.find((m) => m.includes("generate") && !m.includes("fast") && !m.includes("ultra"));
            resolve(fast || standard || imagenModels[0] || "imagen-4.0-fast-generate-001");
          } catch {
            resolve("imagen-4.0-fast-generate-001");
          }
        });
      }
    ).on("error", () => resolve("imagen-4.0-fast-generate-001"));
  });
}

// ─── Generate image via Gemini Imagen API (predict endpoint) ──────────────────
async function generateWithImagen(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
  const body = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1 },
  };

  const res = await httpsPost(url, body);
  if (res.status !== 200) {
    const err = JSON.parse(res.body);
    throw new Error(`Imagen API error ${res.status}: ${err?.error?.message || res.body.slice(0, 200)}`);
  }

  const json = JSON.parse(res.body);
  const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("No image data in Imagen response");
  return Buffer.from(b64, "base64");
}

// ─── Generate image via Gemini generateContent (flash-image models) ───────────
async function generateWithFlash(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  };

  const res = await httpsPost(url, body);
  if (res.status !== 200) {
    const err = JSON.parse(res.body);
    throw new Error(`Flash API error ${res.status}: ${err?.error?.message || res.body.slice(0, 200)}`);
  }

  const json = JSON.parse(res.body);
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
  if (!imgPart) throw new Error("No image in Flash response");
  return Buffer.from(imgPart.inlineData.data, "base64");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { prompt, output, aspect, model: cliModel } = parseArgs();
  const apiKey = loadApiKey();

  if (!apiKey) {
    console.error("ERROR: No GEMINI_API_KEY found.");
    console.error("Add it to your .env file: GEMINI_API_KEY=your-key-here");
    console.error("Get a free key at: https://aistudio.google.com/apikey");
    process.exit(1);
  }

  // Build final prompt with aspect ratio hint
  let finalPrompt = prompt;
  if (aspect) finalPrompt += ` Output as ${aspect} aspect ratio.`;

  // Determine model
  const envModel = loadModel();
  let model = cliModel || envModel;

  // If no model specified, auto-detect
  if (!model) {
    process.stderr.write("Detecting available models... ");
    model = await detectModel(apiKey);
    process.stderr.write(`using ${model}\n`);
  }

  // Route to correct API based on model type
  process.stderr.write(`Generating image with ${model}...\n`);

  let buffer;
  const isFlashModel = model.includes("flash") || model.includes("pro-image") || model.includes("gemini-3");
  try {
    if (isFlashModel) {
      buffer = await generateWithFlash(apiKey, model, finalPrompt);
    } else {
      buffer = await generateWithImagen(apiKey, model, finalPrompt);
    }
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }

  // Ensure output directory exists
  const outDir = path.dirname(output);
  if (outDir && outDir !== "." && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(output, buffer);
  console.log(output);
}

main();
