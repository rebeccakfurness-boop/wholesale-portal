import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderCard } from "@/components/OrderCard";
import { getOrdersForBranch, orderTotal } from "@/lib/mock/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCurrentBranch, getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const branch = await getCurrentBranch();
  if (!branch) redirect("/login");

  const orders = getOrdersForBranch(branch.id);
  const recentOrders = orders.slice(0, 3);
  const lastOrder = orders[0];
  const yearToDateTotal = orders
    .filter((o) => o.placedAt.startsWith("2026"))
    .reduce((sum, o) => sum + orderTotal(o), 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-ink-soft">Welcome back,</p>
        <h1 className="font-heading text-2xl text-ink">{user.name}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rx-card px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Current location
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">{branch.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{branch.deliveryAddress}</p>
        </div>
        <div className="rx-card px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Last order
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {lastOrder ? formatDate(lastOrder.placedAt) : "No orders yet"}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {lastOrder ? `Script No. ${lastOrder.orderNumber}` : "—"}
          </p>
        </div>
        <div className="rx-card px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            2026 orders to date
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {formatCurrency(yearToDateTotal)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Across {orders.filter((o) => o.placedAt.startsWith("2026")).length} orders
          </p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg text-ink">Recent orders</h2>
          <Link href="/orders" className="text-sm font-medium text-teal-dark hover:underline">
            View full order history →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="rx-card px-6 py-8 text-center text-sm text-ink-soft">
            No orders on file yet for {branch.name}.
          </div>
        )}
      </div>
    </div>
  );
}
