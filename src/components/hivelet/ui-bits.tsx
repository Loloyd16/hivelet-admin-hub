import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-success-soft text-success-foreground ring-success/25",
  warning: "bg-warning-soft text-warning-foreground ring-warning/25",
  danger: "bg-danger-soft text-danger-foreground ring-danger/25",
  info: "bg-info-soft text-info-foreground ring-info/25",
  neutral: "bg-neutral-soft text-neutral-strong ring-border",
};

export function toneFor(value: string): Tone {
  const v = value.toLowerCase();
  if (["settled", "active", "resolved", "verified", "paid", "available"].includes(v)) return "success";
  if (["pending", "warning", "due", "notice", "reserved", "high"].includes(v)) return "warning";
  if (["overdue", "emergency", "error"].includes(v)) return "danger";
  if (["in progress", "open", "medium", "low"].includes(v)) return "info";
  return "neutral";
}

export function StatusBadge({
  label,
  tone,
  icon: Icon,
  className,
}: {
  label: string;
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
}) {
  const t = tone ?? toneFor(label);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
        TONE_CLASS[t],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="surface-card group relative overflow-hidden p-5 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg p-2 ring-1 ring-inset", TONE_CLASS[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="tabular mt-3 font-display text-3xl font-bold leading-tight">{value}</p>
      {hint ? <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card overflow-hidden", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function DataItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
