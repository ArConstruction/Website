import { formatResendSetupHelp, getResendFromEmail, isResendConfigured, sendResendEmail } from "@/lib/resendEmail";

export type TaskNotificationDetails = {
  title: string;
  taskType: string;
  siteName: string;
  location: string | null;
  description: string;
  priority: string;
  dueDate: string | null;
};

export type TaskNotificationPayload = {
  contractorName: string;
  contractorEmail?: string | null;
  contractorPhone?: string | null;
  task: TaskNotificationDetails;
  portalUrl: string;
};

export type NotificationChannelResult = "sent" | "skipped" | "failed";

export type TaskNotificationResult = {
  email: NotificationChannelResult;
  sms: NotificationChannelResult;
  errors: string[];
};

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dueDate}T12:00:00`));
}

function buildTaskMessage(payload: TaskNotificationPayload) {
  const { contractorName, task, portalUrl } = payload;
  const locationLine = task.location ? `\nLocation: ${task.location}` : "";

  return `Hi ${contractorName},

A new task has been assigned to you on AR Construction Track.

Task: ${task.title}
Type: ${task.taskType}
Site: ${task.siteName}${locationLine}
Priority: ${task.priority}
Due: ${formatDueDate(task.dueDate)}

Details:
${task.description}

Sign in to view and update the task:
${portalUrl}`;
}

function normalizePhoneForSms(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (phone.trim().startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }

  return null;
}

async function sendTaskEmail(payload: TaskNotificationPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isResendConfigured()) {
    return { ok: false, error: "Email notifications are not configured." };
  }

  if (!payload.contractorEmail) {
    return { ok: false, error: "Contractor has no email on file." };
  }

  const text = `${buildTaskMessage(payload)}

— AR Construction
${getResendFromEmail()}`;
  const result = await sendResendEmail({
    to: payload.contractorEmail,
    subject: `New task assigned: ${payload.task.title}`,
    text,
  });

  if (!result.ok) {
    return { ok: false, error: formatResendSetupHelp(result.error) };
  }

  return { ok: true };
}

async function sendTaskSms(payload: TaskNotificationPayload): Promise<{ ok: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { ok: false, error: "SMS notifications are not configured." };
  }

  if (!payload.contractorPhone) {
    return { ok: false, error: "Contractor has no phone number on file." };
  }

  const toNumber = normalizePhoneForSms(payload.contractorPhone);

  if (!toNumber) {
    return { ok: false, error: "Contractor phone number is not valid for SMS." };
  }

  const body = buildTaskMessage(payload);
  const params = new URLSearchParams({
    To: toNumber,
    From: fromNumber,
    Body: body.slice(0, 1600),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    const twilioBody = (await response.json().catch(() => null)) as { message?: string } | null;
    return { ok: false, error: twilioBody?.message ?? "Could not send text message." };
  }

  return { ok: true };
}

export function getTrackPortalUrl(request?: Request) {
  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    if (host) {
      const protocol =
        request.headers.get("x-forwarded-proto") ??
        (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

      return `${protocol}://${host}/track`;
    }
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/track`;
  }

  return "http://arconstruction.ca/track";
}

export async function notifyContractorOfNewTask(
  payload: TaskNotificationPayload,
): Promise<TaskNotificationResult> {
  const result: TaskNotificationResult = {
    email: "skipped",
    sms: "skipped",
    errors: [],
  };

  const emailConfigured = isResendConfigured();
  const smsConfigured = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );

  if (emailConfigured && payload.contractorEmail) {
    const emailResult = await sendTaskEmail(payload);

    if (emailResult.ok) {
      result.email = "sent";
    } else {
      result.email = "failed";
      if (emailResult.error) {
        result.errors.push(emailResult.error);
      }
    }
  }

  if (smsConfigured && payload.contractorPhone) {
    const smsResult = await sendTaskSms(payload);

    if (smsResult.ok) {
      result.sms = "sent";
    } else {
      result.sms = "failed";
      if (smsResult.error) {
        result.errors.push(smsResult.error);
      }
    }
  }

  return result;
}

export function formatTaskNotificationNotice(result: TaskNotificationResult) {
  const parts: string[] = ["Task opened and assigned."];

  if (result.email === "sent") {
    parts.push("Email sent.");
  }

  if (result.sms === "sent") {
    parts.push("Text message sent.");
  }

  if (result.email === "failed" || result.sms === "failed") {
    parts.push("Some notifications could not be delivered.");
  }

  return parts.join(" ");
}
