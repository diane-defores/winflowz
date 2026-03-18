import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("snippets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const findByTrigger = query({
  args: { userId: v.string(), trigger: v.string() },
  handler: async (ctx, { userId, trigger }) => {
    return await ctx.db
      .query("snippets")
      .withIndex("by_user_trigger", (q) =>
        q.eq("userId", userId).eq("trigger", trigger)
      )
      .first();
  },
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    trigger: v.string(),
    content: v.string(),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("snippets")
      .withIndex("by_user_trigger", (q) =>
        q.eq("userId", args.userId).eq("trigger", args.trigger)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        label: args.label,
      });
      return existing._id;
    }

    return await ctx.db.insert("snippets", args);
  },
});

export const remove = mutation({
  args: { id: v.id("snippets") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
