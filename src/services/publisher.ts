import { Asset } from "../types";
import { postThread, splitIntoTweets } from "./twitter";
import { postNote } from "./substack";
import { updateAsset } from "./notion";

/** Publish a single asset to its target platform */
export async function publishAsset(asset: Asset): Promise<void> {
  try {
    let url: string;

    if (asset.platform === "X Thread") {
      const tweets = splitIntoTweets(asset.content);
      url = await postThread(tweets);
    } else {
      url = await postNote(asset.content);
    }

    await updateAsset(asset.id!, {
      status: "Published",
      publishedUrl: url,
    });

    console.log(`Published ${asset.platform}: ${asset.title} → ${url}`);
  } catch (err: any) {
    await updateAsset(asset.id!, {
      status: "Failed",
      errorLog: err.message ?? String(err),
    });

    console.error(`Failed to publish ${asset.title}:`, err.message);
  }
}
