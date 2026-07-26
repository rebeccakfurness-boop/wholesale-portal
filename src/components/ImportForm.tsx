"use client";

import { useActionState } from "react";
import { importCsvAction, type ImportState } from "@/lib/admin/import-actions";

const initialState: ImportState = {};

export function ImportForm() {
  const [state, formAction, pending] = useActionState(importCsvAction, initialState);

  const createdCount = state.results?.filter((r) => r.tempPassword).length ?? 0;
  const errorCount = state.results?.filter((r) => !r.ok).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="rx-card flex flex-col gap-4 p-6">
        <div>
          <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-ink">
            CSV file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".csv,text/csv"
            required
            className="block w-full border border-cream-dark bg-white px-3.5 py-2.5 text-sm text-ink file:mr-3 file:border-0 file:bg-teal file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
          />
          <p className="mt-2 text-xs text-ink-soft">
            Columns: company name, branch name, contact email, delivery address, shopify
            customer email (optional). One row per branch — repeat the company name for each
            of that company&apos;s branches.
          </p>
        </div>

        {state.error && (
          <p className="border border-status-processing/40 bg-status-processing/10 px-3.5 py-2.5 text-sm text-ink">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="self-start bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
        >
          {pending ? "Importing…" : "Import"}
        </button>
      </form>

      {state.results && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
            <span>{state.results.length} row(s) processed</span>
            {createdCount > 0 && (
              <span className="border border-cream-dark bg-white px-2.5 py-1 text-xs font-medium text-ink">
                {createdCount} new login(s)
              </span>
            )}
            {errorCount > 0 && (
              <span className="border border-status-processing/40 bg-status-processing/10 px-2.5 py-1 text-xs font-medium text-ink">
                {errorCount} error(s)
              </span>
            )}
          </div>

          {createdCount > 0 && (
            <p className="border border-status-processing/40 bg-status-processing/10 px-3.5 py-2.5 text-sm text-ink">
              Temporary passwords below are shown <strong>once</strong> — copy them now to send
              to each contact. Reloading this page will lose them (reset from the company page
              if needed).
            </p>
          )}

          <div className="overflow-x-auto border border-cream-dark">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Row</th>
                  <th className="px-3 py-2.5 font-medium">Company</th>
                  <th className="px-3 py-2.5 font-medium">Branch</th>
                  <th className="px-3 py-2.5 font-medium">Contact email</th>
                  <th className="px-3 py-2.5 font-medium">Result</th>
                  <th className="px-3 py-2.5 font-medium">Temp password</th>
                </tr>
              </thead>
              <tbody>
                {state.results.map((r) => (
                  <tr key={r.row} className={`border-t border-cream-dark ${!r.ok ? "bg-status-processing/5" : ""}`}>
                    <td className="px-3 py-2.5 text-ink-soft">{r.row}</td>
                    <td className="px-3 py-2.5 font-medium text-ink">{r.companyName}</td>
                    <td className="px-3 py-2.5 text-ink">{r.branchName}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{r.contactEmail}</td>
                    <td className={`px-3 py-2.5 ${r.ok ? "text-ink-soft" : "text-status-processing"}`}>
                      {r.summary}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-ink">{r.tempPassword ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
