"use client";

import { Poppins } from "next/font/google";
import { Loader2Icon, SparkleIcon, Trash2Icon, XIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Id } from "../../../../convex/_generated/dataModel";

import { ProjectsList } from "./projects-list";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { ImportGithubDialog } from "./import-github-dialog";
import { NewProjectDialog } from "./new-project-dialog";
import { useDeleteProjects } from "../hooks/use-projects";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const ProjectsView = () => {
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Id<"projects">[]>([]);

  const deleteProjects = useDeleteProjects();

  const selectedCount = selectedProjectIds.length;

  const handleToggleProjectSelection = (projectId: Id<"projects">) => {
    setSelectedProjectIds((current) => {
      if (current.includes(projectId)) {
        return current.filter((id) => id !== projectId);
      }

      return [...current, projectId];
    });
  };

  const handleStartDeleteSelection = () => {
    setSelectionMode(true);
    setSelectedProjectIds([]);
  };

  const handleCancelDeleteSelection = () => {
    setSelectionMode(false);
    setSelectedProjectIds([]);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteProjects({ ids: selectedProjectIds });
      toast.success(`${selectedCount} project${selectedCount === 1 ? "" : "s"} deleted`);
      setDeleteDialogOpen(false);
      setSelectionMode(false);
      setSelectedProjectIds([]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete selected projects"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
        if (e.key === "i") {
          e.preventDefault();
          setImportDialogOpen(true);
        }
        if (e.key === "j") {
          e.preventDefault();
          setNewProjectDialogOpen(true);
        }
        if (e.key === "d") {
          e.preventDefault();
          handleStartDeleteSelection();
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
      <ImportGithubDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
      />
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteDialogOpen(open);
          }
        }}
      >
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>
              Delete {selectedCount} project{selectedCount === 1 ? "" : "s"}?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete selected projects and all related files.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting || selectedCount === 0}
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  Delete {selectedCount}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">

          <div className="flex justify-between gap-4 w-full items-center">

            <div className="flex items-center gap-2 w-full group/logo">
              <Image src="/zelda-logo.webp" alt="Zelda Logo" width={28} height={28} className="size-8 md:size-11.5" />
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
                onClick={() => setNewProjectDialogOpen(true)}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <SparkleIcon className="size-4" />
                  <Kbd className="bg-accent border">
                    ⌘J
                  </Kbd>
                </div>
                <div>
                  <span className="text-sm">
                    New
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FaGithub className="size-4" />
                  <Kbd className="bg-accent border">
                    ⌘I
                  </Kbd>
                </div>
                <div>
                  <span className="text-sm">
                    Import
                  </span>
                </div>
              </Button>
            </div>

            {!selectionMode ? (
              <Button
                variant="outline"
                onClick={handleStartDeleteSelection}
                className="w-full justify-between rounded-none"
              >
                <span className="flex items-center gap-2">
                  <Trash2Icon className="size-4" />
                  Delete projects
                </span>
                <Kbd className="bg-accent border">
                  ⌘D
                </Kbd>
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelDeleteSelection}
                  className="rounded-none"
                  disabled={isDeleting}
                >
                  <XIcon className="size-4" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="rounded-none"
                  disabled={selectedCount === 0 || isDeleting}
                >
                  <Trash2Icon className="size-4" />
                  Delete {selectedCount}
                </Button>
              </div>
            )}

            <ProjectsList
              onViewAll={() => setCommandDialogOpen(true)}
              selectable={selectionMode}
              selectedProjectIds={selectedProjectIds}
              onToggleProject={handleToggleProjectSelection}
            />

          </div>

        </div>
      </div>
    </>
  );
};
