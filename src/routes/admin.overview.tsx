import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Banknote, TrendingUp, Home, ShieldAlert, Wrench, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard, StatusBadge, SectionCard } from "@/components/hivelet/ui-bits";
import { CashPaymentModal, UnitEditorDrawer, UnitSpecsModal } from "@/components/hivelet/modals";
import { UNITS, CLUSTERS, peso, type Unit, type UnitStatus } from "@/lib/hivelet-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/overview")({
  head: () => ({
    meta: [
      { title: "Executive Overview | Hivelet Admin" },
      {
        name: "description",
        content: "Revenue, occupancy, pending GCash verifications and the live 32-unit status matrix.",
      },
    ],
  }),
  component: Overview,
});

const STATUS_STYLE: Record<UnitStatus, string> = {
  settled: "border-success/30 bg-success-soft",
  pending: "border-warning/30 bg-warning-soft",
  overdue: "border-danger/30 bg-danger-soft",
  vacant: "border-border bg-neutral-soft",
  maintenance: "border-border bg-neutral-soft",
};

function Overview() {
  const [cashOpen, setCashOpen] = useState(false);
  const [specs, setSpecs] = useState<Unit | null>(null);
  const [editing, setEditing] = useState<Unit | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Overview"
        description="Live operating snapshot for Fe Galang Da Silva Boarding House — July to August 2026 cycle."
        actions={
          <Button className="min-h-11 gap-2" onClick={() => setCashOpen(true)}>
            <Banknote className="size-4" /> Record On-Site Cash Payment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly Revenue"
          value={peso(178500)}
          hint="+₱12,000 vs last month"
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Occupancy Rate"
          value="28 / 32 Units"
          hint="87.5% occupied • 4 vacant"
          icon={Home}
          tone="info"
        />
        <StatCard
          label="Pending GCash Verifications"
          value={peso(12400)}
          hint="2 remittances awaiting review"
          icon={ShieldAlert}
          tone="warning"
        />
        <StatCard
          label="Maintenance Alerts"
          value="2 Open"
          hint="1 emergency needs dispatch"
          icon={Wrench}
          tone="danger"
        />
      </div>

      <SectionCard
        title="32-Unit Visual Matrix"
        description="Grouped by property cluster. Colors reflect the current billing cycle."
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Settled" tone="success" />
            <StatusBadge label="Pending" tone="warning" />
            <StatusBadge label="Overdue" tone="danger" />
            <StatusBadge label="Vacant" tone="neutral" />
          </div>
        }
      >
        <div className="space-y-6 p-5">
          {CLUSTERS.map((cluster) => {
            const units = UNITS.filter((u) => u.cluster === cluster);
            return (
              <div key={cluster}>
                <div className="mb-3 flex items-baseline gap-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide">{cluster}</h3>
                  <span className="text-xs text-muted-foreground">{units.length} units</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {units.map((u) => (
                    <article
                      key={u.code}
                      className={cn(
                        "rounded-xl border p-4 transition-shadow hover:shadow-card",
                        STATUS_STYLE[u.status],
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-lg font-extrabold uppercase leading-none">{u.code}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{u.type}</p>
                        </div>
                        <StatusBadge label={u.status === "vacant" ? "Vacant" : u.status} />
                      </div>
                      <p className="mt-3 truncate text-sm font-semibold">{u.tenant ?? "No occupant"}</p>
                      <p className="tabular text-xs text-muted-foreground">{peso(u.rate)} / month</p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="min-h-11 flex-1 bg-card"
                          onClick={() => setSpecs(u)}
                        >
                          <Eye className="size-3.5" /> Specs
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="min-h-11 flex-1 bg-card"
                          onClick={() => setEditing(u)}
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <CashPaymentModal open={cashOpen} onOpenChange={setCashOpen} />
      <UnitSpecsModal unit={specs} onOpenChange={(v) => !v && setSpecs(null)} />
      <UnitEditorDrawer unit={editing} onOpenChange={(v) => !v && setEditing(null)} />
    </div>
  );
}
