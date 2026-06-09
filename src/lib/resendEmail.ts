const DEFAULT_FROM_EMAIL = "thisafzal@arconstruction.ca";

export function getResendFromEmail() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  const match = configured.match(/<([^>]+)>/);

  return match?.[1] ?? configured;
}

export function getResendFromAddress() {
  const email = getResendFromEmail();

  if (configuredIncludesDisplayName(process.env.RESEND_FROM_EMAIL?.trim())) {
    return process.env.RESEND_FROM_EMAIL!.trim();
  }

  return `AR Construction <${email}>`;
}

function configuredIncludesDisplayName(value: string | undefined) {
  return Boolean(value?.includes("<"));
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() ?? "";
}

export function isResendConfigured() {
  return Boolean(getResendApiKey() && getResendFromAddress());
}

export async function sendResendEmail(payload: {
  to: string | string[];
  subject: string;
  text: string;
}) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    return { ok: false as const, error: "Email notifications are not configured." };
  }

  const to = Array.isArray(payload.to) ? payload.to : [payload.to];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to,
      subject: payload.subject,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    return { ok: false as const, error: body?.message ?? "Could not send email." };
  }

  return { ok: true as const };
}

export function formatResendSetupHelp(error: string) {
  if (error.toLowerCase().includes("domain is not verified")) {
    return `${error} Add and verify arconstruction.ca at https://resend.com/domains, then add the DNS records Resend gives you.`;
  }

  return error;
}
