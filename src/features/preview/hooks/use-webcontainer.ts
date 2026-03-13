import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";

import { 
  buildFileTree,
  getFilePath
} from "@/features/preview/utils/file-tree";
import { useFiles } from "@/features/projects/hooks/use-files";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

// Walk the flat files list to find the directory that contains package.json.
// Returns an absolute path like "/" or "/my-app". Falls back to "/".
const findProjectRoot = (
  files: Doc<"files">[]
): string => {
  const filesMap = new Map(files.map((f) => [f._id, f]));
  const pkgJson = files.find((f) => f.name === "package.json" && f.type === "file");
  if (!pkgJson) return "/";

  const fullPath = getFilePath(pkgJson, filesMap); // e.g. "package.json" or "my-app/package.json"
  const lastSlash = fullPath.lastIndexOf("/");
  if (lastSlash <= 0) return "/";
  return "/" + fullPath.substring(0, lastSlash);
};

// Persist the singleton on `window` so HMR module resets don't lose the
// reference and cause "Unable to create more instances" errors.
declare global {
  interface Window {
    __wc_instance__: WebContainer | null;
    __wc_boot__: Promise<WebContainer> | null;
  }
}

const getWebContainer = async (): Promise<WebContainer> => {
  if (typeof window === "undefined") throw new Error("WebContainer requires a browser context");

  if (window.__wc_instance__) {
    return window.__wc_instance__;
  }

  if (!window.__wc_boot__) {
    window.__wc_boot__ = WebContainer.boot({ coep: "credentialless" });
  }

  window.__wc_instance__ = await window.__wc_boot__;
  return window.__wc_instance__;
};

const teardownWebContainer = () => {
  if (typeof window === "undefined") return;

  if (window.__wc_instance__) {
    window.__wc_instance__.teardown();
    window.__wc_instance__ = null;
  }
  window.__wc_boot__ = null;
};

interface UseWebContainerProps {
  projectId: Id<"projects">;
  enabled: boolean;
  settings?: {
    installCommand?: string;
    devCommand?: string;
  };
};

export const useWebContainer = ({
  projectId,
  enabled,
  settings,
}: UseWebContainerProps) => {
  const [status, setStatus] = useState<
    "idle" | "booting" | "installing" | "running" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState("");

  const containerRef = useRef<WebContainer | null>(null);
  const hasStartedRef = useRef(false);

  // Fetch files from Convex (auto-updates on changes)
  const files = useFiles(projectId);

  // Initial boot and mount
  useEffect(() => {
    if (!enabled || !files || files.length === 0 || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const start = async () => {
      try {
        setStatus("booting");
        setError(null);
        setTerminalOutput("");

        const appendOutput = (data: string) => {
          setTerminalOutput((prev) => prev + data);
        };

        const container = await getWebContainer();
        containerRef.current = container;

        const fileTree = buildFileTree(files);
        await container.mount(fileTree);

        // Detect where package.json lives — could be "/" or a subdirectory
        // like "/my-todo-app" if the AI agent created a project folder.
        const projectRoot = findProjectRoot(files);
        appendOutput(`\x1b[2m[info] project root: ${projectRoot}\x1b[0m\n`);

        container.on("server-ready", (_port, url) => {
          setPreviewUrl(url);
          setStatus("running");
        });

        setStatus("installing");

        // Parse install command (default: npm install)
        const installCmd = settings?.installCommand || "npm install";
        const [installBin, ...installArgs] = installCmd.split(" ");
        appendOutput(`$ ${installCmd}\n`)
        const installProcess = await container.spawn(installBin, installArgs, { cwd: projectRoot });
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          })
        );
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(
            `${installCmd} failed with code ${installExitCode}`
          );
        }

        // Parse dev command (default: npm run dev)
        const devCmd = settings?.devCommand || "npm run dev";
        const [devBin, ...devArgs] = devCmd.split(" ");
        appendOutput(`\n$ ${devCmd}\n`);
        const devProcess = await container.spawn(devBin, devArgs, { cwd: projectRoot });
        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          })
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        setStatus("error");
      }
    };

    start();
  }, [
    enabled,
    files,
    restartKey,
    settings?.devCommand,
    settings?.installCommand,
  ]);

  // Sync file changes (hot-reload)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !files || status !== "running") return;

    const filesMap = new Map(files.map((f) => [f._id, f]));

    for (const file of files) {
      if (file.type !== "file" || file.storageId || !file.content) continue;

      const filePath = getFilePath(file, filesMap);
      container.fs.writeFile(filePath, file.content);
    }
  }, [files, status]);

  // Reset when disabled
  useEffect(() => {
    if (!enabled) {
      hasStartedRef.current = false;
      setStatus("idle");
      setPreviewUrl(null);
      setError(null);
    }
  }, [enabled]);

  // Restart the entire WebContainer process
  const restart = useCallback(() => {
    teardownWebContainer();
    containerRef.current = null;
    hasStartedRef.current = false;
    setStatus("idle");
    setPreviewUrl(null);
    setError(null);
    setRestartKey((k) => k + 1);
  }, []);

  return {
    status,
    previewUrl,
    error,
    restart,
    terminalOutput,
  };
};
