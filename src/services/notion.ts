import { Client } from "@notionhq/client";
import { BlogPost, AssetConfig, Asset } from "../types";
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

