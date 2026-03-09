"use client";

import { Inter } from "next/font/google";

import { FolderImportIcon, GithubIcon, PlusSignCircleIcon, SparklesIcon} from "hugeicons-react";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { ProjectsList } from "./project-list";
import { useCreateProject } from "../hooks/use-projects";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { Separator } from "@/components/ui/separator";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const ProjectsView = () => {
  const createProject = useCreateProject();

  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">

          <div className="flex justify-between gap-4 w-full items-center">

            <div className="flex items-center justify-center gap-4 w-full group/logo">
              <Image src="/zelda-logo.webp" alt="Zelda logo" width={32} height={32} className="size-8 md:size-11.5 rounded-xl" />
              <h1 className={cn(
                "text-4xl md:text-5xl font-semibold",
                font.className,
              )}>
                Zelda
              </h1>
            </div>

          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [
                      adjectives,
                      animals,
                      colors,
                    ],
                    separator: "-",
                    length: 3,
                  });

                  createProject({
                    name: projectName,
                  });
                }}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <SparklesIcon className="size-6" />
                  <PlusSignCircleIcon className="size-4" />
                </div>
                <div>
                  <span className="text-sm">
                    New
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => { }}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <GithubIcon className="size-6" />
                  <FolderImportIcon className="size-4" />
                </div>
                <div>
                  <span className="text-sm">
                    Import
                  </span>
                </div>
              </Button>
            </div>

            <Separator />
            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />

          </div>

        </div>
      </div>
    </>
  );
};

export default ProjectsView;