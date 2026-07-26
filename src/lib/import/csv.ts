import { parse } from "csv-parse/sync";
import { eq } from "drizzle-orm";
import { generateTempPassword, hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db/client";
import { branches, companies, users } from "@/lib/db/schema";

export type ImportRowResult = {
  row: number;
  companyName: string;
  branchName: string;
  contactEmail: string;
  ok: boolean;
  summary: string;
  tempPassword?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_COLUMNS = ["company_name", "branch_name", "contact_email", "delivery_address"];

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

export function parseImportCsv(csvText: string): Record<string, string>[] {
  const records = parse(csvText, {
    columns: (headerRow: string[]) => headerRow.map(normalizeHeader),
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const missingColumns = REQUIRED_COLUMNS.filter((col) => !(col in (records[0] ?? {})));
  if (records.length > 0 && missingColumns.length > 0) {
    throw new Error(
      `CSV is missing required column(s): ${missingColumns.join(", ")}. Expected columns: company name, branch name, contact email, delivery address, shopify customer email (optional).`
    );
  }

  return records;
}

export async function importCsvRows(records: Record<string, string>[]): Promise<ImportRowResult[]> {
  const results: ImportRowResult[] = [];

  for (let i = 0; i < records.length; i++) {
    const rowNum = i + 2; // header is row 1
    const record = records[i];
    const companyName = (record.company_name ?? "").trim();
    const branchName = (record.branch_name ?? "").trim();
    const contactEmail = (record.contact_email ?? "").trim().toLowerCase();
    const deliveryAddress = (record.delivery_address ?? "").trim();
    const shopifyCustomerEmail = (record.shopify_customer_email ?? "").trim() || null;

    const base = { row: rowNum, companyName, branchName, contactEmail };

    if (!companyName || !branchName || !deliveryAddress || !contactEmail) {
      results.push({
        ...base,
        ok: false,
        summary:
          "Missing required field — company name, branch name, delivery address, and contact email are all required.",
      });
      continue;
    }

    if (!EMAIL_RE.test(contactEmail)) {
      results.push({ ...base, ok: false, summary: `"${contactEmail}" doesn't look like a valid email address.` });
      continue;
    }

    try {
      let company = await db.query.companies.findFirst({
        where: (c, { ilike }) => ilike(c.name, companyName),
      });
      let companyCreated = false;
      if (!company) {
        [company] = await db.insert(companies).values({ name: companyName }).returning();
        companyCreated = true;
      }

      let branch = await db.query.branches.findFirst({
        where: (b, { and, eq, ilike }) => and(eq(b.companyId, company!.id), ilike(b.name, branchName)),
      });
      let branchStatus: "created" | "updated" | "unchanged";
      if (!branch) {
        [branch] = await db
          .insert(branches)
          .values({ companyId: company.id, name: branchName, deliveryAddress, shopifyCustomerEmail })
          .returning();
        branchStatus = "created";
      } else if (branch.deliveryAddress !== deliveryAddress || branch.shopifyCustomerEmail !== shopifyCustomerEmail) {
        [branch] = await db
          .update(branches)
          .set({ deliveryAddress, shopifyCustomerEmail, updatedAt: new Date() })
          .where(eq(branches.id, branch.id))
          .returning();
        branchStatus = "updated";
      } else {
        branchStatus = "unchanged";
      }

      const existingUser = await db.query.users.findFirst({ where: eq(users.email, contactEmail) });

      if (existingUser && existingUser.companyId !== company.id) {
        results.push({
          ...base,
          ok: false,
          summary: `Branch ${branchStatus}, but "${contactEmail}" is already a login for a different company — left unchanged.`,
        });
        continue;
      }

      let tempPassword: string | undefined;
      let userNote: string;
      if (!existingUser) {
        tempPassword = generateTempPassword();
        await db.insert(users).values({
          companyId: company.id,
          name: contactEmail.split("@")[0],
          email: contactEmail,
          passwordHash: await hashPassword(tempPassword),
        });
        userNote = "login created";
      } else {
        userNote = "existing login";
      }

      const summaryParts = [companyCreated ? "new company" : null, `branch ${branchStatus}`, userNote].filter(
        Boolean
      );

      results.push({ ...base, ok: true, summary: summaryParts.join(", "), tempPassword });
    } catch (err) {
      results.push({
        ...base,
        ok: false,
        summary: err instanceof Error ? err.message : "Unknown error while importing this row.",
      });
    }
  }

  return results;
}
