import { createXAsset } from "./platforms/x";
import { createYouTubeAsset } from "./platforms/youtube";
import { createSubstackAsset } from "./platforms/substack";
import { getFrameworksByPlatform } from "./notion";
import { Asset, BlogPost } from "../types";

export interface AssetCreationResult {
  x?: Asset;
  youtube?: Asset;
  substack?: Asset;
}

/** Creates asset rows only for platforms with an active framework */
export async function createAssetsForBlog(
  blogPost: BlogPost
): Promise<AssetCreationResult> {
  const frameworks = await getFrameworksByPlatform();
  const result: AssetCreationResult = {};

  const tasks: Promise<void>[] = [];

  if (frameworks.x) {
    tasks.push(createXAsset(blogPost, frameworks.x).then((a) => { result.x = a; }));
  }
  if (frameworks.youtube) {
    tasks.push(createYouTubeAsset(blogPost, frameworks.youtube).then((a) => { result.youtube = a; }));
  }
  if (frameworks.substack) {
    tasks.push(createSubstackAsset(blogPost, frameworks.substack).then((a) => { result.substack = a; }));
  }

  await Promise.all(tasks);
  return result;
}
