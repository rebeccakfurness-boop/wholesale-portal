import { cookies } from "next/headers";
import { getBranchById, getBranchesForCompany, getCompanyById, getUserById } from "@/lib/db/queries";
import type { Branch, Company, User } from "@/lib/db/schema";
import { BRANCH_COOKIE, SESSION_COOKIE } from "@/lib/constants";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return (await getUserById(userId)) ?? null;
}

export async function getCurrentCompany(): Promise<Company | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return (await getCompanyById(user.companyId)) ?? null;
}

/**
 * Falls back to the company's first branch if no branch cookie is set yet,
 * or if the cookie references a branch outside the signed-in user's company.
 */
export async function getCurrentBranch(): Promise<Branch | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const companyBranches = await getBranchesForCompany(user.companyId);
  if (companyBranches.length === 0) return null;

  const store = await cookies();
  const branchId = store.get(BRANCH_COOKIE)?.value;
  if (branchId) {
    const branch = await getBranchById(branchId);
    if (branch && branch.companyId === user.companyId) {
      return branch;
    }
  }
  return companyBranches[0];
}

export async function getBranchesForCurrentUser(): Promise<Branch[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getBranchesForCompany(user.companyId);
}

export async function createSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, COOKIE_OPTIONS);
  store.delete(BRANCH_COOKIE);
}

export async function setCurrentBranch(branchId: string) {
  const store = await cookies();
  store.set(BRANCH_COOKIE, branchId, COOKIE_OPTIONS);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(BRANCH_COOKIE);
}
