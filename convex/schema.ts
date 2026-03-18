import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Clipboard sync between devices
  clipboardItems: defineTable({
    userId: v.string(),
    content: v.string(),
    contentType: v.union(v.literal("text"), v.literal("url"), v.literal("code")),
    source: v.string(), // device name/id
    pinned: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId"]),

  // Voice transcriptions history
  transcriptions: defineTable({
    userId: v.string(),
    rawText: v.string(),
    cleanedText: v.string(),
    language: v.string(),
    durationMs: v.number(),
    source: v.string(),
  }).index("by_user", ["userId"]),

  // User snippets (reusable text blocks)
  snippets: defineTable({
    userId: v.string(),
    trigger: v.string(), // e.g. "/sig" -> inserts signature
    content: v.string(),
    label: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_trigger", ["userId", "trigger"]),

  // Personal dictionary (names, acronyms, jargon)
  dictionary: defineTable({
    userId: v.string(),
    term: v.string(),
    replacement: v.optional(v.string()), // optional correction
  }).index("by_user", ["userId"]),
});
