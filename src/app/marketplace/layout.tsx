'use client';

import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <MarketplaceHeader />
      {children}
    </div>
  );
} 