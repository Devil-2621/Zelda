import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { verifyAuth } from "./auth";

const resolveUniqueProjectName = async (
  ctx: MutationCtx,
  ownerId: string,
  requestedName: string,
) => {
  const baseName = requestedName.trim() || "New-Project";

  const existingProjects = await ctx.db
    .query("projects")
    .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
    .collect();

  const existingNames = new Set(existingProjects.map((project) => project.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let suffix = 1;
  let candidate = `${baseName} (${suffix})`;

  while (existingNames.has(candidate)) {
    suffix += 1;
    candidate = `${baseName} (${suffix})`;
  }

  return candidate;
};

export const updateSettings = mutation({
  args: {
    id: v.id("projects"),
    settings: v.object({
      installCommand: v.optional(v.string()),
      devCommand: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to update this project");
    }

    await ctx.db.patch("projects", args.id, {
      settings: args.settings,
      updatedAt: Date.now(),
    });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const uniqueProjectName = await resolveUniqueProjectName(
      ctx,
      identity.subject,
      args.name,
    );

    const projectId = await ctx.db.insert("projects", {
      name: uniqueProjectName,
      ownerId: identity.subject,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .order("desc")
      .take(args.limit);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await verifyAuth(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("projects")
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project");
    }

    return project;
  },
});

export const rename = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project");
    }

    await ctx.db.patch("projects", args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const deleteMany = mutation({
  args: {
    ids: v.array(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    for (const projectId of args.ids) {
      const project = await ctx.db.get("projects", projectId);

      if (!project) {
        continue;
      }

      if (project.ownerId !== identity.subject) {
        throw new Error("Unauthorized access to this project");
      }

      const files = await ctx.db
        .query("files")
        .withIndex("by_project", (q) => q.eq("projectId", projectId))
        .collect();

      for (const file of files) {
        if (file.storageId) {
          await ctx.storage.delete(file.storageId);
        }
        await ctx.db.delete(file._id);
      }

      const conversations = await ctx.db
        .query("conversations")
        .withIndex("by_project", (q) => q.eq("projectId", projectId))
        .collect();

      const messages = await ctx.db
        .query("messages")
        .withIndex("by_project_status", (q) => q.eq("projectId", projectId))
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      for (const conversation of conversations) {
        await ctx.db.delete(conversation._id);
      }

      await ctx.db.delete(projectId);
    }
  },
});