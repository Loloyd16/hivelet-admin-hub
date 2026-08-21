import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, SectionCard, StatusBadge } from "@/components/hivelet/ui-bits";
import { UnitEditorDrawer } from "@/components/hivelet/modals";
import { UNITS, CLUSTERS, peso, type Unit } from "@/lib/hivelet-data";

export const Route = createFileRoute("/admin/directory")({
  head: () => ({
    meta: [
      { title: "Room & Rate Directory | Hivelet Admin" },
      { name: "description", content: "All 32 canonical units with clusters, billing rules and monthly rates." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState("All");
  const [editing, setEditing] = useState<Unit | null>(null);

  const rows = useMemo(
    () =>
      UNITS.filter(
        (u) =>
          (cluster === "All" || u.cluster === cluster) &&
          (u.code.toLowerCase().includes(q.toLowerCase()) ||
            (u.tenant ?? "").toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cluster],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room & Rate Directory"
        description="The canonical unit register across the 5 property clusters."
      />

      <SectionCard>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search unit code or tenant…"
              className="min-h-11 pl-9"
            />
          </div>
          <select
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
            className="min-h-11 rounded-lg border border-input bg-card px-3 text-sm sm:w-56"
          >
            <option>All</option>
            {CLUSTERS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                {["Unit", "Cluster", "Type", "Billing Rule", "Rate (₱/mo)", "Status", "Primary Tenant", ""].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.code} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-4 py-3 font-display font-bold uppercase">{u.code}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{u.cluster}</td>
                  <td className="whitespace-nowrap px-4 py-3">{u.type}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.billingRule}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3 font-semibold">{peso(u.rate)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={u.status === "vacant" ? "Vacant" : u.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{u.tenant ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" className="min-h-11" onClick={() => setEditing(u)}>
                      <Pencil className="size-3.5" /> Edit Rate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <UnitEditorDrawer unit={editing} onOpenChange={(v) => !v && setEditing(null)} />
    </div>
  );
}
