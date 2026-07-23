# Step 3: ICP Qualification

Ask the user which qualification flow they want using AskUserQuestion:

**Option A: Keyword-based qualification**, Filter by keywords in their LinkedIn headline/position. Faster and cheaper. Good when there's a clear keyword signal (e.g., "AI", "marketing", "founder").

**Option B: Skip qualification, scrape all profiles**, No filtering, proceed straight to full profile scraping. More thorough but slower and more expensive.

Also ask: **What keywords define your ICP?** (e.g., "people in marketing or AI")

## Keyword Qualification (Option A)

For straightforward keyword matching, run inline with Python:

```python
# Define keyword groups from user input
ai_keywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
               'nlp', 'natural language', 'gpt', 'llm', 'generative', 'neural', 'data science',
               'automation', 'chatbot', 'computer vision']
marketing_keywords = ['marketing', 'cmo', 'growth', 'brand', 'content', 'seo', 'digital marketing',
                      'social media', 'demand gen', 'gtm', 'go-to-market', 'copywriting',
                      'communications', 'advertising', 'creative director', 'branding']

all_keywords = ai_keywords + marketing_keywords  # combine as appropriate

qualified = []
for e in engagers:
    position = (e.get('Position') or '').lower()
    if any(kw in position for kw in all_keywords):
        e['ICP Match'] = 'Yes'
        qualified.append(e)
    else:
        e['ICP Match'] = 'No'
```

Report:

```
ICP Qualification complete.
- Total unique engagers: [N]
- Qualified: [Q] ([%])
- Not qualified: [D]
```

Save qualified CSV to outputs folder.
