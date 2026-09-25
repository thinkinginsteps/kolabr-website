import { isSignedIn } from "@/lib/admin/session";
import { getDeployRecord, getLatestDeployRecord } from "@/lib/deploy/status";
import { isValidDeployId } from "@/lib/deploy/types";

/**
 * Polled by the deploy panel to find out how a running deploy ended.
 *
 * The deploy restarts this app mid-flight, so the client's polls fail outright for a stretch
 * while the service is down. That is expected: the client keeps polling and this route answers
 * again once the app is back, reading the status the deploy script left on disk.
 */

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" } as const;

export async function GET(request: Request): Promise<Response> {
  // Not requireAdmin(): that redirects, and a redirect to an HTML login page arrives at a JSON
  // poller as an unparseable body. A poller needs a status code it can act on.
  if (!(await isSignedIn())) {
    return Response.json({ error: "Not signed in." }, { status: 401, headers: NO_STORE });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (id !== null && !isValidDeployId(id)) {
    return Response.json({ error: "Invalid deploy id." }, { status: 400, headers: NO_STORE });
  }

  try {
    const record = id ? await getDeployRecord(id) : await getLatestDeployRecord();
    if (!record) {
      return Response.json(
        { error: id ? "No such deploy." : "No deploy has run yet." },
        { status: 404, headers: NO_STORE },
      );
    }
    return Response.json(record, { headers: NO_STORE });
  } catch (e) {
    // Reading the status is a filesystem operation and can fail for reasons that have nothing to
    // do with the deploy. Say so, rather than reporting a failed deploy.
    console.error("[deploy/status] could not read the status:", e);
    return Response.json({ error: "Could not read the deploy status." }, { status: 500, headers: NO_STORE });
  }
}
