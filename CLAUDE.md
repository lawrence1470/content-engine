# Content Engine

Notion-driven content repurposing pipeline. A Notion button triggers a webhook that creates asset rows in the Assets database (X Thread, YouTube Short, Substack Note) for each blog post.

## Environment Setup

Copy `.env` and fill in values:

```
NOTION_API_KEY=       # from notion.so/my-integrations
BLOG_POSTS_DB_ID=     # from Blogs database URL
ASSETS_DB_ID=         # from Assets database URL
OPENAI_API_KEY=       # from platform.openai.com
WEBHOOK_SECRET=       # any string, must match Notion button URL
PORT=3000
```

Getting database IDs from Notion URLs:
- Open the database as a full page
- Copy the 32-char hex ID from the URL: `notion.so/.../<DATABASE_ID>?v=...`

Notion integration setup:
1. Go to [notion.so/my-integrations](https://notion.so/my-integrations) → New integration
2. Copy the API key → `NOTION_API_KEY`
3. In each database (Blogs, Assets): `...` menu → **Connections** → select your integration

## Running Locally

```bash
npm install
npm run dev        # starts on PORT=3000, auto-reloads on file changes
```

## Testing with ngrok

ngrok exposes your local server so Notion can reach it.

**One-time setup:**
```bash
ngrok config add-authtoken <your-token>   # from dashboard.ngrok.com
```

**Start tunnel (in a separate terminal):**
```bash
ngrok http 3000
```

Copy the forwarding URL, e.g. `https://9a56-xxx.ngrok-free.app`

**Configure the Notion button:**
1. Open the Blogs database in Notion
2. Edit the button column → **Send webhook** action
3. Set URL to: `https://<your-ngrok-url>/webhook/generate`
4. Save

**Trigger the webhook:**
1. Click the button on any blog post row
2. Check the `npm run dev` terminal for logs:
   ```
   Fetched: "Your Blog Title"
   Assets created: { x: "...", youtube: "...", substack: "..." }
   Done: "Your Blog Title"
   ```
3. Check the Assets database in Notion — 3 new rows should appear

**Check ngrok request logs:**
```
http://localhost:4040    # ngrok inspector UI
```

## Project Structure

```
src/
  config/env.ts                  # Zod env validation, fail-fast on startup
  routes/webhook.ts              # POST /webhook/generate
  services/
    notion.ts                    # Notion API client (getBlogPost, createAssetPage, updateBlogPostStatus)
    assetOrchestrator.ts         # Runs all 3 platform creations in parallel
    platforms/
      x.ts                       # X Thread asset creation
      youtube.ts                 # YouTube Short asset creation
      substack.ts                # Substack Note asset creation
  types/index.ts                 # BlogPost, Asset, Platform, AssetConfig types
  index.ts                       # Express app entry point
```

## Webhook Flow

```
Notion button click
  → POST /webhook/generate  (202 immediately)
    → getBlogPost(pageId)
    → createAssetsForBlog(blogPostId, title)   [3 parallel Notion API calls]
    → updateBlogPostStatus("Done")
```
