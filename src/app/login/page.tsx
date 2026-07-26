import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-teal p-12 lg:flex">
        <div>
          <p className="rx-label-heading -rotate-2 text-2xl text-white">Sweet Disorder</p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">
            Wholesale Portal
          </p>
        </div>
        <div className="max-w-sm">
          <p className="rx-label-heading text-3xl leading-snug text-white">
            &ldquo;Prescribing fun,&rdquo; one reorder at a time.
          </p>
          <p className="mt-4 text-sm text-white/80">
            Sign in to review order history for your store, and — if you run
            more than one location — switch between them in a click.
          </p>
        </div>
        <p className="text-xs text-white/70">
          Stockist login &middot; wholesale.sweetdisorder.co.nz
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-cream p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="rx-label-heading -rotate-2 text-2xl text-teal-dark">Sweet Disorder</p>
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">
              Wholesale Portal
            </p>
          </div>
          <div className="rx-card p-8 pt-9">
            <h1 className="rx-label-heading mb-1 text-xl text-ink">Sign in</h1>
            <p className="mb-6 text-sm text-ink-soft">
              Access your store&apos;s order history and reordering.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
