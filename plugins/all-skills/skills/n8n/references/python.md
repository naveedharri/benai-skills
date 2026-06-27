# Python in Code Nodes

Complete reference for Python code in n8n Code nodes.

## Contents
- [Basic Syntax](#basic-syntax)
- [Processing Items](#processing-items)
- [Filtering](#filtering)
- [Data Processing](#data-processing)
- [Working with JSON](#working-with-json)
- [Date Handling](#date-handling)
- [Error Handling](#error-handling)

---

## Basic Syntax

**Key difference from JavaScript: Use `_input` instead of `$input`**

```python
# Access input data
items = _input.all()
first_item = _input.first()
data = _input.first().json

# Return data (MUST be a list)
return [{"json": {"result": "success"}}]
```

---

## Processing Items

```python
# Transform all items
results = []
for item in _input.all():
    results.append({
        "json": {
            "original": item.json["name"],
            "upper": item.json["name"].upper()
        }
    })
return results

# List comprehension (cleaner)
return [
    {"json": {"name": item.json["name"].upper()}}
    for item in _input.all()
]
```

---

## Filtering

```python
# Filter items
active_items = [
    item for item in _input.all()
    if item.json.get("status") == "active"
]
return [{"json": item.json} for item in active_items]

# Filter with multiple conditions
filtered = [
    item for item in _input.all()
    if item.json.get("status") == "active"
    and item.json.get("score", 0) > 80
]
return [{"json": item.json} for item in filtered]
```

---

## Data Processing

```python
# Sum values
total = sum(item.json["amount"] for item in _input.all())
return [{"json": {"total": total}}]

# Group by category
from collections import defaultdict
grouped = defaultdict(list)
for item in _input.all():
    grouped[item.json["category"]].append(item.json)
return [{"json": dict(grouped)}]

# Count items
count = len(_input.all())
return [{"json": {"count": count}}]

# Find min/max
values = [item.json["value"] for item in _input.all()]
return [{"json": {
    "min": min(values),
    "max": max(values),
    "avg": sum(values) / len(values)
}}]
```

---

## Working with JSON

```python
import json

# Parse JSON string
data = json.loads(_input.first().json["json_string"])

# Stringify object
json_str = json.dumps({"key": "value"})

# Pretty print
pretty = json.dumps(data, indent=2)

return [{"json": {"parsed": data, "stringified": json_str}}]
```

---

## Date Handling

```python
from datetime import datetime, timedelta

# Current date
now = datetime.now()
iso_string = now.isoformat()

# Parse date
date_str = _input.first().json["date"]
parsed = datetime.fromisoformat(date_str)

# Add days
next_week = now + timedelta(days=7)

# Format date
formatted = now.strftime("%Y-%m-%d %H:%M:%S")

return [{"json": {
    "now": iso_string,
    "next_week": next_week.isoformat(),
    "formatted": formatted
}}]
```

---

## Error Handling

```python
try:
    data = _input.first().json
    if "required_field" not in data:
        raise ValueError("Missing required_field")

    result = data["required_field"].upper()
    return [{"json": {"success": True, "result": result}}]
except Exception as e:
    return [{"json": {"success": False, "error": str(e)}}]
```

### Safe Property Access

```python
# Use .get() for safe access
data = _input.first().json
name = data.get("name", "Unknown")
email = data.get("user", {}).get("email", "no-email")

return [{"json": {"name": name, "email": email}}]
```

---

## Quick Reference

```python
# Input
items = _input.all()
first = _input.first().json
field = _input.first().json["fieldName"]
safe_field = _input.first().json.get("fieldName", "default")

# Return (MUST be list)
return [{"json": {"result": "value"}}]

# Multiple items
return [
    {"json": {"id": 1}},
    {"json": {"id": 2}}
]

# Transform all
return [{"json": {**item.json, "new": "field"}} for item in _input.all()]
```
