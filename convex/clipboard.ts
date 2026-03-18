import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("clipboardItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    contentType: v.union(v.literal("text"), v.literal("url"), v.literal("code")),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Avoid duplicates: skip if last item has same content
    const latest = await ctx.db
      .query("clipboardItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    if (latest?.content === args.content) return latest._id;

    return await ctx.db.insert("clipboardItems", {
      ...args,
      pinned: false,
    });
  },
});

export const togglePin = mutation({
  args: { id: v.id("clipboardItems") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) return;
    await ctx.db.patch(id, { pinned: !item.pinned });
  },
});

export const remove = mutation({
  args: { id: v.id("clipboardItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
