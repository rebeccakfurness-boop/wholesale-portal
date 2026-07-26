import type { OrderStatus } from "@/lib/mock/types";

const STYLES: Record<OrderStatus, string> = {
  fulfilled: "bg-mint text-mint-deep",
  processing: "bg-blush text-rx-dark",
  invoiced: "bg-cream-dark text-ink-soft",
};

const LABELS: Record<OrderStatus, string> = {
  fulfilled: "Fulfilled",
  processing: "Processing",
  invoiced: "Invoiced",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
