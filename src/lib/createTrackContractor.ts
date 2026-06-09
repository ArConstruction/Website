import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrackDatabase } from "@/lib/supabaseTrack";
import { formatResendSetupHelp, getResendFromEmail, sendResendEmail } from "@/lib/resendEmail";

export const INVITES_BUCKET = "track-contractor-invites";
export const INVITES_FILE = "pending-invites.json";

export type ContractorInvite = {
  id: string;
  full_name: string;
  trade: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export type ContractorInviteInput = {
  fullName: string;
  email: string;
  trade: string;
  phone: string;
};

export type ContractorSignupInput = {
  fullName: string;
  email: string;
  password: string;
  trade: string;
  phone: string;
};

export function cleanTrackValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContractorInviteBody(body: Record<string, unknown>): ContractorInviteInput {
  return {
    fullName: cleanTrackValue(body.fullName),
    email: cleanTrackValue(body.email).toLowerCase(),
    trade: cleanTrackValue(body.trade),
    phone: cleanTrackValue(body.phone),
  };
}

export function parseContractorSignupBody(body: Record<string, unknown>): ContractorSignupInput {
  return {
    fullName: cleanTrackValue(body.fullName),
    email: cleanTrackValue(body.email).toLowerCase(),
    password: cleanTrackValue(body.password),
    trade: cleanTrackValue(body.trade),
    phone: cleanTrackValue(body.phone),
  };
}

function hasValidEmail(email: string) {
  return Boolean(email && email.includes("@"));
}

function hasValidPhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 10;
}

export function validateContractorInviteInput(input: ContractorInviteInput): string | null {
  if (!input.fullName || input.fullName.length < 2) {
    return "Enter a valid full name.";
  }

  if (!input.trade) {
    return "Enter a trade or role.";
  }

  if (!hasValidEmail(input.email) && !hasValidPhone(input.phone)) {
    return "Enter an email or phone number.";
  }

  if (input.email && !hasValidEmail(input.email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validateContractorSignupInput(input: ContractorSignupInput): string | null {
  if (!input.fullName || input.fullName.length < 2) {
    return "Enter a valid full name.";
  }

  if (!hasValidEmail(input.email)) {
    return "Enter a valid email address.";
  }

  if (input.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!input.trade) {
    return "Enter a trade or role.";
  }

  return null;
}

function normalizePhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function phonesMatch(left: string, right: string) {
  const leftDigits = normalizePhoneDigits(left);
  const rightDigits = normalizePhoneDigits(right);

  if (!leftDigits || !rightDigits) {
    return false;
  }

  return leftDigits === rightDigits || leftDigits.endsWith(rightDigits) || rightDigits.endsWith(leftDigits);
}

async function readContractorInvites(supabase: SupabaseClient<TrackDatabase>) {
  const { data, error } = await supabase.storage.from(INVITES_BUCKET).download(INVITES_FILE);

  if (error) {
    if (error.message.toLowerCase().includes("not found")) {
      return [] as ContractorInvite[];
    }

    throw new Error(error.message);
  }

  const text = await data.text();

  if (!text.trim()) {
    return [] as ContractorInvite[];
  }

  return JSON.parse(text) as ContractorInvite[];
}

async function writeContractorInvites(
  supabase: SupabaseClient<TrackDatabase>,
  invites: ContractorInvite[],
) {
  const payload = JSON.stringify(invites, null, 2);
  const { error } = await supabase.storage.from(INVITES_BUCKET).upload(INVITES_FILE, payload, {
    upsert: true,
    contentType: "application/json",
    cacheControl: "60",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function ensureContractorInviteStorage(
  supabase: SupabaseClient<TrackDatabase>,
) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  if (!buckets?.some((bucket) => bucket.name === INVITES_BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(INVITES_BUCKET, {
      public: false,
    });

    if (createError) {
      throw new Error(createError.message);
    }
  }

  try {
    await readContractorInvites(supabase);
  } catch {
    await writeContractorInvites(supabase, []);
  }
}

export async function listContractorInvites(supabase: SupabaseClient<TrackDatabase>) {
  await ensureContractorInviteStorage(supabase);
  const invites = await readContractorInvites(supabase);
  return invites.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

async function sendContractorInviteEmail(payload: {
  contractorName: string;
  email: string;
  signupUrl: string;
}) {
  const text = `Hi ${payload.contractorName},

You have been added to AR Construction Track.

Create your account with this email address:
${payload.signupUrl}

Once signed up, you can receive assigned tasks, upload proof photos, and mark work complete.

— AR Construction
${getResendFromEmail()}`;

  const result = await sendResendEmail({
    to: payload.email,
    subject: "Create your AR Construction Track account",
    text,
  });

  if (!result.ok) {
    return { ok: false as const, error: formatResendSetupHelp(result.error) };
  }

  return { ok: true as const };
}

export async function createContractorInvite(
  supabase: SupabaseClient<TrackDatabase>,
  input: ContractorInviteInput,
  portalBaseUrl: string,
) {
  await ensureContractorInviteStorage(supabase);

  const invites = await readContractorInvites(supabase);
  const invite: ContractorInvite = {
    id: randomUUID(),
    full_name: input.fullName,
    trade: input.trade,
    email: hasValidEmail(input.email) ? input.email : null,
    phone: input.phone || null,
    created_at: new Date().toISOString(),
  };

  invites.push(invite);
  await writeContractorInvites(supabase, invites);

  let emailSent = false;
  let emailError: string | undefined;

  if (invite.email) {
    const signupUrl = `${portalBaseUrl}/signup`;
    const emailResult = await sendContractorInviteEmail({
      contractorName: input.fullName,
      email: invite.email,
      signupUrl,
    });

    if (emailResult.ok) {
      emailSent = true;
    } else {
      emailError = emailResult.error;
    }
  }

  return {
    invite: {
      id: invite.id,
      email: invite.email,
      phone: invite.phone,
    },
    emailSent,
    emailError,
  };
}

export async function createTrackContractorFromSignup(
  supabase: SupabaseClient<TrackDatabase>,
  input: ContractorSignupInput,
) {
  await ensureContractorInviteStorage(supabase);
  const invites = await readContractorInvites(supabase);

  const inviteIndex = invites.findIndex((row) => {
    if (row.email && row.email.toLowerCase() === input.email) {
      return true;
    }

    if (row.phone && input.phone && phonesMatch(row.phone, input.phone)) {
      return true;
    }

    return false;
  });

  if (inviteIndex === -1) {
    return { error: "No contractor invite found for this email or phone. Contact your admin." };
  }

  const invite = invites[inviteIndex];

  if (invite.email && invite.email.toLowerCase() !== input.email) {
    return { error: "Sign up with the email address your admin added for you." };
  }

  const fullName = input.fullName || invite.full_name;
  const trade = input.trade || invite.trade;
  const phone = input.phone || invite.phone || null;

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "contractor",
      trade,
      phone,
    },
  });

  if (userError || !userData.user) {
    return { error: userError?.message ?? "Could not create account." };
  }

  const { error: profileError } = await supabase.from("track_profiles").insert({
    id: userData.user.id,
    full_name: fullName,
    role: "contractor",
    trade,
    phone,
    is_active: true,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userData.user.id);
    return { error: profileError.message };
  }

  invites.splice(inviteIndex, 1);
  await writeContractorInvites(supabase, invites);

  return {
    user: {
      id: userData.user.id,
      email: userData.user.email,
    },
  };
}
