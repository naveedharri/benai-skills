# n8n Expressions Reference

Master n8n's expression language for dynamic data access and transformation.

---

## The Fundamental Rule

**All dynamic content requires double curly braces:**

```
{{ expression }}
```

Without braces = static text. With braces = evaluated expression.

---

## Core Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `$json` | Current node's input data | `{{ $json.name }}` |
| `$node` | Reference other nodes | `{{ $node["Node Name"].json.field }}` |
| `$input` | Input items (Code nodes) | `$input.all()` |
| `$now` | Current timestamp | `{{ $now.toISO() }}` |
| `$env` | Environment variables | `{{ $env.API_KEY }}` |
| `$execution` | Execution metadata | `{{ $execution.id }}` |
| `$workflow` | Workflow metadata | `{{ $workflow.name }}` |

---

## CRITICAL: Webhook Data Location

**This is the #1 mistake. Webhook data is NOT at `$json` root!**

User-submitted data from webhooks lives under `.body`:

```javascript
// WRONG - will be undefined
{{ $json.name }}
{{ $json.email }}

// CORRECT - webhook data is under .body
{{ $json.body.name }}
{{ $json.body.email }}
```

### Webhook Data Structure

```json
{
  "headers": { "content-type": "application/json", ... },
  "params": { },
  "query": { "id": "123" },
  "body": {
    "name": "John",
    "email": "john@example.com"
  }
}
```

**Access patterns:**
- Body data: `{{ $json.body.fieldName }}`
- Query params: `{{ $json.query.paramName }}`
- Headers: `{{ $json.headers["header-name"] }}`

---

## Cross-Node References

### Method 1: $node syntax
```javascript
{{ $node["HTTP Request"].json.data }}
{{ $node["Get User"].json.user.id }}
```

### Method 2: $() function (recommended)
```javascript
{{ $('HTTP Request').item.json.data }}
{{ $('Get User').first().json.user.id }}
```

**Important:** Node names are case-sensitive and must match exactly!

---

## Field Access Patterns

### Simple field
```javascript
{{ $json.fieldName }}
```

### Nested field
```javascript
{{ $json.user.address.city }}
```

### Array element
```javascript
{{ $json.items[0].name }}
{{ $json.results[0] }}
```

### Field with spaces (bracket notation)
```javascript
{{ $json["field name"] }}
{{ $json.user["first name"] }}
```

### Dynamic field access
```javascript
{{ $json[$json.fieldKey] }}
```

---

## Conditional Expressions

### Ternary operator
```javascript
{{ $json.status === 'active' ? 'Yes' : 'No' }}
{{ $json.score > 80 ? 'Pass' : 'Fail' }}
```

### Nullish coalescing (default values)
```javascript
{{ $json.name ?? 'Unknown' }}
{{ $json.count ?? 0 }}
```

### Optional chaining (safe access)
```javascript
{{ $json.user?.address?.city ?? 'N/A' }}
{{ $json.items?.[0]?.name }}
```

---

## String Operations

```javascript
// Concatenation
{{ $json.firstName + ' ' + $json.lastName }}
{{ 'Hello, ' + $json.name + '!' }}

// Case conversion
{{ $json.name.toUpperCase() }}
{{ $json.name.toLowerCase() }}

// Trimming
{{ $json.input.trim() }}

// Substring
{{ $json.text.substring(0, 100) }}

// Replace
{{ $json.text.replace('old', 'new') }}
{{ $json.text.replaceAll('-', '_') }}

// Split
{{ $json.csv.split(',') }}

// Check contains
{{ $json.text.includes('keyword') }}
```

---

## Number Operations

```javascript
// Basic math
{{ $json.price * $json.quantity }}
{{ $json.total / 100 }}
{{ $json.value + 10 }}

// Rounding
{{ Math.round($json.value) }}
{{ Math.floor($json.value) }}
{{ Math.ceil($json.value) }}

// Formatting
{{ $json.price.toFixed(2) }}

// Parse string to number
{{ parseInt($json.stringNum) }}
{{ parseFloat($json.decimalString) }}
```

---

## Array Operations

```javascript
// Length
{{ $json.items.length }}

// First/Last
{{ $json.items[0] }}
{{ $json.items[$json.items.length - 1] }}

// Map (transform)
{{ $json.users.map(u => u.name) }}

// Filter
{{ $json.items.filter(i => i.active) }}

// Find
{{ $json.users.find(u => u.id === 123) }}

// Join
{{ $json.tags.join(', ') }}

// Includes
{{ $json.roles.includes('admin') }}
```

---

## Date/Time with Luxon

n8n uses Luxon's DateTime. `$now` is a DateTime object.

```javascript
// Current time
{{ $now }}
{{ $now.toISO() }}
{{ $now.toFormat('yyyy-MM-dd') }}

// Formatting
{{ $now.toFormat('dd/MM/yyyy HH:mm') }}
{{ $now.toFormat('MMMM d, yyyy') }}

// Add/Subtract time
{{ $now.plus({ days: 7 }).toISO() }}
{{ $now.minus({ hours: 2 }).toISO() }}

// Parse date string
{{ DateTime.fromISO($json.dateString) }}
{{ DateTime.fromFormat($json.date, 'dd/MM/yyyy') }}

// Compare dates
{{ DateTime.fromISO($json.date) > $now }}

// Get parts
{{ $now.year }}
{{ $now.month }}
{{ $now.day }}
{{ $now.hour }}
{{ $now.weekday }}
```

---

## Where NOT to Use Expressions

**Do NOT use `{{ }}` in these contexts:**

1. **Code node JavaScript** - Use plain JS variables
2. **Webhook path field** - Static text only
3. **Credential fields** - Use n8n's credential system
4. **Node names** - Static identifiers

---

## Debugging Expressions

### Test in Set node
Create a Set node to test expressions before using in complex nodes.

### Check for undefined
```javascript
{{ $json.field ?? 'FIELD_IS_UNDEFINED' }}
```

### Log structure
Use Code node to inspect:
```javascript
console.log(JSON.stringify($input.first().json, null, 2));
return $input.all();
```

### Common error messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot read property 'x' of undefined" | Parent object doesn't exist | Use optional chaining: `$json.parent?.x` |
| "x is not a function" | Calling method on wrong type | Check data type first |
| "Unexpected token" | Syntax error in expression | Check brackets and quotes |

---

## Quick Reference

```javascript
// Webhook body
{{ $json.body.fieldName }}

// Other node
{{ $('Node Name').item.json.field }}

// Default value
{{ $json.field ?? 'default' }}

// Safe access
{{ $json.obj?.nested?.field }}

// Conditional
{{ $json.x ? 'yes' : 'no' }}

// Format date
{{ $now.toFormat('yyyy-MM-dd') }}

// Array first item
{{ $json.items[0] }}
```
