import { createXAsset } from "./platforms/x";
import { createYouTubeAsset } from "./platforms/youtube";
import { createSubstackAsset } from "./platforms/substack";
import { Asset } from "../types";

export interface AssetCreationResult {
  x: Asset;
  youtube: Asset;
  substack: Asset;
}

/** Creates one asset row per platform for the given blog post (runs in parallel) */
export async function createAssetsForBlog(
  blogPostId: string,
  blogTitle: string
): Promise<AssetCreationResult> {
  const [x, youtube, substack] = await Promise.all([
    createXAsset(blogPostId, blogTitle),
    createYouTubeAsset(blogPostId, blogTitle),
    createSubstackAsset(blogPostId, blogTitle),
  ]);

  return { x, youtube, substack };
}
