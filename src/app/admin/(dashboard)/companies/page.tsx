import Link from "next/link";
import { listCompaniesWithCounts } from "@/lib/db/queries";

export default async function AdminCompaniesPage() {
  const companies = await listCompaniesWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Companies</h1>
        <Link
          href="/admin/companies/new"
          className="bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-dark"
        >
          Add company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="rx-card px-6 py-8 text-center text-sm text-ink-soft">
          No companies yet — add one, or use CSV Import for a bulk load.
        </div>
      ) : (
        <div className="overflow-hidden border border-cream-dark">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-4 py-2.5 text-right font-medium">Branches</th>
                <th className="px-4 py-2.5 text-right font-medium">Logins</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-t border-cream-dark">
                  <td className="px-4 py-3">
                    <Link href={`/admin/companies/${c.id}`} className="font-medium text-teal-dark hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-soft">{c.branchCount}</td>
                  <td className="px-4 py-3 text-right text-ink-soft">{c.userCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
