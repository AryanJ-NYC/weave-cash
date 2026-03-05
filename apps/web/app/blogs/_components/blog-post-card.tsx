import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import type { BlogPost } from '@/lib/blog/posts';

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  return (
    <Link
      href={post.href}
      className={clsx(
        'group relative block overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950',
        featured ? 'shadow-lg shadow-blue-950/5 dark:shadow-black/20' : 'shadow-sm'
      )}
    >
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 opacity-100',
          featured
            ? 'bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_48%),linear-gradient(180deg,_rgba(248,250,252,0.92),_rgba(255,255,255,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_45%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,1))]'
            : 'bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.12),_transparent_42%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(51,65,85,0.32),_transparent_42%)]'
        )}
      />

      <article
        className={clsx(
          'relative flex h-full flex-col',
          featured ? 'gap-8 p-8 md:p-10' : 'gap-6 p-7'
        )}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={clsx(
              'inline-flex items-center rounded-full border px-3 py-1 font-medium',
              featured
                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
            )}
          >
            {post.category}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{post.publishedLabel}</span>
          <span className="text-slate-400 dark:text-slate-500">{post.readTime}</span>
        </div>

        <div className="space-y-4">
          {featured ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Featured release
            </div>
          ) : null}

          <h2
            className={clsx(
              'max-w-2xl font-semibold tracking-tight text-slate-900 dark:text-white',
              featured ? 'text-3xl md:text-4xl' : 'text-2xl'
            )}
          >
            {post.title}
          </h2>
          <p
            className={clsx(
              'max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300',
              featured ? 'text-lg md:text-xl' : 'text-base'
            )}
          >
            {post.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-200/80 pt-5 text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:group-hover:text-white">
          <span>Read article</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </div>
      </article>
    </Link>
  );
}

type BlogPostCardProps = {
  post: BlogPost;
  featured?: boolean;
};
