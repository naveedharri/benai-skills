# Troubleshooting

Common issues and solutions when using seomator.

---

## Installation Issues

### Node.js Version Too Old

**Error:** `seomator requires Node.js 18 or higher`

**Solution:**
```bash
# Check current version
node --version

# Update Node.js (using nvm)
nvm install 18
nvm use 18

# Or update globally
npm install -g n && n lts
```

### Global npm Install Permission Errors

**Error:** `EACCES: permission denied` when running `npm install -g @seomator/seo-audit`

**Solutions:**

```bash
# Option 1: Use npx instead (no global install needed)
npx @seomator/seo-audit audit https://example.com --format llm

# Option 2: Fix npm permissions
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @seomator/seo-audit

# Option 3: Use sudo (not recommended)
sudo npm install -g @seomator/seo-audit
```

### Playwright/Chromium Installation Fails

**Error:** Issues installing Chromium for Core Web Vitals

**Solutions:**

```bash
# Install Playwright with Chromium
npx playwright install chromium

# If that fails, try with dependencies
npx playwright install --with-deps chromium

# On Linux, you may need system dependencies
sudo npx playwright install-deps chromium
```

**Workaround:** Skip CWV checks entirely:
```bash
seomator audit https://example.com --format llm --no-cwv
```

---

## Runtime Issues

### Timeouts During Audit

**Error:** `Request timeout` or audit hangs

**Solutions:**

```bash
# Increase timeout (default is 30 seconds)
seomator audit https://example.com --format llm --timeout 60000

# For very slow sites
seomator audit https://example.com --format llm --timeout 120000
```

### Rate Limiting During Crawls

**Error:** `429 Too Many Requests` or audit returns incomplete results

**Solutions:**

```bash
# Reduce concurrency
seomator audit https://example.com --crawl -m 50 --concurrency 2 --format llm

# Add longer timeout between requests
seomator audit https://example.com --crawl -m 50 --concurrency 1 --timeout 60000 --format llm
```

### SSL Certificate Errors

**Error:** `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or `CERT_HAS_EXPIRED`

**Solutions:**

```bash
# For self-signed certificates on staging/dev sites
NODE_TLS_REJECT_UNAUTHORIZED=0 seomator audit https://staging.example.com --format llm
```

**Note:** Only use `NODE_TLS_REJECT_UNAUTHORIZED=0` for trusted internal/staging sites. The security audit category will still flag SSL issues on the target site.

### Sites Blocking Crawlers

**Error:** `403 Forbidden` or empty results

**Possible causes:**
- WAF (Web Application Firewall) blocking automated requests
- robots.txt disallowing the crawler
- IP-based rate limiting
- Cloudflare or similar protection

**Solutions:**
1. Check the site's `robots.txt` — the site may explicitly block crawlers
2. Try auditing a single page instead of crawling
3. Contact the site owner to whitelist the audit tool
4. For your own sites, temporarily adjust WAF rules

### Crawl Interrupted

**Error:** Crawl stopped partway through

**Solution:**
```bash
# Resume from where it stopped
seomator audit https://example.com --crawl -m 100 --format llm --resume
```

---

## Output Issues

### Output Too Large

For large crawls, output can be very long.

**Solutions:**

```bash
# Save to file instead of stdout
seomator audit https://example.com --crawl -m 100 --format llm -o results.md

# Audit fewer categories
seomator audit https://example.com --crawl -m 100 --format llm -c seo,performance,security
```

### Cached Results Showing Old Data

**Error:** Results don't reflect recent site changes

**Solution:**
```bash
# Force fresh audit, ignoring cache
seomator audit https://example.com --format llm --refresh
```

---

## Environment-Specific Issues

### Docker / CI Environments

When running in Docker or CI:

```bash
# Install with all Playwright dependencies
npm install -g @seomator/seo-audit
npx playwright install --with-deps chromium

# Or skip CWV for faster CI runs
seomator audit https://example.com --format json --no-cwv
```

### macOS Specific

On macOS, if Chromium is blocked by Gatekeeper:

```bash
# Allow Chromium to run
xattr -cr ~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app
```

### Windows Specific

On Windows, use PowerShell or Command Prompt (not Git Bash) for best compatibility:

```powershell
npx @seomator/seo-audit audit https://example.com --format llm
```

---

## Getting Help

```bash
# View help
seomator --help
seomator audit --help

# Check system readiness
seomator self doctor

# Check version
seomator --version
```
