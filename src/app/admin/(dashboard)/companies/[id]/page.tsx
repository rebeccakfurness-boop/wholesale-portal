import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { ResetPasswordButton } from "@/components/admin/ResetPasswordButton";
import {
  createBranchAction,
  renameCompanyAction,
  updateBranchAction,
} from "@/lib/admin/company-actions";
import { getBranchesForCompany, getCompanyById, getUsersForCompany } from "@/lib/db/queries";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) notFound();

  const [companyBranches, companyUsers] = await Promise.all([
    getBranchesForCompany(id),
    getUsersForCompany(id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/companies" className="text-sm font-medium text-teal-dark hover:underline">
          ← All companies
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-heading text-2xl text-ink">{company.name}</h1>
          <details className="group">
            <summary className="cursor-pointer list-none text-xs font-medium text-teal-dark underline">
              Rename
            </summary>
            <form action={renameCompanyAction} className="mt-3 flex items-end gap-2">
              <input type="hidden" name="companyId" value={company.id} />
              <input
                name="name"
                defaultValue={company.name}
                required
                className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
              />
              <button type="submit" className="bg-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-dark">
                Save
              </button>
            </form>
          </details>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg text-ink">Branches</h2>

        {companyBranches.length > 0 && (
          <div className="overflow-hidden border border-cream-dark">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Delivery address</th>
                  <th className="px-4 py-2.5 font-medium">Shopify email</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {companyBranches.map((branch) => (
                  <tr key={branch.id} className="border-t border-cream-dark align-top">
                    <td className="px-4 py-3 font-medium text-ink">{branch.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{branch.deliveryAddress}</td>
                    <td className="px-4 py-3 text-ink-soft">{branch.shopifyCustomerEmail ?? "—"}</td>
                    <td className="px-4 py-3">
                      <details>
                        <summary className="cursor-pointer list-none text-xs font-medium text-teal-dark underline">
                          Edit
                        </summary>
                        <form action={updateBranchAction} className="mt-3 flex flex-col gap-2">
                          <input type="hidden" name="branchId" value={branch.id} />
                          <input type="hidden" name="companyId" value={company.id} />
                          <input
                            name="name"
                            defaultValue={branch.name}
                            required
                            placeholder="Branch name"
                            className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
                          />
                          <input
                            name="deliveryAddress"
                            defaultValue={branch.deliveryAddress}
                            required
                            placeholder="Delivery address"
                            className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
                          />
                          <input
                            name="shopifyCustomerEmail"
                            defaultValue={branch.shopifyCustomerEmail ?? ""}
                            placeholder="Shopify customer email (optional)"
                            className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
                          />
                          <button
                            type="submit"
                            className="self-start bg-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-dark"
                          >
                            Save
                          </button>
                        </form>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <details className="rx-card p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-teal-dark">
            + Add branch
          </summary>
          <form action={createBranchAction} className="mt-4 flex flex-col gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">Name</label>
              <input
                name="name"
                required
                placeholder="e.g. Wellington"
                className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Delivery address
              </label>
              <input
                name="deliveryAddress"
                required
                className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Shopify customer email (optional)
              </label>
              <input
                name="shopifyCustomerEmail"
                type="email"
                className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
              />
            </div>
            <button
              type="submit"
              className="self-start bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark"
            >
              Add branch
            </button>
          </form>
        </details>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg text-ink">Logins</h2>

        {companyUsers.length > 0 && (
          <div className="overflow-hidden border border-cream-dark">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Email</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {companyUsers.map((user) => (
                  <tr key={user.id} className="border-t border-cream-dark">
                    <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{user.email}</td>
                    <td className="px-4 py-3">
                      <ResetPasswordButton userId={user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="rx-card p-4">
          <p className="mb-3 text-sm font-medium text-ink">+ Add login</p>
          <CreateUserForm companyId={company.id} />
        </div>
      </section>
    </div>
  );
}
