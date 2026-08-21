import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Banknote, Info, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UNITS, peso, type Unit } from "@/lib/hivelet-data";
import { Field } from "./ui-bits";

/* ------------------------------------------------ On-site cash payment modal */

export function CashPaymentModal({
  open,
  onOpenChange,
  defaultUnit = "",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultUnit?: string;
}) {
  const [unit, setUnit] = useState(defaultUnit);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (open) setUnit(defaultUnit);
  }, [open, defaultUnit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="size-5" /> Record On-Site Cash Payment
          </DialogTitle>
          <DialogDescription>Logs a cash remittance received in person.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success("Cash payment recorded", {
              description: `Unit ${unit.toUpperCase() || "—"} · ${peso(Number(amount) || 0)} posted to the July ledger.`,
            });
            setAmount("");
          }}
        >
          <Field label="Unit">
            <select
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              <option value="">Select a unit</option>
              {UNITS.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code.toUpperCase()} — {u.tenant ?? "Vacant"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Amount received (₱)">
            <Input
              required
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="4900"
              className="min-h-11"
            />
          </Field>
          <Field label="OR / Receipt number">
            <Input required placeholder="OR-2026-1055" className="min-h-11" />
          </Field>
          <Field label="Date received">
            <Input required type="date" defaultValue="2026-08-21" className="min-h-11" />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-h-11">
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------- Rate & unit specs drawer */

export function UnitEditorDrawer({
  unit,
  onOpenChange,
}: {
  unit: Unit | null;
  onOpenChange: (v: boolean) => void;
}) {
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (unit) setRate(unit.rate);
  }, [unit]);

  const cap = unit ? Math.round(unit.rate * 1.02) : 0;
  const overCap = unit ? rate > cap : false;

  return (
    <Sheet open={!!unit} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {unit ? (
          <>
            <SheetHeader>
              <SheetTitle className="uppercase">Unit {unit.code} — Rate & Specs</SheetTitle>
              <SheetDescription>
                {unit.cluster} · Floor {unit.floor} · {unit.type}
              </SheetDescription>
            </SheetHeader>
            <form
              className="grid gap-4 px-4 pb-6"
              onSubmit={(e) => {
                e.preventDefault();
                onOpenChange(false);
                toast.success("Unit updated", {
                  description: `Unit ${unit.code.toUpperCase()} rate set to ${peso(rate)} / month.`,
                });
              }}
            >
              <img
                src={unit.photo}
                alt={`Unit ${unit.code}`}
                className="h-40 w-full rounded-xl object-cover"
                loading="lazy"
              />
              <Field label="Monthly rate (₱)">
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="min-h-11"
                />
              </Field>
              <div
                className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
                  overCap ? "bg-warning-soft text-warning-foreground" : "bg-info-soft text-info-foreground"
                }`}
              >
                {overCap ? (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <Info className="mt-0.5 size-4 shrink-0" />
                )}
                <p>
                  2% annual price cap guidance: the maximum recommended rate for this unit is{" "}
                  <strong>{peso(cap)}</strong> (current {peso(unit.rate)}).{" "}
                  {overCap ? "Your entry exceeds the cap — a written 30-day notice is required." : "You are within the cap."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Capacity (pax)">
                  <Input type="number" defaultValue={unit.capacity} className="min-h-11" />
                </Field>
                <Field label="Registered occupants">
                  <Input type="number" defaultValue={unit.occupants} className="min-h-11" />
                </Field>
              </div>
              <Field label="Unit type">
                <Input defaultValue={unit.type} className="min-h-11" />
              </Field>
              <Field label="Billing rule">
                <Input defaultValue={unit.billingRule} className="min-h-11" />
              </Field>
              <Field label="Amenities / inclusions">
                <Textarea rows={3} defaultValue={unit.amenities.join(", ")} />
              </Field>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="min-h-11 flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="min-h-11 flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------- Unit specs viewer modal */

export function UnitSpecsModal({ unit, onOpenChange }: { unit: Unit | null; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={!!unit} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {unit ? (
          <>
            <DialogHeader>
              <DialogTitle className="uppercase">Unit {unit.code}</DialogTitle>
              <DialogDescription>
                {unit.cluster} · Floor {unit.floor} · {unit.type}
              </DialogDescription>
            </DialogHeader>
            <img src={unit.photo} alt={`Unit ${unit.code}`} className="h-48 w-full rounded-xl object-cover" loading="lazy" />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Rate</dt>
                <dd className="tabular font-semibold">{peso(unit.rate)} / mo</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Capacity</dt>
                <dd className="font-semibold">{unit.capacity} pax</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Occupant</dt>
                <dd className="font-semibold">{unit.tenant ?? "Vacant"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Billing rule</dt>
                <dd className="font-semibold">{unit.billingRule}</dd>
              </div>
            </dl>
            <ul className="grid gap-1.5 text-sm">
              {unit.amenities.map((a) => (
                <li key={a} className="text-muted-foreground">
                  • {a}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------- Tenant onboarding modal */

export function OnboardTenantModal({
  open,
  onOpenChange,
  prefill,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefill?: { name?: string; phone?: string; email?: string; unit?: string };
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5" /> Onboard New Tenant
          </DialogTitle>
          <DialogDescription>Creates the resident account and activates billing.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success("Tenant onboarded", { description: "Resident portal access has been issued." });
          }}
        >
          <Field label="Full name">
            <Input required defaultValue={prefill?.name ?? ""} placeholder="Juan Dela Cruz" className="min-h-11" />
          </Field>
          <Field label="Email">
            <Input required type="email" defaultValue={prefill?.email ?? ""} placeholder="you@email.com" className="min-h-11" />
          </Field>
          <Field label="Phone">
            <Input required defaultValue={prefill?.phone ?? ""} placeholder="0917-000-0000" className="min-h-11" />
          </Field>
          <Field label="Unit">
            <select
              required
              defaultValue={prefill?.unit ?? ""}
              className="min-h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              <option value="">Select a unit</option>
              {UNITS.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code.toUpperCase()} — {peso(u.rate)} ({u.status === "vacant" ? "Vacant" : "Occupied"})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Move-in date">
            <Input required type="date" className="min-h-11" />
          </Field>
          <Field label="Anniversary anchor date" hint="Used to derive the billing period.">
            <Input required type="date" className="min-h-11" />
          </Field>
          <Field label="Deposit (₱)">
            <Input required type="number" placeholder="9000" className="min-h-11" />
          </Field>
          <Field label="Occupants" hint="Water is ₱200 per registered occupant.">
            <Input required type="number" min={1} defaultValue={1} className="min-h-11" />
          </Field>
          <Field label="Emergency contact name">
            <Input required placeholder="Maria Santos" className="min-h-11" />
          </Field>
          <Field label="Emergency contact phone">
            <Input required placeholder="0928-000-0000" className="min-h-11" />
          </Field>
          <Field label="Occupation">
            <Input placeholder="BPO Team Lead" className="min-h-11" />
          </Field>
          <Field label="Facebook link">
            <Input placeholder="facebook.com/username" className="min-h-11" />
          </Field>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-h-11">
              Onboard Tenant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------- Confirmation dialog */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className={destructive ? "size-5 text-danger" : "size-5 text-warning"} />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="min-h-11"
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
