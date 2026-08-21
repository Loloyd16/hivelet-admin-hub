import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, Eye, Pencil, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, SectionCard, StatusBadge, DataItem, Field } from "@/components/hivelet/ui-bits";
import { ConfirmDialog, OnboardTenantModal } from "@/components/hivelet/modals";
import { TENANTS, peso, type Tenant } from "@/lib/hivelet-data";

export const Route = createFileRoute("/admin/tenants")({
  head: () => ({
    meta: [
      { title: "Active Tenant Directory | Hivelet Admin" },
      { name: "description", content: "Active residents, contacts, emergency details and account status." },
    ],
  }),
  component: TenantsPage,
});

function TenantsPage() {
  const [q, setQ] = useState("");
  const [onboard, setOnboard] = useState(false);
  const [profile, setProfile] = useState<Tenant | null>(null);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [vacating, setVacating] = useState<Tenant | null>(null);

  const rows = useMemo(
    () =>
      TENANTS.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.unit.toLowerCase().includes(q.toLowerCase()) ||
          t.phone.includes(q),
      ),
    [q],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Tenant Directory"
        description={`${TENANTS.length} residents currently on record.`}
        actions={
          <Button className="min-h-11 gap-2" onClick={() => setOnboard(true)}>
            <UserPlus className="size-4" /> Onboard Tenant
          </Button>
        }
      />

      <SectionCard>
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, unit or phone…"
              className="min-h-11 pl-9"
            />
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                {["Resident", "Unit", "Contact", "Emergency Contact", "Move-in", "Deposit", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.email}</p>
                  </td>
                  <td className="px-4 py-3 font-display font-bold uppercase">{t.unit}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3">{t.phone}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p>{t.emergencyName}</p>
                    <p className="tabular text-xs text-muted-foreground">{t.emergencyPhone}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{t.moveIn}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3">{peso(t.deposit)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={t.status === "notice" ? "Pending" : "Active"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="min-h-11" onClick={() => setProfile(t)}>
                        <Eye className="size-3.5" /> Profile
                      </Button>
                      <Button size="sm" variant="outline" className="min-h-11" onClick={() => setEditing(t)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="min-h-11" onClick={() => setVacating(t)}>
                        <LogOut className="size-3.5" /> Vacate
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <OnboardTenantModal open={onboard} onOpenChange={setOnboard} />

      <Dialog open={!!profile} onOpenChange={(v) => !v && setProfile(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          {profile ? (
            <>
              <DialogHeader>
                <DialogTitle>{profile.name}</DialogTitle>
                <DialogDescription>
                  Unit {profile.unit.toUpperCase()} · {profile.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <DataItem label="Phone" value={profile.phone} />
                <DataItem label="Email" value={profile.email} />
                <DataItem label="Occupation" value={profile.occupation} />
                <DataItem label="Occupants" value={`${profile.occupants} registered`} />
                <DataItem label="Move-in" value={profile.moveIn} />
                <DataItem label="Anniversary anchor" value={profile.anniversary} />
                <DataItem label="Deposit" value={peso(profile.deposit)} />
                <DataItem label="Facebook" value={profile.facebook} />
                <DataItem label="Emergency contact" value={profile.emergencyName} />
                <DataItem label="Emergency phone" value={profile.emergencyPhone} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          {editing ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit contact info</DialogTitle>
                <DialogDescription>{editing.name}</DialogDescription>
              </DialogHeader>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEditing(null);
                  toast.success("Contact details updated");
                }}
              >
                <Field label="Phone">
                  <Input defaultValue={editing.phone} className="min-h-11" />
                </Field>
                <Field label="Email">
                  <Input defaultValue={editing.email} className="min-h-11" />
                </Field>
                <Field label="Emergency contact name">
                  <Input defaultValue={editing.emergencyName} className="min-h-11" />
                </Field>
                <Field label="Emergency contact phone">
                  <Input defaultValue={editing.emergencyPhone} className="min-h-11" />
                </Field>
                <DialogFooter>
                  <Button type="submit" className="min-h-11">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!vacating}
        onOpenChange={(v) => !v && setVacating(null)}
        title="Settle vacancy & deactivate"
        description={`This closes the account of ${vacating?.name ?? ""} and marks unit ${vacating?.unit.toUpperCase() ?? ""} as vacant. Deposit settlement will be logged.`}
        confirmLabel="Settle Vacancy"
        destructive
        onConfirm={() => toast.warning("Vacancy settled", { description: "Unit released back to the directory." })}
      />
    </div>
  );
}
