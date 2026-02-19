import { Client } from "@notionhq/client";
import { BlogPost, Template, Asset } from "../types";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const BLOG_POSTS_DB = process.env.BLOG_POSTS_DB_ID!;
const TEMPLATES_DB = process.env.TEMPLATES_DB_ID!;
const ASSETS_DB = process.env.ASSETS_DB_ID!;

/** Fetch a single blog post by page ID */
export async function getBlogPost(pageId: string): Promise<BlogPost> {
  // TODO: fetch page properties + block children, extract text
  throw new Error("Not implemented");
}

/** Update the status of a blog post */
export async function updateBlogPostStatus(
  pageId: string,
  status: BlogPost["status"]
): Promise<void> {
  // TODO: notion.pages.update
  throw new Error("Not implemented");
}

/** Fetch all templates from the Templates DB */
export async function getTemplates(): Promise<Template[]> {
  // TODO: query Templates DB, map to Template type
  throw new Error("Not implemented");
}

/** Create a new asset in the Assets DB */
export async function createAsset(asset: Asset): Promise<string> {
  // TODO: notion.pages.create in Assets DB, return new page ID
  throw new Error("Not implemented");
}

/** Get all assets that are scheduled and due now */
export async function getDueAssets(): Promise<Asset[]> {
  // TODO: query Assets DB where status=Scheduled and scheduledDate <= now
  throw new Error("Not implemented");
}

/** Update an asset (status, publishedUrl, errorLog) */
export async function updateAsset(
  assetId: string,
  updates: Partial<Asset>
): Promise<void> {
  // TODO: notion.pages.update
  throw new Error("Not implemented");
}
