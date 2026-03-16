import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('/create route shape', () => {
  it('keeps the route page server-rendered and moves interactivity into a local client component', () => {
    const pageSource = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');
    const clientComponentPath = new URL('./_components/create-invoice-flow.tsx', import.meta.url);
    const clientComponentSource = readFileSync(clientComponentPath, 'utf8');

    expect(pageSource.startsWith("'use client'")).toBe(false);
    expect(pageSource).toContain("from './_components/create-invoice-flow'");
    expect(existsSync(new URL('./layout.tsx', import.meta.url))).toBe(false);

    expect(clientComponentSource.startsWith("'use client'")).toBe(true);
  });
});
