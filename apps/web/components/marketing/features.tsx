export function Features() {
  return (
    <>
      {/* Value Props Section */}
      <section className="bg-slate-50 py-24 md:py-32 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              Built for crypto-native businesses
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Everything you need to accept crypto payments—without the
              complexity.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-950">
                  {prop.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {prop.title}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              From invoice to settlement in seconds—powered by NEAR intents.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-blue-200 to-transparent lg:block dark:from-blue-900" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/25 dark:bg-blue-500 dark:shadow-blue-500/25">
                    {index + 1}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const VALUE_PROPS = [
  {
    title: 'Multi-Chain',
    description:
      'Accept BTC, ETH, SOL, and 20+ tokens. Your customers pay with whatever crypto they have.',
    icon: '🔗',
  },
  {
    title: 'Instant Settlement',
    description:
      'Receive your preferred crypto immediately via NEAR. No waiting for confirmations.',
    icon: '⚡',
  },
  {
    title: 'Self-Custody',
    description:
      'You control your keys. No third-party custody risk. Your crypto goes directly to your wallet.',
    icon: '🔐',
  },
];

const STEPS = [
  {
    title: 'Create Invoice',
    description: 'Set your preferred settlement currency and amount.',
  },
  {
    title: 'Customer Pays',
    description: 'They pay with any supported cryptocurrency.',
  },
  {
    title: 'NEAR Swaps',
    description: 'Intents automatically convert to your crypto.',
  },
  {
    title: 'You Receive',
    description: 'Funds arrive in your wallet instantly.',
  },
];
