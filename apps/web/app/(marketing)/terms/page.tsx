export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Last Updated: February 9, 2026
        </p>
      </header>

      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        <p>
          Welcome to <strong className="text-slate-900 dark:text-white">WeaveCash</strong>. These
          Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the WeaveCash
          website, services, and non-custodial infrastructure. By utilizing our platform, you agree
          to be bound by these Terms in their entirety. If you do not agree, you must immediately
          cease all use of our services.
        </p>

        {/* Section 1 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            1. Description of Service
          </h2>
          <p className="mb-4">
            WeaveCash provides a software interface and infrastructure layer designed to facilitate:
          </p>
          <ul className="mb-8 list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Non-Custodial Invoicing:</strong>{' '}
              Tools to generate professional payment requests.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Cross-Chain Settlement:</strong>{' '}
              Utilizing NEAR Intents and Chain Signatures to allow buyers to pay in various digital
              assets while settling in the merchant&rsquo;s preferred cryptocurrency (e.g.,
              Bitcoin).
            </li>
          </ul>
          <p>
            WeaveCash is not a bank, money transmitter, or custodial wallet. We do not hold, manage,
            or have access to your private keys or digital assets at any time.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            2. &ldquo;No-Sign-Up&rdquo; and Wallet Identity
          </h2>
          <p className="mb-4">
            WeaveCash utilizes a &ldquo;Wallet-as-Identity&rdquo; model to prioritize user
            sovereignty.
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Account Creation:</strong> You do
              not need to create a traditional account to use basic features. Your public wallet
              address serves as your identifier.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Optional Data:</strong> You may
              choose to provide an email address, business name, and invoice description. While
              these are stored on our servers for your convenience, they do not grant WeaveCash
              control over your financial transactions.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Responsibility:</strong> You are
              solely responsible for maintaining the security of the wallet used to connect to
              WeaveCash. If you lose access to your private keys, WeaveCash cannot recover your
              funds.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            3. Fees and Subscriptions
          </h2>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Free Tier:</strong> Users may
              generate invoices up to a specific monthly volume (the &ldquo;Threshold&rdquo;)
              without a platform fee.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Pro Tier:</strong> Upon exceeding
              the Threshold, or to unlock advanced features (e.g., custom branding, accounting
              sync), a monthly SaaS subscription fee is required.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Network Fees:</strong> Users
              acknowledge that third-party &ldquo;Intent Solvers&rdquo; and blockchain networks
              charge gas and swap fees. These are separate from WeaveCash platform fees and are
              non-refundable.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            4. Open Source vs. Proprietary Code
          </h2>
          <p className="mb-4">
            To ensure transparency and trust, WeaveCash operates under an Open Core model:
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">The Swap Engine:</strong> The code
              governing the movement and settlement of funds via NEAR Intents is open-source and
              available for public audit.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">The SaaS Platform:</strong> The
              dashboard, UI/UX, and professional business tools remain the proprietary,
              closed-source property of WeaveCash.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            5. User Responsibilities and Compliance
          </h2>
          <p className="mb-4">
            As a condition of using WeaveCash, you represent and warrant that you will comply with
            all applicable local and international laws.
          </p>

          <h3 className="mb-4 text-xl font-medium text-slate-900 dark:text-white">
            5.1 Sanctions Compliance
          </h3>
          <p className="mb-4">
            WeaveCash is committed to preventing the abuse of digital assets for illicit activities.
            You are strictly prohibited from using our services to facilitate the movement of funds
            to or from any address or entity sanctioned by the Office of Foreign Assets Control
            (OFAC), the European Commission, or other relevant international bodies.
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Prohibited Entities:</strong> This
              includes, but is not limited to, addresses identified on the Specially Designated
              Nationals and Blocked Persons (SDN) List.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">
                Restricted Jurisdictions:
              </strong>{' '}
              Our services may not be used by persons or entities located in, or residents of,
              comprehensively sanctioned countries or territories.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Monitoring Mechanisms:</strong>{' '}
              While WeaveCash is non-custodial, we utilize practical mechanisms&mdash;such as
              geoblocking and blockchain analytics&mdash;to identify and prevent access from
              prohibited jurisdictions and sanctioned addresses.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Strict Liability:</strong> You
              acknowledge that sanctions compliance is a &ldquo;strict liability&rdquo; standard;
              engaging in prohibited transactions&mdash;even without intent&mdash;may result in the
              immediate termination of your access to the WeaveCash interface.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            6. Limitation of Liability and Disclaimers
          </h2>
          <p className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            WEAVECASH PROVIDES THE SERVICE &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo;
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">No Guarantee:</strong> We do not
              guarantee that the service will be uninterrupted or error-free.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Blockchain Risks:</strong> You
              acknowledge the inherent risks of blockchain technology, including smart contract
              vulnerabilities, network congestion, and extreme price volatility.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Compliance Restrictions:</strong>{' '}
              We reserve the right to block or restrict your access to our front-end interface and
              NEAR Intent rails if we detect activity associated with sanctioned addresses or
              jurisdictions.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Liability Cap:</strong> To the
              maximum extent permitted by law, WeaveCash&rsquo;s liability for any claim arising out
              of these Terms shall not exceed the total subscription fees paid by you in the 12
              months preceding the claim.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            7. Responsibility Flow
          </h2>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-slate-900 dark:text-white">Private Key Security:</strong>{' '}
              User
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Sanctions Compliance:</strong>{' '}
              User / WeaveCash (Interface Level)
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Transaction Integrity:</strong>{' '}
              Open Source Code / NEAR Network
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">UI/UX Availability:</strong>{' '}
              WeaveCash
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            8. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which WeaveCash is incorporated, without regard to its conflict of law
            provisions.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">
            9. Contact
          </h2>
          <p>
            For legal inquiries or notices, please contact{' '}
            <a
              href="mailto:support@weavecash.com"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
            >
              support@weavecash.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
