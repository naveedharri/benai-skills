# JavaScript in Code Nodes

Complete reference for JavaScript code in n8n Code nodes.

## Contents
- [Accessing Input Data](#accessing-input-data)
- [Returning Data](#returning-data)
- [Working with All Items](#working-with-all-items)
- [Filtering Items](#filtering-items)
- [Aggregating Data](#aggregating-data)
- [Accessing Other Nodes](#accessing-other-nodes)
- [Environment Variables](#environment-variables)
- [Making HTTP Requests](#making-http-requests)
- [Working with Dates](#working-with-dates)
- [Error Handling](#error-handling)
- [Common Patterns](#common-patterns)
- [Common Mistakes](#common-mistakes)
- [Debugging](#debugging)

---

## Accessing Input Data

```javascript
// Get all input items
const items = $input.all();

// Get first item
const firstItem = $input.first();

// Get item data
const data = $input.first().json;
const name = $input.first().json.name;

// Get specific field from first item
const email = $input.first().json.body.email;
```

---

## Returning Data

**Every Code node MUST return an array of items.**

```javascript
// Return single item
return [{ json: { result: 'success' } }];

// Return multiple items
return [
  { json: { id: 1, name: 'First' } },
  { json: { id: 2, name: 'Second' } }
];

// Transform and return all items
return $input.all().map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));
```

---

## Working with All Items

```javascript
// Process each item
const results = [];
for (const item of $input.all()) {
  results.push({
    json: {
      original: item.json.name,
      uppercase: item.json.name.toUpperCase()
    }
  });
}
return results;

// Using map (cleaner)
return $input.all().map(item => ({
  json: {
    original: item.json.name,
    uppercase: item.json.name.toUpperCase()
  }
}));
```

---

## Filtering Items

```javascript
// Filter items
return $input.all().filter(item => item.json.status === 'active');

// Filter and transform
return $input.all()
  .filter(item => item.json.score > 80)
  .map(item => ({
    json: {
      name: item.json.name,
      passed: true
    }
  }));
```

---

## Aggregating Data

```javascript
// Sum values
const total = $input.all().reduce((sum, item) => sum + item.json.amount, 0);
return [{ json: { total } }];

// Group by field
const grouped = {};
for (const item of $input.all()) {
  const key = item.json.category;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(item.json);
}
return [{ json: grouped }];

// Count items
const count = $input.all().length;
return [{ json: { count } }];
```

---

## Accessing Other Nodes

```javascript
// Get data from specific node
const httpData = $('HTTP Request').first().json;
const allHttpItems = $('HTTP Request').all();

// Get data from previous node
const prevData = $input.first().json;

// Check if node has data
if ($('HTTP Request').all().length > 0) {
  // Node has output
}
```

---

## Environment Variables

```javascript
// Access environment variables
const apiKey = $env.API_KEY;
const baseUrl = $env.BASE_URL;

// Use in API calls
const response = await fetch(`${$env.API_URL}/endpoint`, {
  headers: { 'Authorization': `Bearer ${$env.API_KEY}` }
});
```

---

## Making HTTP Requests

```javascript
// GET request
const response = await fetch('https://api.example.com/data');
const data = await response.json();
return [{ json: data }];

// POST request
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});
const result = await response.json();
return [{ json: result }];

// With error handling
try {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return [{ json: { success: true, data } }];
} catch (error) {
  return [{ json: { success: false, error: error.message } }];
}
```

---

## Working with Dates

```javascript
// Current date
const now = new Date();
const isoString = now.toISOString();

// Using Luxon (available in n8n)
const { DateTime } = require('luxon');
const today = DateTime.now().toFormat('yyyy-MM-dd');
const nextWeek = DateTime.now().plus({ days: 7 }).toISO();

// Parse date string
const parsed = DateTime.fromISO($input.first().json.dateString);
const formatted = parsed.toFormat('dd/MM/yyyy');

return [{ json: { today, nextWeek, formatted } }];
```

---

## Error Handling

```javascript
// Try-catch pattern
try {
  const data = $input.first().json;
  if (!data.required_field) {
    throw new Error('Missing required_field');
  }
  // Process data
  return [{ json: { success: true, result: data.required_field } }];
} catch (error) {
  // Return error info instead of failing
  return [{ json: { success: false, error: error.message } }];
}

// Validate input
const item = $input.first().json;
if (!item.email || !item.email.includes('@')) {
  throw new Error('Invalid email address');
}
```

---

## Common Patterns

```javascript
// Deduplicate array
const unique = [...new Set($input.all().map(i => i.json.email))];
return unique.map(email => ({ json: { email } }));

// Flatten nested arrays
const nested = $input.first().json.items; // [[1,2], [3,4]]
const flat = nested.flat();
return [{ json: { flat } }];

// Sort items
const sorted = $input.all().sort((a, b) =>
  a.json.name.localeCompare(b.json.name)
);
return sorted;

// Merge objects
const merged = Object.assign({},
  $('Node1').first().json,
  $('Node2').first().json
);
return [{ json: merged }];

// Safe property access
const city = $input.first().json?.user?.address?.city ?? 'Unknown';
return [{ json: { city } }];
```

---

## Common Mistakes

### Mistake 1: Not Returning Array

```javascript
// WRONG - returns single object
return { json: { result: 'done' } };

// CORRECT - returns array of items
return [{ json: { result: 'done' } }];
```

### Mistake 2: Missing json Wrapper

```javascript
// WRONG - missing json property
return [{ name: 'John' }];

// CORRECT - wrapped in json
return [{ json: { name: 'John' } }];
```

### Mistake 3: Using Expression Syntax

```javascript
// WRONG - expression syntax
const data = {{ $json.body }};

// CORRECT - Code node syntax
const data = $input.first().json.body;
```

### Mistake 4: Forgetting Async/Await

```javascript
// WRONG - fetch returns Promise
const response = fetch('https://api.example.com');
const data = response.json(); // Error!

// CORRECT - await the Promise
const response = await fetch('https://api.example.com');
const data = await response.json();
return [{ json: data }];
```

### Mistake 5: Not Handling Empty Input

```javascript
// WRONG - crashes if no input
const name = $input.first().json.name;

// CORRECT - check first
const items = $input.all();
if (items.length === 0) {
  return [{ json: { error: 'No input data' } }];
}
const name = items[0].json.name;
```

### Mistake 6: Modifying Input Directly

```javascript
// WRONG - modifies original
const item = $input.first();
item.json.newField = 'value';
return [item];

// CORRECT - create new object
const item = $input.first();
return [{
  json: {
    ...item.json,
    newField: 'value'
  }
}];
```

---

## Debugging

### Console Logging

```javascript
// Log to execution output
console.log('Input data:', JSON.stringify($input.first().json, null, 2));

// Log all items
console.log('Item count:', $input.all().length);
for (const item of $input.all()) {
  console.log('Item:', item.json);
}

// Always return something
return $input.all();
```

### Inspect Data Structure

```javascript
// Return input structure for debugging
return [{
  json: {
    itemCount: $input.all().length,
    firstItem: $input.first()?.json,
    allKeys: Object.keys($input.first()?.json || {}),
    rawInput: $input.all().map(i => i.json)
  }
}];
```

### Step-by-Step Debugging

```javascript
const results = { steps: [] };

// Step 1
const input = $input.first().json;
results.steps.push({ step: 1, input });

// Step 2
const processed = input.name?.toUpperCase();
results.steps.push({ step: 2, processed });

// Step 3
const final = { name: processed, timestamp: new Date().toISOString() };
results.steps.push({ step: 3, final });

return [{ json: results }];
```
