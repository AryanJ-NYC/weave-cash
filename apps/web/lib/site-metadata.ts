import type { Metadata, MetadataRoute } from 'next';
import { BLOG_INDEX_HREF, BLOG_POSTS } from './blog/posts';

export function buildPageMetadata({
  title,
  description,
  path,
  robots,
}: BuildPageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}

export function buildInvoiceMetadata(invoiceId: string): Metadata {
  return buildPageMetadata({
    title: INVOICE_TITLE,
    description: INVOICE_DESCRIPTION,
    path: `/invoice/${invoiceId}`,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  });
}

export function getSiteRobotsMetadata(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: buildAbsoluteUrl('/sitemap.xml'),
  };
}

export function getSiteSitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_SITEMAP_ENTRIES.map((entry) => ({
      url: buildAbsoluteUrl(entry.path),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: buildAbsoluteUrl(post.href),
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

function buildAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export const DEFAULT_SITE_TITLE =
  'Weave Cash - Accept Any Crypto. Store Your Value.';
export const DEFAULT_SITE_DESCRIPTION =
  'Buyer pays in any coin. Receive your preferred coin. Instantly, via NEAR Intents.';
export const INVOICE_TITLE = 'Pay Invoice | Weave Cash';
export const INVOICE_DESCRIPTION =
  'Complete your invoice payment with your preferred cryptocurrency.';
export const SITE_NAME = 'Weave Cash';
export const SITE_URL = 'https://weavecash.com';

const STATIC_SITEMAP_ENTRIES = [
  {
    path: '/',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    path: '/create',
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    path: '/about',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: BLOG_INDEX_HREF,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
] as const satisfies readonly SitemapEntry[];

type BuildPageMetadataInput = {
  description: string;
  path: string;
  robots?: Metadata['robots'];
  title: string;
};

type SitemapEntry = {
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  path: string;
  priority: number;
};
