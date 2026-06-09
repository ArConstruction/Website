import { createClient } from "@supabase/supabase-js";
import {
  createTrackContractorFromSignup,
  parseContractorSignupBody,
  validateContractorSignupInput,
} from "@/lib/createTrackContractor";
import type { TrackDatabase } from "@/lib/supabaseTrack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    return Response.json(
      { error: "Signup is not configured on this server." },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid signup request." }, { status: 400 });
  }

  const input = parseContractorSignupBody(body);
  const validationError = validateContractorSignupInput(input);

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const supabase = createClient<TrackDatabase>(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const result = await createTrackContractorFromSignup(supabase, input);

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
