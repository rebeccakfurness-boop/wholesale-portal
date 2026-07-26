import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { branches, companies, users } from "@/lib/db/schema";

export function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email.trim().toLowerCase()),
  });
}

export function getUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export function getCompanyById(id: string) {
  return db.query.companies.findFirst({ where: eq(companies.id, id) });
}

export function getBranchesForCompany(companyId: string) {
  return db.query.branches.findMany({
    where: eq(branches.companyId, companyId),
    orderBy: (branch, { asc }) => [asc(branch.name)],
  });
}

export function getBranchById(id: string) {
  return db.query.branches.findFirst({ where: eq(branches.id, id) });
}

export function getOtherUserWithEmail(email: string, excludingUserId: string) {
  return db.query.users.findFirst({
    where: and(eq(users.email, email.trim().toLowerCase()), ne(users.id, excludingUserId)),
  });
}

export function getUsersForCompany(companyId: string) {
  return db.query.users.findMany({
    where: eq(users.companyId, companyId),
    orderBy: (user, { asc }) => [asc(user.name)],
  });
}

export async function listCompaniesWithCounts() {
  return db
    .select({
      id: companies.id,
      name: companies.name,
      branchCount: sql<number>`count(distinct ${branches.id})::int`,
      userCount: sql<number>`count(distinct ${users.id})::int`,
    })
    .from(companies)
    .leftJoin(branches, eq(branches.companyId, companies.id))
    .leftJoin(users, eq(users.companyId, companies.id))
    .groupBy(companies.id)
    .orderBy(companies.name);
}
