import { useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  ReceiptText,
  Wrench,
  Inbox,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/admin/overview", label: "Executive Overview", icon: LayoutDashboard },
  { to: "/admin/directory", label: "Room & Rate Directory", icon: Building2 },
  { to: "/admin/tenants", label: "Active Tenants", icon: Users },
  { to: "/admin/income", label: "Income & Collections", icon: Wallet },
  { to: "/admin/expenses", label: "Monthly Expenses", icon: ReceiptText },
  { to: "/admin/tickets", label: "Maintenance Dispatch", icon: Wrench },
  { to: "/admin/inquiries", label: "Prospect Inquiries", icon: Inbox },
] as const;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Landlady Admin Workspace | Hivelet" },
      {
        name: "description",
        content:
          "Operations workspace for Fe Galang Da Silva Boarding House: occupancy, collections, expenses, and maintenance.",
      },
    ],
  }),
  component: AdminLayout,
});

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="grid gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
            pathname === item.to
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6">
      <aside className="sticky top-24 hidden h-[calc(100dvh-8rem)] w-64 shrink-0 rounded-2xl border border-border bg-sidebar p-3 lg:block">
        <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Operations
        </p>
        <NavList />
      </aside>

      <div className="min-w-0 flex-1">
        <Button variant="outline" className="mb-4 min-h-11 gap-2 lg:hidden" onClick={() => setOpen(true)}>
          <PanelLeft className="size-4" /> Menu
        </Button>
        <Outlet />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>Operations</SheetTitle>
          </SheetHeader>
          <div className="px-3">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
