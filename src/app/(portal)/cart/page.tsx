import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CartEditor } from "@/components/CartEditor";
import { getOrder } from "@/lib/orders";
import { getCurrentBranch } from "@/lib/session";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const branch = await getCurrentBranch();
  if (!branch) redirect("/login");

  if (!from) redirect("/orders");

  const order = await getOrder(from);
  if (!order || order.branchId !== branch.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/orders/${order.id}`} className="text-sm font-medium text-teal-dark hover:underline">
          ← Back to order
        </Link>
        <h1 className="font-heading mt-2 text-2xl text-ink">Reorder</h1>
      </div>

      <CartEditor initialItems={order.lineItems} sourceOrderNumber={order.orderNumber} />
    </div>
  );
}
