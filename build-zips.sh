#!/bin/bash
#
# Builds distributable zip files for BenAI skills.
# Reads marketplace.json, detects all department plugins, and generates:
#
#   dist/extension/                      Claude Code extension (Cursor, VS Code)
#     ├── <department>.zip               One department per zip (marketplace format)
#     └── benai-skills-marketplace.zip   All departments in one zip
#
#   dist/claude/                         Claude Console (platform.claude.com)
#     └── <department>.zip               Flat skill zips (SKILL.md + references)
#
# Usage: ./build-zips.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"
MARKETPLACE="$ROOT/.claude-plugin/marketplace.json"
TMP="$(mktemp -d)"

trap 'rm -rf "$TMP"' EXIT

# Check dependencies
if ! command -v python3 &>/dev/null; then
  echo "Error: python3 is required" >&2
  exit 1
fi

if [ ! -f "$MARKETPLACE" ]; then
  echo "Error: marketplace.json not found at $MARKETPLACE" >&2
  exit 1
fi

# Clean and create dist directories
rm -rf "$DIST"
mkdir -p "$DIST/extension" "$DIST/claude"

# Read plugin names from marketplace.json
PLUGIN_NAMES=$(python3 -c "
import json
with open('$MARKETPLACE') as f:
    data = json.load(f)
for p in data['plugins']:
    print(p['name'])
")

echo "Found department plugins:"
echo "$PLUGIN_NAMES" | while read -r name; do
  echo "  - $name"
done
echo ""

# =============================================================
# EXTENSION ZIPS (Claude Code / Cursor / VS Code)
# Structure: .claude-plugin/marketplace.json + skills/ + commands/
# With strict:false, source is "./" so we include the referenced
# skills and commands for each department.
# =============================================================
echo "--- Building extension zips ---"

echo "$PLUGIN_NAMES" | while read -r name; do
  staging="$TMP/ext-$name"
  rm -rf "$staging"
  mkdir -p "$staging/.claude-plugin" "$staging/plugins" "$staging/commands"

  # Get skill and command paths for this plugin
  SKILL_PATHS=$(python3 -c "
import json
with open('$MARKETPLACE') as f:
    data = json.load(f)
plugin = next(p for p in data['plugins'] if p['name'] == '$name')
for s in plugin.get('skills', []):
    print(s)
")

  CMD_PATHS=$(python3 -c "
import json
with open('$MARKETPLACE') as f:
    data = json.load(f)
plugin = next(p for p in data['plugins'] if p['name'] == '$name')
for c in plugin.get('commands', []):
    print(c)
")

  # Copy referenced skills
  SKILL_COUNT=0
  echo "$SKILL_PATHS" | while read -r skill_path; do
    [ -z "$skill_path" ] && continue
    if [ -d "$ROOT/$skill_path" ]; then
      cp -R "$ROOT/$skill_path" "$staging/$skill_path"
    fi
  done

  # Copy referenced commands
  echo "$CMD_PATHS" | while read -r cmd_path; do
    [ -z "$cmd_path" ] && continue
    if [ -f "$ROOT/$cmd_path" ]; then
      cp "$ROOT/$cmd_path" "$staging/$cmd_path"
    fi
  done

  # Generate a marketplace.json with this department only
  python3 -c "
import json
with open('$MARKETPLACE') as f:
    data = json.load(f)
envelope = {k: v for k, v in data.items() if k != 'plugins'}
envelope['name'] = data['name'] + '-$name'
plugin = next(p for p in data['plugins'] if p['name'] == '$name')
envelope['plugins'] = [plugin]
with open('$staging/.claude-plugin/marketplace.json', 'w') as f:
    json.dump(envelope, f, indent=2)
    f.write('\n')
"

  # Remove .gitkeep files and empty directories
  find "$staging" -name ".gitkeep" -delete 2>/dev/null || true
  find "$staging" -type d -empty -delete 2>/dev/null || true

  # Create zip
  (cd "$staging" && zip -r "$DIST/extension/$name.zip" . > /dev/null 2>&1)
  SIZE=$(du -h "$DIST/extension/$name.zip" | cut -f1 | xargs)
  SKILL_COUNT=$(find "$staging/plugins" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | xargs)
  echo "  Created extension/$name.zip ($SIZE) — $SKILL_COUNT skills"

  rm -rf "$staging"
done

# Full marketplace zip
(cd "$ROOT" && zip -r "$DIST/extension/benai-skills-marketplace.zip" .claude-plugin/marketplace.json plugins/ commands/ -x "*/\.*" > /dev/null 2>&1)
SIZE=$(du -h "$DIST/extension/benai-skills-marketplace.zip" | cut -f1 | xargs)
echo "  Created extension/benai-skills-marketplace.zip ($SIZE)"

# =============================================================
# CLAUDE CONSOLE ZIPS (platform.claude.com)
# Structure: flat — each skill as top-level folder (SKILL.md + references)
# =============================================================
echo ""
echo "--- Building Claude Console zips ---"

echo "$PLUGIN_NAMES" | while read -r name; do
  staging="$TMP/claude-$name"
  rm -rf "$staging"
  mkdir -p "$staging"

  # Get skill paths for this plugin
  SKILL_PATHS=$(python3 -c "
import json
with open('$MARKETPLACE') as f:
    data = json.load(f)
plugin = next(p for p in data['plugins'] if p['name'] == '$name')
for s in plugin.get('skills', []):
    print(s)
")

  # Copy each skill as a top-level folder
  echo "$SKILL_PATHS" | while read -r skill_path; do
    [ -z "$skill_path" ] && continue
    skill_dir="$ROOT/$skill_path"
    skill_name=$(basename "$skill_path")
    if [ -f "$skill_dir/SKILL.md" ]; then
      mkdir -p "$staging/$skill_name"
      cp -R "$skill_dir"/* "$staging/$skill_name/" 2>/dev/null || true
      cp -R "$skill_dir"/.[!.]* "$staging/$skill_name/" 2>/dev/null || true

      # Remove .gitkeep files and empty directories
      find "$staging/$skill_name" -name ".gitkeep" -delete 2>/dev/null || true
      find "$staging/$skill_name" -type d -empty -delete 2>/dev/null || true
    fi
  done

  # Create zip with skill folders as top-level entries
  (cd "$staging" && zip -r "$DIST/claude/$name.zip" . > /dev/null 2>&1)
  SIZE=$(du -h "$DIST/claude/$name.zip" | cut -f1 | xargs)
  SKILL_COUNT=$(find "$staging" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | xargs)
  echo "  Created claude/$name.zip ($SIZE) — $SKILL_COUNT skills"

  rm -rf "$staging"
done

echo ""
echo "Done. All zips in $DIST/"
echo "  extension/   — for Claude Code, Cursor, VS Code"
echo "  claude/      — for Claude Console (platform.claude.com)"
