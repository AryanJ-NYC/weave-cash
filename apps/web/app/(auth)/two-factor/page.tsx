'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { twoFactor } from '@/lib/auth-client';

export default function TwoFactorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    const { error } = useBackupCode
      ? await twoFactor.verifyBackupCode({ code })
      : await twoFactor.verifyTotp({ code });

    if (error) {
      toast.error(error.message || 'Invalid code');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
          <p className="text-neutral-500">
            {useBackupCode
              ? 'Enter one of your backup codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              {useBackupCode ? 'Backup Code' : 'Authentication Code'}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode={useBackupCode ? 'text' : 'numeric'}
              pattern={useBackupCode ? undefined : '[0-9]*'}
              maxLength={useBackupCode ? undefined : 6}
              placeholder={useBackupCode ? 'Enter backup code' : '000000'}
              required
              autoComplete="one-time-code"
              autoFocus
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-center text-lg tracking-widest placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-100"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setUseBackupCode(!useBackupCode)}
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {useBackupCode
              ? 'Use authenticator app instead'
              : 'Use a backup code instead'}
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          <Link
            href="/login"
            className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
