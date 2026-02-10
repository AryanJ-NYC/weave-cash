import { OpenAPI } from '@defuse-protocol/one-click-sdk-typescript';
import { env } from '@/lib/env';

export function initNearSdk() {
  OpenAPI.BASE = 'https://1click.chaindefuser.com';
  OpenAPI.TOKEN = env.DEFUSE_JWT_TOKEN;
}
