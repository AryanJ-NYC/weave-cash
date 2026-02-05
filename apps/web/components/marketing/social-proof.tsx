export function SocialProof() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-24 md:py-32 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Supported networks */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
            One platform, all major chains
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Accept payments from any supported network. NEAR intents handle the
            cross-chain complexity.
          </p>
        </div>

        {/* Chain grid */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CHAINS.map((chain) => (
            <div
              key={chain.name}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className={`text-3xl ${chain.color}`}>{chain.icon}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {chain.name}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-slate-200 pt-12 dark:border-slate-800">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
            >
              {badge.icon}
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CHAINS = [
  { name: 'Bitcoin', icon: '₿', color: 'text-orange-500' },
  { name: 'Ethereum', icon: 'Ξ', color: 'text-blue-400' },
  { name: 'Solana', icon: '◎', color: 'text-purple-400' },
  { name: 'NEAR', icon: 'Ⓝ', color: 'text-green-400' },
  { name: 'Polygon', icon: '⬡', color: 'text-violet-500' },
  { name: 'Arbitrum', icon: '🔷', color: '' },
  { name: 'Optimism', icon: '🔴', color: '' },
  { name: 'Avalanche', icon: '🔺', color: '' },
  { name: 'BNB Chain', icon: '🟡', color: '' },
  { name: 'Base', icon: '🔵', color: '' },
];

const TRUST_BADGES = [
  {
    label: 'Non-custodial',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },
  {
    label: 'Audited Smart Contracts',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    label: 'Powered by NEAR',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];
