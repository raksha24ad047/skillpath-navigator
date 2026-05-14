import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

function getKey() {
  const k = process.env.LOVABLE_API_KEY;
  if (!k) throw new Error("LOVABLE_API_KEY is not configured");
  return k;
}

async function callTool<T>(opts: {
  system: string;
  user: string;
  tool: { name: string; description: string; parameters: object };
}): Promise<T> {
  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: opts.tool.name,
            description: opts.tool.description,
            parameters: opts.tool.parameters,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: opts.tool.name } },
    }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Top up in Settings → Workspace → Usage.");
    const body = await res.text();
    console.error("Lovable AI error", res.status, body);
    throw new Error(`AI gateway error (${res.status})`);
  }

  const json = (await res.json()) as {
    choices?: Array<{
      message?: { tool_calls?: Array<{ function?: { arguments?: string } }> };
    }>;
  };
  const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("AI did not return a structured response");
  try {
    return JSON.parse(args) as T;
  } catch {
    throw new Error("AI returned malformed JSON");
  }
}

/* -------------------- Roadmap -------------------- */

export interface RoadmapStep {
  stage: string;
  title: string;
  duration: string;
  type: "Reading" | "Video" | "Project" | "Simulation";
  resource: string;
}
export interface RoadmapResult {
  goal: string;
  steps: RoadmapStep[];
}

export const generateRoadmap = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        goal: z.string().trim().min(3).max(160),
        mode: z.enum(["video", "reading"]).default("video"),
        weeks: z.number().int().min(2).max(24).default(8),
      })
      .parse(input)
  )
  .handler(async ({ data }): Promise<RoadmapResult> => {
    return callTool<RoadmapResult>({
      system: `You are a senior engineering mentor. Build a focused, week-by-week learning roadmap for a 2nd/3rd year engineering student.
Prefer ${data.mode === "video" ? "video courses (YouTube playlists, freeCodeCamp, Fireship, etc.)" : "books, docs, and long-form articles"} where possible. Keep it pragmatic — 4-6 steps total over ~${data.weeks} weeks.`,
      user: `Goal: ${data.goal}`,
      tool: {
        name: "return_roadmap",
        description: "Return an ordered roadmap.",
        parameters: {
          type: "object",
          properties: {
            goal: { type: "string" },
            steps: {
              type: "array",
              minItems: 4,
              maxItems: 6,
              items: {
                type: "object",
                properties: {
                  stage: { type: "string", description: "Now / Next / Then / Goal" },
                  title: { type: "string" },
                  duration: { type: "string" },
                  type: { type: "string", enum: ["Reading", "Video", "Project", "Simulation"] },
                  resource: { type: "string", description: "Concrete resource name." },
                },
                required: ["stage", "title", "duration", "type", "resource"],
                additionalProperties: false,
              },
            },
          },
          required: ["goal", "steps"],
          additionalProperties: false,
        },
      },
    });
  });

/* -------------------- Resume Optimizer -------------------- */

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  improvements: { issue: string; suggestion: string }[];
  rewrittenBullets: { before: string; after: string }[];
}

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        resumeText: z.string().trim().min(50).max(8000),
        targetRole: z.string().trim().min(2).max(120).default("SDE-1"),
      })
      .parse(input)
  )
  .handler(async ({ data }): Promise<ResumeAnalysis> => {
    return callTool<ResumeAnalysis>({
      system: `You are a strict but fair recruiter at a top product company. Score a student's resume against ATS best practices and the target role. Be honest about weak verbs, missing metrics, and irrelevant fluff.`,
      user: `Target role: ${data.targetRole}\n\nResume:\n${data.resumeText}`,
      tool: {
        name: "return_resume_analysis",
        description: "Return ATS analysis and rewritten bullets.",
        parameters: {
          type: "object",
          properties: {
            atsScore: { type: "number", description: "0-100" },
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
            improvements: {
              type: "array",
              minItems: 2,
              maxItems: 6,
              items: {
                type: "object",
                properties: {
                  issue: { type: "string" },
                  suggestion: { type: "string" },
                },
                required: ["issue", "suggestion"],
                additionalProperties: false,
              },
            },
            rewrittenBullets: {
              type: "array",
              minItems: 2,
              maxItems: 5,
              items: {
                type: "object",
                properties: {
                  before: { type: "string" },
                  after: { type: "string" },
                },
                required: ["before", "after"],
                additionalProperties: false,
              },
            },
          },
          required: ["atsScore", "summary", "strengths", "improvements", "rewrittenBullets"],
          additionalProperties: false,
        },
      },
    });
  });

/* -------------------- Mock Interview -------------------- */

export interface MockInterview {
  persona: string;
  opener: string;
  questions: { question: string; whyAsked: string; whatTheyWant: string }[];
  closingTip: string;
}

export const generateMockInterview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        role: z.string().trim().min(2).max(120),
        persona: z.enum(["stressed-recruiter", "friendly-mentor", "technical-lead"]),
        focus: z.string().trim().max(200).optional(),
      })
      .parse(input)
  )
  .handler(async ({ data }): Promise<MockInterview> => {
    const personaBrief: Record<string, string> = {
      "stressed-recruiter":
        "Sharp, time-pressured recruiter at a FAANG. Cuts off rambling. Pushes for metrics and clarity.",
      "friendly-mentor":
        "Warm senior engineer running a low-stakes practice round. Encouraging, asks follow-ups to coach.",
      "technical-lead":
        "Hiring tech lead. Goes deep on tradeoffs and system thinking.",
    };
    return callTool<MockInterview>({
      system: `You are simulating an interviewer. Persona: ${personaBrief[data.persona]}
Generate exactly 3 sharp interview questions for the role, each with the reason it's being asked and what the interviewer wants to hear.`,
      user: `Role: ${data.role}\nFocus area: ${data.focus ?? "general"}`,
      tool: {
        name: "return_mock_interview",
        description: "Return a 3-question mock interview script.",
        parameters: {
          type: "object",
          properties: {
            persona: { type: "string" },
            opener: { type: "string", description: "How the interviewer opens the call, in character." },
            questions: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  whyAsked: { type: "string" },
                  whatTheyWant: { type: "string" },
                },
                required: ["question", "whyAsked", "whatTheyWant"],
                additionalProperties: false,
              },
            },
            closingTip: { type: "string" },
          },
          required: ["persona", "opener", "questions", "closingTip"],
          additionalProperties: false,
        },
      },
    });
  });
