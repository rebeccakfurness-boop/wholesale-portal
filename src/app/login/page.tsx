import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-teal p-12 lg:flex">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/sweet-disorder-logo.png"
            alt="Sweet Disorder"
            width={72}
            height={72}
            className="h-[72px] w-[72px]"
            priority
          />
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
            Wholesale
            <br />
            Portal
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
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/brand/sweet-disorder-logo.png"
              alt="Sweet Disorder"
              width={56}
              height={56}
              className="h-[56px] w-[56px]"
              priority
            />
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
