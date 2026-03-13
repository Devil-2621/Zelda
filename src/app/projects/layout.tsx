import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProjectsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <>{children}</>;
};

export default ProjectsLayout;
