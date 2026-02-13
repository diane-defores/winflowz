import type { APIRoute } from "astro";
import { ConvexHttpClient } from "convex/browser";

export const POST: APIRoute = async ({ request }) => {
  const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;
  if (!convexUrl || convexUrl === "https://PLACEHOLDER.convex.cloud") {
    return new Response(JSON.stringify({ success: true, message: "Convex not configured" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const convex = new ConvexHttpClient(convexUrl);
  const payload = await request.json();
  const { type, data } = payload;

  switch (type) {
    case "user.created":
    case "user.updated": {
      await convex.mutation("users:upsertFromClerk" as any, {
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined,
        imageUrl: data.image_url || undefined,
      });
      break;
    }
    case "user.deleted": {
      if (data.id) {
        await convex.mutation("users:deleteByClerkId" as any, {
          clerkId: data.id,
        });
      }
      break;
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
