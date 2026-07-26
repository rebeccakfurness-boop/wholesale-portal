import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-8">
      <div className="w-full max-w-sm">
        <p className="rx-label-heading mb-8 text-center text-lg text-teal-dark">
          Sweet Disorder — Admin
        </p>
        <div className="rx-card p-8 pt-9">
          <h1 className="rx-label-heading mb-1 text-xl text-ink">Admin sign in</h1>
          <p className="mb-6 text-sm text-ink-soft">
            Account setup and CSV import — internal use only.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
