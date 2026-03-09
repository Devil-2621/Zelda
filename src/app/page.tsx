"use client"

import { ProjectsView } from "@/features/projects/components/project-view";

/**
 * Renders the Home page UI with controls to add a project, a list of projects, and a demo section.
 *
 * Renders an "Add new" button that triggers project creation, a list of fetched projects showing each project's
 * name and owner ID, and a bordered section containing the DemoPage component.
 *
 * @returns A React element containing the home page: an "Add new" button, the projects list (each item shows name and owner ID), and the DemoPage section.
 */
export default function Home() {
  return (
    <ProjectsView />
  );
}
