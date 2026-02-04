import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

import { SignOutButton } from './sign-out-button';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user.name || session.user.email}
      </h1>
      <p className="text-neutral-500">You are signed in.</p>
      <SignOutButton />
    </main>
  );
}
