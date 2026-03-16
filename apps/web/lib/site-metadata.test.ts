import { describe, expect, it } from 'vitest';
import {
  buildInvoiceMetadata,
  buildPageMetadata,
  getSiteRobotsMetadata,
  getSiteSitemap,
} from './site-metadata';

describe('site metadata helpers', () => {
  it('builds required Open Graph fields and canonical URLs for public pages', () => {
    expect(
      buildPageMetadata({
        title: 'About WeaveCash | Sovereign Web3 Payments',
        description: 'Learn how WeaveCash helps merchants accept crypto.',
        path: '/about',
      })
    ).toMatchObject({
      title: 'About WeaveCash | Sovereign Web3 Payments',
      description: 'Learn how WeaveCash helps merchants accept crypto.',
      alternates: {
        canonical: '/about',
      },
      openGraph: {
        title: 'About WeaveCash | Sovereign Web3 Payments',
        description: 'Learn how WeaveCash helps merchants accept crypto.',
        url: '/about',
        type: 'website',
        siteName: 'Weave Cash',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'About WeaveCash | Sovereign Web3 Payments',
        description: 'Learn how WeaveCash helps merchants accept crypto.',
      },
    });
  });

  it('keeps invoice pages shareable but not indexable', () => {
    expect(buildInvoiceMetadata('inv_123')).toMatchObject({
      title: 'Pay Invoice | Weave Cash',
      description:
        'Complete your invoice payment with your preferred cryptocurrency.',
      alternates: {
        canonical: '/invoice/inv_123',
      },
      openGraph: {
        url: '/invoice/inv_123',
        type: 'website',
      },
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    });
  });

  it('publishes a sitemap for public marketing routes and excludes invoice URLs', () => {
    expect(getSiteSitemap().map((entry) => entry.url)).toEqual([
      'https://weavecash.com/',
      'https://weavecash.com/create',
      'https://weavecash.com/about',
      'https://weavecash.com/privacy',
      'https://weavecash.com/terms',
      'https://weavecash.com/blogs',
      'https://weavecash.com/blogs/openclaw-agent-skill',
      'https://weavecash.com/blogs/web3-payments',
    ]);
  });

  it('publishes a robots file that points crawlers at the sitemap', () => {
    expect(getSiteRobotsMetadata()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://weavecash.com/sitemap.xml',
    });
  });
});
