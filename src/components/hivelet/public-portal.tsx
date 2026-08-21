import { useMemo, useState } from "react";
import {
  MapPin,
  BedDouble,
  Users,
  Building2,
  Check,
  Send,
  MessageCircle,
  ShieldCheck,
  Wifi,
  Droplets,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
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
import { UNITS, peso, HERO_PHOTO, LANDLADY, type Unit } from "@/lib/hivelet-data";
import { Field, StatusBadge } from "./ui-bits";
import { openChat } from "./chat-widget";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    key: "1BR",
    title: "1-Bedroom Unit",
    pax: "Up to 3 Pax",
    blurb: "Main boarding house rooms with private bathroom and submetered electricity.",
    icon: BedDouble,
    match: (u: Unit) => u.cluster === "BH" || u.cluster === "Linda Units",
  },
  {
    key: "2BR",
    title: "2-Bedroom Unit",
    pax: "Up to 4 Pax",
    blurb: "Front and back apartments with kitchenette, balcony access and parking.",
    icon: Building2,
    match: (u: Unit) => u.cluster === "Back Apartment" || u.cluster === "Front Apartment",
  },
  {
    key: "PH",
    title: "3-Bedroom / Penthouse Suite",
    pax: "Up to 5 Pax",
    blurb: "Top-floor suite with roof deck and panoramic view of Tanauan City.",
    icon: ShieldCheck,
    match: (u: Unit) => u.cluster === "Penthouse",
  },
];

export function PublicPortal() {
  const [category, setCategory] = useState("1BR");
  const [selected, setSelected] = useState<string | null>(null);
  const [inquiryUnit, setInquiryUnit] = useState<string>("");
  const [open, setOpen] = useState(false);

  const cat = CATEGORIES.find((c) => c.key === category)!;
  const list = useMemo(() => UNITS.filter(cat.match), [cat]);
  const active = list.find((u) => u.code === selected) ?? list[0];

  function openInquiry(unitCode: string) {
    setInquiryUnit(unitCode);
    setOpen(true);
  }

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={HERO_PHOTO}
          alt="Facade of Fe Galang Da Silva Boarding House in Sambat, Tanauan City"
          className="absolute inset-0 size-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
            <MapPin className="size-3.5" /> Sambat, Tanauan City, Batangas
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-primary-foreground sm:text-6xl">
            Fe Galang Da Silva Boarding House
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Thirty-two well-kept units across three floors — clean, secure, and minutes away from
            Tanauan City proper. Transparent rates, submetered electricity, no hidden fees.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="min-h-12 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => openInquiry("")}
            >
              Inquire Now <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-12 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => openChat()}
            >
              <MessageCircle className="size-4" /> Chat Live
            </Button>
          </div>
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["32", "Rentable units"],
              ["3", "Floors"],
              ["₱4,500", "Starting rate"],
              ["24/7", "Gate security"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur-sm">
                <dt className="font-display text-2xl font-bold text-primary-foreground">{v}</dt>
                <dd className="text-xs text-primary-foreground/70">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Category explorer */}
      <section className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Explore by unit category</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a category to browse live availability across the property.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const count = UNITS.filter(c.match).filter((u) => u.status === "vacant").length;
            return (
              <button
                key={c.key}
                onClick={() => {
                  setCategory(c.key);
                  setSelected(null);
                }}
                className={cn(
                  "surface-card group flex min-h-11 flex-col items-start p-5 text-left transition-all hover:shadow-lift",
                  category === c.key && "ring-2 ring-accent",
                )}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <c.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  {c.pax}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{c.blurb}</p>
                <span className="mt-4 text-xs font-semibold text-muted-foreground">
                  {count} vacant now
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 sm:px-6">
        <div className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_380px]">
            <div className="relative">
              <img
                src={active.photo}
                alt={`Interior of unit ${active.code}`}
                className="h-64 w-full object-cover sm:h-[26rem]"
                loading="lazy"
              />
              <div className="absolute left-4 top-4">
                <StatusBadge
                  label={active.status === "vacant" ? "Available" : "Reserved"}
                  tone={active.status === "vacant" ? "success" : "warning"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {active.cluster} · Floor {active.floor}
                </p>
                <h3 className="font-display text-2xl font-bold uppercase">Unit {active.code}</h3>
                <p className="text-sm text-muted-foreground">{active.type}</p>
              </div>
              <p className="tabular font-display text-3xl font-extrabold">
                {peso(active.rate)}
                <span className="text-sm font-medium text-muted-foreground"> / month</span>
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 font-semibold">
                  <Users className="size-3.5" /> Up to {active.capacity} pax
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 font-semibold">
                  <Droplets className="size-3.5" /> ₱200 water / occupant
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 font-semibold">
                  <Wifi className="size-3.5" /> Fiber ready
                </span>
              </div>
              <ul className="grid gap-2">
                {active.amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {a}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Button className="min-h-11 flex-1" onClick={() => openInquiry(active.code)}>
                  Inquire Now
                </Button>
                <Button variant="outline" className="min-h-11" onClick={() => openChat()}>
                  <MessageCircle className="size-4" /> Chat
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto border-t border-border bg-surface p-4">
            {list.map((u) => (
              <button
                key={u.code}
                onClick={() => setSelected(u.code)}
                className={cn(
                  "min-h-11 w-40 shrink-0 rounded-xl border border-border bg-card p-3 text-left transition-shadow hover:shadow-card",
                  u.code === active.code && "ring-2 ring-accent",
                )}
              >
                <p className="font-display text-sm font-bold uppercase">{u.code}</p>
                <p className="truncate text-[11px] text-muted-foreground">{u.type}</p>
                <p className="tabular mt-1 text-sm font-semibold">{peso(u.rate)}</p>
                <span
                  className={cn(
                    "mt-1 inline-block text-[11px] font-semibold",
                    u.status === "vacant" ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {u.status === "vacant" ? "Available" : "Reserved"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <InquiryDialog open={open} onOpenChange={setOpen} unit={inquiryUnit} setUnit={setInquiryUnit} />
    </main>
  );
}

function InquiryDialog({
  open,
  onOpenChange,
  unit,
  setUnit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  unit: string;
  setUnit: (v: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Inquire about a unit</DialogTitle>
          <DialogDescription>
            Send your message directly to {LANDLADY.name}. She usually replies within the day.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success("Inquiry sent", {
              description: "Fe Galang Da Silva has received your message.",
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input required placeholder="Juan Dela Cruz" className="min-h-11" />
            </Field>
            <Field label="Phone number">
              <Input required placeholder="0917-000-0000" className="min-h-11" />
            </Field>
          </div>
          <Field label="Email">
            <Input required type="email" placeholder="you@email.com" className="min-h-11" />
          </Field>
          <Field label="Target unit">
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
            >
              <option value="">Any available unit</option>
              {UNITS.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code.toUpperCase()} — {u.cluster} ({peso(u.rate)})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Message">
            <Textarea
              required
              rows={4}
              defaultValue="Good day po! Interested ako sa unit. Pwede po bang mag-viewing?"
            />
          </Field>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => {
                onOpenChange(false);
                openChat();
              }}
            >
              <MessageCircle className="size-4" /> Chat Live
            </Button>
            <Button type="submit" className="min-h-11">
              <Send className="size-4" /> Send Inquiry to Landlady
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
