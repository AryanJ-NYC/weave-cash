import type { Metadata } from 'next';
import { BookOpenText, Rocket } from 'lucide-react';
import { BlogPostCard } from './_components/blog-post-card';
import { BLOG_POSTS } from '@/lib/blog/posts';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'WeaveCash Blog | Launches and Guides',
  description:
    'Read WeaveCash launch announcements, product notes, and practical guides for sovereign crypto payments.',
  path: '/blogs',
});

export default function BlogsPage() {
  const featuredPost = BLOG_POSTS.at(0);

  if (!featuredPost) {
    throw new Error('Missing featured blog post');
  }

  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_25%)]" />

      <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              <BookOpenText className="h-4 w-4" />
              WeaveCash Journal
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              Product launches, field guides, and protocol notes for sovereign payments.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300">
              Follow what we are shipping, how the payment rails work, and how to accept crypto
              without custody, approval queues, or hidden swap fees.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Latest focus
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      Agent-native launches
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Published posts
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {BLOG_POSTS.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <BlogPostCard post={featuredPost} featured />

          <div className="flex flex-col gap-6">
            {otherPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Why this feed exists
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                We use the blog for launch notes and practical explanations, not generic crypto
                commentary. If a post is here, it should help you understand what changed or how to
                put WeaveCash to work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
