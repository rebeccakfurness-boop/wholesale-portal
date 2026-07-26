import type { OrderStatus } from "@/lib/orders";

const DOT_COLORS: Record<OrderStatus, string> = {
  fulfilled: "bg-status-fulfilled",
  processing: "bg-status-processing",
  invoiced: "bg-status-invoiced",
};

const LABELS: Record<OrderStatus, string> = {
  fulfilled: "Fulfilled",
  processing: "Processing",
  invoiced: "Invoiced",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-dark bg-white px-2.5 py-1 text-xs font-medium text-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[status]}`} aria-hidden="true" />
      {LABELS[status]}
    </span>
  );
}
