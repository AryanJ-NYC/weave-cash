import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-16 text-center md:px-16 md:py-24 dark:from-blue-500 dark:to-blue-700">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl dark:bg-blue-300 dark:opacity-10" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-800 opacity-30 blur-3xl dark:opacity-20" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Want to accept crypto payments?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100 md:text-xl">
              Get started immediately.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/create"
                className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
              >
                Create Invoice
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-200">
              Self-custody &middot; Non-custodial &middot; Your keys, your
              crypto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
