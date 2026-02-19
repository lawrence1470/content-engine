import { createXAsset } from "./platforms/x";
import { createYouTubeAsset } from "./platforms/youtube";
import { createSubstackAsset } from "./platforms/substack";
import { getFrameworksByPlatform } from "./notion";
import { Asset, BlogPost } from "../types";

export interface AssetCreationResult {
  x: Asset;
  youtube: Asset;
  substack: Asset;
}

/** Creates one asset row per platform for the given blog post (runs in parallel) */
export async function createAssetsForBlog(
  blogPost: BlogPost
): Promise<AssetCreationResult> {
  const frameworks = await getFrameworksByPlatform();

  const [x, youtube, substack] = await Promise.all([
    createXAsset(blogPost, frameworks.x),
    createYouTubeAsset(blogPost, frameworks.youtube),
    createSubstackAsset(blogPost, frameworks.substack),
  ]);

  return { x, youtube, substack };
}
