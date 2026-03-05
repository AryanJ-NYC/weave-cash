export const BLOG_INDEX_HREF = '/blogs';

export const BLOG_POSTS: readonly BlogPost[] = sortBlogPosts([
  {
    slug: 'web3-payments',
    href: '/blogs/web3-payments',
    title: 'The Definitive Guide to Web3 Payments',
    pageTitle:
      'The Definitive Guide to Web3 Payments: Scale Your Business with Seamless, Fee-Free Crypto',
    seoTitle: 'The Definitive Guide to Web3 Payments | WeaveCash',
    description:
      'Learn how to accept crypto payments as a business with zero fees, self-custody swaps, and cross-chain settlement powered by NEAR Intents.',
    category: 'Guide',
    publishedAt: '2026-02-12',
    publishedLabel: 'February 12, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'openclaw-agent-skill',
    href: '/blogs/openclaw-agent-skill',
    title: 'WeaveCash OpenClaw Agent Skill',
    pageTitle: 'WeaveCash OpenClaw Agent Skill',
    seoTitle: 'WeaveCash OpenClaw Agent Skill | WeaveCash',
    description: 'Zero Sign-In. Non-Custodial. Autonomous Payments for AI Agents.',
    category: 'Launch',
    publishedAt: '2026-03-05',
    publishedLabel: 'March 5, 2026',
    readTime: '5 min read',
  },
]);

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRequiredBlogPostBySlug(slug: BlogPostSlug) {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    throw new Error(`Missing blog post metadata for ${slug}`);
  }

  return post;
}

function sortBlogPosts(posts: readonly BlogPost[]) {
  return [...posts].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt)
  );
}

export type BlogPost = {
  slug: BlogPostSlug;
  href: BlogPostHref;
  title: string;
  pageTitle: string;
  seoTitle: string;
  description: string;
  category: BlogPostCategory;
  publishedAt: string;
  publishedLabel: string;
  readTime: string;
};

type BlogPostCategory = 'Guide' | 'Launch';

type BlogPostHref = `/blogs/${BlogPostSlug}`;

type BlogPostSlug = 'openclaw-agent-skill' | 'web3-payments';
