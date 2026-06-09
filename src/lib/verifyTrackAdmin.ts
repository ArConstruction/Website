import { createClient } from "@supabase/supabase-js";
import type { TrackDatabase } from "@/lib/supabaseTrack";

export type VerifyTrackAdminResult =
  | { adminId: string }
  | { error: string; status: number };

export async function verifyTrackAdmin(
  request: Request,
  supabaseUrl: string,
  anonKey: string,
): Promise<VerifyTrackAdminResult> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized.", status: 401 };
  }

  const token = authHeader.slice(7);
  const userClient = createClient<TrackDatabase>(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser(token);

  if (userError || !userData.user) {
    return { error: "Unauthorized.", status: 401 };
  }

  const { data: profile, error: profileError } = await userClient
    .from("track_profiles")
    .select("role, is_active")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin" || !profile.is_active) {
    return { error: "Forbidden.", status: 403 };
  }

  return { adminId: userData.user.id };
}
