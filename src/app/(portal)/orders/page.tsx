import { redirect } from "next/navigation";
import { OrderCard } from "@/components/OrderCard";
import { getOrdersForBranch } from "@/lib/orders";
import { getCurrentBranch } from "@/lib/session";

export default async function OrderHistoryPage() {
  const branch = await getCurrentBranch();
  if (!branch) redirect("/login");

  const orders = await getOrdersForBranch(branch.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-ink">Order history</h1>
        <p className="text-sm text-ink-soft">{branch.name}</p>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="rx-card px-6 py-8 text-center text-sm text-ink-soft">
          No orders on file yet for {branch.name}.
        </div>
      )}
    </div>
  );
}
