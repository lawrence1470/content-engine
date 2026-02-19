// --- Notion Database Row Types ---

export interface BlogPost {
  id: string;
  title: string;
  content: string; // extracted plain text from Notion blocks
  status: "Draft" | "Ready" | "Processing" | "Done";
}

export interface Template {
  id: string;
  name: string;
  platform: "X" | "Substack";
  promptTemplate: string; // contains {{blog_content}}, {{title}}, etc.
  maxLength?: number;
}

export interface Asset {
  id?: string;
  title: string;
  platform: "X Thread" | "Substack Note";
  content: string;
  sourceBlogPostId: string;
  status: "Draft" | "Approved" | "Scheduled" | "Published" | "Failed";
  scheduledDate?: string; // ISO date string
  publishedUrl?: string;
  errorLog?: string;
}

// --- Webhook Payload ---

export interface WebhookPayload {
  blogPostId: string;
}
