# Configuration Guide

How to configure seomator for your projects using `seomator.toml` and CLI flags.

---

## Quick Start

```bash
# Generate a default config file
seomator init
```

This creates `seomator.toml` in your current directory.

---

## Configuration File Format

`seomator.toml` uses the TOML format:

```toml
# seomator.toml

[audit]
format = "llm"
timeout = 30000
no-cwv = false

[crawl]
enabled = false
max-pages = 10
concurrency = 5

[categories]
include = []  # Empty = all categories
# include = ["seo", "performance", "links"]

[output]
save = false
# file = "audit-results.md"
```

---

## Configuration Sections

### `[audit]` — General Audit Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `format` | string | `"console"` | Output format (`llm`, `json`, `html`, `markdown`, `console`) |
| `timeout` | integer | `30000` | Request timeout in milliseconds |
| `no-cwv` | boolean | `false` | Skip Core Web Vitals checks |
| `verbose` | boolean | `false` | Enable verbose output |

### `[crawl]` — Crawl Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `false` | Enable multi-page crawling |
| `max-pages` | integer | `10` | Maximum pages to crawl |
| `concurrency` | integer | `5` | Concurrent requests |

### `[categories]` — Category Selection

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `include` | array | `[]` | Categories to audit (empty = all) |

### `[output]` — Output Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `save` | boolean | `false` | Save to local database |
| `file` | string | `""` | Output file path |

---

## Custom Category Selection

Audit only specific categories using the `-c` flag or config:

```bash
# CLI flag
seomator audit https://example.com -c seo,performance,links --format llm

# Config file
[categories]
include = ["seo", "performance", "links"]
```

### Available Categories

`seo`, `performance`, `links`, `images`, `security`, `technical`, `crawlability`, `structured-data`, `accessibility`, `content`, `social`, `eeat`, `url-structure`, `mobile`, `i18n`, `legal`

---

## Crawl Configuration

### Basic Crawl

```bash
seomator audit https://example.com --crawl -m 50 --format llm
```

### Optimized Crawl for Large Sites

```toml
[crawl]
enabled = true
max-pages = 100
concurrency = 3  # Lower for rate-limited sites

[audit]
timeout = 60000  # Higher timeout for slow pages
no-cwv = true    # Skip CWV for speed during crawl
```

### Resume Interrupted Crawls

```bash
# Start a large crawl
seomator audit https://example.com --crawl -m 500 --format llm --save

# If interrupted, resume from where it stopped
seomator audit https://example.com --crawl -m 500 --format llm --resume
```

---

## Output File Saving

### Save to File

```bash
# Save to specific file
seomator audit https://example.com --format llm -o report.md

# Save to database for tracking
seomator audit https://example.com --format llm --save
```

### Config File Version

```toml
[output]
save = true
file = "seo-audit-results.md"
```

---

## Presets

Common configuration patterns:

### Default (General Purpose)

```toml
[audit]
format = "llm"
no-cwv = false

[crawl]
enabled = false
```

### Blog

```toml
[audit]
format = "llm"
no-cwv = true

[categories]
include = ["seo", "content", "links", "social", "eeat", "structured-data"]
```

### E-commerce

```toml
[audit]
format = "llm"
no-cwv = false

[categories]
include = ["seo", "performance", "security", "structured-data", "mobile", "images", "legal"]

[crawl]
enabled = true
max-pages = 50
```

### CI/CD Pipeline

```toml
[audit]
format = "json"
no-cwv = true
timeout = 15000

[categories]
include = ["seo", "performance", "security", "accessibility"]

[crawl]
enabled = false
```

---

## Priority of Configuration

Configuration is merged in this order (later overrides earlier):

1. **Built-in defaults**
2. **Config file** (`seomator.toml`)
3. **CLI flags** (highest priority)

Example: If your config file sets `format = "json"` but you pass `--format llm` on the CLI, the output will be `llm`.

---

## Config File Location

By default, seomator looks for `seomator.toml` in the current working directory. Use `--config` to specify a different path:

```bash
seomator audit https://example.com --config /path/to/custom-config.toml
```
