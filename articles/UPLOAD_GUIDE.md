# Article Upload Guide

## Publishing the Airbnb AI Operating Model Article

### Option 1: Using the Web CMS (Recommended)

1. Navigate to the News page and log in with your credentials
2. Click the Edit button (pencil icon)
3. Create a new article with the following details from `airbnb-ai-operating-model.json`
4. Copy the full markdown content from `airbnb-ai-operating-model.md` into the content field
5. Fill in metadata fields:
   - **Title**: What We Can Learn from Airbnb's AI Operating Model
   - **Slug**: airbnb-ai-operating-model
   - **Format**: Feature
   - **Themes**: adoption-organizational-change, ai-product-strategy
   - **Author**: brittany
   - **Publish Date**: 2026-05-14
   - **Meta Description**: See `airbnb-ai-operating-model.json`
   - **Overview Bullets**: See `airbnb-ai-operating-model.json`
6. Save as draft first, review, then publish

### Option 2: Using the API

If you have API authentication credentials, you can post directly:

```bash
curl -X POST https://your-supabase-url/functions/v1/articles \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "slug": "airbnb-ai-operating-model",
    "title": "What We Can Learn from Airbnb'"'"'s AI Operating Model",
    "subtitle": "How to build internal structures that make AI effective at scale",
    "format": "feature",
    "author_slugs": ["brittany"],
    "byline_role": "Director of Product Impact",
    "publish_date": "2026-05-14",
    "meta_description": "Airbnb'"'"'s deliberate AI operating model shows how to move from chaotic AI experimentation to structured, measurable impact. Here'"'"'s how to build the same system for your own work.",
    "themes": ["adoption-organizational-change", "ai-product-strategy"],
    "lenses": ["organizational-design", "capability-building"],
    "topics": ["AI operating models", "workflow optimization", "organizational adoption", "knowledge work"],
    "read_time_minutes": 8,
    "content_markdown": "[FULL MARKDOWN CONTENT HERE]",
    "content_html": "[CONVERTED HTML HERE]",
    "overview_bullets": ["Airbnb'"'"'s AI model treats AI as a capability within defined workflows...", "Clear input specs...", "You can build this same system in 3-4 weeks...", "Token costs actually drop..."],
    "is_lead_story": false,
    "published": true
  }'
```

### Converting Markdown to HTML

The article needs both `content_markdown` and `content_html`. You can use any markdown-to-HTML converter:

```bash
# Using pandoc (if installed)
pandoc -f markdown -t html articles/airbnb-ai-operating-model.md > articles/airbnb-ai-operating-model.html

# Or using Node.js with remark
npm install remark remark-html && node -e "
const {unified} = require('unified');
const {read} = require('to-vfile');
const remarkParse = require('remark-parse');
const remarkHtml = require('remark-html');

const file = await read('articles/airbnb-ai-operating-model.md');
const result = await unified()
  .use(remarkParse)
  .use(remarkHtml)
  .process(file);
console.log(result.toString());
"
```

### Quick Checklist

- [ ] Article markdown is finalized
- [ ] Metadata is accurate in the JSON file
- [ ] Theme slugs are correct
- [ ] Author slug matches your user system
- [ ] Publish date is set
- [ ] Meta description is SEO-friendly
- [ ] Read time estimate is reasonable (8 min)
- [ ] Article is drafted/previewed before publishing
- [ ] Canonical URL is set correctly
