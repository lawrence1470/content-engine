export interface BlogPost {
  id: string;
  title: string;
  content: string; // extracted plain text from Notion blocks
  status: "Draft" | "Ready" | "Processing" | "Done";
}

export interface WebhookPayload {
  blogPostId: string;
}

export type Platform = "X" | "YouTube" | "Substack";
export type AssetType = "Thread" | "Short" | "Note";
export type AssetStatus = "Pending Review" | "In Review" | "Approved" | "Published";

export interface AssetConfig {
  name: string;
  platform: Platform;
  type: AssetType;
  blogPostId: string;
}

export interface Asset {
  id: string;
  name: string;
  platform: Platform;
  type: AssetType;
  status: AssetStatus;
  blogPostId: string;
}
