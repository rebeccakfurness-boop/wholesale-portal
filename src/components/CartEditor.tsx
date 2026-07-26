"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { LineItem } from "@/lib/mock/types";

export function CartEditor({
  initialItems,
  sourceOrderNumber,
}: {
  initialItems: LineItem[];
  sourceOrderNumber: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [handedOff, setHandedOff] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, li) => sum + li.qty * li.price, 0),
    [items]
  );

  function updateQty(productId: string, qty: number) {
    setItems((prev) =>
      prev.map((li) => (li.productId === productId ? { ...li, qty: Math.max(0, qty) } : li))
    );
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((li) => li.productId !== productId));
  }

  if (handedOff) {
    return (
      <div className="rx-card px-6 py-10 text-center">
        <span className="rx-stamp mx-auto mb-4">Rx</span>
        <h2 className="font-heading text-xl text-ink">Sent to checkout</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          This is a placeholder — once the Shopify Admin API is connected,
          this step will create a real draft order and hand you off to
          checkout to pay and confirm.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft">
        Repeating items from <span className="font-medium text-ink">Script No. {sourceOrderNumber}</span>.
        Adjust quantities below before sending to checkout.
      </p>

      <div className="rx-card divide-y divide-cream-dark overflow-hidden">
        {items.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-soft">
            Your cart is empty — remove items from too many carts, and this
            is where you&apos;d end up.
          </p>
        )}
        {items.map((li) => (
          <div key={li.productId} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="font-medium text-ink">{li.title}</p>
              <p className="text-xs text-ink-soft">{li.sku} &middot; {formatCurrency(li.price)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-cream-dark">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${li.title}`}
                  onClick={() => updateQty(li.productId, li.qty - 1)}
                  className="px-3 py-1.5 text-ink-soft hover:text-ink"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={li.qty}
                  onChange={(e) => updateQty(li.productId, Number(e.target.value) || 0)}
                  className="w-12 border-x border-cream-dark bg-transparent py-1.5 text-center outline-none"
                />
                <button
                  type="button"
                  aria-label={`Increase quantity of ${li.title}`}
                  onClick={() => updateQty(li.productId, li.qty + 1)}
                  className="px-3 py-1.5 text-ink-soft hover:text-ink"
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right font-medium text-ink">
                {formatCurrency(li.qty * li.price)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(li.productId)}
                className="text-xs text-ink-soft underline hover:text-status-processing"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rx-card flex items-center justify-between px-6 py-4">
        <p className="text-sm text-ink-soft">Order total</p>
        <p className="text-lg font-semibold text-ink">{formatCurrency(total)}</p>
      </div>

      <button
        type="button"
        disabled={items.length === 0}
        onClick={() => setHandedOff(true)}
        className="self-end bg-teal px-5 py-2.5 font-medium text-white transition hover:bg-teal-dark disabled:opacity-50"
      >
        Send to Shopify checkout
      </button>
    </div>
  );
}
