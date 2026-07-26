"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { switchBranchAction } from "@/lib/actions";
import type { Branch } from "@/lib/mock/types";

export function BranchSwitcher({
  branches,
  currentBranchId,
}: {
  branches: Branch[];
  currentBranchId: string;
}) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={switchBranchAction} className="flex items-center gap-2">
      <input type="hidden" name="returnTo" value={pathname} />
      <label htmlFor="branchId" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
        Location
      </label>
      <select
        id="branchId"
        name="branchId"
        defaultValue={currentBranchId}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-cream-dark bg-white px-3 py-1.5 text-sm font-medium text-ink outline-none focus:border-mint-dark focus:ring-2 focus:ring-mint"
      >
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </form>
  );
}
