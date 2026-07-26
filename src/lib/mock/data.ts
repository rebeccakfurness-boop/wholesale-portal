import type { Branch, Company, Order, PortalUser, Product } from "./types";

export const PRODUCTS: Product[] = [
  { id: "p1", title: "Chill Pills", sku: "SD-CHILL-01", price: 8.5, emoji: "💊" },
  { id: "p2", title: "You Rock", sku: "SD-ROCK-02", price: 9.0, emoji: "🪨" },
  { id: "p3", title: "Happy Tablets", sku: "SD-HAPPY-03", price: 8.5, emoji: "🙂" },
  { id: "p4", title: "Confidence Capsules", sku: "SD-CONF-04", price: 9.5, emoji: "✨" },
  { id: "p5", title: "Get Well Soon Gummies", sku: "SD-WELL-05", price: 7.5, emoji: "🍬" },
  { id: "p6", title: "Good Vibes Only Lozenges", sku: "SD-VIBE-06", price: 7.0, emoji: "🎵" },
  { id: "p7", title: "Sleep Tight Drops", sku: "SD-SLEEP-07", price: 8.0, emoji: "🌙" },
  { id: "p8", title: "Big Energy Boosters", sku: "SD-ENERGY-08", price: 9.0, emoji: "⚡" },
];

export const COMPANIES: Company[] = [
  { id: "c1", name: "Acquisitions Ltd" },
  { id: "c2", name: "Corner Dairy & Gifts" },
  { id: "c3", name: "Paper Moon Gift Co" },
];

export const BRANCHES: Branch[] = [
  {
    id: "b1",
    companyId: "c1",
    name: "Auckland CBD",
    deliveryAddress: "12 Queen St, Auckland CBD, Auckland 1010",
    shopifyCustomerEmail: "aucklandcbd@acquisitions.example",
    shopifyCustomerId: "gid://shopify/Customer/1001",
    xeroContactId: null,
  },
  {
    id: "b2",
    companyId: "c1",
    name: "Wellington",
    deliveryAddress: "45 Cuba St, Te Aro, Wellington 6011",
    shopifyCustomerEmail: "wellington@acquisitions.example",
    shopifyCustomerId: "gid://shopify/Customer/1002",
    xeroContactId: null,
  },
  {
    id: "b3",
    companyId: "c1",
    name: "Christchurch",
    deliveryAddress: "8 High St, Christchurch Central, Christchurch 8011",
    shopifyCustomerEmail: "christchurch@acquisitions.example",
    shopifyCustomerId: "gid://shopify/Customer/1003",
    xeroContactId: null,
  },
  {
    id: "b4",
    companyId: "c1",
    name: "Hamilton",
    deliveryAddress: "3 Victoria St, Hamilton Central, Hamilton 3204",
    shopifyCustomerEmail: "hamilton@acquisitions.example",
    shopifyCustomerId: "gid://shopify/Customer/1004",
    xeroContactId: null,
  },
  {
    id: "b5",
    companyId: "c2",
    name: "Ponsonby",
    deliveryAddress: "156 Ponsonby Rd, Ponsonby, Auckland 1011",
    shopifyCustomerEmail: "hello@cornerdairy.example",
    shopifyCustomerId: "gid://shopify/Customer/1005",
    xeroContactId: null,
  },
  {
    id: "b6",
    companyId: "c3",
    name: "Nelson",
    deliveryAddress: "22 Trafalgar St, Nelson 7010",
    shopifyCustomerEmail: "orders@papermoongifts.example",
    shopifyCustomerId: "gid://shopify/Customer/1006",
    xeroContactId: null,
  },
];

export const USERS: PortalUser[] = [
  {
    id: "u1",
    companyId: "c1",
    name: "Priya Nair",
    email: "priya@acquisitions.example",
    password: "wholesale2026",
  },
  {
    id: "u2",
    companyId: "c2",
    name: "Sam Ashworth",
    email: "sam@cornerdairy.example",
    password: "wholesale2026",
  },
  {
    id: "u3",
    companyId: "c3",
    name: "Jo Bell",
    email: "jo@papermoongifts.example",
    password: "wholesale2026",
  },
];

function items(...pairs: [string, number][]) {
  return pairs.map(([productId, qty]) => {
    const product = PRODUCTS.find((p) => p.id === productId)!;
    return {
      productId,
      title: product.title,
      sku: product.sku,
      qty,
      price: product.price,
    };
  });
}

export const ORDERS: Order[] = [
  {
    id: "o1",
    branchId: "b1",
    orderNumber: "SD-1042",
    placedAt: "2026-07-14",
    status: "fulfilled",
    lineItems: items(["p1", 24], ["p2", 12], ["p5", 36]),
  },
  {
    id: "o2",
    branchId: "b1",
    orderNumber: "SD-1015",
    placedAt: "2026-06-02",
    status: "fulfilled",
    lineItems: items(["p1", 12], ["p3", 24], ["p6", 12]),
  },
  {
    id: "o3",
    branchId: "b1",
    orderNumber: "SD-0988",
    placedAt: "2026-04-21",
    status: "fulfilled",
    lineItems: items(["p4", 12], ["p8", 12]),
  },
  {
    id: "o4",
    branchId: "b2",
    orderNumber: "SD-1039",
    placedAt: "2026-07-10",
    status: "processing",
    lineItems: items(["p2", 18], ["p7", 12], ["p1", 12]),
  },
  {
    id: "o5",
    branchId: "b2",
    orderNumber: "SD-0971",
    placedAt: "2026-03-18",
    status: "fulfilled",
    lineItems: items(["p5", 24], ["p3", 12]),
  },
  {
    id: "o6",
    branchId: "b3",
    orderNumber: "SD-1029",
    placedAt: "2026-06-28",
    status: "invoiced",
    lineItems: items(["p1", 36], ["p2", 24], ["p4", 12], ["p8", 6]),
  },
  {
    id: "o7",
    branchId: "b4",
    orderNumber: "SD-0955",
    placedAt: "2026-02-11",
    status: "fulfilled",
    lineItems: items(["p6", 12], ["p7", 12]),
  },
  {
    id: "o8",
    branchId: "b5",
    orderNumber: "SD-1031",
    placedAt: "2026-06-30",
    status: "fulfilled",
    lineItems: items(["p1", 6], ["p5", 12], ["p3", 6]),
  },
  {
    id: "o9",
    branchId: "b5",
    orderNumber: "SD-0902",
    placedAt: "2026-01-09",
    status: "fulfilled",
    lineItems: items(["p2", 6], ["p8", 6]),
  },
  {
    id: "o10",
    branchId: "b6",
    orderNumber: "SD-1020",
    placedAt: "2026-06-15",
    status: "fulfilled",
    lineItems: items(["p4", 18], ["p6", 12], ["p7", 6]),
  },
];

export function getCompany(companyId: string): Company | undefined {
  return COMPANIES.find((c) => c.id === companyId);
}

export function getBranchesForCompany(companyId: string): Branch[] {
  return BRANCHES.filter((b) => b.companyId === companyId);
}

export function getBranch(branchId: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === branchId);
}

export function getOrdersForBranch(branchId: string): Order[] {
  return ORDERS.filter((o) => o.branchId === branchId).sort((a, b) =>
    a.placedAt < b.placedAt ? 1 : -1
  );
}

export function getOrder(orderId: string): Order | undefined {
  return ORDERS.find((o) => o.id === orderId);
}

export function orderTotal(order: Order): number {
  return order.lineItems.reduce((sum, li) => sum + li.qty * li.price, 0);
}

export function findUserByCredentials(
  email: string,
  password: string
): PortalUser | undefined {
  return USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
}

export function getUser(userId: string): PortalUser | undefined {
  return USERS.find((u) => u.id === userId);
}
