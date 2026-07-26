"use server";

import { redirect } from "next/navigation";
import { findUserByCredentials, getBranch, getOrder } from "@/lib/mock/data";
import { createSession, destroySession, getCurrentUser, setCurrentBranch } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = findUserByCredentials(email, password);
  if (!user) {
    return { error: "That email and password combination doesn't match a wholesale account." };
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
  const branch = getBranch(branchId);
  if (!branch || branch.companyId !== user!.companyId) {
    return;
  }

  await setCurrentBranch(branchId);
  const returnTo = String(formData.get("returnTo") ?? "/");
  redirect(returnTo);
}

export async function reorderAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const order = getOrder(orderId);
  if (!order) redirect("/orders");
  redirect(`/cart?from=${order!.id}`);
}
