import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { FileSpreadsheet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard } from "@/components/hivelet/ui-bits";
import {
  INCOME_ROWS,
  peso,
  halfShare,
  remitted,
  expectedWater,
  type IncomeRow,
  type Cluster,
} from "@/lib/hivelet-data";

export const Route = createFileRoute("/admin/income")({
  head: () => ({
    meta: [
      { title: "Income & Collections Ledger | Hivelet Admin" },
      {
        name: "description",
        content: "Excel-matched monthly collections ledger with 50% share, water and remittance totals.",
      },
    ],
  }),
  component: IncomePage,
});

const HEADERS = [
  "Rm #",
  "Date Paid",
  "Contact + Invoice #",
  "Rent For",
  "Rent Amount",
  "50% Share",
  "Occupants",
  "Water Payment",
  "GBG",
  "Remitted Amount",
  "Anniv Date",
  "Deposit",
];

const MAIN_GROUPS: Cluster[] = ["BH", "Back Apartment", "Penthouse", "Front Apartment"];

function sum(rows: IncomeRow[], fn: (r: IncomeRow) => number) {
  return rows.reduce((s, r) => s + fn(r), 0);
}

function Row({ r }: { r: IncomeRow }) {
  const mismatch = r.occupants > 0 && r.water !== expectedWater(r.occupants) && !r.linda;
  return (
    <tr className="border-b border-border hover:bg-surface">
      <td className="px-3 py-2 font-display font-bold uppercase">{r.unit}</td>
      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.datePaid}</td>
      <td className="whitespace-nowrap px-3 py-2">
        <span className="tabular">{r.contact}</span>
        <span className="ml-2 font-semibold text-danger">{r.invoice}</span>
      </td>
      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.rentFor}</td>
      <td className="tabular px-3 py-2 text-right font-semibold">{peso(r.rent)}</td>
      <td className="tabular px-3 py-2 text-right text-muted-foreground">{peso(halfShare(r.rent))}</td>
      <td className="px-3 py-2 text-center">{r.occupants}</td>
      <td className="tabular px-3 py-2 text-right">
        <span className="inline-flex items-center gap-1">
          {mismatch ? <AlertTriangle className="size-3.5 text-warning" /> : null}
          {peso(r.water)}
        </span>
      </td>
      <td className="tabular px-3 py-2 text-right text-muted-foreground">{peso(r.garbage)}</td>
      <td className="tabular px-3 py-2 text-right font-bold">{peso(remitted(r))}</td>
      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.anniversary}</td>
      <td className="tabular px-3 py-2 text-right">{peso(r.deposit)}</td>
    </tr>
  );
}

function SubtotalRow({ label, rows, strong }: { label: string; rows: IncomeRow[]; strong?: boolean }) {
  return (
    <tr className={strong ? "bg-primary text-primary-foreground" : "bg-secondary font-semibold"}>
      <td className="px-3 py-2 text-xs uppercase tracking-wide" colSpan={4}>
        {label}
      </td>
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, (r) => r.rent))}</td>
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, (r) => halfShare(r.rent)))}</td>
      <td className="px-3 py-2 text-center">{sum(rows, (r) => r.occupants)}</td>
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, (r) => r.water))}</td>
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, (r) => r.garbage))}</td>
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, remitted))}</td>
      <td />
      <td className="tabular px-3 py-2 text-right">{peso(sum(rows, (r) => r.deposit))}</td>
    </tr>
  );
}

function IncomePage() {
  const lindaRows = INCOME_ROWS.filter((r) => r.cluster === "Linda Units");
  const mainRows = INCOME_ROWS.filter((r) => r.cluster !== "Linda Units");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monthly Income & Collections Ledger"
        description="Cycle Jun.26 – Jul.25, 2026. Water is ₱200 per registered occupant; the 50% share is auto-computed as rent ÷ 2."
        actions={
          <Button
            className="min-h-11 gap-2"
            onClick={() => toast.success("Export ready", { description: "Hivelet-Income-Jul2026.xlsx generated." })}
          >
            <FileSpreadsheet className="size-4" /> Export Income to Excel
          </Button>
        }
      />

      <SectionCard>
        <div className="max-h-[75vh] overflow-auto">
          <table className="w-full min-w-[1280px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                {HEADERS.map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-border px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MAIN_GROUPS.map((g) => {
                const rows = INCOME_ROWS.filter((r) => r.cluster === g);
                return (
                  <Fragment key={g}>
                    <tr className="bg-surface">
                      <td colSpan={12} className="px-3 py-2 text-xs font-bold uppercase tracking-widest">
                        {g}
                      </td>
                    </tr>
                    {rows.map((r) => (
                      <Row key={r.unit} r={r} />
                    ))}
                    <SubtotalRow label={`${g} Subtotal`} rows={rows} />
                  </Fragment>
                );
              })}

              <SubtotalRow label="Grand Subtotal (excluding Linda Units)" rows={mainRows} strong />

              <tr className="bg-surface">
                <td colSpan={12} className="px-3 py-2 text-xs font-bold uppercase tracking-widest">
                  Linda Units — remitted separately to Linda
                </td>
              </tr>
              {lindaRows.map((r) => (
                <Row key={r.unit} r={r} />
              ))}
              <SubtotalRow label="Linda Separate Subtotal" rows={lindaRows} />
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Linda fixed-charge breakdown" description="Not included in the grand subtotal.">
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {lindaRows.map((r) => (
            <div key={r.unit} className="rounded-xl border border-border p-4">
              <p className="font-display text-lg font-bold uppercase">{r.unit}</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Fixed electricity</dt>
                <dd className="tabular text-right font-semibold">{peso(r.linda?.electricity ?? 0)}</dd>
                <dt className="text-muted-foreground">Fixed water</dt>
                <dd className="tabular text-right font-semibold">{peso(r.linda?.water ?? 0)}</dd>
                <dt className="font-semibold">Total to Linda</dt>
                <dd className="tabular text-right font-bold">
                  {peso((r.linda?.electricity ?? 0) + (r.linda?.water ?? 0))}
                </dd>
              </dl>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
