import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import { BranchSwitcher } from "@/components/BranchSwitcher";
import { NavLinks } from "@/components/NavLinks";
import type { Branch, Company, PortalUser } from "@/lib/mock/types";

export function Header({
  company,
  user,
  branches,
  currentBranch,
}: {
  company: Company;
  user: PortalUser;
  branches: Branch[];
  currentBranch: Branch;
}) {
  return (
    <header className="border-b border-cream-dark bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="rx-stamp text-xs">Rx</span>
            <span className="rx-label-heading text-lg text-mint-deep">
              Sweet Disorder
            </span>
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          {branches.length > 1 ? (
            <BranchSwitcher branches={branches} currentBranchId={currentBranch.id} />
          ) : (
            <span className="text-sm text-ink-soft">{currentBranch.name}</span>
          )}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-ink">{company.name}</p>
            <p className="text-xs text-ink-soft">{user.name}</p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-cream-dark hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
