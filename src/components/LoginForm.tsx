"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourstore.co.nz"
          className="rounded-lg border border-cream-dark bg-white px-3.5 py-2.5 text-ink outline-none focus:border-mint-dark focus:ring-2 focus:ring-mint"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-lg border border-cream-dark bg-white px-3.5 py-2.5 text-ink outline-none focus:border-mint-dark focus:ring-2 focus:ring-mint"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-blush/60 px-3.5 py-2.5 text-sm text-rx-dark">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-rx px-4 py-2.5 font-medium text-white transition hover:bg-rx-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-ink-soft">
        New wholesale accounts are set up by Sweet Disorder — contact us if you
        need access.
      </p>
    </form>
  );
}
