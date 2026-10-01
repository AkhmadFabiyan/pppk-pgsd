import { CalendarClock } from "lucide-react";

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="status-badge" aria-label={`Status pemilihan: ${label}`}>
      <CalendarClock aria-hidden="true" size={15} strokeWidth={2.2} />
      {label}
    </span>
  );
}
