export interface CheckInEntry {
  id: string;
  date: string; // ISO string
  craving: boolean;
  intensity?: number;
  trigger?: string;
  choice?: string;
}

const STORAGE_KEY = "craving-check-ins";

export function saveCheckIn(entry: Omit<CheckInEntry, "id" | "date">): CheckInEntry {
  const full: CheckInEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const existing = getCheckIns();
  existing.unshift(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return full;
}

export function getCheckIns(): CheckInEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function groupByDate(entries: CheckInEntry[]): Record<string, CheckInEntry[]> {
  const groups: Record<string, CheckInEntry[]> = {};
  for (const e of entries) {
    const key = new Date(e.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return groups;
}
