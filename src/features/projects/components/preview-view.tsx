"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import {
  Loader2Icon,
  TerminalSquareIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CopyIcon,
  MessageCircleIcon,
} from "lucide-react";

import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";
import { DraggableTerminal } from "@/features/preview/components/draggable-terminal";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ADD_TO_CHAT_EVENT } from "@/lib/chat-events";

import { useProject } from "../hooks/use-projects";

import { Id } from "../../../../convex/_generated/dataModel";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isPoppedOut, setIsPoppedOut] = useState(false);

  const {
    status, previewUrl, error, restart, terminalOutput, frameworkWarnings
  } = useWebContainer({
    projectId,
    enabled: true,
    settings: project?.settings,
  });

  const isLoading = status === "booting" || status === "installing";
  const hasWarnings = frameworkWarnings && frameworkWarnings.length > 0;

  const handleCopyTerminal = async () => {
    if (!terminalOutput) {
      toast.error("No terminal output to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(terminalOutput);
      toast.success("Terminal output copied");
    } catch {
      toast.error("Unable to copy terminal output");
    }
  };

  const handleAddTerminalToChat = () => {
    if (!terminalOutput) {
      toast.error("No terminal output to add");
      return;
    }

    window.dispatchEvent(
      new CustomEvent(ADD_TO_CHAT_EVENT, {
        detail: { text: terminalOutput, source: "terminal" },
      })
    );
    toast.success("Terminal output added to chat");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-8.75 flex items-center border-b bg-sidebar shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          disabled={isLoading}
          onClick={restart}
          title="Restart container"
        >
          <RefreshCwIcon className="size-3" />
        </Button>

        <div className="flex-1 h-full flex items-center px-3 bg-background border-x text-xs text-muted-foreground truncate font-mono">
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              {status === "booting" ? "Starting..." : "Installing..."}
            </div>
          )}
          {previewUrl && <span className="truncate">{previewUrl}</span>}
          {!isLoading && !previewUrl && !error && <span>Ready to preview</span>}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Toggle terminal"
          onClick={() => setShowTerminal((value) => !value)}
        >
          <TerminalSquareIcon className="size-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Pop out terminal"
          onClick={() => {
            setIsPoppedOut(true);
            setShowTerminal(false);
          }}
        >
          <ExternalLinkIcon className="size-3" />
        </Button>
        <PreviewSettingsPopover
          projectId={projectId}
          initialValues={project?.settings}
          onSave={restart}
        />
      </div>

      <div className="flex-1 min-h-0">
        <Allotment vertical>
          <Allotment.Pane>
            {hasWarnings && !error && (
              <div className="h-full flex flex-col">
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2.5 shrink-0">
                  <div className="flex items-start gap-2">
                    <AlertTriangleIcon className="size-4 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Next.js Configuration Warning
                      </p>
                      <ul className="mt-1 text-xs text-yellow-700 dark:text-yellow-300 space-y-0.5">
                        {frameworkWarnings.map((warning, idx) => (
                          <li key={idx}>• {warning}</li>
                        ))}
                      </ul>
                      <p className="mt-1.5 text-xs text-yellow-600 dark:text-yellow-400">
                        The app may fail to start without proper WebContainer configuration.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  {previewUrl && (
                    <iframe
                      src={previewUrl}
                      className="size-full border-0"
                      title="Preview"
                    />
                  )}
                </div>
              </div>
            )}

            {!hasWarnings && error && (
              <div className="size-full flex items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2 max-w-md mx-auto text-center">
                  <AlertTriangleIcon className="size-6" />
                  <p className="text-sm font-medium">{error}</p>
                  <Button size="sm" variant="outline" onClick={restart}>
                    <RefreshCwIcon className="size-4" />
                    Restart
                  </Button>
                </div>
              </div>
            )}

            {!hasWarnings && isLoading && !error && (
              <div className="size-full flex items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2 max-w-md mx-auto text-center">
                  <Loader2Icon className="size-6 animate-spin" />
                  <p className="text-sm font-medium">Installing...</p>
                </div>
              </div>
            )}

            {!hasWarnings && previewUrl && (
              <iframe
                src={previewUrl}
                className="size-full border-0"
                title="Preview"
              />
            )}
          </Allotment.Pane>

          {showTerminal && (
            <Allotment.Pane minSize={100} maxSize={500} preferredSize={200}>
              <div className="h-full flex flex-col bg-background border-t">
                <div className="h-7 flex items-center px-3 text-xs gap-1.5 text-muted-foreground border-b border-border/50 shrink-0">
                  <TerminalSquareIcon className="size-3" />
                  Terminal
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="h-5 w-5"
                      aria-label="Copy terminal output"
                      onClick={handleCopyTerminal}
                    >
                      <CopyIcon className="size-3" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="h-5 w-5"
                      aria-label="Add terminal output to chat"
                      onClick={handleAddTerminalToChat}
                    >
                      <MessageCircleIcon className="size-3" />
                    </Button>
                  </div>
                </div>
                <PreviewTerminal output={terminalOutput} />
              </div>
            </Allotment.Pane>
          )}
        </Allotment>
      </div>

      {isPoppedOut && (
        <DraggableTerminal
          output={terminalOutput}
          onClose={() => setIsPoppedOut(false)}
        />
      )}
    </div>
  );
};
