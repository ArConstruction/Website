"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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
  UserRound,
  XCircle,
} from "lucide-react";
import {
  getTrackSupabase,
  PROOF_BUCKET,
  type TaskPriority,
  type TaskStatus,
  type TrackProfile,
  type WorkTask,
} from "@/lib/supabaseTrack";

const inputClass =
  "w-full border border-white/10 bg-ink-700 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-white/45";
const panelClass = "border border-white/10 bg-ink-800/80";

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
    <div className={`${panelClass} px-5 py-4`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-white/55">{label}</p>
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <p className="font-display mt-2 text-3xl font-semibold text-white">{value}</p>
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

export default function TrackPortal() {
  const supabase = useMemo(() => getTrackSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TrackProfile | null>(null);
  const [profiles, setProfiles] = useState<TrackProfile[]>([]);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [notice, setNotice] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [pendingTask, setPendingTask] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function loadWorkspace(currentUser = user) {
    if (!supabase || !currentUser) return;

    setWorkspaceError("");
    setNotice("");
    setLoading(true);

    const [{ data: profileData, error: profileError }, { data: profilesData, error: profilesError }] =
      await Promise.all([
        supabase.from("track_profiles").select("*").eq("id", currentUser.id).single(),
        supabase
          .from("track_profiles")
          .select("*")
          .eq("is_active", true)
          .order("full_name", { ascending: true }),
      ]);
    const profileRow = profileData as TrackProfile | null;
    const profileRows = (profilesData ?? []) as TrackProfile[];

    if (profileError || !profileRow) {
      setProfile(null);
      setProfiles([]);
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

    const { data: taskData, error: taskError } = await query;

    if (taskError) {
      setWorkspaceError(taskError.message);
      setLoading(false);
      return;
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
    if (!supabase || !user || profile?.role !== "admin") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setNotice("");
    setWorkspaceError("");

    const assignedTo = String(formData.get("assigned_to") ?? "");
    if (!assignedTo) {
      setWorkspaceError("Choose a contractor before opening the task.");
      return;
    }

    const { error } = await supabase.from("work_tasks").insert({
      title: String(formData.get("title") ?? "").trim(),
      task_type: String(formData.get("task_type") ?? "").trim(),
      site_name: String(formData.get("site_name") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim(),
      priority: String(formData.get("priority") ?? "normal") as TaskPriority,
      status: "open",
      assigned_to: assignedTo,
      created_by: user.id,
      due_date: String(formData.get("due_date") ?? "") || null,
      completion_name: null,
      completion_type: null,
      completion_details: null,
    });

    if (error) {
      setWorkspaceError(error.message);
      return;
    }

    form.reset();
    setNotice("Task opened and assigned.");
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

  const contractors = profiles.filter((item) => item.role === "contractor");
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
      <main className="min-h-screen bg-ink px-5 py-10 text-white sm:px-8">
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
      <main className="flex min-h-screen items-center justify-center bg-ink text-white">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/office-polished-corridor.jpg"
            alt="AR Construction project corridor"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/55" />
          <div className="noise absolute inset-0 opacity-50" />
        </div>

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <Image
              src="/images/logo-full.png"
              alt="AR Construction"
              width={150}
              height={162}
              className="h-20 w-auto"
            />
            <p className="eyebrow mt-10 text-gold">Contractor Operations</p>
            <h1 className="font-display mt-5 max-w-2xl text-5xl font-bold uppercase leading-none sm:text-6xl lg:text-7xl">
              AR Construction Track
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
              Assign, complete, and verify contractor work with field notes,
              proof photos, due dates, and live task status.
            </p>
          </section>

          <form onSubmit={handleLogin} className={`${panelClass} p-6 sm:p-8`}>
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
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-gold px-6 py-4 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
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
    <main className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/10 bg-ink-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo-mark.png"
              alt="AR Construction"
              width={52}
              height={50}
              className="h-12 w-auto"
            />
            <div>
              <p className="eyebrow text-gold">AR Construction Track</p>
              <h1 className="font-display text-2xl font-semibold uppercase">
                {profile?.role === "admin" ? "Admin View" : "Contractor View"}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-sm text-white/65">
              <UserRound className="h-4 w-4 text-gold" />
              {profile?.full_name ?? user.email}
            </span>
            <button
              type="button"
              onClick={() => loadWorkspace()}
              className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-sm text-white/65 transition hover:border-gold hover:text-gold"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-sm text-white/65 transition hover:border-gold hover:text-gold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatTile icon={ClipboardList} label="Open" value={openCount} />
          <StatTile icon={Clock3} label="In Progress" value={progressCount} />
          <StatTile icon={CheckCircle2} label="Completed" value={completedCount} />
          <StatTile icon={XCircle} label="Rejected" value={rejectedCount} />
          <StatTile icon={CalendarClock} label="Overdue" value={overdueCount} />
        </div>

        {profile?.role === "admin" && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.55fr]">
            <form onSubmit={handleCreateTask} className={`${panelClass} p-5 sm:p-6`}>
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-gold" />
                <h2 className="font-display text-xl font-semibold uppercase">Open Task</h2>
              </div>
              <div className="mt-6 grid gap-4">
                <label>
                  <span className={labelClass}>Task Name</span>
                  <input className={`${inputClass} mt-2`} name="title" required />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Site</span>
                    <input className={`${inputClass} mt-2`} name="site_name" required />
                  </label>
                  <label>
                    <span className={labelClass}>Due Date</span>
                    <input className={`${inputClass} mt-2`} name="due_date" type="date" />
                  </label>
                </div>
                <label>
                  <span className={labelClass}>Location</span>
                  <input className={`${inputClass} mt-2`} name="location" />
                </label>
                <label>
                  <span className={labelClass}>Details</span>
                  <textarea className={`${inputClass} mt-2 min-h-28 resize-y`} name="description" required />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gold px-6 py-4 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light"
                >
                  <Plus className="h-4 w-4" />
                  Open Task
                </button>
              </div>
            </form>

            <TaskBoard
              tasks={visibleTasks}
              profileById={profileById}
              signedUrls={signedUrls}
              pendingTask={pendingTask}
              onAdminStatus={handleAdminStatus}
              onAdminReject={handleAdminReject}
            />
          </section>
        )}

        {profile?.role === "contractor" && (
          <section className="mt-8">
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
  return (
    <div className={`${panelClass} p-5 sm:p-6`}>
      <div className="flex items-center gap-3">
        <BriefcaseBusiness className="h-5 w-5 text-gold" />
        <h2 className="font-display text-xl font-semibold uppercase">Team Tasks</h2>
      </div>

      <div className="mt-6 space-y-4">
        {tasks.length === 0 && (
          <p className="border border-white/10 bg-ink-700 px-4 py-5 text-sm text-white/45">
            No tasks are open.
          </p>
        )}

        {tasks.map((task) => {
          const contractor = profileById.get(task.assigned_to);
          return (
            <article key={task.id} className="border border-white/10 bg-ink-700 p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />
                    <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${priorityClasses[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-semibold uppercase text-white">
                    {task.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{task.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
                    <span className="inline-flex items-center gap-1.5">
                      <HardHat className="h-3.5 w-3.5 text-gold" />
                      {contractor?.full_name ?? "Unassigned"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {task.site_name}
                      {task.location ? `, ${task.location}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-gold" />
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {(["open", "in_progress", "completed", "cancelled"] as TaskStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={task.status === status || pendingTask === `${task.id}:${status}`}
                      onClick={() => onAdminStatus(task, status)}
                      className="border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/55 transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {pendingTask === `${task.id}:${status}` ? "Saving" : statusLabels[status]}
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
                  <p className="mt-2 text-sm leading-6 text-red-50/80">
                    {task.admin_review_note}
                  </p>
                </div>
              )}

              {(task.completion_name || task.completion_details || task.proof_photo_paths.length > 0) && (
                <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 lg:grid-cols-[1fr_220px]">
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
                    className="mt-3 inline-flex items-center justify-center gap-2 border border-red-300/25 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-red-100 transition hover:border-red-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
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
  const sorted = [...tasks].sort((a, b) => {
    if (a.status === "rejected" && b.status !== "rejected") return -1;
    if (a.status !== "rejected" && b.status === "rejected") return 1;
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return (a.due_date ?? "9999-99-99").localeCompare(b.due_date ?? "9999-99-99");
  });

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sorted.length === 0 && (
        <p className={`${panelClass} px-5 py-6 text-sm text-white/45`}>No assigned tasks.</p>
      )}

      {sorted.map((task) => (
        <article key={task.id} className={`${panelClass} p-5`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge status={task.status} />
              <h2 className="font-display mt-3 text-2xl font-semibold uppercase">{task.title}</h2>
              <p className="mt-2 text-sm font-semibold text-gold">{task.task_type}</p>
            </div>
            <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${priorityClasses[task.priority]}`}>
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
              <p className="mt-2 text-sm leading-6 text-red-50/80">
                {task.admin_review_note}
              </p>
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
                    className={`${inputClass} mt-2 file:mr-4 file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink`}
                    name="proof_photos"
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    value="in_progress"
                    disabled={pendingTask === `${task.id}:in_progress`}
                    className="inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white/70 transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}
