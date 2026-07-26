export type Company = {
  id: string;
  name: string;
};

export type Branch = {
  id: string;
  companyId: string;
  name: string;
  deliveryAddress: string;
  shopifyCustomerEmail: string | null;
  shopifyCustomerId: string | null;
  xeroContactId: string | null;
};

export type PortalUser = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  password: string;
};

export type Product = {
  id: string;
  title: string;
  sku: string;
  price: number;
  emoji: string;
};

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
