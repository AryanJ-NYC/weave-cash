import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_components/content-page', () => ({
  ContentPage: ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) =>
    React.createElement(
      'article',
      null,
      React.createElement('h1', null, title),
      subtitle ? React.createElement('p', null, subtitle) : null,
      children
    ),
}));

import OpenClawAgentSkillBlogPage from './page';

describe('OpenClaw launch post', () => {
  it('tracks the source announcement structure and headline claims', () => {
    const markup = renderToStaticMarkup(<OpenClawAgentSkillBlogPage />);
    const text = markup
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();

    expect(text).toContain('Zero Sign-In. Non-Custodial. Autonomous Payments for AI Agents.');
    expect(text).toContain('NO SIGN-IN REQUIRED');
    expect(text).toContain('Today we');
    expect(text).toContain('no sign-in or account setup required.');
    expect(text).toContain('NowPayments and PayPal');
    expect(text).toContain('What Makes This Different');
    expect(text).toContain('Core Protocol Capabilities');
    expect(text).toContain('Feature');
    expect(text).toContain('Agent Benefit');
    expect(text).toContain('Ethereum · Solana · Tron · Base');
    expect(text).toContain('Built for Agents, Not Humans');
    expect(text).toContain('Get Started in Seconds');
    expect(text).toContain(
      'Your agent is now ready to accept payments across Ethereum, Solana, Tron, and Base'
    );
    expect(text).toContain('Install the WeaveCash Skill Now');
  });
});
