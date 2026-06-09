import { createClient } from "@supabase/supabase-js";
import {
  createContractorInvite,
  listContractorInvites,
  parseContractorInviteBody,
  validateContractorInviteInput,
} from "@/lib/createTrackContractor";
import type { TrackDatabase } from "@/lib/supabaseTrack";
import { getTrackPortalUrl } from "@/lib/taskNotifications";
import { verifyTrackAdmin } from "@/lib/verifyTrackAdmin";

export const runtime = "nodejs";

function getServiceSupabase(supabaseUrl: string, secretKey: string) {
  return createClient<TrackDatabase>(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, anonKey, secretKey };
}

export async function GET(request: Request) {
  const { supabaseUrl, anonKey, secretKey } = getConfig();

  if (!supabaseUrl || !anonKey || !secretKey) {
    return Response.json(
      { error: "Contractor invites are not configured on this server." },
      { status: 500 },
    );
  }

  const authResult = await verifyTrackAdmin(request, supabaseUrl, anonKey);

  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const supabase = getServiceSupabase(supabaseUrl, secretKey);
    const invites = await listContractorInvites(supabase);
    return Response.json({ invites });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load contractor invites.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { supabaseUrl, anonKey, secretKey } = getConfig();

  if (!supabaseUrl || !anonKey || !secretKey) {
    return Response.json(
      { error: "Contractor creation is not configured on this server." },
      { status: 500 },
    );
  }

  const authResult = await verifyTrackAdmin(request, supabaseUrl, anonKey);

  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = parseContractorInviteBody(body);
  const validationError = validateContractorInviteInput(input);

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase(supabaseUrl, secretKey);
    const result = await createContractorInvite(supabase, input, getTrackPortalUrl(request));

    if ("error" in result) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add contractor.";
    return Response.json({ error: message }, { status: 500 });
  }
}
