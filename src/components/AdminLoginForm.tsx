"use client";

import { useActionState } from "react";
import { adminLoginAction, type AdminLoginState } from "@/lib/admin/actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="border border-cream-dark bg-white px-3.5 py-2.5 text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      {state?.error && (
        <p className="border border-status-processing/40 bg-status-processing/10 px-3.5 py-2.5 text-sm text-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-teal px-4 py-2.5 font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
