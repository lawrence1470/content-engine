import { Router, Request, Response } from "express";
import { z } from "zod";
import { getBlogPost, updateBlogPostStatus } from "../services/notion";
import { createAssetsForBlog } from "../services/assetOrchestrator";
import { getConfig } from "../config/env";

const router = Router();

const webhookBodySchema = z.object({
  source: z.object({ type: z.string() }),
  data: z.object({
    id: z.string().min(1, "page id is required"),
  }),
});

router.post("/generate", async (req: Request, res: Response) => {
  try {
    console.log("Webhook body:", JSON.stringify(req.body, null, 2));

    const parsed = webhookBodySchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("Zod errors:", parsed.error.issues);
      return res.status(400).json({
        error: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    const blogPostId = parsed.data.data.id;

    res.status(202).json({ message: "Processing started" });

    fetchBlog(blogPostId).catch((err) => {
      console.error("Fetch failed:", err.message ?? err);
    });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal error" });
    }
  }
});

async function fetchBlog(blogPostId: string) {
  await updateBlogPostStatus(blogPostId, "Processing");

  const blogPost = await getBlogPost(blogPostId);

  console.log(`Fetched: "${blogPost.title}"`);

  const assets = await createAssetsForBlog(blogPost);
  const created = Object.entries(assets)
    .filter(([, a]) => a)
    .map(([key, a]) => [key, a!.id]);
  console.log(`Assets created:`, Object.fromEntries(created));

  await updateBlogPostStatus(blogPostId, "Done");
  console.log(`Done: "${blogPost.title}"`);
}

export default router;
