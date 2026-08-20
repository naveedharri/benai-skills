# Privacy: Files and folders Claude should NOT read or access
# Add paths here for sensitive content

# Baalda internals — index, CRDT store, doc-id map. Never read or edit these.
.context/

# Credentials and secrets
.env
.env.*
*.key
*.pem
credentials/
secrets/

# Private journals (if you keep one)
# private/
# journal/

# Financial documents
# finance/

# Health records
# health/

# Client confidential data
# confidential/
