import { useRouter } from "next/navigation";
import { AlertCircleIcon, Globe02Icon, Loading01Icon, GithubIcon, SearchRemoveIcon, ArrowRight02Icon } from "hugeicons-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useProjects } from "@/features/projects/hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProjectsCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <GithubIcon className="size-4 text-muted-foreground" />;
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-4 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <Loading01Icon className="size-4 text-muted-foreground animate-spin" />
    );
  }

  return <Globe02Icon className="size-4 text-muted-foreground" />;
}

export const ProjectsCommandDialog = ({
  open,
  onOpenChange,
}: ProjectsCommandDialogProps) => {
  const router = useRouter();
  const projects = useProjects();

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Projects"
      description="Search and navigate to your projects"
      className="border w-full"
    >
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty className="flex items-center justify-center gap-2 text-md"><SearchRemoveIcon className="size-4" /><span className="pb-1">No projects found.</span></CommandEmpty>
        <CommandGroup className="bg-background" heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              className="group gap-2 bg-background hover:bg-foreground/20 hover:text-foreground cursor-pointer pl-6"
              key={project._id}
              value={`${project.name}-${project._id}`}
              onSelect={() => handleSelect(project._id)}
            >
              {getProjectIcon(project)}
              <span className="flex-1 pb-1">{project.name}</span>
              <ArrowRight02Icon className="ml-2 size-4 shrink-0 text-muted-foreground group-hover:translate-x-1" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
};