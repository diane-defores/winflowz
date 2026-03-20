import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("transcriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(30);
  },
});

export const save = mutation({
  args: {
    userId: v.string(),
    rawText: v.string(),
    cleanedText: v.string(),
    language: v.string(),
    durationMs: v.number(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transcriptions", args);
  },
});

export const remove = mutation({
  args: { id: v.id("transcriptions") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("transcriptions"),
    rawText: v.string(),
    cleanedText: v.string(),
  },
  handler: async (ctx, { id, rawText, cleanedText }) => {
    await ctx.db.patch(id, { rawText, cleanedText });
  },
});
