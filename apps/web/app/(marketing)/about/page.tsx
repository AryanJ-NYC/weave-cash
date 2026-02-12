export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          About WeaveCash: The Future of Sovereign Web3 Payments
        </h1>
      </header>

      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        <p>
          Welcome to <strong className="text-slate-900 dark:text-white">WeaveCash</strong>, where you
          can accept all cryptocurrencies and store-your-value.
        </p>
        <p>
          We are redefining the{' '}
          <strong className="text-slate-900 dark:text-white">crypto payment gateway</strong> for the
          modern era of commerce. Our mission is simple: to empower merchants, freelancers, and DAOs
          with a truly decentralized, self-sovereign way to handle{' '}
          <strong className="text-slate-900 dark:text-white">Web3 payments</strong> without the
          friction of traditional financial intermediaries.
        </p>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Redefining How to Accept Crypto Payments as a Business
          </h2>
          <p className="mb-4">
            For years, businesses wanting to know how to accept crypto payments as a business were
            forced to choose between complex technical setups or custodial services that took a cut of
            every sale. WeaveCash eliminates that compromise through{' '}
            <strong className="text-slate-900 dark:text-white">chain abstraction</strong>.
          </p>
          <p>
            We provide a seamless interface that allows you to{' '}
            <strong className="text-slate-900 dark:text-white">accept stablecoin payments</strong>{' '}
            (like <strong className="text-slate-900 dark:text-white">USDC</strong> and{' '}
            <strong className="text-slate-900 dark:text-white">USDT</strong>) alongside major
            cryptocurrencies such as{' '}
            <strong className="text-slate-900 dark:text-white">Bitcoin (BTC)</strong>,{' '}
            <strong className="text-slate-900 dark:text-white">Ethereum (ETH)</strong>,{' '}
            <strong className="text-slate-900 dark:text-white">Solana (SOL)</strong>, and{' '}
            <strong className="text-slate-900 dark:text-white">Zcash (ZEC)</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            The WeaveCash Difference: True Self-Sovereignty
          </h2>
          <p className="mb-4">
            Unlike other platforms, WeaveCash is built on the principle of{' '}
            <strong className="text-slate-900 dark:text-white">self-custody</strong>.
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Your Wallet, Your Rules</strong>:
              Every <strong className="text-slate-900 dark:text-white">cross-chain swap</strong> is
              settled directly into your own wallet.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Preferred Store of Value</strong>:
              You have the freedom to receive payments in one coin and hold them in your preferred
              store-of-value asset automatically.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">No Sign-Up Required</strong>: We
              believe in privacy. Start accepting payments immediately with{' '}
              <strong className="text-slate-900 dark:text-white">no sign-up</strong> and no invasive
              data collection.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Powered by NEAR Intents: Institutional Liquidity, Minimal Spreads
          </h2>
          <p className="mb-4">
            At the heart of WeaveCash is our integration with{' '}
            <strong className="text-slate-900 dark:text-white">NEAR Intents</strong>. This
            cutting-edge technology makes &ldquo;invisible&rdquo;{' '}
            <strong className="text-slate-900 dark:text-white">cross-chain swaps</strong> possible by
            utilizing a decentralized network of solvers to find the most efficient path for your
            transaction.
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Minimal Spreads</strong>: We
              leverage NEAR&rsquo;s infrastructure to ensure you get the best possible rates,
              effectively eliminating the high spreads found in traditional bridges.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Speed and Security</strong>: NEAR
              makes it possible to co-sign transactions across different blockchains in seconds,
              providing a &ldquo;chain-agnostic&rdquo; experience that feels like using a single
              network.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Zero Fees. Maximum Savings.
          </h2>
          <p>
            We understand that for global freelancers and merchants, every percentage point matters.
            That is why{' '}
            <strong className="text-slate-900 dark:text-white">
              WeaveCash takes zero fees on our swaps.
            </strong>{' '}
            While we plan to introduce subscription-based features in the future, our core swap
            functionality is designed to provide massive savings compared to legacy processors that
            charge up to 3% per transaction.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Commitment to Trust: Open Source Core
          </h2>
          <p className="mb-4">
            We understand that trust is the most critical component of any financial tool. To ensure
            our users have absolute certainty that their funds are secure, we operate under an{' '}
            <strong className="text-slate-900 dark:text-white">Open Core</strong> model:
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">
                Open Source Swap &amp; Settlement:
              </strong>{' '}
              The core logic governing the movement of funds, including our NEAR Intent integrations
              and cross-chain settlement engine, is{' '}
              <strong className="text-slate-900 dark:text-white">fully open source</strong>. This
              allows any developer, merchant, or AI agent to audit our code and verify that WeaveCash
              has{' '}
              <strong className="text-slate-900 dark:text-white">zero technical ability</strong> to
              divert, hold, or &ldquo;take&rdquo; buyer funds.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Proprietary Business Tools:</strong>{' '}
              While our settlement rails are open for the world to see, our &ldquo;Pro&rdquo;
              features, including our custom branding dashboard, accounting integrations, and advanced
              merchant analytics, remain our proprietary SaaS offering.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Solutions for the New Economy
          </h2>
          <p className="mb-4">
            Whether you are looking for advanced{' '}
            <strong className="text-slate-900 dark:text-white">crypto invoicing</strong> solutions or
            a secure way to manage{' '}
            <strong className="text-slate-900 dark:text-white">DAO payments</strong>, WeaveCash is
            built for you.
          </p>
          <p>
            Join the thousands of businesses moving away from custodial gatekeepers. Experience the
            power of{' '}
            <strong className="text-slate-900 dark:text-white">chain abstraction</strong> and take
            full control of your digital revenue today.
          </p>
        </section>
      </div>
    </article>
  );
}
