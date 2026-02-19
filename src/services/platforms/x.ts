import { createAssetPage } from "../notion";
import { generateContent } from "../openai";
import { Asset, BlogPost, Framework } from "../../types";

/** Creates the X Thread asset row for a given blog post */
export async function createXAsset(
  blogPost: BlogPost,
  framework?: Framework | null
): Promise<Asset> {
  if (framework) console.log(`[X] Framework: ${framework.name}`);
  const content = framework ? await generateContent(blogPost, framework) : undefined;
  return createAssetPage({
    name: `X Thread - ${blogPost.title}`,
    platform: "X",
    type: "Thread",
    blogPostId: blogPost.id,
    content,
  });
}
