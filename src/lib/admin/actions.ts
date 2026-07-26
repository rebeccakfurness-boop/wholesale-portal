"use server";

import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminPassword,
} from "@/lib/admin/session";

export type AdminLoginState = { error?: string };

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyAdminPassword(password))) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
