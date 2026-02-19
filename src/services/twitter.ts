import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

/**
 * Post a thread to X/Twitter.
 * Content should be pre-split into an array of tweets.
 */
export async function postThread(tweets: string[]): Promise<string> {
  // TODO: post first tweet, then chain replies using in_reply_to_tweet_id
  // Return URL of first tweet
  throw new Error("Not implemented");
}

/** Split generated content into individual tweets */
export function splitIntoTweets(content: string): string[] {
  // TODO: split on double newlines or numbered markers (1/, 2/, etc.)
  return content.split(/\n\n+/).filter((t) => t.trim().length > 0);
}
