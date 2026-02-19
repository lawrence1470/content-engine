import { createAssetPage } from "../notion";
import { Asset } from "../../types";

/** Creates the YouTube Short asset row for a given blog post */
export async function createYouTubeAsset(
  blogPostId: string,
  blogTitle: string
): Promise<Asset> {
  return createAssetPage({
    name: `Short #1 - ${blogTitle}`,
    platform: "YouTube",
    type: "Short",
    blogPostId,
  });
}
