import { createAssetPage } from "../notion";
import { generateContent } from "../openai";
import { Asset, BlogPost, Framework } from "../../types";

/** Creates the YouTube Short asset row for a given blog post */
export async function createYouTubeAsset(
  blogPost: BlogPost,
  framework?: Framework | null
): Promise<Asset> {
  if (framework) console.log(`[YouTube] Framework: ${framework.name}`);
  const content = framework ? await generateContent(blogPost, framework) : undefined;
  return createAssetPage({
    name: `Short #1 - ${blogPost.title}`,
    platform: "YouTube",
    type: "Short",
    blogPostId: blogPost.id,
    content,
  });
}
