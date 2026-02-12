'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';

export function CopyableField({ value, label }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        readOnly
        onClick={handleCopy}
        className="cursor-pointer rounded-lg border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
      />
      {label && (
        <span className="shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        className="shrink-0 border-slate-300 dark:border-slate-700"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

type CopyableFieldProps = {
  value: string;
  label?: string;
};
