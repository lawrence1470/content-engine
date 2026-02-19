import OpenAI from "openai";
import { Template } from "../types";
import { fillTemplate } from "../utils/template";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Generate content for a blog post using a template */
export async function generateContent(
  template: Template,
  variables: Record<string, string>
): Promise<string> {
  const prompt = fillTemplate(template.promptTemplate, variables);

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a content repurposing assistant. Generate ${template.platform} content. Follow the platform's conventions and constraints.`,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: template.maxLength ?? 1000,
  });

  return response.choices[0]?.message?.content ?? "";
}
