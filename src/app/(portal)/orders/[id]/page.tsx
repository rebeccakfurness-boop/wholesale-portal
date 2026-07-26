import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { reorderAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrder, orderTotal } from "@/lib/orders";
import { getCurrentBranch } from "@/lib/session";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branch = await getCurrentBranch();
  if (!branch) redirect("/login");

  const order = await getOrder(id);
  if (!order || order.branchId !== branch.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/orders" className="text-sm font-medium text-teal-dark hover:underline">
          ← Back to order history
        </Link>
      </div>

      <div className="rx-card px-6 pb-6 pt-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rx-stamp text-base">Rx</span>
            <div>
              <p className="rx-label-heading text-xl text-ink">
                Script No. {order.orderNumber}
              </p>
              <p className="text-sm text-ink-soft">Filled {formatDate(order.placedAt)}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-6 grid gap-4 border-y border-dashed border-cream-dark py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Delivered to
            </p>
            <p className="mt-1 text-sm text-ink">{branch.name}</p>
            <p className="text-sm text-ink-soft">{branch.deliveryAddress}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Order total
            </p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {formatCurrency(orderTotal(order))}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-cream-dark">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-2.5 font-medium">Product</th>
                <th className="px-4 py-2.5 font-medium">SKU</th>
                <th className="px-4 py-2.5 text-right font-medium">Qty</th>
                <th className="px-4 py-2.5 text-right font-medium">Unit price</th>
                <th className="px-4 py-2.5 text-right font-medium">Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((li) => (
                <tr key={li.productId} className="border-t border-cream-dark">
                  <td className="px-4 py-3 font-medium text-ink">{li.title}</td>
                  <td className="px-4 py-3 text-ink-soft">{li.sku}</td>
                  <td className="px-4 py-3 text-right text-ink-soft">{li.qty}</td>
                  <td className="px-4 py-3 text-right text-ink-soft">
                    {formatCurrency(li.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-ink">
                    {formatCurrency(li.price * li.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <form action={reorderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="bg-teal px-5 py-2.5 font-medium text-white transition hover:bg-teal-dark"
            >
              Reorder all items
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
