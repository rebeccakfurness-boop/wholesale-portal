"use client";

import { useActionState } from "react";
import { resetUserPasswordAction, type ResetPasswordState } from "@/lib/admin/company-actions";

const initialState: ResetPasswordState = {};

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(resetUserPasswordAction, initialState);

  if (state.tempPassword) {
    return (
      <span className="font-mono text-xs text-ink">
        New password: <strong>{state.tempPassword}</strong>
      </span>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-medium text-teal-dark underline hover:text-teal disabled:opacity-60"
      >
        {pending ? "Resetting…" : "Reset password"}
      </button>
      {state.error && <p className="mt-1 text-xs text-status-processing">{state.error}</p>}
    </form>
  );
}
