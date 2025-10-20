import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [],
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
};

export default withNextIntl(nextConfig);
