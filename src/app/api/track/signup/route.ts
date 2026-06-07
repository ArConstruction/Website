import { createClient } from "@supabase/supabase-js";
import type { TrackDatabase } from "@/lib/supabaseTrack";

export const runtime = "nodejs";

type SignupBody = {
  fullName?: string;
  email?: string;
  password?: string;
  trade?: string;
  phone?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    return Response.json(
      { error: "Signup is not configured on this server." },
      { status: 500 },
    );
  }

  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return Response.json({ error: "Invalid signup request." }, { status: 400 });
  }

  const fullName = clean(body.fullName);
  const email = clean(body.email).toLowerCase();
  const password = clean(body.password);
  const trade = clean(body.trade);
  const phone = clean(body.phone);

  if (!fullName || fullName.length < 2) {
    return Response.json({ error: "Enter a valid full name." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  if (!trade) {
    return Response.json({ error: "Enter your trade or role." }, { status: 400 });
  }

  const supabase = createClient<TrackDatabase>(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "contractor",
      trade,
      phone: phone || null,
    },
  });

  if (userError || !userData.user) {
    return Response.json(
      { error: userError?.message ?? "Could not create account." },
      { status: 400 },
    );
  }

  const { error: profileError } = await supabase.from("track_profiles").insert({
    id: userData.user.id,
    full_name: fullName,
    role: "contractor",
    trade,
    phone: phone || null,
    is_active: true,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userData.user.id);

    return Response.json(
      { error: profileError.message },
      { status: 400 },
    );
  }

  return Response.json({
    user: {
      id: userData.user.id,
      email: userData.user.email,
    },
  });
}
