"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth/password";
import { getBranchById, getUserByEmail } from "@/lib/db/queries";
import { getOrder } from "@/lib/orders";
import { createSession, destroySession, getCurrentUser, setCurrentBranch } from "@/lib/session";

export type LoginState = { error?: string };

const GENERIC_LOGIN_ERROR =
  "That email and password combination doesn't match a wholesale account.";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: GENERIC_LOGIN_ERROR };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function switchBranchAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const branchId = String(formData.get("branchId") ?? "");
  const branch = await getBranchById(branchId);
  if (!branch || branch.companyId !== user!.companyId) {
    return;
  }

  await setCurrentBranch(branchId);
  const returnTo = String(formData.get("returnTo") ?? "/");
  redirect(returnTo);
}

export async function reorderAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const order = await getOrder(orderId);
  if (!order) redirect("/orders");
  redirect(`/cart?from=${order!.id}`);
}
