import {
  GitPullRequestIcon,
  MessageSquareIcon,
  MonitorPlayIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

const marqueeItems = [
  { icon: SparklesIcon, text: "Prompt-to-project" },
  { icon: MessageSquareIcon, text: "AI conversation" },
  { icon: MonitorPlayIcon, text: "Live preview" },
  { icon: GitPullRequestIcon, text: "GitHub delivery" },
  { icon: ZapIcon, text: "Quick edits" },
  { icon: SparklesIcon, text: "Context-aware AI" },
  { icon: MessageSquareIcon, text: "Threaded memory" },
  { icon: MonitorPlayIcon, text: "Browser preview" },
  { icon: GitPullRequestIcon, text: "Import & export" },
  { icon: ZapIcon, text: "Fast iterations" },
];

export const ProofStrip = ({ reduceMotion }: { reduceMotion: boolean }) => {
  // 4 copies so the seam is always off-screen
  const items = [
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
  ];

  return (
    <section className="py-8 border-y border-border/25 overflow-hidden relative">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <div
        className="flex items-center whitespace-nowrap will-change-transform"
        style={
          reduceMotion
            ? undefined
            : {
                animation: "marquee-run 28s linear infinite",
              }
        }
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 text-sm text-muted-foreground/50 shrink-0 px-7"
          >
            <item.icon className="size-3.5 text-primary/40 shrink-0" />
            <span className="tracking-wide">{item.text}</span>
            <span className="text-border/40 pl-5 text-xs">—</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-run {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </section>
  );
};
