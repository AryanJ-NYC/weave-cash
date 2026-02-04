'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { twoFactor, useSession } from '@/lib/auth-client';

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [isPending, session, router]);

  async function handleEnable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    const { data, error } = await twoFactor.enable({ password });

    if (error) {
      toast.error(error.message || 'Failed to enable 2FA');
      setIsLoading(false);
      return;
    }

    if (data) {
      setTotpUri(data.totpURI);
      setBackupCodes(data.backupCodes);
      setStep('verify');
    }
    setIsLoading(false);
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    const { error } = await twoFactor.verifyTotp({ code });

    if (error) {
      toast.error(error.message || 'Invalid code');
      setIsLoading(false);
      return;
    }

    toast.success('Two-factor authentication enabled');
    setStep('idle');
    setTotpUri(null);
    setIsLoading(false);
  }

  async function handleDisable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    const { error } = await twoFactor.disable({ password });

    if (error) {
      toast.error(error.message || 'Failed to disable 2FA');
      setIsLoading(false);
      return;
    }

    toast.success('Two-factor authentication disabled');
    setIsLoading(false);
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const twoFactorEnabled = session.user.twoFactorEnabled;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <p className="text-neutral-500">Manage your account security</p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Two-Factor Authentication</h2>
              <p className="text-sm text-neutral-500">
                {twoFactorEnabled
                  ? 'Enabled'
                  : 'Add an extra layer of security'}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                twoFactorEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {twoFactorEnabled ? 'On' : 'Off'}
            </span>
          </div>

          {/* Enable 2FA - Step 1: Enter password */}
          {!twoFactorEnabled && step === 'idle' && (
            <form onSubmit={handleEnable} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Confirm your password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-100"
              >
                {isLoading ? 'Setting up...' : 'Set up 2FA'}
              </button>
            </form>
          )}

          {/* Enable 2FA - Step 2: Scan QR & verify */}
          {!twoFactorEnabled && step === 'verify' && totpUri && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  1. Scan this QR code with your authenticator app
                </p>
                <div className="flex justify-center rounded-lg bg-white p-4">
                  <QRCodeSVG value={totpUri} size={180} />
                </div>
              </div>

              {backupCodes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    2. Save your backup codes
                  </p>
                  <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-800">
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {backupCodes.map((code, i) => (
                        <span key={i}>{code}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Store these codes somewhere safe. You can use them to access
                    your account if you lose your device.
                  </p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    3. Enter the 6-digit code from your app
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    required
                    autoComplete="one-time-code"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-center text-lg tracking-widest placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('idle');
                      setTotpUri(null);
                      setBackupCodes(null);
                    }}
                    className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:focus:ring-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-100"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Disable 2FA */}
          {twoFactorEnabled && (
            <form onSubmit={handleDisable} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="disable-password"
                  className="text-sm font-medium"
                >
                  Confirm your password to disable
                </label>
                <input
                  id="disable-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md border border-red-300 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                {isLoading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
