import { ImportForm } from "@/components/ImportForm";

export default function AdminImportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-ink">CSV Import</h1>
        <p className="text-sm text-ink-soft">
          Bulk-load wholesale accounts. Safe to re-run — matching companies/branches are
          updated in place rather than duplicated, and existing logins are left untouched.
        </p>
      </div>
      <ImportForm />
    </div>
  );
}
