import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { reorderAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { orderTotal } from "@/lib/orders";
import type { Order } from "@/lib/orders";

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.lineItems.reduce((sum, li) => sum + li.qty, 0);
  const summary = order.lineItems
    .map((li) => `${li.title} ×${li.qty}`)
    .join(", ");

  return (
    <div className="rx-card px-6 pb-5 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rx-stamp">Rx</span>
          <div>
            <p className="rx-label-heading text-base text-ink">
              Script No. {order.orderNumber}
            </p>
            <p className="text-xs text-ink-soft">
              Filled {formatDate(order.placedAt)} &middot; {itemCount} items
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-ink-soft">{summary}</p>

      <div className="mt-5 flex items-center justify-between border-t border-dashed border-cream-dark pt-4">
        <p className="font-semibold text-ink">{formatCurrency(orderTotal(order))}</p>
        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.id}`}
            className="border border-cream-dark px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-cream-dark hover:text-ink"
          >
            View
          </Link>
          <form action={reorderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="bg-teal px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-dark"
            >
              Reorder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
