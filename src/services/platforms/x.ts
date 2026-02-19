import { createAssetPage } from "../notion";
import { Asset } from "../../types";

/** Creates the X Thread asset row for a given blog post */
export async function createXAsset(
  blogPostId: string,
  blogTitle: string
): Promise<Asset> {
  return createAssetPage({
    name: `X Thread - ${blogTitle}`,
    platform: "X",
    type: "Thread",
    blogPostId,
  });
}
