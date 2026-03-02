import Link from 'next/link';
import { CopyCommandButton } from './copy-command-button';

export function CLIInstallSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_40%)]" />

      <div className="relative mx-auto grid max-w-[88rem] gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
        <div className="min-w-0 lg:pr-4">
          <p className="inline-flex items-center rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-blue-200">
            Agent-First CLI Install
          </p>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Install the crypto invoice CLI in one command
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            If you need to accept crypto payments through a crypto payment API,
            <span className="font-semibold text-white"> weave</span> gives you a
            stateless command line tool to create a crypto invoice, generate a
            quote, and track status from bots, scripts, and product workflows.
          </p>

          <p className="mt-4 max-w-2xl text-base text-slate-400">
            Works with OpenClaw and any agent runtime that can execute shell
            commands.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            {SECTION_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-cyan-300"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Create First Invoice
            </Link>
            <a
              href={INSTALL_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              Read Install Docs
            </a>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/30">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <p className="text-sm font-semibold text-slate-200">Quick Install</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                macOS + Linux
              </p>
              <CopyCommandButton command={INSTALL_COMMAND} />
            </div>
          </div>

          <pre className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-cyan-200 whitespace-pre">
            <code>{INSTALL_COMMAND}</code>
          </pre>

          <p className="mt-4 text-xs text-slate-400">
            Install globally from npm and verify with:
          </p>

          <pre className="mt-2 w-full max-w-full overflow-x-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-words">
            <code>{VERIFY_COMMAND}</code>
          </pre>

          <div className="mt-5 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              OpenClaw / Agent Example
            </p>
            <pre className="mt-2 w-full max-w-full overflow-x-hidden text-xs leading-relaxed text-blue-100 whitespace-pre-wrap break-words">
              <code>{AGENT_EXAMPLE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

const INSTALL_COMMAND =
  'npm i -g weave-cash-cli';

const VERIFY_COMMAND = 'weave --help';

const AGENT_EXAMPLE =
  '# OpenClaw or any shell-capable agent\nweave create --receive-token USDC --receive-network Ethereum --amount 125 --wallet-address 0xYourWallet\nweave quote <invoice-id> --pay-token ETH --pay-network Ethereum --refund-address 0xRefundWallet\nweave status <invoice-id> --watch';

const SECTION_POINTS = [
  'Built for businesses searching how to accept crypto payments without adding local config or API keys.',
  'CLI-first flow for creating crypto invoices and handing links to customers or autonomous agents.',
  'Deterministic JSON output by default, so agents can parse status changes and terminal outcomes safely.',
];

const INSTALL_DOCS_URL =
  'https://github.com/AryanJ-NYC/weave-cash/blob/master/apps/cli/docs/INSTALL.md';
