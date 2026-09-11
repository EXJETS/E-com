import { diagnoseAvinode } from "@/lib/avinode";

/**
 * GET /api/avinode/health — one URL that says whether the Avinode integration
 * actually works, and if not, exactly what Avinode replied.
 *
 * Gated behind AVINODE_DEBUG=1 and 404s otherwise, so it stays inert in a
 * normal production deploy. Token values are never included in the output.
 */
export async function GET() {
  if (process.env.AVINODE_DEBUG !== "1") {
    return new Response("Not found", { status: 404 });
  }

  const diagnosis = await diagnoseAvinode();
  return Response.json(diagnosis, {
    status: diagnosis.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
