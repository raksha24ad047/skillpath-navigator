import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  stack: z
    .array(z.string().trim().min(1).max(60))
    .min(1, "Add at least one skill")
    .max(40, "Too many skills"),
  persona: z
    .enum(["sde-1-product", "sde-1-service", "sde-1-startup"])
    .default("sde-1-product"),
});

export type SkillStatus = "missing" | "partial" | "strong";

export interface SkillBaseline {
  name: string;
  status: SkillStatus;
  you: number;
  industry: number;
  note: string;
}

export interface SkillAnalysis {
  persona: string;
  summary: string;
  readinessScore: number;
  gaps: SkillBaseline[];
}

const tool = {
  type: "function" as const,
  function: {
    name: "return_skill_baseline",
    description:
      "Compare a candidate's current stack against the industry baseline for the given SDE-1 persona and return a structured gap analysis.",
    parameters: {
      type: "object",
      properties: {
        persona: { type: "string" },
        summary: {
          type: "string",
          description: "One paragraph honest assessment, 2-3 sentences max.",
        },
        readinessScore: {
          type: "number",
          description: "0-100 readiness score for the persona.",
        },
        gaps: {
          type: "array",
          minItems: 5,
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              status: { type: "string", enum: ["missing", "partial", "strong"] },
              you: { type: "number", description: "0-100 candidate proficiency" },
              industry: {
                type: "number",
                description: "0-100 industry baseline expectation",
              },
              note: {
                type: "string",
                description: "Short, actionable note (max ~140 chars).",
              },
            },
            required: ["name", "status", "you", "industry", "note"],
            additionalProperties: false,
          },
        },
      },
      required: ["persona", "summary", "readinessScore", "gaps"],
      additionalProperties: false,
    },
  },
};

const PERSONA_PROMPTS: Record<string, string> = {
  "sde-1-product":
    "SDE-1 at top product companies (Google, Atlassian, Uber). Expects strong DSA, system design fundamentals, distributed systems exposure, cloud-native basics.",
  "sde-1-service":
    "SDE-1 at service / consulting companies (TCS, Infosys, Accenture). Expects aptitude, OOP, SQL, one mainstream backend stack, communication.",
  "sde-1-startup":
    "SDE-1 at fast-moving startups. Expects shipping ability across the stack, modern frameworks (Next.js, TypeScript), some devops, pragmatic system design.",
};

export const analyzeSkillGap = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<SkillAnalysis> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const personaBrief = PERSONA_PROMPTS[data.persona];
    const systemPrompt = `You are a senior engineering hiring manager. Compare a candidate's stack to the industry baseline for: ${personaBrief}
Return 5-8 of the MOST relevant skill dimensions (mix of strengths and gaps). Be honest — mark things "missing" when they are. Use realistic 0-100 numbers.`;

    const userPrompt = `Candidate's current stack:\n${data.stack.map((s) => `- ${s}`).join("\n")}\n\nProduce a baseline comparison via the return_skill_baseline tool.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_skill_baseline" } },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (res.status === 402) {
        throw new Error("AI credits exhausted. Add funds in Settings → Workspace → Usage.");
      }
      const body = await res.text();
      console.error("Lovable AI error", res.status, body);
      throw new Error(`AI gateway error (${res.status})`);
    }

    const json = (await res.json()) as {
      choices?: Array<{
        message?: {
          tool_calls?: Array<{
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
    };

    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = call?.function?.arguments;
    if (!argsRaw) {
      throw new Error("AI did not return a structured response");
    }

    let parsed: SkillAnalysis;
    try {
      parsed = JSON.parse(argsRaw) as SkillAnalysis;
    } catch {
      throw new Error("AI returned malformed JSON");
    }

    parsed.readinessScore = Math.max(0, Math.min(100, Math.round(parsed.readinessScore)));
    parsed.gaps = parsed.gaps.map((g) => ({
      ...g,
      you: Math.max(0, Math.min(100, Math.round(g.you))),
      industry: Math.max(0, Math.min(100, Math.round(g.industry))),
    }));

    return parsed;
  });
