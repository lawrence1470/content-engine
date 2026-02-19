import OpenAI from "openai";
import { BlogPost, Framework } from "../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Generate platform content from a blog post using a framework template */
export async function generateContent(
  blogPost: BlogPost,
  framework: Framework
): Promise<string> {
  const prompt = `You are a content repurposing specialist.

FRAMEWORK TEMPLATE:
${framework.template}

BLOG POST TITLE: ${blogPost.title}

BLOG POST CONTENT:
${blogPost.content}

Using the framework template above, generate the content for this platform. Follow the structure exactly.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content ?? "";
}
