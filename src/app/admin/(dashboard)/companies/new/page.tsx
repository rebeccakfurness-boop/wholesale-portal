import { createCompanyAction } from "@/lib/admin/company-actions";

export default function NewCompanyPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl text-ink">Add company</h1>
      <form action={createCompanyAction} className="rx-card flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Company name
          </label>
          <input
            id="name"
            name="name"
            required
            autoFocus
            placeholder="e.g. Acquisitions Ltd"
            className="border border-cream-dark bg-white px-3.5 py-2.5 text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
          />
        </div>
        <button
          type="submit"
          className="self-start bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark"
        >
          Create company
        </button>
      </form>
      <p className="text-sm text-ink-soft">
        You&apos;ll add branches and logins from the company&apos;s page next.
      </p>
    </div>
  );
}
