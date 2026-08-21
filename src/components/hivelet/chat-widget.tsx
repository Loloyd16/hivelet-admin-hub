import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CHAT_EVENT = "hivelet:open-chat";

export function openChat() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHAT_EVENT));
}

interface Msg {
  id: number;
  from: "them" | "me";
  author: string;
  text: string;
  time: string;
}

const THREADS = [
  {
    name: "Gabriel Fernandez",
    unit: "Inquiry — Room 3e",
    seed: [
      {
        id: 1,
        from: "them" as const,
        author: "Gabriel Fernandez",
        text: "Good day po! Available pa po ba ang Room 3e this September?",
        time: "9:12 AM",
      },
      {
        id: 2,
        from: "me" as const,
        author: "Fe Galang Da Silva",
        text: "Good day! Opo, vacant pa ang 3e. ₱6,500/mo plus ₱200 water per occupant.",
        time: "9:20 AM",
      },
      {
        id: 3,
        from: "them" as const,
        author: "Gabriel Fernandez",
        text: "Salamat po! Pwede po bang mag-viewing this Saturday, 10 AM?",
        time: "9:22 AM",
      },
    ],
  },
  {
    name: "Maria Santos",
    unit: "Inquiry — Penthouse",
    seed: [
      {
        id: 1,
        from: "them" as const,
        author: "Maria Santos",
        text: "Hello po, may parking ba ang Penthouse?",
        time: "Yesterday",
      },
    ],
  },
  {
    name: "Samantha Cruz",
    unit: "Tenant — Room 204",
    seed: [
      {
        id: 1,
        from: "them" as const,
        author: "Samantha Cruz",
        text: "Ma'am, na-submit ko na po ang GCash proof for August.",
        time: "Mon",
      },
    ],
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [threads, setThreads] = useState<Msg[][]>(THREADS.map((t) => [...t.seed]));
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(CHAT_EVENT, handler);
    return () => window.removeEventListener(CHAT_EVENT, handler);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [threads, active, open]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setThreads((prev) =>
      prev.map((t, i) =>
        i === active
          ? [
              ...t,
              {
                id: t.length + 1,
                from: "me",
                author: "Fe Galang Da Silva",
                text,
                time: new Date().toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" }),
              },
            ]
          : t,
      ),
    );
    setDraft("");
  }

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 right-4 z-[60] flex h-[560px] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-display text-sm font-bold">Inquiry Inbox</p>
              <p className="text-[11px] opacity-70">Hivelet Live Chat</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="min-h-11 min-w-11 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4" />
            </Button>
          </header>

          <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-2 py-2">
            {THREADS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActive(i)}
                className={cn(
                  "min-h-11 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-colors",
                  i === active ? "bg-card text-foreground shadow-card" : "text-muted-foreground",
                )}
              >
                {t.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-3">
            <p className="text-center text-[11px] font-medium text-muted-foreground">
              {THREADS[active].unit}
            </p>
            {threads[active].map((m) => (
              <div key={m.id} className={cn("flex gap-2", m.from === "me" && "flex-row-reverse")}>
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <UserRound className="size-3.5" />
                </span>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                    m.from === "me"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-card",
                  )}
                >
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-60">{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border bg-card p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a reply…"
              className="min-h-11"
            />
            <Button type="submit" size="icon" className="min-h-11 min-w-11" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}

      <button
        onClick={() => setOpen(true)}
        aria-label="Open live chat"
        className="fixed bottom-4 right-4 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" />
        <span className="absolute -right-0.5 -top-0.5 grid size-6 place-items-center rounded-full bg-danger text-xs font-bold text-destructive-foreground ring-2 ring-background">
          3
        </span>
      </button>
    </>
  );
}
