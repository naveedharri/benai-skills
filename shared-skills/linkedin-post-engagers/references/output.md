# Step 6: Final Output

Save the final enriched CSV to the outputs folder with these columns:

```
Name, Position, LinkedIn URL, About, Company Name, Company LinkedIn URL,
Company Description, Company Website, Company Headcount,
Total Engagements, Engagement Summary, ICP Match
```

The `Total Engagements` column counts how many times this person engaged across all scraped posts. The `Engagement Summary` column has a brief text summary of their engagements (e.g., "Like: Claude CoWork will 10x... | Comment: 'Great post!'").

Report:

```
Pipeline complete.
- Posts scraped: [N] from [M] profiles
- Total unique engagers: [X]
- ICP qualified: [Q]
- Profiles enriched: [P]
- Unemployed removed: [U]
- Company websites found: [W]
- Unmatched companies removed: [R]
- No website removed: [V]
- Final leads: [F]
- Output: [link to CSV]
```
