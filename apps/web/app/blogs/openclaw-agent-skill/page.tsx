import type { Metadata } from 'next';
import React from 'react';
import { getRequiredBlogPostBySlug } from '@/lib/blog/posts';
import { buildPageMetadata } from '@/lib/site-metadata';

const openClawPost = getRequiredBlogPostBySlug('openclaw-agent-skill');

export const metadata: Metadata = buildPageMetadata({
  title: openClawPost.seoTitle,
  description: openClawPost.description,
  path: openClawPost.href,
});

export default function OpenClawAgentSkillBlogPage() {
  return (
    <div className="bg-[#f5f5f5] text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <section className="rounded-sm bg-[#171936] px-8 py-10 text-white md:px-10 md:py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#00f5a0]">
            Announcing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            WeaveCash OpenClaw Agent Skill
          </h1>
          <p className="mt-4 text-lg text-slate-300 md:text-xl">
            Zero Sign-In. Non-Custodial. Autonomous Payments for AI Agents.
          </p>
          <p className="mt-8">
            <a
              href="https://clawhub.ai/AryanJ-NYC/weave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-[#00f5a0] underline-offset-4 hover:underline"
            >
              Get the Skill &rarr;
            </a>
          </p>
        </section>

        <article className="mt-10 space-y-12 text-lg leading-9">
          <section className="border border-[#00a56a]/30 bg-[#d6f0e6] px-6 py-7 text-center dark:border-[#00a56a]/40 dark:bg-[#11352b]">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#008954]">
              NO SIGN-IN REQUIRED
            </h2>
            <p className="mt-3 text-xl leading-8 text-slate-700 dark:text-slate-200">
              Agents use their own wallet address as identity. No accounts. No KYC. No approval
              gates.
            </p>
          </section>

          <section className="space-y-6">
            <p>
              Today we&apos;re excited to announce the{' '}
              <strong className="font-bold text-[#008954]">WeaveCash OpenClaw Agent Skill</strong>{' '}
              &mdash; a native payment capability that lets any OpenClaw agent generate payment
              links and accept crypto payments autonomously, with absolutely{' '}
              <strong className="font-bold">no sign-in or account setup required.</strong>
            </p>
            <p>
              WeaveCash is a non-custodial, open-source payment protocol purpose-built to be the
              financial backbone for Sovereign Professionals and Autonomous AI Agents. By
              leveraging NEAR Protocol&apos;s advanced chain abstraction, WeaveCash eliminates the
              &ldquo;Success Tax&rdquo; &mdash; the predatory percentage-based fees baked into
              legacy systems like NowPayments and PayPal.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              What Makes This Different
            </h2>
            <p>
              Traditional payment integrations force agents (and their operators) through lengthy
              onboarding flows: account creation, identity verification, API key management, and
              approval processes. WeaveCash flips this entirely.
            </p>
            <p>
              With the WeaveCash skill installed, an OpenClaw agent simply uses its own wallet
              address as its identity. That&apos;s it. The agent can immediately begin generating
              payment links and invoices with{' '}
              <strong className="font-bold">zero human intervention.</strong>
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Core Protocol Capabilities
            </h2>
            <div className="overflow-hidden border-y border-slate-300 dark:border-slate-700">
              {CAPABILITIES.map((capability) => (
                <div
                  key={capability.title}
                  className="grid gap-3 border-b border-slate-300 py-5 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 dark:border-slate-700"
                >
                  <h3 className="text-2xl font-bold text-[#008954]">{capability.title}</h3>
                  <p className="leading-8">{capability.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Supported Networks &amp; Coins
            </h2>
            <p>
              <strong className="font-bold text-slate-900 dark:text-white">Networks:</strong>{' '}
              <span className="text-[#008954]">Ethereum</span> &middot;{' '}
              <span className="text-[#008954]">Solana</span> &middot;{' '}
              <span className="text-[#008954]">Tron</span> &middot;{' '}
              <span className="text-[#008954]">Base</span>
            </p>
            <p>
              <strong className="font-bold text-slate-900 dark:text-white">Coins:</strong>{' '}
              <span className="text-[#008954]">USDC</span> &middot;{' '}
              <span className="text-[#008954]">USDT</span> &middot;{' '}
              <span className="text-[#008954]">ETH</span> &middot;{' '}
              <span className="text-[#008954]">BTC</span> &middot;{' '}
              <span className="text-[#008954]">SOL</span> &middot;{' '}
              <span className="text-[#008954]">ZEC</span> &middot;{' '}
              <span className="text-[#008954]">XAUT</span> &middot;{' '}
              <span className="text-[#008954]">PAXG</span>
            </p>
            <p>
              Cross-chain settlement means your payers aren&apos;t locked into a single network.
              They pay with whatever they have; your agent receives exactly what it wants.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Agents, Not Humans
            </h2>
            <div className="overflow-hidden border border-slate-300 dark:border-slate-700">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#008954] text-white">
                  <tr>
                    <th className="border-r border-[#5eb894] px-4 py-3 text-2xl font-bold">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-2xl font-bold">Agent Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {AGENT_BENEFITS.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-t border-slate-300 align-top dark:border-slate-700"
                    >
                      <td className="border-r border-slate-300 px-4 py-4 font-bold text-[#008954] dark:border-slate-700">
                        {row.feature}
                      </td>
                      <td className="px-4 py-4 leading-8">{row.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Get Started in Seconds
            </h2>
            <p>Adding WeaveCash to your OpenClaw agent is as simple as installing any other skill:</p>
            <ul className="list-disc space-y-4 pl-10">
              <li>
                Visit the skill page at{' '}
                <a
                  href="https://clawhub.ai/AryanJ-NYC/weave"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#008954] underline-offset-4 hover:underline"
                >
                  clawhub.ai/AryanJ-NYC/weave
                </a>
              </li>
              <li>Install the skill on your OpenClaw agent</li>
              <li>Provide a wallet address</li>
              <li>Your agent is now ready to accept payments across Ethereum, Solana, Tron, and Base</li>
            </ul>
            <p>
              <strong className="font-bold">
                No sign-up forms. No API key management. No waiting for approval.
              </strong>{' '}
              Just a wallet address and you&apos;re live.
            </p>
          </section>

          <section className="space-y-8 border-t border-slate-300 pt-10 text-center dark:border-slate-700">
            <div className="bg-[#171936] px-6 py-10 text-white">
              <h2 className="text-4xl font-bold tracking-tight">
                Ready to give your agent financial sovereignty?
              </h2>
              <p className="mt-4">
                <a
                  href="https://clawhub.ai/AryanJ-NYC/weave"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl font-bold text-[#00f5a0] underline-offset-4 hover:underline"
                >
                  Install the WeaveCash Skill Now &rarr;
                </a>
              </p>
            </div>
            <p className="text-base text-slate-500 dark:text-slate-400">
              WeaveCash is open-source.{' '}
              <em>Verify everything. Trust nothing blindly.</em>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

const CAPABILITIES = [
  {
    title: 'Permissionless Identity',
    description:
      'No-Sign-In model. Agents use their own wallet addresses as identity, requiring no centralized account approval or KYC to begin generating invoices.',
  },
  {
    title: 'Cross-Chain Settlement',
    description:
      'Powered by NEAR Intents, payers can use any supported asset while the merchant or agent receives settlement in their preferred cryptocurrency.',
  },
  {
    title: 'Non-Custodial Escrow',
    description:
      'Utilizing NEAR Chain Signatures, WeaveCash facilitates peer-to-peer settlement without ever taking custody of user funds.',
  },
  {
    title: 'Open-Source Trust',
    description:
      'The swap and settlement engine is fully open-source, enabling programmatic verification and eliminating “black-box” risk.',
  },
] as const;

const AGENT_BENEFITS = [
  {
    feature: 'Skill Integration',
    benefit: 'Deploy as a standard OpenClaw skill to generate payment links autonomously.',
  },
  {
    feature: 'Zero Onboarding',
    benefit: 'Agents spin up and immediately start accepting payments — no human intervention needed.',
  },
  {
    feature: 'No Sign-In',
    benefit: 'Wallet address is the only identity required. No accounts, no KYC, no approval gates.',
  },
  {
    feature: 'Non-Custodial',
    benefit: 'Agents never surrender control of funds. Peer-to-peer settlement preserves sovereignty.',
  },
] as const;
