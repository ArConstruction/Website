import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PROOF_BUCKET = "task-proof-photos";

export type TrackRole = "admin" | "contractor";
export type TaskStatus = "open" | "in_progress" | "completed" | "rejected" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type TrackProfile = {
  id: string;
  full_name: string;
  role: TrackRole;
  trade: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkTask = {
  id: string;
  title: string;
  task_type: string;
  site_name: string;
  location: string | null;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to: string;
  created_by: string;
  due_date: string | null;
  completion_name: string | null;
  completion_type: string | null;
  completion_details: string | null;
  admin_review_note: string | null;
  rejected_at: string | null;
  proof_photo_paths: string[];
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TrackDatabase = {
  public: {
    Tables: {
      track_profiles: {
        Row: TrackProfile;
        Insert: Omit<TrackProfile, "created_at" | "updated_at">;
        Update: Partial<Omit<TrackProfile, "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "track_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      work_tasks: {
        Row: WorkTask;
        Insert: Omit<
          WorkTask,
          | "id"
          | "created_at"
          | "updated_at"
          | "completed_at"
          | "rejected_at"
          | "admin_review_note"
          | "proof_photo_paths"
        > & {
          id?: string;
          completed_at?: string | null;
          rejected_at?: string | null;
          admin_review_note?: string | null;
          proof_photo_paths?: string[];
        };
        Update: Partial<Omit<WorkTask, "id" | "created_at" | "created_by">>;
        Relationships: [
          {
            foreignKeyName: "work_tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "track_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "work_tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "track_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let browserClient: SupabaseClient<TrackDatabase> | null = null;

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getTrackSupabase() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    clearCorruptedTrackAuthStorage(url);

    browserClient = createClient<TrackDatabase>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

function isInvalidRefreshTokenError(error: unknown) {
  const message =
    error && typeof error === "object" && "message" in error && typeof error.message === "string"
      ? error.message.toLowerCase()
      : "";

  return (
    message.includes("refresh token") ||
    message.includes("invalid jwt") ||
    message.includes("session not found")
  );
}

function getTrackAuthStorageKey(supabaseUrl: string) {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    const projectRef = hostname.split(".")[0];
    return `sb-${projectRef}-auth-token`;
  } catch {
    return null;
  }
}

function clearCorruptedTrackAuthStorage(supabaseUrl: string) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getTrackAuthStorageKey(supabaseUrl);

  if (!storageKey) {
    return;
  }

  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored) as { refresh_token?: string | null };

    if (!parsed.refresh_token) {
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    window.localStorage.removeItem(storageKey);
  }
}

export async function clearInvalidTrackSession(client: SupabaseClient<TrackDatabase>) {
  await client.auth.signOut({ scope: "local" }).catch(() => undefined);
}

export async function getTrackSession(client: SupabaseClient<TrackDatabase>) {
  const { url } = getSupabaseConfig();

  if (url) {
    clearCorruptedTrackAuthStorage(url);
  }

  try {
    const { data, error } = await client.auth.getSession();

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        await clearInvalidTrackSession(client);
      }

      return null;
    }

    return data.session ?? null;
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      await clearInvalidTrackSession(client);
    }

    return null;
  }
}
