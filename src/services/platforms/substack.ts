import { createAssetPage } from "../notion";
import { generateContent } from "../openai";
import { Asset, BlogPost, Framework } from "../../types";

/** Creates the Substack Note asset row for a given blog post */
export async function createSubstackAsset(
  blogPost: BlogPost,
  framework?: Framework | null
): Promise<Asset> {
  if (framework) console.log(`[Substack] Framework: ${framework.name}`);
  const content = framework ? await generateContent(blogPost, framework) : undefined;
  return createAssetPage({
    name: `Substack Note - ${blogPost.title}`,
    platform: "Substack",
    type: "Note",
    blogPostId: blogPost.id,
    content,
  });
}
