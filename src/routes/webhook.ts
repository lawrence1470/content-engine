import { Router, Request, Response } from "express";
import { WebhookPayload } from "../types";
import {
  getBlogPost,
  updateBlogPostStatus,
  getTemplates,
  createAsset,
} from "../services/notion";
import { generateContent } from "../services/openai";

const router = Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    // Verify webhook secret
    const secret = req.headers["x-webhook-secret"];
    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { blogPostId } = req.body as WebhookPayload;
    if (!blogPostId) {
      return res.status(400).json({ error: "blogPostId is required" });
    }

    // Respond immediately — do the work async
    res.status(202).json({ message: "Processing started" });

    // Run generation in background
    await runGeneration(blogPostId);
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal error" });
    }
  }
});

async function runGeneration(blogPostId: string) {
  await updateBlogPostStatus(blogPostId, "Processing");

  const blogPost = await getBlogPost(blogPostId);
  const templates = await getTemplates();

  for (const template of templates) {
    const content = await generateContent(template, {
      blog_content: blogPost.content,
      title: blogPost.title,
    });

    await createAsset({
      title: `${blogPost.title} — ${template.platform}`,
      platform: template.platform === "X" ? "X Thread" : "Substack Note",
      content,
      sourceBlogPostId: blogPostId,
      status: "Draft",
    });
  }

  await updateBlogPostStatus(blogPostId, "Done");
  console.log(`Generation complete for: ${blogPost.title}`);
}

export default router;
