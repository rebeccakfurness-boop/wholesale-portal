// Order history is sourced live from Shopify (step 4) rather than stored in
// Postgres — these are just the shapes the UI renders, backed by an empty
// placeholder until that integration lands.

export type LineItem = {
  productId: string;
  title: string;
  sku: string;
  qty: number;
  price: number;
};

export type OrderStatus = "fulfilled" | "processing" | "invoiced";

export type Order = {
  id: string;
  branchId: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  lineItems: LineItem[];
};

export async function getOrdersForBranch(_branchId: string): Promise<Order[]> {
  return [];
}

export async function getOrder(_orderId: string): Promise<Order | null> {
  return null;
}

export function orderTotal(order: Order): number {
  return order.lineItems.reduce((sum, li) => sum + li.qty * li.price, 0);
}
