import { createClient } from "@supabase/supabase-js";
import { parseCreateTaskBody, validateCreateTaskInput } from "@/lib/createTrackTask";
import {
  formatTaskNotificationNotice,
  getTrackPortalUrl,
  notifyContractorOfNewTask,
} from "@/lib/taskNotifications";
import type { TrackDatabase } from "@/lib/supabaseTrack";
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

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !secretKey) {
    return Response.json({ error: "Task creation is not configured on this server." }, { status: 500 });
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

  const input = parseCreateTaskBody(body);
  const validationError = validateCreateTaskInput(input);

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const supabase = getServiceSupabase(supabaseUrl, secretKey);

  const { data: contractorProfile, error: contractorError } = await supabase
    .from("track_profiles")
    .select("full_name, phone, role, is_active")
    .eq("id", input.assignedTo)
    .single();

  if (
    contractorError ||
    !contractorProfile ||
    contractorProfile.role !== "contractor" ||
    !contractorProfile.is_active
  ) {
    return Response.json({ error: "Choose an active contractor." }, { status: 400 });
  }

  const { data: taskData, error: taskError } = await supabase
    .from("work_tasks")
    .insert({
      title: input.title,
      task_type: input.taskType,
      site_name: input.siteName,
      location: input.location,
      description: input.description,
      priority: input.priority,
      status: "open",
      assigned_to: input.assignedTo,
      created_by: authResult.adminId,
      due_date: input.dueDate,
      completion_name: null,
      completion_type: null,
      completion_details: null,
    })
    .select("id")
    .single();

  if (taskError || !taskData) {
    return Response.json({ error: taskError?.message ?? "Could not create task." }, { status: 400 });
  }

  const { data: authUserData } = await supabase.auth.admin.getUserById(input.assignedTo);

  const notificationResult = await notifyContractorOfNewTask({
    contractorName: contractorProfile.full_name,
    contractorEmail: authUserData.user?.email ?? null,
    contractorPhone: contractorProfile.phone,
    task: {
      title: input.title,
      taskType: input.taskType,
      siteName: input.siteName,
      location: input.location,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
    },
    portalUrl: getTrackPortalUrl(request),
  });

  return Response.json({
    task: { id: taskData.id },
    notifications: notificationResult,
    message: formatTaskNotificationNotice(notificationResult),
  });
}
