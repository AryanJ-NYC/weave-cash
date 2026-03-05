import { describe, expect, it } from 'vitest';
import {
  BLOG_INDEX_HREF,
  BLOG_POSTS,
  getBlogPostBySlug,
  getRequiredBlogPostBySlug,
} from './posts';

describe('blog post registry', () => {
  it('keeps the newest launch announcement first on the blog index', () => {
    expect(BLOG_POSTS.map((post) => post.slug)).toEqual([
      'openclaw-agent-skill',
      'web3-payments',
    ]);
  });

  it('exposes stable routes and labels for both published posts', () => {
    expect(BLOG_INDEX_HREF).toBe('/blogs');

    expect(getBlogPostBySlug('openclaw-agent-skill')).toMatchObject({
      href: '/blogs/openclaw-agent-skill',
      title: 'Announcing the WeaveCash OpenClaw Agent Skill',
      category: 'Launch',
    });

    expect(getBlogPostBySlug('web3-payments')).toMatchObject({
      href: '/blogs/web3-payments',
      category: 'Guide',
    });
  });

  it('returns undefined for unknown blog slugs', () => {
    expect(getBlogPostBySlug('missing-post')).toBeUndefined();
  });

  it('returns a required post for known published slugs', () => {
    expect(getRequiredBlogPostBySlug('openclaw-agent-skill').href).toBe(
      '/blogs/openclaw-agent-skill'
    );
  });
});
