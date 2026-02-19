# Content Engine - Los Angeles

## Project Summary
Notion → OpenAI → X/Substack content repurposing engine (TypeScript/Node.js)

## Stack
- **Runtime**: Node.js with TypeScript (tsx for dev, tsc for build)
- **Framework**: Express
- **Key Dependencies**: @notionhq/client, openai, twitter-api-v2, node-cron, zod, dotenv

## Architecture

### Entry Point
- `src/index.ts` - Express app, PORT, /health endpoint

### Services
- `src/services/notion.ts` - Notion DB client
  - Constants: ASSETS_DB, BLOG_POSTS_DB, TEMPLATES_DB, notion client
  - Functions: createAsset, getBlogPost, getDueAssets, getTemplates, updateAsset, updateBlogPostStatus
- `src/services/openai.ts` - Content generation
  - Functions: generateContent
- `src/services/twitter.ts` - X/Twitter posting
  - Functions: postThread, splitIntoTweets
- `src/services/publisher.ts` - Orchestrates publishing
  - Functions: publishAsset
- `src/services/substack.ts` - Substack publishing (via session cookie)

### Scheduler
- `src/scheduler/cron.ts` - cron jobs
  - Functions: startScheduler

### Routes
- `src/routes/webhook.ts` - POST /generate webhook
  - Functions: runGeneration

### Types
- `src/types/index.ts` - Interfaces: Asset, BlogPost, Template, WebhookPayload

## Environment Variables
- NOTION_API_KEY, BLOG_POSTS_DB_ID, TEMPLATES_DB_ID, ASSETS_DB_ID
- OPENAI_API_KEY
- TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
- SUBSTACK_COOKIE (browser session cookie)
- PORT (default 3000), WEBHOOK_SECRET

## Scripts
- `npm run dev` - tsx watch (hot reload)
- `npm run build` - tsc
- `npm start` - node dist/index.js

## Git
- Branch: lawrence1470/init-setup
- Target: main
- Status: clean (initial commit only)
