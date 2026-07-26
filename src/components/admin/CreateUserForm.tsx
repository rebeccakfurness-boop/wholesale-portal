"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "@/lib/admin/company-actions";

const initialState: CreateUserState = {};

export function CreateUserForm({ companyId }: { companyId: string }) {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);

  if (state.tempPassword) {
    return (
      <div className="border border-status-processing/40 bg-status-processing/10 px-4 py-3 text-sm text-ink">
        <p>
          Login created for <strong>{state.email}</strong>. Temporary password (shown once —
          copy it now):
        </p>
        <p className="mt-1 font-mono text-base">{state.tempPassword}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="companyId" value={companyId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="new-user-name" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Name
        </label>
        <input
          id="new-user-name"
          name="name"
          required
          className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="new-user-email" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Email
        </label>
        <input
          id="new-user-email"
          name="email"
          type="email"
          required
          className="border border-cream-dark bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-teal px-4 py-1.5 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add login"}
      </button>
      {state.error && <p className="w-full text-sm text-status-processing">{state.error}</p>}
    </form>
  );
}
