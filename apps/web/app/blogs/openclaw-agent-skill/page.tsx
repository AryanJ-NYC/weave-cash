import type { Metadata } from 'next';
import { ContentPage } from '@/_components/content-page';
import { getRequiredBlogPostBySlug } from '@/lib/blog/posts';

const openClawPost = getRequiredBlogPostBySlug('openclaw-agent-skill');

export const metadata: Metadata = {
  title: openClawPost.seoTitle,
  description: openClawPost.description,
};

export default function OpenClawAgentSkillBlogPage() {
  return (
    <ContentPage
      title={openClawPost.pageTitle}
      subtitle="Zero sign-in. Non-custodial settlement. A wallet-native payment skill for autonomous OpenClaw agents."
    >
      <p>
        Today we are introducing the{' '}
        <strong className="text-slate-900 dark:text-white">WeaveCash OpenClaw Agent Skill</strong>
        , a launch that gives OpenClaw agents a native way to create payment links and accept
        crypto without waiting for a human operator to create an account first.
      </p>
      <p>
        The thesis is simple: an agent should be able to use its own wallet address as identity,
        get paid in supported crypto, and settle into the asset it wants to hold. No sign-up flow.
        No KYC queue. No custodial dashboard sitting between the agent and its funds.
      </p>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          What ships in this launch
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-6">
          <li>
            <strong className="text-slate-900 dark:text-white">No-sign-in identity</strong> so the
            agent can start from its wallet address instead of a centralized account.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Cross-chain settlement</strong>{' '}
            powered by NEAR Intents, letting the payer use a supported asset while the receiver
            settles into its preferred crypto.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Non-custodial payment rails</strong>{' '}
            so funds move through open settlement logic instead of sitting inside a black-box
            merchant balance.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Open-source verifiability</strong>{' '}
            for the payment and settlement engine, which keeps trust grounded in code instead of
            marketing claims.
          </li>
        </ul>
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Why this matters for agent payments
        </h2>
        <p className="mb-4">
          Most payment tooling still assumes a human operator is sitting in the loop. Before an
          agent can accept money, someone usually has to create an account, clear an approval flow,
          manage API keys, and accept the custody and fee model of the gateway they picked.
        </p>
        <p>
          The OpenClaw skill removes that setup tax. An agent gets a direct path from request to
          invoice creation, which means autonomous workflows can keep moving without leaving the
          wallet-native world they already operate in.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          How the OpenClaw skill works
        </h2>
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            The operator installs the WeaveCash skill and supplies the wallet address the agent
            should use for settlement.
          </li>
          <li>
            The agent generates a payment link or invoice when it needs to collect funds for a task
            or deliverable.
          </li>
          <li>
            The payer uses a supported asset, and WeaveCash coordinates the settlement path so the
            agent receives the crypto it actually wants to hold.
          </li>
        </ol>
        <p className="mt-4">
          That gives OpenClaw agents a payment primitive that feels native to the workflow instead
          of bolted on after the fact.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Supported networks and assets today
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Networks
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Bitcoin, Ethereum, Solana, Zcash, and Tron
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Assets
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              USDC, USDT, ETH, BTC, SOL, ZEC, XAUT, and PAXG
            </p>
          </div>
        </div>
        <p className="mt-4">
          The payer is not locked into a single network just because the receiver has a preferred
          settlement asset. That flexibility is the whole point of treating payments as intents
          instead of forcing users through manual bridging.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Built for autonomous workflows, not approval queues
        </h2>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong className="text-slate-900 dark:text-white">Wallet-native identity</strong>{' '}
            keeps the skill aligned with how agents already authenticate and transact.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">No custodial balance</strong> keeps
            operators from delegating fund control to a third-party processor.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Open rails</strong> make it possible
            to inspect the payment and settlement path instead of trusting a sealed gateway.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Install the skill
        </h2>
        <p className="mb-6">
          If you are running OpenClaw and want agent-native crypto payments, you can install the
          skill, supply a wallet address, and start generating payment links without a separate
          merchant onboarding flow.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="https://clawhub.ai/AryanJ-NYC/weave"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:ring-offset-slate-950"
          >
            Get the Skill
          </a>
          <a
            href="https://github.com/AryanJ-NYC/weave-cash"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          >
            View the open-source rails
          </a>
        </div>
      </section>
    </ContentPage>
  );
}
