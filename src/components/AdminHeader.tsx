import Link from "next/link";
import { adminLogoutAction } from "@/lib/admin/actions";

export function AdminHeader() {
  return (
    <header className="border-b border-cream-dark bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/companies" className="rx-label-heading text-lg text-teal-dark">
            Sweet Disorder — Admin
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/companies"
              className="px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-cream-dark hover:text-ink"
            >
              Companies
            </Link>
            <Link
              href="/admin/import"
              className="px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-cream-dark hover:text-ink"
            >
              CSV Import
            </Link>
          </nav>
        </div>

        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="border border-cream-dark px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-cream-dark hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
