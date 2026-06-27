# CLI Reference — All Commands & Flags

Complete documentation for the `seomator` command-line tool (`@seomator/seo-audit`).

---

## Installation

```bash
# Global install (recommended)
npm install -g @seomator/seo-audit

# Or use npx without installing
npx @seomator/seo-audit audit <url> --format llm
```

**Requirements:** Node.js 18+

---

## Commands

### `seomator audit <url>`

Run an SEO audit on a URL.

```bash
seomator audit https://example.com
```

**Arguments:**

| Argument | Description |
|----------|-------------|
| `<url>` | Target URL to audit (required) |

**Flags:**

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--format <type>` | | Output format: `llm`, `json`, `html`, `markdown`, `console` | `console` |
| `--crawl` | | Enable multi-page crawling from the starting URL | Off |
| `-m <number>` | | Maximum pages to crawl (requires `--crawl`) | 10 |
| `--no-cwv` | | Skip Core Web Vitals checks (no Playwright needed) | CWV enabled |
| `-c <categories>` | | Comma-separated list of categories to audit | All categories |
| `--concurrency <n>` | | Number of concurrent requests during crawl | 5 |
| `--timeout <ms>` | | Request timeout in milliseconds | 30000 |
| `-v` | | Verbose output — show detailed progress | Off |
| `--refresh` | | Force re-audit, ignore cached results | Off |
| `--resume` | | Resume a previously interrupted crawl | Off |
| `-o <file>` | | Save output to file | stdout |
| `--save` | | Save results to local audit database | Off |
| `--config <path>` | | Path to custom config file | `./seomator.toml` |

**Examples:**

```bash
# Quick audit without Core Web Vitals
seomator audit https://example.com --format llm --no-cwv

# Full audit with CWV
seomator audit https://example.com --format llm

# Crawl up to 50 pages
seomator audit https://example.com --crawl -m 50 --format llm

# Audit specific categories only
seomator audit https://example.com --format llm -c seo,performance,links

# Save results to file
seomator audit https://example.com --format llm -o audit-report.md

# Save to database for tracking over time
seomator audit https://example.com --format llm --save

# Verbose mode for debugging
seomator audit https://example.com --format llm -v

# Custom timeout for slow sites
seomator audit https://example.com --format llm --timeout 60000

# Resume interrupted crawl
seomator audit https://example.com --crawl -m 100 --format llm --resume
```

---

### `seomator init`

Create a `seomator.toml` configuration file in the current directory.

```bash
seomator init
```

Creates a default config file you can customize. See [Configuration Guide](configuration-guide.md) for details.

---

### `seomator self doctor`

Verify system readiness and check dependencies.

```bash
seomator self doctor
```

Checks:
- Node.js version (18+ required)
- Playwright/Chromium installation (for CWV)
- Network connectivity
- Available disk space

---

### `seomator config --list`

Display current configuration settings.

```bash
seomator config --list
```

Shows merged configuration from defaults + config file + CLI flags.

---

### `seomator report --list`

List previously saved audit reports.

```bash
seomator report --list
```

Shows reports saved with `--save` flag, with timestamps and URLs.

---

### `seomator db stats`

Display audit database statistics.

```bash
seomator db stats
```

Shows number of audits, total pages scanned, date range, and database size.

---

## Output Formats

### `--format llm` (Recommended for AI)

Purpose-built for AI/LLM consumption. 50-70% smaller than JSON while retaining all actionable data. Structured text format optimized for parsing by language models.

### `--format json`

Full structured JSON output. Best for programmatic processing, CI/CD pipelines, or custom tooling.

### `--format html`

Self-contained HTML report. Shareable, viewable in any browser. Includes charts and visual indicators.

### `--format markdown`

Markdown-formatted report. Good for embedding in documentation, READMEs, or wikis.

### `--format console`

Human-readable terminal output with color coding. Default format when no `--format` is specified.

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Audit passed — no critical issues found |
| `1` | Audit failed — critical issues detected |
| `2` | Error — audit could not complete (network error, invalid URL, etc.) |

Use exit codes in CI/CD pipelines:

```bash
seomator audit https://example.com --format json --no-cwv
if [ $? -eq 1 ]; then
  echo "SEO audit failed — critical issues found"
  exit 1
fi
```

---

## Category Names for `-c` Flag

Use these names with the `-c` flag to audit specific categories:

| Category Flag | Full Name |
|---------------|-----------|
| `seo` | Core SEO |
| `performance` | Performance |
| `links` | Links |
| `images` | Images |
| `security` | Security |
| `technical` | Technical SEO |
| `crawlability` | Crawlability |
| `structured-data` | Structured Data |
| `accessibility` | Accessibility |
| `content` | Content |
| `social` | Social |
| `eeat` | E-E-A-T |
| `url-structure` | URL Structure |
| `mobile` | Mobile |
| `i18n` | Internationalization |
| `legal` | Legal Compliance |

**Multiple categories:** Comma-separated, no spaces:

```bash
seomator audit https://example.com -c seo,performance,security --format llm
```
