import { createAssetPage } from "../notion";
import { Asset } from "../../types";

/** Creates the Substack Note asset row for a given blog post */
export async function createSubstackAsset(
  blogPostId: string,
  blogTitle: string
): Promise<Asset> {
  return createAssetPage({
    name: `Substack Note - ${blogTitle}`,
    platform: "Substack",
    type: "Note",
    blogPostId,
  });
}
