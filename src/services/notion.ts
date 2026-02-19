import { Client } from "@notionhq/client";
import { BlogPost, AssetConfig, Asset, Framework, FrameworkMap } from "../types";
import { getConfig } from "../config/env";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/** Extract plain text from a Notion rich_text array */
function extractRichText(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join("") ?? "";
}

/** Extract plain text content from Notion page blocks */
async function extractPageContent(pageId: string): Promise<string> {
  const blocks: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      const b = block as any;
      const type = b.type;

      if (b[type]?.rich_text) {
        blocks.push(extractRichText(b[type].rich_text));
      } else if (type === "bulleted_list_item" || type === "numbered_list_item") {
        blocks.push(`- ${extractRichText(b[type].rich_text)}`);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks.filter(Boolean).join("\n\n");
}

/** Fetch a single blog post by page ID */
export async function getBlogPost(pageId: string): Promise<BlogPost> {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any;
  const props = page.properties;

  const title = extractRichText(props.Name?.title ?? props.Title?.title ?? []);
  const status = props.Status?.select?.name ?? "Draft";
  const content = await extractPageContent(pageId);

  return { id: pageId, title, content, status };
}

/** Split text into ≤2000 char chunks for Notion rich_text limits */
function chunkText(text: string, size = 2000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

/** Create a single asset row in the Assets database */
export async function createAssetPage(config: AssetConfig): Promise<Asset> {
  const response = await notion.pages.create({
    parent: { database_id: getConfig().ASSETS_DB_ID },
    properties: {
      Name: { title: [{ text: { content: config.name } }] },
      Platform: { multi_select: [{ name: config.platform }] },
      Type: { select: { name: config.type } },
      Status: { select: { name: "Pending Review" } },
      Blogs: { relation: [{ id: config.blogPostId }] },
      ...(config.content && {
        Content: {
          rich_text: chunkText(config.content).map((chunk) => ({
            text: { content: chunk },
          })),
        },
      }),
    },
  }) as any;

  return {
    id: response.id,
    name: config.name,
    platform: config.platform,
    type: config.type,
    status: "Pending Review",
    blogPostId: config.blogPostId,
  };
}

/** Fetch active frameworks from the Frameworks database, keyed by platform */
export async function getFrameworksByPlatform(): Promise<FrameworkMap> {
  const response = await notion.databases.query({
    database_id: getConfig().FRAMEWORKS_DB_ID,
    filter: { property: "Active", checkbox: { equals: true } },
  });

  const map: FrameworkMap = { x: null, youtube: null, substack: null };

  for (const page of response.results) {
    const f = parseFramework(page as any);
    if (!f) continue;
    if (f.platform === "X Thread") map.x = f;
    else if (f.platform === "Substack Note") map.substack = f;
  }

  return map;
}

function parseFramework(page: any): Framework | null {
  try {
    const props = page.properties;
    return {
      id: page.id,
      name: extractRichText(props.Name?.title ?? []),
      platform: props.Platform?.select?.name,
      template: extractRichText(props.Template?.rich_text ?? []),
    };
  } catch {
    return null;
  }
}

/** Update the status of a blog post */
export async function updateBlogPostStatus(
  pageId: string,
  status: BlogPost["status"]
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { select: { name: status } },
    },
  });
}

