import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { AlertCircleIcon, ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { useProjectsPartial } from "../hooks/use-projects";

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true
  });
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-3.5 text-muted-foreground" />
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
    );
  }

  return <GlobeIcon className="size-3.5 text-muted-foreground" />;
}

interface ProjectsListProps {
  onViewAll: () => void;
  selectable?: boolean;
  selectedProjectIds?: Id<"projects">[];
  onToggleProject?: (projectId: Id<"projects">) => void;
}

const ContinueCard = ({ 
  data,
  selectable,
  selected,
  onToggle,
}: {
  data: Doc<"projects">;
  selectable: boolean;
  selected: boolean;
  onToggle: (projectId: Id<"projects">) => void;
}) => {
  if (selectable) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Last updated
        </span>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onToggle(data._id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle(data._id);
            }
          }}
          className="h-auto items-start justify-start p-4 bg-background border rounded-none flex flex-col gap-2 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selected}
                aria-label={`Select ${data.name}`}
                className="pointer-events-none"
              />
              {getProjectIcon(data)}
              <span className="font-medium truncate">
                {data.name}
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">
        Last updated
      </span>
      <Button
        variant="outline"
        asChild
        className="h-auto items-start justify-start p-4 bg-background border rounded-none flex flex-col gap-2"
      >
        <Link href={`/projects/${data._id}`} className="group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="font-medium truncate">
                {data.name}
              </span>
            </div>
            <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  )
};

const ProjectItem = ({ 
  data,
  selectable,
  selected,
  onToggle,
}: {
  data: Doc<"projects">;
  selectable: boolean;
  selected: boolean;
  onToggle: (projectId: Id<"projects">) => void;
}) => {
  if (selectable) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(data._id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(data._id);
          }
        }}
        className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            aria-label={`Select ${data.name}`}
            className="pointer-events-none"
          />
          {getProjectIcon(data)}
          <span className="truncate">{data.name}</span>
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
          {formatTimestamp(data.updatedAt)}
        </span>
      </div>
    );
  }

  return (
    <Link 
      href={`/projects/${data._id}`}
      className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimestamp(data.updatedAt)}
      </span>
    </Link>
  );
};

export const ProjectsList = ({ 
  onViewAll,
  selectable = false,
  selectedProjectIds = [],
  onToggleProject,
}: ProjectsListProps) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring" />
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? (
        <ContinueCard
          data={mostRecent}
          selectable={selectable}
          selected={selectedProjectIds.includes(mostRecent._id)}
          onToggle={(projectId) => onToggleProject?.(projectId)}
        />
      ) : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            {!selectable && (
              <button
                onClick={onViewAll}
                className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
              >
                <span>View all</span>
                <Kbd className="bg-accent border">
                  ⌘K
                </Kbd>
              </button>
            )}
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem
                key={project._id}
                data={project}
                selectable={selectable}
                selected={selectedProjectIds.includes(project._id)}
                onToggle={(projectId) => onToggleProject?.(projectId)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
};
