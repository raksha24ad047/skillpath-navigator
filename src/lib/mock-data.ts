export type SkillStatus = "missing" | "partial" | "strong";

export interface SkillGap {
  name: string;
  status: SkillStatus;
  note: string;
  you: number;
  industry: number;
}

export interface MarketSkill {
  name: string;
  growth: string;
  signal: "high" | "stable" | "growth" | "critical";
}

export interface CompanyIntel {
  id: string;
  name: string;
  pattern: string;
  focus: string;
  minGpa: string;
  dsaLevel: string;
  questions: string[];
  accent: "blue" | "purple";
}

export const skillGaps: SkillGap[] = [
  {
    name: "Distributed Systems",
    status: "missing",
    note: "Industry expects experience with Kafka, RabbitMQ, or NATS.",
    you: 18,
    industry: 78,
  },
  {
    name: "API Architecture",
    status: "partial",
    note: "You know REST. Modern stacks lean on GraphQL and gRPC.",
    you: 52,
    industry: 80,
  },
  {
    name: "Cloud Native (K8s)",
    status: "partial",
    note: "Solid Docker basics — Kubernetes orchestration is the next leap.",
    you: 44,
    industry: 75,
  },
  {
    name: "Data Structures & Algorithms",
    status: "strong",
    note: "Strong fundamentals. Maintain weekly Leetcode cadence.",
    you: 86,
    industry: 82,
  },
  {
    name: "System Design",
    status: "missing",
    note: "Critical for product-based companies above SDE-1.",
    you: 22,
    industry: 70,
  },
];

export const marketSkills: MarketSkill[] = [
  { name: "LLM Ops", growth: "+420%", signal: "high" },
  { name: "Cloud Native", growth: "+112%", signal: "stable" },
  { name: "Rust", growth: "+89%", signal: "growth" },
  { name: "System Design", growth: "Critical", signal: "critical" },
];

export const trendingTags = [
  "PyTorch",
  "Kubernetes",
  "TypeScript",
  "GoLang",
  "Redis",
  "Docker",
  "Next.js",
  "Postgres",
];

export const companies: CompanyIntel[] = [
  {
    id: "atlassian",
    name: "Atlassian",
    pattern: "Heavy on System Design and collaborative problem solving. Values culture-fit as much as code quality.",
    focus: "System Design",
    minGpa: "7.5 / 10",
    dsaLevel: "Medium-Hard",
    questions: ["Rate limiting algorithm design", "Concurrency in Java/Python", "Design a pluggable webhook system"],
    accent: "purple",
  },
  {
    id: "google",
    name: "Google",
    pattern: "Algorithmic depth + clean code. Multiple DSA rounds, then design + Googleyness.",
    focus: "DSA + Design",
    minGpa: "8.0 / 10",
    dsaLevel: "Hard",
    questions: ["Word ladder variants", "Design YouTube transcoding pipeline", "LRU cache with TTL"],
    accent: "blue",
  },
  {
    id: "tcs",
    name: "TCS",
    pattern: "Aptitude-first funnel. Coding round is moderate; managerial + HR weighted heavily.",
    focus: "Aptitude + Communication",
    minGpa: "6.0 / 10",
    dsaLevel: "Easy-Medium",
    questions: ["String manipulation patterns", "Basic SQL joins", "OOPs principles in Java"],
    accent: "blue",
  },
  {
    id: "uber",
    name: "Uber",
    pattern: "Real-world product thinking. Live coding under time pressure plus a deep design round.",
    focus: "Product + Scale",
    minGpa: "7.0 / 10",
    dsaLevel: "Medium-Hard",
    questions: ["Design surge pricing", "Geo-hash based driver matching", "Idempotent payment APIs"],
    accent: "purple",
  },
];

export const roadmap = [
  { stage: "Now", title: "Master System Design Primer", duration: "2 weeks", type: "Reading" },
  { stage: "Next", title: "Kafka in Practice — build a streaming app", duration: "3 weeks", type: "Project" },
  { stage: "Then", title: "K8s the Hard Way (mini)", duration: "2 weeks", type: "Video" },
  { stage: "Goal", title: "Mock Interview: Senior Recruiter mode", duration: "1 week", type: "Simulation" },
];
