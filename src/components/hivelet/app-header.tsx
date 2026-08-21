import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Hexagon, Shield, User, Home, MessageCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { openChat } from "./chat-widget";

const ROLES = [
  { to: "/admin/overview", label: "Landlady Admin", short: "Admin", icon: Shield, match: "/admin" },
  { to: "/tenant", label: "Tenant Portal", short: "Tenant", icon: User, match: "/tenant" },
  { to: "/public", label: "Public Guest Showcase", short: "Guest", icon: Home, match: "/public" },
] as const;

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const activeMatch = ROLES.find((r) => pathname.startsWith(r.match))?.match ?? "/public";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <Link to="/public" className="flex min-h-11 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Hexagon className="size-5 fill-accent stroke-accent" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight">HIVELET</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Fe Galang Da Silva Boarding House
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 rounded-xl border border-border bg-surface p-1 lg:flex">
          {ROLES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                activeMatch === r.match
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <r.icon className="size-4" />
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="relative min-h-11 gap-2"
            onClick={() => openChat()}
            aria-label="Open live chat and inquiry inbox"
          >
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">Live Chat</span>
            <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-danger text-[11px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <div className="grid gap-1.5">
            {ROLES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold",
                  activeMatch === r.match ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <r.icon className="size-4" />
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
