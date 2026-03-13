import {
  BotIcon,
  BracesIcon,
  CloudUploadIcon,
  Code2Icon,
  FileCode2Icon,
  FolderTreeIcon,
  GitPullRequestIcon,
  LayoutPanelLeftIcon,
  MessageSquareTextIcon,
  MonitorPlayIcon,
  RocketIcon,
  SparklesIcon,
  TerminalSquareIcon,
  WandSparklesIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

export type BentoFeature = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  metric?: string;
  icon: LucideIcon;
  size: "wide" | "tall" | "normal";
};

export type ShowcaseItem = {
  key: "create" | "iterate" | "deliver";
  label: string;
  title: string;
  body: string;
  points: string[];
  icon: LucideIcon;
};

export const proofItems = [
  { label: "Workflow", value: "Prompt -> Code -> Preview" },
  { label: "Editing", value: "Quick edit with context" },
  { label: "Collaboration", value: "Conversation-first IDE" },
  { label: "Delivery", value: "Import + Export GitHub" },
] as const;

export const bentoFeatures: BentoFeature[] = [
  {
    key: "prompt-project",
    eyebrow: "Project creation",
    title: "Prompt-to-project kickoff",
    description:
      "Start new projects from natural language prompts and jump directly into an editable workspace.",
    highlights: [
      "Create with prompt dialog",
      "Fast route to codebase scaffolding",
      "Works with your existing workflow",
    ],
    metric: "Cmd/Ctrl + J flow",
    icon: WandSparklesIcon,
    size: "wide",
  },
  {
    key: "editor",
    eyebrow: "IDE experience",
    title: "Editor built for shipping",
    description:
      "File explorer, open tabs, and focused editing to keep momentum while building production features.",
    highlights: [
      "File tree + tabs",
      "Syntax-aware editing",
      "Project-level navigation",
    ],
    icon: FileCode2Icon,
    size: "normal",
  },
  {
    key: "conversation",
    eyebrow: "AI collaboration",
    title: "Conversation sidebar with memory",
    description:
      "Keep technical decisions and implementation context in one threaded place next to your code.",
    highlights: [
      "Per-project conversations",
      "Streaming assistant responses",
      "Paste terminal output into chat",
    ],
    metric: "Context stays local to project",
    icon: MessageSquareTextIcon,
    size: "tall",
  },
  {
    key: "quick-edit",
    eyebrow: "Precision changes",
    title: "Quick edit + code suggestions",
    description:
      "Apply natural language refinements to selected code instead of broad, risky rewrites.",
    highlights: [
      "Selection-based updates",
      "Suggestion-driven iteration",
      "Faster review loops",
    ],
    icon: SparklesIcon,
    size: "normal",
  },
  {
    key: "preview",
    eyebrow: "Run in browser",
    title: "Live preview with terminal",
    description:
      "Boot your app, watch terminal logs, restart quickly, and keep build feedback in the same workspace.",
    highlights: [
      "Preview pane",
      "Terminal output controls",
      "Framework-aware setup",
    ],
    metric: "Next.js + Vite support",
    icon: MonitorPlayIcon,
    size: "wide",
  },
  {
    key: "github",
    eyebrow: "Ship + sync",
    title: "GitHub import and export",
    description:
      "Pull in existing repositories or export completed work to GitHub without leaving Zelda.",
    highlights: [
      "Import by repo URL",
      "Export with visibility controls",
      "Track export status",
    ],
    icon: GitPullRequestIcon,
    size: "normal",
  },
];

export const workflowSteps = [
  {
    title: "Start with intent",
    description:
      "Describe what you want to build. Zelda creates a project and gets you into implementation quickly.",
    icon: RocketIcon,
  },
  {
    title: "Build with AI in the loop",
    description:
      "Use the conversation sidebar, quick edits, and suggestions while keeping control of every decision.",
    icon: BotIcon,
  },
  {
    title: "Preview and validate",
    description:
      "Run your app in preview, inspect terminal logs, and iterate until behavior and UX match your goals.",
    icon: TerminalSquareIcon,
  },
  {
    title: "Deliver to your stack",
    description:
      "Import or export with GitHub and continue in your normal release workflow.",
    icon: CloudUploadIcon,
  },
] as const;

export const showcaseTabs: ShowcaseItem[] = [
  {
    key: "create",
    label: "Create",
    title: "From prompt to working project context",
    body: "Generate a project foundation and immediately move to real implementation, not static mockups.",
    points: [
      "Project creation from prompt",
      "Ready-to-edit code structure",
      "Immediate handoff to IDE workflow",
    ],
    icon: BracesIcon,
  },
  {
    key: "iterate",
    label: "Iterate",
    title: "Code + conversation in one surface",
    body: "Coordinate AI guidance and concrete code changes side-by-side so intent and output stay aligned.",
    points: [
      "Conversation attached to project",
      "Selection-aware quick edits",
      "Suggestion loops for refinement",
    ],
    icon: LayoutPanelLeftIcon,
  },
  {
    key: "deliver",
    label: "Deliver",
    title: "Preview and ship with confidence",
    body: "Validate behavior in preview and then move code to GitHub when your implementation is ready.",
    points: [
      "Preview + terminal observability",
      "Restart and debug quickly",
      "Export flows for handoff",
    ],
    icon: WorkflowIcon,
  },
];

export const useCases = [
  {
    title: "Solo product builders",
    description:
      "Go from idea to functional product surfaces without juggling multiple disconnected tools.",
    icon: Code2Icon,
  },
  {
    title: "Startup engineering teams",
    description:
      "Collaborate on implementation detail while speeding up scaffolding, edits, and validation.",
    icon: FolderTreeIcon,
  },
  {
    title: "Client delivery teams",
    description:
      "Use faster prototyping and feedback cycles to deliver quality outcomes with tighter timelines.",
    icon: RocketIcon,
  },
] as const;

export const faqs = [
  {
    question: "What does Zelda actually help with today?",
    answer:
      "Zelda focuses on project creation, structured coding workflows, AI-assisted edits, conversation context, live preview, and GitHub import/export flows.",
  },
  {
    question: "Can I keep control over code changes?",
    answer:
      "Yes. Zelda is designed for human-in-the-loop building. You review, refine, and decide what gets kept.",
  },
  {
    question: "Does Zelda support real preview workflows?",
    answer:
      "Yes. Zelda includes a preview pane and terminal output workflow so you can validate behavior while iterating.",
  },
  {
    question: "How does Zelda fit into GitHub workflows?",
    answer:
      "You can import existing repositories and export projects directly to GitHub with visibility and status-aware controls.",
  },
  {
    question: "Who is Zelda best suited for?",
    answer:
      "Builders and teams who want faster implementation cycles while keeping architecture and quality decisions explicit.",
  },
] as const;
