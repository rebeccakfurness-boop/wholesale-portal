"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { generateTempPassword, hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db/client";
import { branches, companies, users } from "@/lib/db/schema";
import { getOtherUserWithEmail } from "@/lib/db/queries";

export async function createCompanyAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const [company] = await db.insert(companies).values({ name }).returning();
  redirect(`/admin/companies/${company.id}`);
}

export async function renameCompanyAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!companyId || !name) return;

  await db.update(companies).set({ name, updatedAt: new Date() }).where(eq(companies.id, companyId));
  redirect(`/admin/companies/${companyId}`);
}

export async function createBranchAction(formData: FormData) {
  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
  const shopifyCustomerEmail = String(formData.get("shopifyCustomerEmail") ?? "").trim() || null;
  if (!companyId || !name || !deliveryAddress) return;

  await db.insert(branches).values({ companyId, name, deliveryAddress, shopifyCustomerEmail });
  redirect(`/admin/companies/${companyId}`);
}

export async function updateBranchAction(formData: FormData) {
  const branchId = String(formData.get("branchId") ?? "");
  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
  const shopifyCustomerEmail = String(formData.get("shopifyCustomerEmail") ?? "").trim() || null;
  if (!branchId || !companyId || !name || !deliveryAddress) return;

  await db
    .update(branches)
    .set({ name, deliveryAddress, shopifyCustomerEmail, updatedAt: new Date() })
    .where(eq(branches.id, branchId));
  redirect(`/admin/companies/${companyId}`);
}

export type CreateUserState = { error?: string; tempPassword?: string; email?: string };

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!companyId || !name || !email) {
    return { error: "Name and email are required." };
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return { error: `${email} is already a login${existing.companyId !== companyId ? " for a different company" : ""}.` };
  }

  const tempPassword = generateTempPassword();
  await db.insert(users).values({ companyId, name, email, passwordHash: await hashPassword(tempPassword) });

  return { tempPassword, email };
}

export type ResetPasswordState = { error?: string; tempPassword?: string };

export async function resetUserPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return { error: "Missing user." };

  const tempPassword = generateTempPassword();
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(tempPassword), updatedAt: new Date() })
    .where(eq(users.id, userId));

  return { tempPassword };
}

export type UpdateUserEmailState = { error?: string };

export async function updateUserEmailAction(
  _prevState: UpdateUserEmailState,
  formData: FormData
): Promise<UpdateUserEmailState> {
  const userId = String(formData.get("userId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!userId || !email) return { error: "Email is required." };

  const conflict = await getOtherUserWithEmail(email, userId);
  if (conflict) return { error: `${email} is already used by another login.` };

  await db.update(users).set({ email, updatedAt: new Date() }).where(eq(users.id, userId));
  return {};
}
