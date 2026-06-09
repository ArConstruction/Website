import type { TaskPriority } from "@/lib/supabaseTrack";

export type CreateTaskInput = {
  title: string;
  taskType: string;
  siteName: string;
  location: string | null;
  description: string;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string | null;
};

const validPriorities: TaskPriority[] = ["low", "normal", "high", "urgent"];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseCreateTaskBody(body: Record<string, unknown>): CreateTaskInput {
  const priority = clean(body.priority) as TaskPriority;

  return {
    title: clean(body.title),
    taskType: clean(body.taskType ?? body.task_type),
    siteName: clean(body.siteName ?? body.site_name),
    location: clean(body.location) || null,
    description: clean(body.description),
    priority: validPriorities.includes(priority) ? priority : "normal",
    assignedTo: clean(body.assignedTo ?? body.assigned_to),
    dueDate: clean(body.dueDate ?? body.due_date) || null,
  };
}

export function validateCreateTaskInput(input: CreateTaskInput): string | null {
  if (!input.title) {
    return "Enter a task name.";
  }

  if (!input.taskType) {
    return "Enter a task type.";
  }

  if (!input.siteName) {
    return "Enter a site name.";
  }

  if (!input.description) {
    return "Enter task details.";
  }

  if (!input.assignedTo) {
    return "Choose a contractor before opening the task.";
  }

  return null;
}
