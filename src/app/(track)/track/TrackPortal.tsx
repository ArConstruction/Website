"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  HardHat,
  Loader2,
  LogOut,
  MapPin,
  MessageSquareWarning,
  Plus,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  getTrackSupabase,
  getTrackSession,
  PROOF_BUCKET,
  type TaskPriority,
  type TaskStatus,
  type TrackProfile,
  type WorkTask,
} from "@/lib/supabaseTrack";
import type { ContractorInvite } from "@/lib/createTrackContractor";

const inputClass =
  "w-full min-h-11 border border-white/10 bg-ink-700 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-gold sm:min-h-0 sm:text-sm";
const labelClass = "text-xs font-semibold uppercase tracking-[0.14em] text-white/45 sm:tracking-[0.18em]";
const panelClass = "border border-white/10 bg-ink-800/80";
const primaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-4";
const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-3 py-2.5 text-sm text-white/65 transition hover:border-gold hover:text-gold sm:py-2";

const statusLabels: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const statusClasses: Record<TaskStatus, string> = {
  open: "border-gold/30 bg-gold/10 text-gold",
  in_progress: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  completed: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  rejected: "border-red-300/25 bg-red-300/10 text-red-100",
  cancelled: "border-white/15 bg-white/5 text-white/45",
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "text-white/45",
  normal: "text-white/65",
  high: "text-gold-light",
  urgent: "text-red-200",
};

const STATUS_ORDER: TaskStatus[] = ["open", "in_progress", "rejected", "completed", "cancelled"];

const statusBarColors: Record<TaskStatus, string> = {
  open: "bg-gold/70",
  in_progress: "bg-blue-300/60",
  completed: "bg-emerald-300/60",
  rejected: "bg-red-300/60",
  cancelled: "bg-white/25",
};

function groupTasksByStatus(tasks: WorkTask[]) {
  const groups = Object.fromEntries(STATUS_ORDER.map((status) => [status, [] as WorkTask[]])) as Record<
    TaskStatus,
    WorkTask[]
  >;

  for (const task of tasks) {
    groups[task.status].push(task);
  }

  return groups;
}

function sortTasksForDisplay(tasks: WorkTask[]) {
  return [...tasks].sort((a, b) => {
    if (a.status === "rejected" && b.status !== "rejected") return -1;
    if (a.status !== "rejected" && b.status === "rejected") return 1;
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return (a.due_date ?? "9999-99-99").localeCompare(b.due_date ?? "9999-99-99");
  });
}

function StatusChart({ tasks }: { tasks: WorkTask[] }) {
  const counts = useMemo(() => {
    const map: Record<TaskStatus, number> = {
      open: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
    };

    for (const task of tasks) {
      map[task.status] += 1;
    }

    return map;
  }, [tasks]);

  const total = tasks.length;

  if (total === 0) {
    return null;
  }

  return (
    <div className="mt-5 sm:mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45 sm:tracking-[0.18em]">
        Tasks by status
      </p>
      <div className="mt-3 flex h-3 overflow-hidden border border-white/10 bg-ink">
        {STATUS_ORDER.map((status) => {
          const count = counts[status];
          if (count === 0) return null;

          return (
            <div
              key={status}
              className={`${statusBarColors[status]} min-w-[2px] transition-[width]`}
              style={{ width: `${(count / total) * 100}%` }}
              title={`${statusLabels[status]}: ${count}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {STATUS_ORDER.map((status) => {
          const count = counts[status];
          if (count === 0) return null;

          return (
            <span key={status} className="inline-flex items-center gap-2 text-xs text-white/55">
              <span className={`h-2 w-2 shrink-0 ${statusBarColors[status]}`} />
              {statusLabels[status]} ({count})
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StatusTaskSection({
  status,
  tasks,
  defaultOpen = false,
  children,
}: {
  status: TaskStatus;
  tasks: WorkTask[];
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="border border-white/10 bg-ink-700/40">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.03]"
      >
        <span className="inline-flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <StatusBadge status={status} />
          <span className="text-sm text-white/55">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white/45 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-4 border-t border-white/10 p-4">{children}</div>}
    </div>
  );
}

function formatDate(date: string | null) {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
}) {
  return (
    <div className={`${panelClass} px-4 py-3 sm:px-5 sm:py-4`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-white/55 sm:text-sm">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-gold" />
      </div>
      <p className="font-display mt-1.5 text-2xl font-semibold text-white sm:mt-2 sm:text-3xl">{value}</p>
    </div>
  );
}

function TaskPhotos({
  paths,
  signedUrls,
}: {
  paths: string[];
  signedUrls: Record<string, string>;
}) {
  if (paths.length === 0) {
    return <p className="text-sm text-white/35">No proof photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {paths.map((path) => {
        const url = signedUrls[path];
        return url ? (
          <a
            key={path}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden border border-white/10 bg-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Task proof"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </a>
        ) : (
          <div
            key={path}
            className="flex aspect-square items-center justify-center border border-white/10 bg-ink text-white/30"
          >
            <Camera className="h-5 w-5" />
          </div>
        );
      })}
    </div>
  );
}

function AdminActionButton({
  icon: Icon,
  label,
  count,
  open,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  count?: number;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`flex min-h-11 w-full items-center justify-between gap-2 border px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider transition sm:w-auto sm:justify-start ${
        open
          ? "border-gold bg-gold/10 text-gold"
          : "border-white/10 bg-ink-800/80 text-white/65 hover:border-gold hover:text-gold"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
        {count !== undefined && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs normal-case tracking-normal">
            {count}
          </span>
        )}
      </span>
      <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

export default function TrackPortal() {
  const supabase = useMemo(() => getTrackSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TrackProfile | null>(null);
  const [profiles, setProfiles] = useState<TrackProfile[]>([]);
  const [invites, setInvites] = useState<ContractorInvite[]>([]);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [notice, setNotice] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [pendingTask, setPendingTask] = useState("");
  const [contractorLoading, setContractorLoading] = useState(false);
  const [showOpenTaskForm, setShowOpenTaskForm] = useState(false);
  const [showContractorForm, setShowContractorForm] = useState(false);
  const [showContractorList, setShowContractorList] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    void getTrackSession(supabase).then((session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function loadWorkspace(currentUser = user) {
    if (!supabase || !currentUser) return;

    setWorkspaceError("");
    setNotice("");
    setLoading(true);

    const [{ data: profileData, error: profileError }, { data: profilesData, error: profilesError }] =
      await Promise.all([
        supabase.from("track_profiles").select("*").eq("id", currentUser.id).single(),
        supabase.from("track_profiles").select("*").order("full_name", { ascending: true }),
      ]);
    const profileRow = profileData as TrackProfile | null;
    const profileRows = (profilesData ?? []) as TrackProfile[];

    if (profileError || !profileRow) {
      setProfile(null);
      setProfiles([]);
      setInvites([]);
      setTasks([]);
      setWorkspaceError("This login does not have a tracking profile yet.");
      setLoading(false);
      return;
    }

    if (profilesError) {
      setWorkspaceError(profilesError.message);
      setLoading(false);
      return;
    }

    const query = supabase
      .from("work_tasks")
      .select("*")
      .order("status", { ascending: false })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    const session = profileRow.role === "admin" ? await getTrackSession(supabase) : null;

    const [{ data: taskData, error: taskError }, inviteResponse] = await Promise.all([
      query,
      profileRow.role === "admin" && session
        ? fetch("/api/track/contractors", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          })
        : Promise.resolve(null),
    ]);

    if (taskError) {
      setWorkspaceError(taskError.message);
      setLoading(false);
      return;
    }

    let inviteRows: ContractorInvite[] = [];

    if (inviteResponse) {
      const invitePayload = (await inviteResponse.json()) as {
        error?: string;
        invites?: ContractorInvite[];
      };

      if (!inviteResponse.ok) {
        inviteRows = [];
      } else {
        inviteRows = invitePayload.invites ?? [];
      }
    }

    const allTasks = (taskData ?? []) as WorkTask[];
    const paths = allTasks.flatMap((task) => task.proof_photo_paths);
    const urlMap: Record<string, string> = {};

    if (paths.length > 0) {
      const { data: signed } = await supabase.storage
        .from(PROOF_BUCKET)
        .createSignedUrls(paths, 60 * 60);

      signed?.forEach((item) => {
        if (item.path && item.signedUrl) {
          urlMap[item.path] = item.signedUrl;
        }
      });
    }

    setProfile(profileRow);
    setProfiles(profileRows ?? []);
    setInvites(inviteRows);
    setTasks(allTasks);
    setSignedUrls(urlMap);
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        void loadWorkspace(user);
      });
    } else {
      queueMicrotask(() => {
        setProfile(null);
        setProfiles([]);
        setInvites([]);
        setTasks([]);
        setSignedUrls({});
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const formData = new FormData(event.currentTarget);
    setAuthLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (error) {
      setLoginError(error.message);
    }

    setAuthLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || profile?.role !== "admin") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setNotice("");
    setWorkspaceError("");
    setTaskLoading(true);

    const session = await getTrackSession(supabase);

    if (!session) {
      setWorkspaceError("Your session expired. Sign in again.");
      setTaskLoading(false);
      return;
    }

    const assignedTo = String(formData.get("assigned_to") ?? "");

    if (!assignedTo) {
      setWorkspaceError("Choose a contractor before opening the task.");
      setTaskLoading(false);
      return;
    }

    const response = await fetch("/api/track/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        title: formData.get("title"),
        taskType: formData.get("task_type"),
        siteName: formData.get("site_name"),
        location: formData.get("location"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        assignedTo,
        dueDate: formData.get("due_date"),
      }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setWorkspaceError(payload.error ?? "Could not create task.");
      setTaskLoading(false);
      return;
    }

    form.reset();
    setNotice(payload.message ?? "Task opened and assigned.");
    setShowOpenTaskForm(false);
    setTaskLoading(false);
    await loadWorkspace();
  }

  async function handleCreateContractor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || profile?.role !== "admin") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const phone = String(formData.get("phone") ?? "").trim();
    const hasEmail = email.includes("@");
    const hasPhone = phone.replace(/\D/g, "").length >= 10;

    if (!hasEmail && !hasPhone) {
      setWorkspaceError("Enter an email or phone number.");
      return;
    }

    setNotice("");
    setWorkspaceError("");
    setContractorLoading(true);

    const session = await getTrackSession(supabase);

    if (!session) {
      setWorkspaceError("Your session expired. Sign in again.");
      setContractorLoading(false);
      return;
    }

    const response = await fetch("/api/track/contractors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        fullName: formData.get("full_name"),
        email,
        trade: formData.get("trade"),
        phone,
      }),
    });

    const payload = (await response.json()) as {
      error?: string;
      invite?: { email?: string | null; phone?: string | null };
      emailSent?: boolean;
      emailError?: string;
    };

    if (!response.ok) {
      setWorkspaceError(payload.error ?? "Could not add contractor.");
      setContractorLoading(false);
      return;
    }

    form.reset();
    const contact = payload.invite?.email ?? payload.invite?.phone ?? "contractor";
    let message = `${contact} added. They can sign up at /track/signup with their email.`;

    if (payload.emailSent) {
      message = `Invite email sent from thisafzal@arconstruction.ca to ${payload.invite?.email}. They can finish signup at /track/signup.`;
    } else if (payload.invite?.email && payload.emailError) {
      setWorkspaceError(payload.emailError);
      message = `${contact} added, but the invite email could not be sent. Share /track/signup with them manually.`;
    }

    setNotice(message);
    setContractorLoading(false);
    setShowContractorForm(false);
    await loadWorkspace();
  }

  async function handleAdminStatus(task: WorkTask, status: TaskStatus) {
    if (!supabase || profile?.role !== "admin") return;
    setPendingTask(`${task.id}:${status}`);
    setWorkspaceError("");

    const update =
      status === "rejected"
        ? { status }
        : { status, admin_review_note: null, rejected_at: null };

    const { error } = await supabase.from("work_tasks").update(update).eq("id", task.id);

    if (error) {
      setWorkspaceError(error.message);
    } else {
      setNotice("Task status updated.");
      await loadWorkspace();
    }

    setPendingTask("");
  }

  async function handleAdminReject(event: FormEvent<HTMLFormElement>, task: WorkTask) {
    event.preventDefault();
    if (!supabase || profile?.role !== "admin") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const note = String(formData.get("admin_review_note") ?? "").trim();

    if (!note) {
      setWorkspaceError("Add a rejection note or follow-up before rejecting the job.");
      return;
    }

    setPendingTask(`${task.id}:rejected`);
    setWorkspaceError("");
    setNotice("");

    const { error } = await supabase
      .from("work_tasks")
      .update({
        status: "rejected",
        admin_review_note: note,
        rejected_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    if (error) {
      setWorkspaceError(error.message);
    } else {
      form.reset();
      setNotice("Job rejected with follow-up note.");
      await loadWorkspace();
    }

    setPendingTask("");
  }

  async function handleContractorUpdate(
    event: FormEvent<HTMLFormElement>,
    task: WorkTask,
    nextStatus: TaskStatus,
  ) {
    event.preventDefault();
    if (!supabase || !user) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData
      .getAll("proof_photos")
      .filter((value): value is File => value instanceof File && value.size > 0);
    const newPaths: string[] = [];
    const existingPaths = task.proof_photo_paths ?? [];
    const completionName = String(formData.get("completion_name") ?? "").trim();
    const completionType = String(formData.get("completion_type") ?? "").trim();
    const completionDetails = String(formData.get("completion_details") ?? "").trim();

    if (nextStatus === "completed") {
      if (!completionName || !completionType || !completionDetails) {
        setWorkspaceError("Completion name, type, and details are required.");
        return;
      }

      if (existingPaths.length === 0 && files.length === 0) {
        setWorkspaceError("Add at least one proof photo before completing the task.");
        return;
      }
    }

    setPendingTask(`${task.id}:${nextStatus}`);
    setWorkspaceError("");
    setNotice("");

    for (const [index, file] of files.entries()) {
      const path = `${user.id}/${task.id}/${Date.now()}-${index}-${safeFileName(file.name)}`;
      const { error } = await supabase.storage.from(PROOF_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        setWorkspaceError(error.message);
        setPendingTask("");
        return;
      }

      newPaths.push(path);
    }

    const { error } = await supabase
      .from("work_tasks")
      .update({
        status: nextStatus,
        completion_name: completionName || null,
        completion_type: completionType || null,
        completion_details: completionDetails || null,
        proof_photo_paths: [...existingPaths, ...newPaths],
      })
      .eq("id", task.id);

    if (error) {
      setWorkspaceError(error.message);
    } else {
      form.reset();
      setNotice(nextStatus === "completed" ? "Task marked complete." : "Progress saved.");
      await loadWorkspace();
    }

    setPendingTask("");
  }

  const contractors = profiles.filter((item) => item.role === "contractor" && item.is_active);
  const allContractors = profiles.filter((item) => item.role === "contractor");
  const pendingInvites = invites;
  const contractorDirectoryCount = allContractors.length + pendingInvites.length;
  const profileById = new Map(profiles.map((item) => [item.id, item]));
  const visibleTasks =
    profile?.role === "contractor"
      ? tasks.filter((task) => task.assigned_to === profile.id)
      : tasks;
  const openCount = visibleTasks.filter((task) => task.status === "open").length;
  const progressCount = visibleTasks.filter((task) => task.status === "in_progress").length;
  const completedCount = visibleTasks.filter((task) => task.status === "completed").length;
  const rejectedCount = visibleTasks.filter((task) => task.status === "rejected").length;
  const overdueCount = visibleTasks.filter(
    (task) =>
      task.due_date &&
      task.status !== "completed" &&
      task.status !== "cancelled" &&
      new Date(`${task.due_date}T23:59:59`) < new Date(),
  ).length;

  if (!supabase) {
    return (
      <main className="min-h-[100dvh] px-4 py-10 text-white supports-[min-height:100dvh]:min-h-dvh sm:px-8">
        <div className="mx-auto max-w-2xl border border-gold/25 bg-ink-800 p-8">
          <AlertCircle className="h-8 w-8 text-gold" />
          <h1 className="font-display mt-5 text-3xl font-semibold uppercase">
            Supabase setup required
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to
            `.env.local`, then run the SQL in `supabase/track-schema.sql`.
          </p>
        </div>
      </main>
    );
  }

  if (loading && !profile) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-ink text-white supports-[min-height:100dvh]:min-h-dvh">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative min-h-[100dvh] overflow-x-hidden bg-ink text-white supports-[min-height:100dvh]:min-h-dvh">
        <div className="absolute inset-0">
          <Image
            src="/images/office-polished-corridor.jpg"
            alt="AR Construction project corridor"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/92 to-ink/75 sm:bg-gradient-to-r sm:from-ink sm:via-ink/90 sm:to-ink/55" />
          <div className="noise absolute inset-0 opacity-50" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center gap-8 px-4 py-8 supports-[min-height:100dvh]:min-h-dvh sm:gap-10 sm:px-8 sm:py-10 lg:grid lg:min-h-screen lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <section className="text-center lg:text-left">
            <Image
              src="/images/logo-full.png"
              alt="AR Construction"
              width={150}
              height={162}
              className="mx-auto h-16 w-auto sm:h-20 lg:mx-0"
            />
            <p className="eyebrow mt-6 text-gold sm:mt-10">Contractor Operations</p>
            <h1 className="font-display mt-4 text-4xl font-bold uppercase leading-none sm:mt-5 sm:text-5xl lg:max-w-2xl lg:text-7xl">
              AR Construction Track
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65 sm:mt-6 sm:text-base sm:leading-7 lg:mx-0">
              Assign, complete, and verify contractor work with field notes,
              proof photos, due dates, and live task status.
            </p>
          </section>

          <form onSubmit={handleLogin} className={`${panelClass} p-5 sm:p-8`}>
            <ShieldCheck className="h-8 w-8 text-gold" />
            <h2 className="font-display mt-5 text-2xl font-semibold uppercase">
              Secure Login
            </h2>
            <div className="mt-8 space-y-5">
              <label className="block">
                <span className={labelClass}>Email</span>
                <input className={`${inputClass} mt-2`} name="email" type="email" required />
              </label>
              <label className="block">
                <span className={labelClass}>Password</span>
                <input className={`${inputClass} mt-2`} name="password" type="password" required />
              </label>
            </div>
            {loginError && (
              <p className="mt-5 border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className={`${primaryButtonClass} mt-7`}
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Login
            </button>
            <p className="mt-5 text-center text-sm text-white/50">
              Need contractor access?{" "}
              <Link href="/track/signup" className="font-semibold text-gold transition hover:text-gold-light">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-ink text-white supports-[min-height:100dvh]:min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-800/95 backdrop-blur-md supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/images/logo-mark.png"
              alt="AR Construction"
              width={52}
              height={50}
              className="h-10 w-auto shrink-0 sm:h-12"
            />
            <div className="min-w-0">
              <p className="eyebrow text-gold">AR Construction Track</p>
              <h1 className="font-display truncate text-xl font-semibold uppercase sm:text-2xl">
                {profile?.role === "admin" ? "Admin View" : "Contractor View"}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <span className="col-span-3 inline-flex min-w-0 items-center gap-2 border border-white/10 px-3 py-2.5 text-sm text-white/65 sm:col-span-1 sm:max-w-none">
              <UserRound className="h-4 w-4 shrink-0 text-gold" />
              <span className="truncate">{profile?.full_name ?? user.email}</span>
            </span>
            <button
              type="button"
              onClick={() => loadWorkspace()}
              className={`${secondaryButtonClass} w-full sm:w-auto`}
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              <span className="sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`${secondaryButtonClass} w-full sm:w-auto`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8">
        {workspaceError && (
          <div className="mb-6 border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {workspaceError}
          </div>
        )}
        {notice && (
          <div className="mb-6 border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <StatTile icon={ClipboardList} label="Open" value={openCount} />
          <StatTile icon={Clock3} label="In Progress" value={progressCount} />
          <StatTile icon={CheckCircle2} label="Completed" value={completedCount} />
          <StatTile icon={XCircle} label="Rejected" value={rejectedCount} />
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <StatTile icon={CalendarClock} label="Overdue" value={overdueCount} />
          </div>
        </div>

        {profile?.role === "admin" && (
          <section className="mt-6 sm:mt-8">
            <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <AdminActionButton
                icon={Plus}
                label="Open Task"
                open={showOpenTaskForm}
                onClick={() => setShowOpenTaskForm((open) => !open)}
              />
              <AdminActionButton
                icon={HardHat}
                label="Add Contractor"
                open={showContractorForm}
                onClick={() => setShowContractorForm((open) => !open)}
              />
              <AdminActionButton
                icon={UserRound}
                label="Contractors"
                count={contractorDirectoryCount}
                open={showContractorList}
                onClick={() => setShowContractorList((open) => !open)}
              />
            </div>

            {showOpenTaskForm && (
              <form onSubmit={handleCreateTask} className={`${panelClass} mt-4 p-5 sm:p-6`}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <label>
                    <span className={labelClass}>Task Name</span>
                    <input className={`${inputClass} mt-2`} name="title" required />
                  </label>
                  <label>
                    <span className={labelClass}>Contractor</span>
                    <select className={`${inputClass} mt-2`} name="assigned_to" required defaultValue="">
                      <option value="" disabled>
                        Select contractor
                      </option>
                      {contractors.map((contractor) => (
                        <option key={contractor.id} value={contractor.id}>
                          {contractor.full_name}
                          {contractor.trade ? ` - ${contractor.trade}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>Type</span>
                    <input
                      className={`${inputClass} mt-2`}
                      name="task_type"
                      placeholder="Epoxy, drywall, plumbing..."
                      required
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Priority</span>
                    <select className={`${inputClass} mt-2`} name="priority" defaultValue="normal">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>Site</span>
                    <input className={`${inputClass} mt-2`} name="site_name" required />
                  </label>
                  <label>
                    <span className={labelClass}>Due Date</span>
                    <input className={`${inputClass} mt-2`} name="due_date" type="date" />
                  </label>
                  <label className="lg:col-span-2">
                    <span className={labelClass}>Location</span>
                    <input className={`${inputClass} mt-2`} name="location" />
                  </label>
                  <label className="lg:col-span-2">
                    <span className={labelClass}>Details</span>
                    <textarea className={`${inputClass} mt-2 min-h-28 resize-y`} name="description" required />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={taskLoading}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {taskLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Open Task
                </button>
              </form>
            )}

            {showContractorForm && (
              <form onSubmit={handleCreateContractor} className={`${panelClass} mt-4 p-5 sm:p-6`}>
                <p className="text-sm leading-6 text-white/55">
                  Add a contractor contact. They will create their own password at{" "}
                  <Link href="/track/signup" className="text-gold transition hover:text-gold-light">
                    /track/signup
                  </Link>
                  . If you add an email, an invite is sent automatically.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Full Name</span>
                    <input className={`${inputClass} mt-2`} name="full_name" required />
                  </label>
                  <label>
                    <span className={labelClass}>Trade / Role</span>
                    <input
                      className={`${inputClass} mt-2`}
                      name="trade"
                      placeholder="Drywall, flooring, plumbing..."
                      required
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Phone</span>
                    <input className={`${inputClass} mt-2`} name="phone" type="tel" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Email</span>
                    <input className={`${inputClass} mt-2`} name="email" type="email" />
                  </label>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/40">
                  Email or phone is required. Contractors must sign up with the email you add here.
                </p>
                <button
                  type="submit"
                  disabled={contractorLoading}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {contractorLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                  Add Contractor
                </button>
              </form>
            )}

            {showContractorList && (
              <div className={`${panelClass} mt-4 p-5 sm:p-6`}>
                {contractorDirectoryCount === 0 ? (
                  <p className="text-sm text-white/45">No contractors yet.</p>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {pendingInvites.map((invite) => (
                      <li
                        key={invite.id}
                        className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                      >
                        <div>
                          <p className="font-medium text-white">{invite.full_name}</p>
                          <p className="mt-1 text-sm text-white/55">
                            {invite.trade}
                            {invite.email ? ` · ${invite.email}` : ""}
                            {invite.phone ? ` · ${invite.phone}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 border border-gold/25 bg-gold/10 px-2 py-1 text-xs font-semibold text-gold">
                          Pending signup
                        </span>
                      </li>
                    ))}
                    {allContractors.map((contractor) => (
                      <li key={contractor.id} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div>
                          <p className="font-medium text-white">{contractor.full_name}</p>
                          <p className="mt-1 text-sm text-white/55">
                            {contractor.trade ?? "No trade listed"}
                            {contractor.phone ? ` · ${contractor.phone}` : ""}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 border px-2 py-1 text-xs font-semibold ${
                            contractor.is_active
                              ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                              : "border-white/15 bg-white/5 text-white/45"
                          }`}
                        >
                          {contractor.is_active ? "Active" : "Inactive"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-6">
              <TaskBoard
                tasks={visibleTasks}
                profileById={profileById}
                signedUrls={signedUrls}
                pendingTask={pendingTask}
                onAdminStatus={handleAdminStatus}
                onAdminReject={handleAdminReject}
              />
            </div>
          </section>
        )}

        {profile?.role === "contractor" && (
          <section className="mt-6 sm:mt-8">
            <ContractorTasks
              tasks={visibleTasks}
              signedUrls={signedUrls}
              pendingTask={pendingTask}
              onSubmit={handleContractorUpdate}
            />
          </section>
        )}
      </section>
    </main>
  );
}

function TaskBoard({
  tasks,
  profileById,
  signedUrls,
  pendingTask,
  onAdminStatus,
  onAdminReject,
}: {
  tasks: WorkTask[];
  profileById: Map<string, TrackProfile>;
  signedUrls: Record<string, string>;
  pendingTask: string;
  onAdminStatus: (task: WorkTask, status: TaskStatus) => void;
  onAdminReject: (event: FormEvent<HTMLFormElement>, task: WorkTask) => void;
}) {
  const grouped = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  return (
    <div className={`${panelClass} p-4 sm:p-6`}>
      <div className="flex items-center gap-3">
        <BriefcaseBusiness className="h-5 w-5 shrink-0 text-gold" />
        <h2 className="font-display text-lg font-semibold uppercase sm:text-xl">Team Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-5 border border-white/10 bg-ink-700 px-4 py-5 text-sm text-white/45 sm:mt-6">
          No tasks are open.
        </p>
      ) : (
        <>
          <StatusChart tasks={tasks} />
          <div className="mt-5 space-y-3 sm:mt-6">
            {STATUS_ORDER.map((status) => (
              <StatusTaskSection
                key={status}
                status={status}
                tasks={grouped[status]}
                defaultOpen={status === "open" || status === "in_progress" || status === "rejected"}
              >
                {grouped[status].map((task) => {
                  const contractor = profileById.get(task.assigned_to);
                  return (
                    <article key={task.id} className="border border-white/10 bg-ink-700 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] ${priorityClasses[task.priority]}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <h3 className="font-display mt-3 text-lg font-semibold uppercase leading-tight text-white sm:text-xl">
                            {task.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-white/55">{task.description}</p>
                          <div className="mt-4 flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:flex-wrap sm:gap-3">
                            <span className="inline-flex items-center gap-1.5">
                              <HardHat className="h-3.5 w-3.5 shrink-0 text-gold" />
                              {contractor?.full_name ?? "Unassigned"}
                            </span>
                            <span className="inline-flex items-start gap-1.5">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                              <span>
                                {task.site_name}
                                {task.location ? `, ${task.location}` : ""}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarClock className="h-3.5 w-3.5 shrink-0 text-gold" />
                              {formatDate(task.due_date)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:shrink-0">
                          {(["open", "in_progress", "completed", "cancelled"] as TaskStatus[]).map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              disabled={task.status === nextStatus || pendingTask === `${task.id}:${nextStatus}`}
                              onClick={() => onAdminStatus(task, nextStatus)}
                              className="min-h-10 border border-white/10 px-2 py-2.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/55 transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35 sm:px-3 sm:text-xs"
                            >
                              {pendingTask === `${task.id}:${nextStatus}` ? "Saving" : statusLabels[nextStatus]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {task.status === "rejected" && task.admin_review_note && (
                        <div className="mt-5 border border-red-300/20 bg-red-300/10 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-red-100">
                            <MessageSquareWarning className="h-4 w-4" />
                            Follow-up Required
                          </div>
                          <p className="mt-2 text-sm leading-6 text-red-50/80">{task.admin_review_note}</p>
                        </div>
                      )}

                      {(task.completion_name || task.completion_details || task.proof_photo_paths.length > 0) && (
                        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-[1fr_220px]">
                          <div>
                            <p className={labelClass}>Completion Details</p>
                            <p className="mt-2 text-sm text-white/65">
                              {task.completion_name ?? "Name pending"} · {task.completion_type ?? "Type pending"}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/55">
                              {task.completion_details ?? "No completion notes yet."}
                            </p>
                          </div>
                          <TaskPhotos paths={task.proof_photo_paths} signedUrls={signedUrls} />
                        </div>
                      )}

                      {task.status === "completed" && (
                        <form
                          className="mt-5 border-t border-white/10 pt-5"
                          onSubmit={(event) => onAdminReject(event, task)}
                        >
                          <label>
                            <span className={labelClass}>Reject With Follow-up</span>
                            <textarea
                              className={`${inputClass} mt-2 min-h-24 resize-y`}
                              name="admin_review_note"
                              placeholder="Explain what needs to be fixed before this job can be accepted."
                              defaultValue={task.admin_review_note ?? ""}
                              required
                            />
                          </label>
                          <button
                            type="submit"
                            disabled={pendingTask === `${task.id}:rejected`}
                            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-red-300/25 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-red-100 transition hover:border-red-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            {pendingTask === `${task.id}:rejected` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Reject Job
                          </button>
                        </form>
                      )}
                    </article>
                  );
                })}
              </StatusTaskSection>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ContractorTasks({
  tasks,
  signedUrls,
  pendingTask,
  onSubmit,
}: {
  tasks: WorkTask[];
  signedUrls: Record<string, string>;
  pendingTask: string;
  onSubmit: (event: FormEvent<HTMLFormElement>, task: WorkTask, nextStatus: TaskStatus) => void;
}) {
  const sorted = useMemo(() => sortTasksForDisplay(tasks), [tasks]);
  const grouped = useMemo(() => groupTasksByStatus(sorted), [sorted]);

  if (tasks.length === 0) {
    return (
      <p className={`${panelClass} px-4 py-6 text-sm text-white/45 sm:px-5`}>No assigned tasks.</p>
    );
  }

  return (
    <div className={`${panelClass} p-4 sm:p-6`}>
      <div className="flex items-center gap-3">
        <ClipboardList className="h-5 w-5 shrink-0 text-gold" />
        <h2 className="font-display text-lg font-semibold uppercase sm:text-xl">My Tasks</h2>
      </div>

      <StatusChart tasks={tasks} />

      <div className="mt-5 space-y-3 sm:mt-6">
        {STATUS_ORDER.map((status) => (
          <StatusTaskSection
            key={status}
            status={status}
            tasks={grouped[status]}
            defaultOpen={status === "open" || status === "in_progress" || status === "rejected"}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {grouped[status].map((task) => (
                <article key={task.id} className="border border-white/10 bg-ink-700 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold uppercase leading-tight sm:text-2xl">
                        {task.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-gold">{task.task_type}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] ${priorityClasses[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-white/55">
                    <p>{task.description}</p>
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      {task.site_name}
                      {task.location ? `, ${task.location}` : ""}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-gold" />
                      {formatDate(task.due_date)}
                    </p>
                  </div>

                  <div className="mt-5">
                    <TaskPhotos paths={task.proof_photo_paths} signedUrls={signedUrls} />
                  </div>

                  {task.status === "rejected" && task.admin_review_note && (
                    <div className="mt-5 border border-red-300/20 bg-red-300/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-red-100">
                        <MessageSquareWarning className="h-4 w-4" />
                        Follow-up Required
                      </div>
                      <p className="mt-2 text-sm leading-6 text-red-50/80">{task.admin_review_note}</p>
                    </div>
                  )}

                  {task.status !== "completed" && task.status !== "cancelled" && (
                    <form
                      className="mt-6 border-t border-white/10 pt-5"
                      onSubmit={(event) => {
                        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
                        onSubmit(event, task, (submitter?.value as TaskStatus) ?? "in_progress");
                      }}
                    >
                      <div className="grid gap-4">
                        <label>
                          <span className={labelClass}>Name</span>
                          <input
                            className={`${inputClass} mt-2`}
                            name="completion_name"
                            defaultValue={task.completion_name ?? ""}
                            required
                          />
                        </label>
                        <label>
                          <span className={labelClass}>Type</span>
                          <input
                            className={`${inputClass} mt-2`}
                            name="completion_type"
                            defaultValue={task.completion_type ?? task.task_type}
                            required
                          />
                        </label>
                        <label>
                          <span className={labelClass}>Details</span>
                          <textarea
                            className={`${inputClass} mt-2 min-h-28 resize-y`}
                            name="completion_details"
                            defaultValue={task.completion_details ?? ""}
                            required
                          />
                        </label>
                        <label>
                          <span className={labelClass}>Proof Photos</span>
                          <input
                            className={`${inputClass} mt-2 file:mr-3 file:rounded-none file:border-0 file:bg-gold file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-ink sm:file:mr-4 sm:file:px-4`}
                            name="proof_photos"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                          />
                        </label>
                        <div className="grid gap-3">
                          <button
                            type="submit"
                            value="in_progress"
                            disabled={pendingTask === `${task.id}:in_progress`}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/15 px-5 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white/70 transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {pendingTask === `${task.id}:in_progress` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Clock3 className="h-4 w-4" />
                            )}
                            Save Progress
                          </button>
                          <button
                            type="submit"
                            value="completed"
                            disabled={pendingTask === `${task.id}:completed`}
                            className={`${primaryButtonClass}`}
                          >
                            {pendingTask === `${task.id}:completed` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </article>
              ))}
            </div>
          </StatusTaskSection>
        ))}
      </div>
    </div>
  );
}
