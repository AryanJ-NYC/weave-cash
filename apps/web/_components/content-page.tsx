export function ContentPage({ title, subtitle, children }: ContentPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{subtitle}</p>
        )}
      </header>
      <div className="space-y-10 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </article>
  );
}

type ContentPageProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};
