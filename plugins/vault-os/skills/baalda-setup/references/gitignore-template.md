# OS files
.DS_Store
Thumbs.db

# Baalda's local state: SQLite index, CRDT store, doc-id map.
# Machine-specific and rebuildable — never commit it.
.context/

# Attachments Baalda syncs on its own (uncomment to keep them out of git)
# attachments/

# Environment and secrets
.env
.env.*
*.key
*.pem

# Private user content (never commit to public repo)
Intelligence/meetings/team-standups/*.md
Intelligence/meetings/client-calls/*.md
Intelligence/meetings/one-on-ones/*.md
Intelligence/meetings/general/*.md
Daily/*.md

# Private folders (uncomment if you use them)
# private/
# journal/
# finance/
# health/

# Node modules (if using any scripts)
node_modules/

# Logs
*.log
